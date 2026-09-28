const assert=require('node:assert/strict'),crypto=require('node:crypto'),auth=require('../automation/auth'),D=require('../automation/domain');
process.env.DATABASE_URL='test-double';let state=D.empty();state.admins={primary:{mustChange:false}};state.authSessions={};const admin='admin-test';state.authSessions[auth.hash(admin)]={createdAt:Date.now(),lastSeen:Date.now()};state.seniors=[{id:'a',name:'김비공개',birthYear:1940,grade:3,note:'private'},{id:'b',name:'박비공개'}];
require('../automation/database').transaction=async fn=>{const next=structuredClone(state),result=await fn(next);state=next;return result;};const handler=require('../api/garden');
async function call(action,body,cookie=''){let code=200,headers={},data;await handler({url:'/api/garden?action='+action,method:body?'POST':'GET',body,headers:{host:'localhost:8085',origin:'http://localhost:8085',cookie}}, {setHeader(k,v){headers[k]=v;},status(n){code=n;return this;},json(x){data=x;}});return {code,data,headers};}
(async()=>{
 const adminCookie='school_admin='+admin;
 assert.equal((await call('admin')).code,401);
 for(const id of ['a','b'])assert.equal((await call('configure',{id,mode:'lesson',visitable:id==='a'},adminCookie)).code,200);
 const a=(await call('assign',{id:'a'},adminCookie)).headers['Set-Cookie'].split(';')[0],b=(await call('assign',{id:'b'},adminCookie)).headers['Set-Cookie'].split(';')[0];
 assert.equal((await call('home',undefined,'')).code,401);
 const plant={action:'plant',plot:0,vegetable:'potato',eventId:crypto.randomUUID()};assert.equal((await call('act',plant,a)).code,200);assert.equal((await call('act',plant,a)).code,200);assert.equal(state.participationRecords.length,1);
 assert.equal((await call('act',{...plant,target:'a',eventId:crypto.randomUUID()},b)).code,403);
 const neighbors=await call('neighbors',undefined,b);assert.equal(neighbors.data.homes.length,1);assert(!JSON.stringify(neighbors.data).includes('비공개'));assert(!JSON.stringify(neighbors.data).includes('birthYear'));
 const visit=await call('visit',{target:'a'},b);assert.equal(visit.code,200);assert(!JSON.stringify(visit.data).includes('harvests'));
 const help={action:'help',target:'a',plot:0,eventId:crypto.randomUUID()};assert.equal((await call('act',help,b)).code,200);assert.equal((await call('act',{...help,eventId:crypto.randomUUID()},b)).code,400);
 for(const action of ['harvest','reset','delete','water'])assert.equal((await call('act',{action,target:'a',plot:0,eventId:crypto.randomUUID()},b)).code,403);
 assert.equal((await call('configure',{id:'a',mode:'lesson',visitable:false},adminCookie)).code,200);
 assert.equal((await call('neighbors',undefined,b)).data.homes.length,0);assert.equal((await call('view&target=a',undefined,b)).code,403);assert.equal((await call('act',{...help,eventId:crypto.randomUUID()},b)).code,403);
 assert(state.dailyReports.length>0);assert(state.dailyReports.every(r=>r.status==='pending'));assert(state.participationRecords.every(r=>r.mood===null));
 console.log('Garden API transaction-double: admin/session/owner checks, privacy, idempotency, revocation, records passed (not a live PostgreSQL test)');
})().catch(e=>{console.error(e);process.exitCode=1;});
