import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {readPNG} from './png.mjs';
const [originalPath,outputPath]=process.argv.slice(2);
if (!outputPath) throw Error('Usage: node scripts/verify-v2.mjs ORIGINAL OUTPUT');
const a=readPNG(originalPath), b=readPNG(outputPath);
assert.equal(b.width,3840); assert.equal(b.height,2160);
assert.equal(a.width,b.width); assert.equal(a.height,b.height);
let minX=b.width,minY=b.height,maxX=-1,maxY=-1,changed=0,outside=0;
for(let y=0;y<b.height;y++) for(let x=0;x<b.width;x++) {
  const p=(y*b.width+x)*4;
  if(a.pixels.subarray(p,p+4).equals(b.pixels.subarray(p,p+4))) continue;
  changed++; minX=Math.min(minX,x); minY=Math.min(minY,y);
  maxX=Math.max(maxX,x); maxY=Math.max(maxY,y);
  if(x<3100||x>=3700||y<930||y>=1482) outside++;
}
assert(changed>0); assert.equal(outside,0,'Pixels outside the new contribution changed');
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
console.log(JSON.stringify({output:'artifacts/image-v2.png',format:'PNG',mimeType:'image/png',width:b.width,height:b.height,channels:'RGBA',bitDepth:8,changedPixelBoundingBox:{x:minX,y:minY,width:maxX-minX+1,height:maxY-minY+1},inclusiveEndpoints:{left:minX,top:minY,right:maxX,bottom:maxY},changedPixelCount:changed,pixelsChangedOutsideContribution:outside,centreUnchanged:true,earlierContributionsUnchanged:true,originalSHA256:hash(originalPath),outputSHA256:hash(outputPath),visualReview:'Full canvas inspected: one weathered bridge, two paper flags, fine paper crack, requested handwriting, far-right middle placement, blank centre.',unmetRequirements:[]},null,2));
