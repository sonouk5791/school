const { chromium } = require("playwright"),
  assert = require("node:assert/strict");
(async () => {
  const b = await chromium.launch({ channel: "msedge", headless: true }),
    p = await b.newPage();
  await p.clock.install();
  await p.goto("http://localhost:8085/index.html");
  await p.locator("#btnTeacherSpace").click();
  await p.locator("#inputTeacherPin").fill("initial-local-pass");
  await p.locator("#btnSubmitTeacherPin").click();
  await p.waitForSelector(".operations-panel");
  await p.evaluate(() => AdminAccess.logout());
  for (let i = 0; i < 5; i++) {
    await p.locator("#btnTeacherSpace").click();
    await p.locator("#inputTeacherPin").fill("wrong-pass");
    await p.locator("#btnSubmitTeacherPin").click();
    await p.waitForTimeout(150);
    await p.locator("#btnCancelTeacherPin").click();
  }
  await p.locator("#btnTeacherSpace").click();
  await p.locator("#inputTeacherPin").fill("initial-local-pass");
  await p.locator("#btnSubmitTeacherPin").click();
  await p.waitForTimeout(200);
  assert((await p.locator("#pinErrorMessage").innerText()).includes("15분"));
  await p.locator("#btnCancelTeacherPin").click();
  await p.clock.fastForward(16 * 60000);
  await p.locator("#btnTeacherSpace").click();
  await p.locator("#inputTeacherPin").fill("initial-local-pass");
  await p.locator("#btnSubmitTeacherPin").click();
  await p.waitForSelector("#teacherModal.active");
  await p.clock.fastForward(21 * 60000);
  assert.equal(
    await p.locator("#teacherModal").getAttribute("aria-hidden"),
    "true",
  );
  await b.close();
  console.log(
    "PASS local password setup, five-failure lockout, lock expiry, 20-minute inactivity logout",
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
