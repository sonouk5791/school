const fs=require('fs'),path=require('path'),scan=require('./welcome-recordings.cjs');
const root=path.resolve(__dirname,'..');
fs.writeFileSync(path.join(root,'welcome-recordings.json'),JSON.stringify(scan(root),null,2)+'\n');
console.log('Welcome recording manifest generated from existing files.');

fs.writeFileSync(path.join(root,'character-recordings.json'),JSON.stringify(require('./character-recordings.cjs')(root),null,2)+'\n');
