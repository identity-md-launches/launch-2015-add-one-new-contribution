// Minimal dependency-free codec for non-interlaced 8-bit RGB/RGBA PNGs.
import fs from 'node:fs';
import zlib from 'node:zlib';
export function readPNG(path) {
  const file = fs.readFileSync(path);
  if (file.subarray(0,8).toString('hex') !== '89504e470d0a1a0a') throw Error('Not PNG');
  let width, height, channels; const chunks=[];
  for(let p=8;p<file.length;) {
    const n=file.readUInt32BE(p), type=file.toString('ascii',p+4,p+8), data=file.subarray(p+8,p+8+n); p+=n+12;
    if(type==='IHDR') { width=data.readUInt32BE(0); height=data.readUInt32BE(4); channels=({2:3,6:4})[data[9]]; if(data[8]!==8||!channels||data[12]!==0) throw Error('Unsupported PNG'); }
    if(type==='IDAT') chunks.push(data);
  }
  const raw=zlib.inflateSync(Buffer.concat(chunks)), stride=width*channels, pixels=Buffer.alloc(width*height*4);
  let prev=Buffer.alloc(stride), pos=0;
  const paeth=(a,b,c)=>{const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);return pa<=pb&&pa<=pc?a:pb<=pc?b:c;};
  for(let y=0;y<height;y++) {
    const filter=raw[pos++], row=Buffer.alloc(stride);
    if(filter>4) throw Error('Invalid filter');
    for(let x=0;x<stride;x++) {const a=x>=channels?row[x-channels]:0,b=prev[x],c=x>=channels?prev[x-channels]:0;row[x]=(raw[pos++]+[0,a,b,Math.floor((a+b)/2),paeth(a,b,c)][filter])&255;}
    for(let x=0;x<width;x++) {const t=(y*width+x)*4,s=x*channels;pixels[t]=row[s];pixels[t+1]=row[s+1];pixels[t+2]=row[s+2];pixels[t+3]=channels===4?row[s+3]:255;}
    prev=row;
  }
  return {width,height,pixels};
}
const table=Array.from({length:256},(_,n)=>{for(let k=0;k<8;k++) n=n&1?0xedb88320^(n>>>1):n>>>1;return n>>>0;});
function chunk(type,data) {const name=Buffer.from(type),out=Buffer.alloc(data.length+12);out.writeUInt32BE(data.length);name.copy(out,4);data.copy(out,8);let crc=0xffffffff;for(const b of Buffer.concat([name,data]))crc=table[(crc^b)&255]^(crc>>>8);out.writeUInt32BE((crc^0xffffffff)>>>0,out.length-4);return out;}
export function writePNG(path,{width,height,pixels}) {
  const header=Buffer.alloc(13);header.writeUInt32BE(width);header.writeUInt32BE(height,4);header[8]=8;header[9]=6;
  const stride=width*4,raw=Buffer.alloc((stride+1)*height);
  for(let y=0;y<height;y++) pixels.copy(raw,y*(stride+1)+1,y*stride,(y+1)*stride);
  fs.writeFileSync(path,Buffer.concat([Buffer.from('89504e470d0a1a0a','hex'),chunk('IHDR',header),chunk('IDAT',zlib.deflateSync(raw,{level:9})),chunk('IEND',Buffer.alloc(0))]));
}
