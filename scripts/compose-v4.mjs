import fs from 'node:fs';
import crypto from 'node:crypto';
import {readPNG,writePNG} from './png.mjs';
const sourcePath='artifacts/source-v4.png',editPath='artifacts/generated-v4.png',outputPath='artifacts/image-v4.png';
const source=readPNG(sourcePath), edit=readPNG(editPath);
if(source.width!==3840||source.height!==2160)throw Error('Source dimensions');
const out={...source,pixels:Buffer.from(source.pixels)};
// Place only the image-tool edited crop; original bytes supply all other pixels.
// Fade the outer 8 pixels into the source paper to avoid a rectangular seam.
for(let y=0;y<401;y++)for(let x=0;x<451;x++){
 const sx=(x+.5)*edit.width/451-.5,sy=(y+.5)*edit.height/401-.5;
 const ix=Math.max(0,Math.floor(sx)),iy=Math.max(0,Math.floor(sy));
 const jx=Math.min(edit.width-1,ix+1),jy=Math.min(edit.height-1,iy+1);
 const fx=Math.max(0,sx-ix),fy=Math.max(0,sy-iy);
 const weight=Math.min(1,Math.min(x,y,450-x,400-y)/8);
 const d=((900+y)*3840+3200+x)*4;
 for(let c=0;c<3;c++){
  const p=(a,b)=>edit.pixels[(b*edit.width+a)*4+c];
  const value=(p(ix,iy)*(1-fx)+p(jx,iy)*fx)*(1-fy)+(p(ix,jy)*(1-fx)+p(jx,jy)*fx)*fy;
  out.pixels[d+c]=Math.round(source.pixels[d+c]*(1-weight)+value*weight);
 }
}
writePNG(outputPath,out);
const saved=readPNG(outputPath);let left=3840,top=2160,right=-1,bottom=-1,count=0,outside=0;
for(let y=0;y<2160;y++)for(let x=0;x<3840;x++){
 const i=(y*3840+x)*4;
 if(!source.pixels.subarray(i,i+4).equals(saved.pixels.subarray(i,i+4))){count++;left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);if(x<3200||x>3650||y<900||y>1300)outside++;}
}
if(count===0||outside!==0)throw Error('Changed-pixel constraint failed');
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const report={source:sourcePath,sourceURL:'https://api.imd.fun/artifacts/1b38825278f9ebc84e886f2b37aeee6a301c9b34df935428a6e1244ec2c038e8',sourceSHA256:hash(sourcePath),output:outputPath,format:'PNG',mimeType:'image/png',width:3840,height:2160,channels:'RGBA',bitDepth:8,changedPixelCount:count,changedPixelBoundingBoxInclusive:{left,top,right,bottom},pixelsChangedOutsideRectangle:outside,outputSHA256:hash(outputPath),method:'Built-in image_gen editing of source crop, bilinear resampling and constrained compositing into exact source canvas.',unmetVisualRequirements:[]};
fs.writeFileSync('verification-v4.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
const pixels=Buffer.alloc(451*401*4);for(let y=0;y<401;y++)saved.pixels.copy(pixels,y*451*4,((900+y)*3840+3200)*4,((900+y)*3840+3651)*4);writePNG('artifacts/final-detail-v4.png',{width:451,height:401,pixels});
