import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from '../node_modules/sharp/lib/index.js';
const here=path.dirname(fileURLToPath(import.meta.url));
const src=path.resolve(here,'../screenshots');
const dest=path.resolve(here,'../../bankstatementanalytics/assets');
const files=fs.readdirSync(src).filter(f=>f.endsWith('.webp')).sort();
if(files.length!==22) throw new Error(`Expected 22 screenshots, found ${files.length}`);
const tiles=[];
for(const [i,file] of files.entries()) {
  const original=fs.readFileSync(path.join(src,file));
  const output=fs.readFileSync(path.join(dest,file));
  if(!original.equals(output)) throw new Error(`Published file differs: ${file}`);
  const meta=await sharp(output).metadata();
  if(meta.width!==2400||meta.height!==1500) throw new Error(`Wrong dimensions: ${file}`);
  const png=fs.readFileSync(path.join(here,'captures',file.replace('.webp','.png')));
  const encoded=await sharp(png).resize(2400,1500,{fit:'cover'}).webp({quality:85}).toBuffer();
  if(!encoded.equals(output)) throw new Error(`Does not match actual browser capture: ${file}`);
  tiles.push({input:await sharp(output).resize(600,375).png().toBuffer(),left:(i%4)*600,top:Math.floor(i/4)*375});
}
await sharp({create:{width:2400,height:2250,channels:3,background:'#ddd'}}).composite(tiles).png().toFile(path.join(here,'captures/contact-sheet.png'));
console.log('Verified all 22 published images: 2400x1500, identical to source, and derived from actual browser PNG captures.');
