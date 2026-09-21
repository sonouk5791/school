// Called by the repository's pre-commit hook, or explicitly after finishing work.
const fs=require('fs'),path=require('path'),cp=require('child_process');
const project=path.resolve(__dirname,'..');
const git=(args)=>cp.execFileSync('git',args,{cwd:project,encoding:'utf8',maxBuffer:4*1024*1024});
const value=flag=>{const i=process.argv.indexOf(flag);return i<0?'':process.argv[i+1]||''};
const automatic=process.argv.includes('--staged');
let changes=[];
if(automatic){changes=git(['diff','--cached','--name-only','-z']).split('\0').filter(Boolean);if(!changes.length)process.exit(0);}
const now=new Date(),parts=Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(now).map(p=>[p.type,p.value]));
const date=`${parts.year}-${parts.month}-${parts.day}`,time=`${parts.hour}:${parts.minute}:${parts.second}`;
const title=value('--title')||(automatic?'Git 커밋 변경사항 자동 저장':'작업 완료 자동 저장');
const detail=value('--details')||(automatic?'커밋 직전 실제 스테이징된 변경 파일을 자동 기록했습니다.':'작업 내용을 디스크에 저장했습니다.');
const lines=[`\n## 자동 저장 / ${date} ${time} — ${title}`,`- **수행 내역**: ${detail}`];
if(changes.length){lines.push(`- **변경 파일 수**: ${changes.length}`, '<details><summary>변경 파일 목록</summary>','');for(const file of changes)lines.push(`- [${file}](./${file.replaceAll(' ','%20')})`);lines.push('','</details>');}
const entry=lines.join('\n')+'\n';
const names=[`오늘_작업_일지_${date}.md`,'TODAY_WORK_REPORT.md'];
for(const name of names){const file=path.join(project,name);if(!fs.existsSync(file))fs.writeFileSync(file,`# 작업 일지 ${date}\n`);fs.appendFileSync(file,entry);}
// This workspace edits J:/sh and commits its synchronized school-release copy.
const parent=path.dirname(project),release=path.join(project,'school-release');
const mirror=path.basename(project)==='school-release'&&fs.existsSync(path.join(parent,'AGENTS.md'))?parent:fs.existsSync(path.join(release,'.git'))?release:null;
if(mirror)for(const name of names)fs.copyFileSync(path.join(project,name),path.join(mirror,name));
if(automatic)git(['add','--',...names]);
console.log(`Saved Markdown work logs for ${date} (${changes.length} staged files).`);
