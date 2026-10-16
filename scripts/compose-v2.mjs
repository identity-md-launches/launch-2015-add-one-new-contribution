import {readPNG, writePNG} from './png.mjs';

const [basePath, artPath, outputPath] = process.argv.slice(2);
if (!outputPath) throw Error('Usage: node scripts/compose-v2.mjs BASE ART OUTPUT');
const base = readPNG(basePath), art = readPNG(artPath);
if (base.width !== 3840 || base.height !== 2160) throw Error('Unexpected canvas size');
if (art.width !== 1536 || art.height !== 1024) throw Error('Unexpected artwork size');
// All writes stay in blank far-right paper, away from earlier contributions.
const region = {x:3100, y:930, width:600, height:552};
const crop = {x:400, y:190, width:750, height:690};
for (let y=0; y<region.height; y++) for (let x=0; x<region.width; x++) {
  const sx=crop.x+(x+.5)*crop.width/region.width-.5;
  const sy=crop.y+(y+.5)*crop.height/region.height-.5;
  const ix=Math.floor(sx), iy=Math.floor(sy), fx=sx-ix, fy=sy-iy;
  const dst=((region.y+y)*base.width+region.x+x)*4;
  for (let c=0;c<3;c++) {
    const p=(xx,yy)=>art.pixels[(yy*art.width+xx)*4+c];
    const v=(p(ix,iy)*(1-fx)+p(ix+1,iy)*fx)*(1-fy)+(p(ix,iy+1)*(1-fx)+p(ix+1,iy+1)*fx)*fy;
    // Remove near-white scan noise and multiply pigment onto existing paper.
    // Original paper texture remains visible; white contributes no pixels.
    const pigment=Math.max(0,(248-v)/248);
    base.pixels[dst+c]=Math.round(base.pixels[dst+c]*(1-pigment));
  }
}
writePNG(outputPath,base);
