'use strict';
const assert=require('node:assert/strict');
const handler=require('../api/tts.js');
const vars={GOOGLE_CLOUD_PROJECT:'test-project',GOOGLE_WORKLOAD_IDENTITY_PROVIDER:'projects/123/locations/global/workloadIdentityPools/test/providers/vercel',GOOGLE_SERVICE_ACCOUNT_EMAIL:'tts@test-project.iam.gserviceaccount.com'};
const previous=Object.fromEntries(Object.keys(vars).map(k=>[k,process.env[k]]));
const originalFetch=global.fetch;
function response(){return {setHeader(){},end(v){this.data=v;}};}
(async()=>{try{
 Object.assign(process.env,vars);delete process.env.VERCEL_OIDC_TOKEN;
 let r=response();await handler({method:'POST',body:{characterId:'kongi',text:'안녕하세요'},headers:{}},r);assert.equal(r.statusCode,503);
 const stages=[];
 global.fetch=async(url,options)=>{
  const body=JSON.parse(options.body);stages.push(url);
  if(url.includes('sts.googleapis.com')){assert.equal(body.subjectToken,'signed-production-token');assert.equal(body.audience,'//iam.googleapis.com/'+vars.GOOGLE_WORKLOAD_IDENTITY_PROVIDER);return {ok:true,json:async()=>({access_token:'federated-token'})};}
  if(url.includes('iamcredentials.googleapis.com')){assert.equal(options.headers.Authorization,'Bearer federated-token');return {ok:true,json:async()=>({accessToken:'service-token'})};}
  assert.equal(options.headers.Authorization,'Bearer service-token');return {ok:true,json:async()=>({candidates:[{content:{parts:[{inlineData:{mimeType:'audio/L16;rate=24000',data:Buffer.alloc(4800).toString('base64')}}]}}]})};
 };
 r=response();await handler({method:'POST',body:{characterId:'kongi',text:'안녕하세요'},headers:{'x-vercel-oidc-token':'signed-production-token'}},r);assert.equal(r.statusCode,200);assert.equal(stages.length,3);assert.equal(r.data.toString('ascii',0,4),'RIFF');
 global.fetch=async()=>({ok:false,status:403,json:async()=>({error:{message:'subject rejected'}})});
 r=response();await handler({method:'POST',body:{characterId:'tori',text:'안녕하세요'},headers:{'x-vercel-oidc-token':'preview-token'}},r);assert.equal(r.statusCode,502);assert.equal(JSON.parse(r.data).googleStatus,403);
 console.log('PASS: missing OIDC, STS exchange, service-account impersonation, WAV result, denied subject');
}finally{global.fetch=originalFetch;for(const [k,v] of Object.entries(previous)){if(v===undefined)delete process.env[k];else process.env[k]=v;}}})();
