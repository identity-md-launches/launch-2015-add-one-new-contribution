import {readPNG,writePNG} from './png.mjs';
const [basePath,generatedPath,outPath]=process.argv.slice(2);
if(!outPath) throw Error('Usage: node scripts/compose.mjs ORIGINAL GENERATED OUTPUT');
const base=readPNG(basePath), art=readPNG(generatedPath);
if(base.width!==3840||base.height!==2160) throw Error('Unexpected original size');
// Extract only the new miniature; retain original pixels everywhere else.
const region={x:400,y:230,width:960,height:590};
const crop={x:180,y:100,width:480,height:295};
if(art.width!==1672||art.height!==941) throw Error('Unexpected generated size');
for(let y=0;y<region.height;y++) for(let x=0;x<region.width;x++) {
  const sx=crop.x+(x+.5)*crop.width/region.width-.5,sy=crop.y+(y+.5)*crop.height/region.height-.5;
  const ix=Math.floor(sx),iy=Math.floor(sy),fx=sx-ix,fy=sy-iy;
  const edge=Math.min(x,y,region.width-1-x,region.height-1-y);
  const a=Math.min(1,edge/40); // Feather blank paper margins; art stays fully opaque.
  const dst=((y+region.y)*base.width+x+region.x)*4;
  for(let c=0;c<3;c++) {
    const p=(xx,yy)=>art.pixels[(yy*art.width+xx)*4+c];
    const value=(p(ix,iy)*(1-fx)+p(ix+1,iy)*fx)*(1-fy)+(p(ix,iy+1)*(1-fx)+p(ix+1,iy+1)*fx)*fy;
    base.pixels[dst+c]=Math.round(base.pixels[dst+c]*(1-a)+value*a);
  }
}
writePNG(outPath,base);
