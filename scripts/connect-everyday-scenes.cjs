const fs=require('node:fs');
const file='assets/senior-exercise/program.json';
let text=fs.readFileSync(file,'utf8');
for(const id of ['scene02_breathing','scene04_shoulders','scene05_arms','scene06_clapping','scene08_ankles','scene09_hands','scene10_ending']){
 const image=`assets/senior-exercise/images/everyday/${id}.png`;
 if(!fs.existsSync(image))throw Error('Missing scene '+image);
 text=text.replace(`"image": "${id}.jpg"`,`"image": "${image}"`);
}
text=text.replaceAll('파란색 운동복의 곰','크림색 상의와 연갈색 바지의 곰').replaceAll('분홍색 운동복의 토끼','코랄색 상의와 민트색 바지의 토끼').replaceAll('보라색 운동복의 고양이','라벤더 상의와 연하늘색 바지의 고양이');
fs.writeFileSync(file,text);
