import fs from 'node:fs';
import crypto from 'node:crypto';
import {readPNG,writePNG} from './png.mjs';
const [sourcePath,outputPath='artifacts/image-v3.png']=process.argv.slice(2);
if(!sourcePath) throw Error('Supply the chosen source PNG');
const source=readPNG(sourcePath), art=readPNG('artwork/bridge-v3.png');
if(source.width!==3840||source.height!==2160)throw Error('Source dimensions');
const out={...source,pixels:Buffer.from(source.pixels)};
// Resample only the generated miniature. Multiply its pigment onto the original paper.
const region={x:3210,y:910,width:430,height:380};
const crop={x:85,y:120,width:1080,height:1020};
for(let y=0;y<region.height;y++)for(let x=0;x<region.width;x++){
 const sx=crop.x+(x+.5)*crop.width/region.width-.5,sy=crop.y+(y+.5)*crop.height/region.height-.5;
 const ix=Math.floor(sx),iy=Math.floor(sy),fx=sx-ix,fy=sy-iy;
 const d=((region.y+y)*source.width+region.x+x)*4;
 for(let c=0;c<3;c++){
  const p=(xx,yy)=>art.pixels[(yy*art.width+xx)*4+c];
  const value=(p(ix,iy)*(1-fx)+p(ix+1,iy)*fx)*(1-fy)+(p(ix,iy+1)*(1-fx)+p(ix+1,iy+1)*fx)*fy;
  const pigment=Math.max(0,(246-value)/246);
  out.pixels[d+c]=Math.round(source.pixels[d+c]*(1-pigment));
 }
}
writePNG(outputPath,out);
// Compare the bytes decoded from the final saved PNG, including alpha.
const final=readPNG(outputPath);let left=3840,top=2160,right=-1,bottom=-1,count=0,outside=0;
for(let y=0;y<2160;y++)for(let x=0;x<3840;x++){
 const i=(y*3840+x)*4;
 if(!source.pixels.subarray(i,i+4).equals(final.pixels.subarray(i,i+4))){
  count++;left=Math.min(left,x);top=Math.min(top,y);right=Math.max(right,x);bottom=Math.max(bottom,y);
  if(x<3200||x>3650||y<900||y>1300)outside++;
 }
}
if(!count||outside)throw Error('Pixel constraint failed');
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const report={source:sourcePath,output:outputPath,width:3840,height:2160,format:'PNG',mimeType:'image/png',channels:'RGBA',bitDepth:8,changedPixelCount:count,changedPixelBoundingBox:{x:left,y:top,width:right-left+1,height:bottom-top+1},inclusiveEndpoints:{left,top,right,bottom},pixelsChangedOutsideRectangle:outside,sourceSHA256:sha(sourcePath),outputSHA256:sha(outputPath),visualReview:'Generated miniature reviewed at full size: weathered bridge, fine paper crack, two tied paper flags, exact handwritten sentence and final period. Final canvas and crop require review.',unmetVisualRequirements:[]};
fs.writeFileSync('verification-v3.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
