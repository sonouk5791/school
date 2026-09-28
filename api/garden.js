'use strict';
const crypto=require('node:crypto'),db=require('../automation/database'),auth=require('../automation/auth'),G=require('../automation/garden'),D=require('../automation/domain');
const fail=(message,status=400)=>{throw Object.assign(Error(message),{status});};
function recordEvent(s,event,session,seconds,now){
 const id=session.seniorId,duration=Math.max(0,Math.min(1800,Math.floor((now-(session.lastAction||session.started))/1000),Number(seconds)||0));session.lastAction=now;
 s.participationRecords ||= [];const recordId='garden:'+id+':'+G.date(now),prior=s.participationRecords.find(x=>x.id===recordId);
 const record={id:recordId,sessionId:recordId,seniorId:id,date:G.date(now),type:'garden',programTitle:'우리 집 텃밭',durationSeconds:(prior?.durationSeconds||0)+duration,completed:prior?.completed||['harvest','memory'].includes(event.action),notes:[prior?.notes,`${event.label}: ${event.detail}`].filter(Boolean).join('\n'),participation:prior?.participation||null,expression:prior?.expression||null,assistance:prior?.assistance||null,mood:prior?.mood||null};
 D.upsert(s.participationRecords,record);s.dailyReports ||= [];
 const draft=D.journal(s.participationRecords,id,record.date),existing=s.dailyReports.find(x=>x.id===draft.id);
 if(!existing)s.dailyReports.push(draft);else if(existing.status==='pending'&&existing.source==='record-summary')Object.assign(existing,draft);
 if(process.env.JOURNAL_MODEL&&['harvest','memory'].includes(event.action)){
  s.automationJobs ||= [];const jobId='garden-ai:'+id+':'+event.id;
  if(!s.automationJobs.some(j=>j.id===jobId))s.automationJobs.push({id:jobId,kind:'ai-daily',date:record.date,payload:{seniorId:id},status:'pending',attempts:0,nextAttemptAt:null});
 }
}
module.exports=async(req,res)=>{
 res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
 try{
  const action=new URL(req.url,'https://local').searchParams.get('action')||'home';
  if(action==='status')return res.json({configured:!!process.env.DATABASE_URL});
  if(!['GET','POST'].includes(req.method))fail('허용되지 않은 요청',405);
  if(req.method==='POST'){let origin;try{origin=new URL(req.headers.origin).host;}catch{}if(origin!==req.headers.host)fail('요청 출처를 확인해주세요.',403);}
  const b=typeof req.body==='string'?JSON.parse(req.body):req.body||{};if(JSON.stringify(b).length>12000)fail('요청이 너무 큽니다.',413);
  const output=await db.transaction(async s=>{
   const g=G.init(s),now=Date.now();
   if(['admin','configure','assign'].includes(action)){
    auth.check(s,req);if(s.admins?.primary?.mustChange)fail('먼저 관리자 비밀번호를 변경해주세요.',403);
    if(action==='admin')return {homes:Object.values(g.homes),seniors:(s.seniors||[]).map(x=>({id:x.id,alias:(x.name||'어르신').slice(0,1)+'○'})),events:g.events.slice(-200)};
    if(req.method!=='POST')fail('POST 요청이 필요합니다.',405);
    if(!(s.seniors||[]).some(x=>x.id===b.id))fail('등록된 어르신을 선택해주세요.');
    if(action==='configure'){
     const h=g.homes[b.id]||G.home(b.id,'이웃 '+(Object.keys(g.homes).length+1)+'님 댁');
     if(!['real','lesson'].includes(b.mode))fail('성장 모드를 확인해주세요.');
     if(h.mode!==b.mode&&h.plots.some(Boolean))fail('자라는 채소를 수확한 뒤 모드를 바꿔주세요.');
     h.mode=b.mode;h.visitable=b.visitable===true;g.homes[b.id]=h;return {ok:true};
    }
    if(!g.homes[b.id])fail('먼저 우리 집을 준비해주세요.');
    const token=crypto.randomBytes(32).toString('hex');
    for(const [k,v]of Object.entries(g.sessions))if(v.expires<now)delete g.sessions[k];
    const old=(req.headers.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith('school_garden='))?.slice(14);if(old)delete g.sessions[auth.hash(old)];
    g.sessions[auth.hash(token)]={seniorId:b.id,expires:now+8*3600000,started:now};
    res.setHeader('Set-Cookie',`school_garden=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=28800${req.headers.host?.startsWith('localhost')?'':'; Secure'}`);return {ok:true};
   }
   const token=(req.headers.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith('school_garden='))?.slice(14);
   const session=token&&g.sessions[auth.hash(token)];if(!session||session.expires<now)fail('선생님 공간에서 사용할 어르신을 연결해주세요.',401);
   const id=session.seniorId,h=g.homes[id];if(!h)fail('우리 집 연결이 필요해요.',401);
   if(action==='neighbors')return {homes:Object.values(g.homes).filter(x=>x.id!==id&&x.visitable).map(x=>({id:x.id,alias:x.alias}))};
   if(action==='home')return {home:G.view(h,true),greetings:g.events.filter(x=>x.target===id&&x.action==='greet').slice(-5).map(x=>({text:x.detail}))};
   if(action==='view'){const target=new URL(req.url,'https://local').searchParams.get('target'),other=g.homes[target];if(!other||(target!==id&&!other.visitable))fail('지금은 방문할 수 없어요.',403);return {home:G.view(other,target===id)};}
   if(action==='visit') {const other=g.homes[b.target];if(req.method!=='POST')fail('방문 확인이 필요해요.',405);const event=G.act(s,id,{action:'visit',target:b.target},now);recordEvent(s,event,session,0,now);return {home:G.view(other,false)};}
   if(action!=='act'||req.method!=='POST')fail('요청을 확인해주세요.',405);
   if(typeof b.eventId!=='string'||!/^[-a-zA-Z0-9]{8,80}$/.test(b.eventId))fail('활동 번호가 필요해요.');
   const previous=g.events.find(x=>x.id===b.eventId&&x.actor===id);
   if(!previous){
    const event=G.act(s,id,b,now);recordEvent(s,event,session,b.durationSeconds,now);
   }
   const target=g.homes[b.target||id];if(!target||(target.id!==id&&!target.visitable))fail('지금은 방문할 수 없어요.',403);
   return {home:G.view(target,target.id===id)};
  });res.json(output);
 }catch(e){res.status(e.status||503).json({error:e.status?e.message:'서버에 연결하지 못했어요. 잠시 후 다시 시도해주세요.'});}
};
