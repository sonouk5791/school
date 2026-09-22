'use strict';
const crypto=require('node:crypto');
const MODEL='gemini-3.1-flash-tts-preview';
const CHARACTER_VOICES=Object.freeze(Object.fromEntries(Object.entries({kongi:'Achird',tori:'Aoede',nabi:'Gacrux',bori:'Charon'}).map(([id,voice])=>[id,{voice,languageCode:'ko-KR'}])));
let cachedToken=null;
function config(env=process.env){
 if(env.GOOGLE_WORKLOAD_IDENTITY_PROVIDER){
  const missing=['GOOGLE_CLOUD_PROJECT','GOOGLE_SERVICE_ACCOUNT_EMAIL'].filter(k=>!env[k]);
  if(missing.length)throw Object.assign(Error('Missing environment variables: '+missing.join(', ')),{code:'TTS_NOT_CONFIGURED',status:503});
  if(!/^[a-z0-9-]+$/.test(env.GOOGLE_CLOUD_PROJECT)||!/^[a-z0-9-]+$/.test(env.GOOGLE_CLOUD_LOCATION||'us-central1'))throw Object.assign(Error('Invalid project or location'),{code:'TTS_NOT_CONFIGURED',status:503});
  if(!/^projects\/\d+\/locations\/global\/workloadIdentityPools\/[a-z0-9-]+\/providers\/[a-z0-9-]+$/.test(env.GOOGLE_WORKLOAD_IDENTITY_PROVIDER)||!/^[-a-z0-9]+@[-a-z0-9]+\.iam\.gserviceaccount\.com$/.test(env.GOOGLE_SERVICE_ACCOUNT_EMAIL))throw Object.assign(Error('Invalid workload identity configuration'),{code:'TTS_NOT_CONFIGURED',status:503});
  return {auth:'oidc',project:env.GOOGLE_CLOUD_PROJECT,location:env.GOOGLE_CLOUD_LOCATION||'us-central1',provider:env.GOOGLE_WORKLOAD_IDENTITY_PROVIDER,email:env.GOOGLE_SERVICE_ACCOUNT_EMAIL};
 }
 const missing=['GOOGLE_CLOUD_PROJECT','GOOGLE_SERVICE_ACCOUNT_JSON'].filter(k=>!env[k]);
 if(missing.length)throw Object.assign(Error('Missing environment variables: '+missing.join(', ')),{code:'TTS_NOT_CONFIGURED',status:503});
 let credentials;try{credentials=JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON);}catch{throw Object.assign(Error('GOOGLE_SERVICE_ACCOUNT_JSON must be valid JSON'),{code:'TTS_NOT_CONFIGURED',status:503});}
 if(!credentials.client_email||!credentials.private_key||credentials.type!=='service_account')throw Object.assign(Error('Service account client_email/private_key/type required'),{code:'TTS_NOT_CONFIGURED',status:503});
 const project=env.GOOGLE_CLOUD_PROJECT,location=env.GOOGLE_CLOUD_LOCATION||'us-central1';
 if(!/^[a-z0-9-]+$/.test(project)||!/^[a-z0-9-]+$/.test(location))throw Object.assign(Error('Invalid project or location'),{code:'TTS_NOT_CONFIGURED',status:503});
 return {credentials,project,location};
}
function googleError(status,data,stage){const message=String(data?.error?.message||data?.error_description||data?.error||'Google request failed').slice(0,1200);console.error('[Vertex TTS]',JSON.stringify({stage,status,message}));return Object.assign(Error(message),{code:'GOOGLE_TTS_FAILED',status:502,googleStatus:status,stage});}
async function token(c,fetcher=fetch,req={}){
 if(c.auth==='oidc'){
  const subjectToken=req.headers?.['x-vercel-oidc-token']||process.env.VERCEL_OIDC_TOKEN;
  if(typeof subjectToken!=='string'||!subjectToken)throw Object.assign(Error('Vercel OIDC token unavailable; enable OIDC for this deployment'),{code:'TTS_NOT_CONFIGURED',status:503});
  // Google validates the signed issuer, audience and Production-only subject.
  const exchange=await fetcher('https://sts.googleapis.com/v1/token',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({audience:'//iam.googleapis.com/'+c.provider,grantType:'urn:ietf:params:oauth:grant-type:token-exchange',requestedTokenType:'urn:ietf:params:oauth:token-type:access_token',subjectTokenType:'urn:ietf:params:oauth:token-type:jwt',subjectToken,scope:'https://www.googleapis.com/auth/cloud-platform'}),signal:AbortSignal.timeout(15000)});
  const federation=await exchange.json();if(!exchange.ok||!federation.access_token)throw googleError(exchange.status,federation,'oidc-exchange');
  const impersonation=await fetcher('https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/'+encodeURIComponent(c.email)+':generateAccessToken',{method:'POST',headers:{Authorization:'Bearer '+federation.access_token,'Content-Type':'application/json'},body:JSON.stringify({scope:['https://www.googleapis.com/auth/cloud-platform'],lifetime:'3600s'}),signal:AbortSignal.timeout(15000)});
  const access=await impersonation.json();if(!impersonation.ok||!access.accessToken)throw googleError(impersonation.status,access,'service-account-impersonation');
  return access.accessToken;
 }
 const key=c.credentials.client_email+crypto.createHash('sha256').update(c.credentials.private_key).digest('hex');
 if(cachedToken?.key===key&&cachedToken.expires>Date.now()+60000)return cachedToken.value;
 const now=Math.floor(Date.now()/1000),encode=v=>Buffer.from(JSON.stringify(v)).toString('base64url');
 const unsigned=encode({alg:'RS256',typ:'JWT'})+'.'+encode({iss:c.credentials.client_email,scope:'https://www.googleapis.com/auth/cloud-platform',aud:'https://oauth2.googleapis.com/token',iat:now,exp:now+3600});
 const assertion=unsigned+'.'+crypto.sign('RSA-SHA256',Buffer.from(unsigned),c.credentials.private_key.replace(/\\n/g,'\n')).toString('base64url');
 const r=await fetcher('https://oauth2.googleapis.com/token',{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion}),signal:AbortSignal.timeout(15000)});const data=await r.json();if(!r.ok||!data.access_token)throw googleError(r.status,data,'authentication');
 cachedToken={key,value:data.access_token,expires:Date.now()+Number(data.expires_in||3600)*1000};return data.access_token;
}
function payload(id,text){return {contents:[{role:'user',parts:[{text:'Speak the following Korean text naturally, warmly and slowly for an older adult. Read only the text after TEXT. Do not add words.\nTEXT:\n'+text}]}],generation_config:{response_modalities:['AUDIO'],speech_config:{language_code:CHARACTER_VOICES[id].languageCode,voice_config:{prebuilt_voice_config:{voice_name:CHARACTER_VOICES[id].voice}}}}};}
function wav(pcm,rate=24000){if(!pcm.length||pcm.length%2)throw Error('Invalid PCM sample data');const h=Buffer.alloc(44);h.write('RIFF');h.writeUInt32LE(36+pcm.length,4);h.write('WAVEfmt ',8);h.writeUInt32LE(16,16);h.writeUInt16LE(1,20);h.writeUInt16LE(1,22);h.writeUInt32LE(rate,24);h.writeUInt32LE(rate*2,28);h.writeUInt16LE(2,32);h.writeUInt16LE(16,34);h.write('data',36);h.writeUInt32LE(pcm.length,40);return Buffer.concat([h,pcm]);}
function decode(data){const parts=data?.candidates?.[0]?.content?.parts||[],audio=parts.map(p=>p.inlineData||p.inline_data).filter(p=>p?.data);if(!audio.length)throw Error('Vertex returned no audio data');let rate=24000;const buffers=audio.map(p=>{const mime=p.mimeType||p.mime_type||'';if(!/^audio\/(L16|pcm|wav|x-wav)(;|$)/i.test(mime))throw Error('Unsupported audio MIME: '+mime);const m=mime.match(/rate=(\d+)/i);if(m)rate=Number(m[1]);return Buffer.from(p.data,'base64');});if(buffers.length===1&&buffers[0].toString('ascii',0,4)==='RIFF')return buffers[0];if(rate!==24000)throw Error('Unexpected PCM sample rate: '+rate);return wav(Buffer.concat(buffers),rate);}
async function body(req){if(req.body!==undefined)return typeof req.body==='string'?JSON.parse(req.body):req.body;let text='';for await(const chunk of req){text+=chunk;if(Buffer.byteLength(text)>8192)throw Object.assign(Error('Request too large'),{status:413,code:'INVALID_REQUEST'});}return JSON.parse(text||'{}');}
function json(res,status,data){res.statusCode=status;res.setHeader('Content-Type','application/json; charset=utf-8');res.end(JSON.stringify(data));}
async function handler(req,res){
 res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
 if(req.method==='GET'){let configured=true,reason=null;try{config();}catch(e){configured=false;reason=e.message;}return json(res,200,{provider:'vertex-ai',model:MODEL,configured,connection:'not-tested',reason,voices:CHARACTER_VOICES});}
 if(req.method!=='POST'){res.setHeader('Allow','GET, POST');return json(res,405,{error:'METHOD_NOT_ALLOWED'});}
 try{const input=await body(req);if(!Object.hasOwn(CHARACTER_VOICES,input?.characterId)||typeof input.text!=='string'||!input.text.trim()||Buffer.byteLength(input.text)>3000)return json(res,400,{error:'INVALID_REQUEST',message:'Valid characterId and text (1–3000 UTF-8 bytes) required'});
 const c=config(),accessToken=await token(c,fetch,req),endpoint=`https://aiplatform.googleapis.com/v1beta1/projects/${c.project}/locations/${c.location}/publishers/google/models/${MODEL}:generateContent`;
 const response=await fetch(endpoint,{method:'POST',headers:{Authorization:'Bearer '+accessToken,'x-goog-user-project':c.project,'Content-Type':'application/json'},body:JSON.stringify(payload(input.characterId,input.text.trim())),signal:AbortSignal.timeout(45000)});
 const data=await response.json();if(!response.ok)throw googleError(response.status,data,'synthesis');let audio;try{audio=decode(data);}catch(e){throw Object.assign(e,{code:'GOOGLE_TTS_FAILED',status:502,googleStatus:200});}
 res.statusCode=200;res.setHeader('Content-Type','audio/wav');res.setHeader('Content-Length',audio.length);res.setHeader('X-TTS-Provider','vertex-ai');res.setHeader('X-TTS-Model',MODEL);res.setHeader('X-TTS-Voice',CHARACTER_VOICES[input.characterId].voice);res.end(audio);
 }catch(e){const status=e.status||502;console.error('[Vertex TTS]',JSON.stringify({code:e.code||'TTS_SERVER_ERROR',status,googleStatus:e.googleStatus||null,message:e.message}));return json(res,status,{error:e.code||'TTS_SERVER_ERROR',message:e.message,googleStatus:e.googleStatus||null,model:MODEL});}
}
module.exports=handler;module.exports._test={config,payload,wav,decode,MODEL,CHARACTER_VOICES};
