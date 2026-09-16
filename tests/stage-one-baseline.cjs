/* Run existing regressions in isolated browser contexts past the first-entry greeting. */
const fs=require('fs'),cp=require('child_process'),path=require('path');
const files=['welcome-greeting.cjs','morning-program.cjs','senior-care-regression.cjs','participant-archive.cjs','document-templates.cjs'];
for(const file of files){
 let source=fs.readFileSync(path.join(__dirname,file),'utf8');
 if(file!=='welcome-greeting.cjs')source=source.replace(/await (page|p)\.goto\('http:\/\/127\.0\.0\.1:8085'\)/,(_,p)=>`await ${p}.addInitScript(()=>sessionStorage.setItem('school_character_welcome_v1','1'));await ${p}.goto('http://127.0.0.1:8085')`);
 if(file==='welcome-greeting.cjs')source=source.replace('[1440,768,390]','[1440,1024,768,390]');
 const result=cp.spawnSync(process.execPath,['-e',source],{encoding:'utf8',timeout:180000,cwd:path.resolve(__dirname,'..'),env:process.env});
 process.stdout.write(result.stdout||'');process.stderr.write(result.stderr||'');if(result.error)throw result.error;if(result.status!==0)process.exit(result.status||1);
}
console.log('PASS stage-one baseline suite');
