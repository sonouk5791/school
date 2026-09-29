const fs = require('fs');
const path = 'bori-hobby.html';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  /<a href="index\.html" class="bh-home-btn">[\s\S]*?<\/a>/,
  '<a href="index.html" class="bh-home-btn" onclick="sessionStorage.setItem(\'school_home_intro_played\',\'true\')">🏡 친구들 마을로 돌아가기</a>'
);

fs.writeFileSync(path, content, 'utf8');
console.log('bori-hobby.html bottom return link updated');
