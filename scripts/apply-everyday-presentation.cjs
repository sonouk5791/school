// One-time migration: preserve activity data, voices, routes and archived artwork.
const fs = require('node:fs');
const pages = ['index.html','senior-exercise.html','tori-play.html','nabi-learn.html','bori-hobby.html'];
for (const file of pages) {
  let text = fs.readFileSync(file, 'utf8');
  if(text.includes('data-season="everyday"')) continue;
  text = text.replace('data-season="chuseok"', 'data-season="everyday"');
  text = text.replace(/<link[^>]+href="css\/chuseok-(?:season|rooms|recommendation)\.css[^>]*>/g, '');
  text = text.replace(/<script[^>]+src="js\/chuseok-(?:season|bow|recommendation)\.js[^>]*><\/script>/g, '');
  text = text.replace(/css\/chuseok-bow\.css\?[^" ]+/g, 'css/character-expressions.css?v=20260928-active');
  text = text.replace(/js\/hanbok-character\.js\?[^" ]+/g, 'js/hanbok-character.js?v=20260928-active');
  text = text.replace(/js\/character-animation\.js\?[^" ]+/g, 'js/character-animation.js?v=20260928-active');
  text = text.replace(/assets\/images\/chuseok\/(kongi|tori|nabi|bori)-hanbok-v2\.png/g, 'assets/images/everyday/$1-active.png');
  text = text.replace('</head>', '<link rel="stylesheet" href="css/everyday-characters.css?v=20260928-active"><script defer src="js/everyday-characters.js?v=20260928-active"></script>\n</head>');
  text = text.replace('추석을 기다리며, 천천히 움직여볼까요?', '천천히 몸을 움직여볼까요?');
  text = text.replace('<p class="se-ready-desc">10가지 건강 체조</p>', '<p class="se-ready-desc">앉아서도 따라할 수 있는 쉬운 10가지 건강 체조</p>');
  text = text.replace(/\s*<aside class="chuseok-banner"[\s\S]*?<\/aside>/g, '');
  text = text.replace('오전·오후 수업과 계절 소식', '오전·오후 수업 안내');
  fs.writeFileSync(file, text);
}
let rig = fs.readFileSync('js/hanbok-character.js','utf8');
rig = rig.replace("const art=id=>'assets/images/chuseok/'+id+'-hanbok-v2.png';", "// Legacy public API name is retained for voice and expression compatibility.\n const art=id=>'assets/images/everyday/'+id+'-active.png';");
fs.writeFileSync('js/hanbok-character.js', rig);
let animation = fs.readFileSync('js/character-animation.js','utf8');
animation = animation.replaceAll("document.documentElement.dataset.season==='chuseok'", "['chuseok','everyday'].includes(document.documentElement.dataset.season)");
animation = animation.replace("document.documentElement.dataset.season!=='chuseok'", '!season');
fs.writeFileSync('js/character-animation.js', animation);
fs.copyFileSync('css/chuseok-bow.css','css/character-expressions.css');
let player=fs.readFileSync('js/bori-media-player.js','utf8');
player=player.replaceAll('assets/images/chuseok/bori-hanbok-v2.png','assets/images/everyday/bori-active.png');
fs.writeFileSync('js/bori-media-player.js',player);
