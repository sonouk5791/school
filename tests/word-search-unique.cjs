const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const context={window:{LESSON_CATALOG:[]},document:{addEventListener(){}}};vm.createContext(context);vm.runInContext(fs.readFileSync('js/word-search.js','utf8'),context);
let total=0;for(let d=1;d<=60;d++)for(let round=0;round<20;round++){
const date=new Date(Date.UTC(2026,8,d)).toISOString().slice(0,10),g=context.window.WordSearchBoards.generate(date,round),cells=g.targets.flatMap(t=>Array.from(t.path));
assert.equal(g.targets.length,2+Math.floor(round/5));assert.equal(new Set(cells).size,cells.length);
for(const t of g.targets){let count=0;for(let r=0;r<g.size;r++)for(let c=0;c<g.size;c++)for(const [dr,dc] of [[0,1],[1,0],[1,1],[1,-1],[0,-1],[-1,0],[-1,-1],[-1,1]]){const er=r+dr*(t.word.length-1),ec=c+dc*(t.word.length-1);if(er<0||er>=g.size||ec<0||ec>=g.size)continue;if(Array.from(t.word).every((ch,i)=>g.grid[(r+dr*i)*g.size+c+dc*i]===ch))count++;}assert.equal(count,1);}
total++;
}console.log('PASS: '+total+' boards; no shared cells, each target appears exactly once in all 8 directions.');
