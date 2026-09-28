"use strict";
let pool;
function database() {
  if (!process.env.DATABASE_URL)
    throw Object.assign(Error("서버 데이터베이스 연결이 필요합니다."), {
      status: 503,
      code: "DATABASE_NOT_CONFIGURED",
    });
  if (!pool) {
    const { Pool } = require("pg");
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 3,
      connectionTimeoutMillis: 8000,
      idleTimeoutMillis: 10000,
    });
  }
  return pool;
}
async function transaction(fn) {
  const client = await database().connect();
  try {
    await client.query("BEGIN");
    await client.query(
      "INSERT INTO school_operations(id,body) VALUES('institution','{}') ON CONFLICT DO NOTHING",
    );
    const result = await client.query(
      "SELECT body FROM school_operations WHERE id='institution' FOR UPDATE",
    );
    const state = result.rows[0].body;
    const output = await fn(state);
    await client.query(
      "UPDATE school_operations SET body=$1::jsonb, updated_at=now() WHERE id='institution'",
      [JSON.stringify(state)],
    );
    await client.query("COMMIT");
    return output;
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}
module.exports = { transaction };
