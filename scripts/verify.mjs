import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {readPNG} from './png.mjs';
const [originalPath,outputPath]=process.argv.slice(2);
if(!outputPath) throw Error('Usage: node scripts/verify.mjs ORIGINAL OUTPUT');
const a=readPNG(originalPath),b=readPNG(outputPath);
assert.equal(b.width,3840);assert.equal(b.height,2160);
assert.equal(a.width,b.width);assert.equal(a.height,b.height);
let minX=b.width,minY=b.height,maxX=-1,maxY=-1,changed=0,outside=0;
for(let y=0;y<b.height;y++) for(let x=0;x<b.width;x++) {
 const p=(y*b.width+x)*4;
 if(a.pixels.subarray(p,p+4).equals(b.pixels.subarray(p,p+4))) continue;
 changed++;minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);
 if(x<400||x>=1360||y<230||y>=820)outside++;
}
assert(changed>0);assert.equal(outside,0);
const bbox={x:minX,y:minY,width:maxX-minX+1,height:maxY-minY+1};
const fraction=bbox.width*bbox.height/(b.width*b.height);
assert(fraction<0.08);
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
console.log(JSON.stringify({format:'PNG',width:b.width,height:b.height,channels:'RGBA',changedPixelBoundingBox:bbox,changedPixelCount:changed,boundingBoxPercent:fraction*100,pixelsChangedOutsideContribution:outside,originalSHA256:hash(originalPath),outputSHA256:hash(outputPath),unmetRequirements:[]},null,2));
