// Copy changed project files into the existing release checkout. Never deletes files.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=path.resolve(__dirname,'..'),release=path.join(root,'school-release');
if(path.basename(root)==='school-release')throw Error('Run this script from the main workspace.');
if(!fs.existsSync(path.join(release,'.git')))throw Error('Existing release Git checkout required.');
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');let copied=0,checked=0;
function copy(relative){const source=path.join(root,relative),target=path.join(release,relative);if(fs.statSync(source).isDirectory()){for(const name of fs.readdirSync(source)){if(['node_modules','__pycache__','.git','.vercel'].includes(name)||name.startsWith('.env'))continue;copy(path.join(relative,name));}return;}checked++;if(fs.existsSync(target)&&hash(source)===hash(target))return;fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(source,target);if(hash(source)!==hash(target))throw Error('Copy mismatch '+relative);copied++;}
for(const dir of ['assets','characters','css','js','public','scripts','tests','documents','.githooks'])if(fs.existsSync(path.join(root,dir)))copy(dir);
for(const name of fs.readdirSync(root))if(fs.statSync(path.join(root,name)).isFile()&&(/\.(md|html|cjs|json)$/.test(name)||['.gitignore','.gitattributes','.vercelignore'].includes(name)))copy(name);
console.log(`Release sync verified: ${checked} files checked, ${copied} files updated.`);
