const fs=require('fs'),path=require('path');
// Only fixed welcome filenames are inspected. Never return missing-file URLs.
module.exports=function(root){
 const recordings={};
 for(const [id,file] of [['kongi','kong'],['tori','tori'],['nabi','nabi'],['bori','bori']]){
  outer:for(const dir of ['public/audio/welcome','audio/welcome','assets/audio/welcome'])for(const ext of ['mp3','wav']){
   const relative=dir+'/'+file+'.'+ext,full=path.join(root,relative);let fd;
   try{const stat=fs.statSync(full);if(!stat.isFile()||stat.size<12)continue;fd=fs.openSync(full,'r');const head=Buffer.alloc(12);fs.readSync(fd,head,0,12,0);
    const valid=ext==='wav'?head.toString('ascii',0,4)==='RIFF'&&head.toString('ascii',8,12)==='WAVE':head.toString('ascii',0,3)==='ID3'||(head[0]===255&&(head[1]&224)===224);
    if(valid){recordings[id]='/'+relative;break outer;}
   }catch{}finally{if(fd!==undefined)fs.closeSync(fd);}
  }
 }
 return recordings;
};
