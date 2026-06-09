"use strict";
/* ============================================================================
   minecrAft — Adyah's World
   Chunked, streaming voxel survival/creative game. From-scratch WebGL. Offline.
   ============================================================================ */
const PHOTOS = (window.ADYAH_PHOTOS) || {};
const HAS_API = !!(window.gameAPI && window.gameAPI.isElectron);
const Store = {
  async load(){ try{ if(HAS_API) return await window.gameAPI.load(); const r=localStorage.getItem('minecrAft_w1'); return r?JSON.parse(r):null; }catch(e){ return null; } },
  async save(d){ try{ if(HAS_API) return await window.gameAPI.save(d); localStorage.setItem('minecrAft_w1', JSON.stringify(d)); return true; }catch(e){ return false; } },
  async clear(){ try{ if(HAS_API) return await window.gameAPI.clear(); localStorage.removeItem('minecrAft_w1'); }catch(e){} }
};

/* ----------------------------- math ----------------------------- */
const M4={
  perspective(o,f,a,n,fa){const t=1/Math.tan(f/2),nf=1/(n-fa);o[0]=t/a;o[1]=o[2]=o[3]=0;o[4]=0;o[5]=t;o[6]=o[7]=0;o[8]=o[9]=0;o[10]=(fa+n)*nf;o[11]=-1;o[12]=o[13]=0;o[14]=2*fa*n*nf;o[15]=0;return o;},
  lookAt(o,e,c,u){let fx=c[0]-e[0],fy=c[1]-e[1],fz=c[2]-e[2];let rl=1/Math.hypot(fx,fy,fz);fx*=rl;fy*=rl;fz*=rl;let sx=fy*u[2]-fz*u[1],sy=fz*u[0]-fx*u[2],sz=fx*u[1]-fy*u[0];rl=1/Math.hypot(sx,sy,sz);sx*=rl;sy*=rl;sz*=rl;const ux=sy*fz-sz*fy,uy=sz*fx-sx*fz,uz=sx*fy-sy*fx;o[0]=sx;o[1]=ux;o[2]=-fx;o[3]=0;o[4]=sy;o[5]=uy;o[6]=-fy;o[7]=0;o[8]=sz;o[9]=uz;o[10]=-fz;o[11]=0;o[12]=-(sx*e[0]+sy*e[1]+sz*e[2]);o[13]=-(ux*e[0]+uy*e[1]+uz*e[2]);o[14]=(fx*e[0]+fy*e[1]+fz*e[2]);o[15]=1;return o;},
  mul(o,a,b){for(let i=0;i<4;i++){const ai0=a[i],ai1=a[i+4],ai2=a[i+8],ai3=a[i+12];o[i]=ai0*b[0]+ai1*b[1]+ai2*b[2]+ai3*b[3];o[i+4]=ai0*b[4]+ai1*b[5]+ai2*b[6]+ai3*b[7];o[i+8]=ai0*b[8]+ai1*b[9]+ai2*b[10]+ai3*b[11];o[i+12]=ai0*b[12]+ai1*b[13]+ai2*b[14]+ai3*b[15];}return o;}
};
function frustumPlanes(m){ // returns 6 planes [a,b,c,d] from VP matrix (row extraction)
  const p=[];
  const r=(i)=>[m[i],m[i+4],m[i+8],m[i+12]];
  const m0=r(0),m1=r(1),m2=r(2),m3=r(3);
  const add=(s,a,b)=>p.push([s? m3[0]+ (a===0?m0[0]:a===1?m1[0]:m2[0])*b : 0]);
  // build directly
  function pl(ax){return ax;}
  const c0=[m[0],m[4],m[8],m[12]],c1=[m[1],m[5],m[9],m[13]],c2=[m[2],m[6],m[10],m[14]],c3=[m[3],m[7],m[11],m[15]];
  const planes=[
    [c3[0]+c0[0],c3[1]+c0[1],c3[2]+c0[2],c3[3]+c0[3]],
    [c3[0]-c0[0],c3[1]-c0[1],c3[2]-c0[2],c3[3]-c0[3]],
    [c3[0]+c1[0],c3[1]+c1[1],c3[2]+c1[2],c3[3]+c1[3]],
    [c3[0]-c1[0],c3[1]-c1[1],c3[2]-c1[2],c3[3]-c1[3]],
    [c3[0]+c2[0],c3[1]+c2[1],c3[2]+c2[2],c3[3]+c2[3]],
    [c3[0]-c2[0],c3[1]-c2[1],c3[2]-c2[2],c3[3]-c2[3]]
  ];
  for(const q of planes){const l=Math.hypot(q[0],q[1],q[2])||1;q[0]/=l;q[1]/=l;q[2]/=l;q[3]/=l;}
  return planes;
}
function aabbInFrustum(planes,minx,miny,minz,maxx,maxy,maxz){
  for(const pl of planes){const px=pl[0]>0?maxx:minx,py=pl[1]>0?maxy:miny,pz=pl[2]>0?maxz:minz;
    if(pl[0]*px+pl[1]*py+pl[2]*pz+pl[3]<0)return false;}return true;}

/* ----------------------------- GL ----------------------------- */
const canvas=document.getElementById('game');
const gl=canvas.getContext('webgl',{antialias:false,powerPreference:'high-performance'})||canvas.getContext('experimental-webgl');
if(!gl){document.body.innerHTML='<div style="padding:40px">This computer needs WebGL.</div>';throw new Error('no webgl');}
const extEl=gl.getExtension('OES_element_index_uint');
function sh(t,s){const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(o));return o;}
function prog(v,f){const p=gl.createProgram();gl.attachShader(p,sh(gl.VERTEX_SHADER,v));gl.attachShader(p,sh(gl.FRAGMENT_SHADER,f));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p));return p;}
const wProg=prog(`
 attribute vec3 aPos;attribute vec2 aUV;attribute float aShade;attribute float aSky;attribute float aBlk;
 uniform mat4 uProj,uView;varying vec2 vUV;varying float vShade;varying float vSky;varying float vBlk;varying float vFog;
 void main(){vec4 vp=uView*vec4(aPos,1.0);gl_Position=uProj*vp;vUV=aUV;vShade=aShade;vSky=aSky;vBlk=aBlk;vFog=length(vp.xyz);}
`,`
 precision mediump float;varying vec2 vUV;varying float vShade;varying float vSky;varying float vBlk;varying float vFog;
 uniform sampler2D uTex;uniform vec3 uSky;uniform float uDay;uniform float uFar;
 void main(){vec4 c=texture2D(uTex,vUV);if(c.a<0.5)discard;
   float light=max(vBlk, vSky*uDay);
   light=max(light,0.34);
   vec3 col=c.rgb*vShade*light;
   float fog=clamp((uFar - vFog)/(uFar*0.35),0.0,1.0);
   gl_FragColor=vec4(mix(uSky,col,fog),1.0);}
`);
const wA={pos:gl.getAttribLocation(wProg,'aPos'),uv:gl.getAttribLocation(wProg,'aUV'),sh:gl.getAttribLocation(wProg,'aShade'),sky:gl.getAttribLocation(wProg,'aSky'),blk:gl.getAttribLocation(wProg,'aBlk')};
const wU={proj:gl.getUniformLocation(wProg,'uProj'),view:gl.getUniformLocation(wProg,'uView'),tex:gl.getUniformLocation(wProg,'uTex'),sky:gl.getUniformLocation(wProg,'uSky'),day:gl.getUniformLocation(wProg,'uDay'),far:gl.getUniformLocation(wProg,'uFar')};
const sProg=prog(`attribute vec3 aPos;attribute vec2 aUV;uniform mat4 uProj,uView;varying vec2 vUV;void main(){gl_Position=uProj*uView*vec4(aPos,1.0);vUV=aUV;}`,
 `precision mediump float;varying vec2 vUV;uniform sampler2D uTex;uniform vec4 uTint;void main(){vec4 c=texture2D(uTex,vUV);if(c.a<0.4)discard;gl_FragColor=vec4(c.rgb*uTint.rgb,1.0);}`);
const sA={pos:gl.getAttribLocation(sProg,'aPos'),uv:gl.getAttribLocation(sProg,'aUV')};
const sU={proj:gl.getUniformLocation(sProg,'uProj'),view:gl.getUniformLocation(sProg,'uView'),tex:gl.getUniformLocation(sProg,'uTex'),tint:gl.getUniformLocation(sProg,'uTint')};
const lProg=prog(`attribute vec3 aPos;uniform mat4 uProj,uView;void main(){gl_Position=uProj*uView*vec4(aPos,1.0);}`,`precision mediump float;void main(){gl_FragColor=vec4(0.0,0.0,0.0,0.5);}`);
const lA={pos:gl.getAttribLocation(lProg,'aPos')};const lU={proj:gl.getUniformLocation(lProg,'uProj'),view:gl.getUniformLocation(lProg,'uView')};
// model shader: blocky 3D mobs (colored faces + textured head front)
const mProg=prog(`attribute vec3 aPos;attribute vec3 aCol;attribute vec2 aUV;attribute float aTex;attribute float aSh;uniform mat4 uProj,uView;varying vec3 vCol;varying vec2 vUV;varying float vTex;varying float vSh;void main(){gl_Position=uProj*uView*vec4(aPos,1.0);vCol=aCol;vUV=aUV;vTex=aTex;vSh=aSh;}`,
 `precision mediump float;varying vec3 vCol;varying vec2 vUV;varying float vTex;varying float vSh;uniform sampler2D uTex;uniform float uDay;void main(){float light=max(0.5,uDay);if(vTex>0.5){vec4 c=texture2D(uTex,vUV);if(c.a<0.5)discard;gl_FragColor=vec4(c.rgb*vSh*light,1.0);}else{gl_FragColor=vec4(vCol*vSh*light,1.0);}}`);
const mA={pos:gl.getAttribLocation(mProg,'aPos'),col:gl.getAttribLocation(mProg,'aCol'),uv:gl.getAttribLocation(mProg,'aUV'),tex:gl.getAttribLocation(mProg,'aTex'),sh:gl.getAttribLocation(mProg,'aSh')};
const mU={proj:gl.getUniformLocation(mProg,'uProj'),view:gl.getUniformLocation(mProg,'uView'),tex:gl.getUniformLocation(mProg,'uTex'),day:gl.getUniformLocation(mProg,'uDay')};
const modelBuf=gl.createBuffer();
// HUD/viewmodel shader: 2D clip-space textured quad (first-person held item, drawn into the canvas)
const hudProg=prog(`attribute vec2 aPos;attribute vec2 aUV;varying vec2 vUV;void main(){gl_Position=vec4(aPos,0.0,1.0);vUV=aUV;}`,
 `precision mediump float;varying vec2 vUV;uniform sampler2D uTex;void main(){vec4 c=texture2D(uTex,vUV);if(c.a<0.04)discard;gl_FragColor=c;}`);
const hA={pos:gl.getAttribLocation(hudProg,'aPos'),uv:gl.getAttribLocation(hudProg,'aUV')};
const hU={tex:gl.getUniformLocation(hudProg,'uTex')};
const hudBuf=gl.createBuffer();const vmTex=gl.createTexture();let vmReady=false,vmItemId=-1,viewSwing=0;

/* ----------------------------- atlas ----------------------------- */
const ATILE=32,ACOLS=8,AROWS=8,AW=ATILE*ACOLS;
const atlas=document.createElement('canvas');atlas.width=AW;atlas.height=ATILE*AROWS;const ax=atlas.getContext('2d');
function tc(i){return{cx:(i%ACOLS)*ATILE,cy:Math.floor(i/ACOLS)*ATILE};}
let RS=1;function rr(){RS=(RS*1103515245+12345)&0x7fffffff;return(RS%1000)/1000;}
function fill(i,c){const{cx,cy}=tc(i);ax.fillStyle=c;ax.fillRect(cx,cy,ATILE,ATILE);}
function spk(i,base,sp,n){fill(i,base);RS=i*131+7;const{cx,cy}=tc(i);for(let k=0;k<n;k++){const gx=(rr()*16)|0,gy=(rr()*16)|0;ax.fillStyle=sp[(rr()*sp.length)|0];ax.fillRect(cx+gx*2,cy+gy*2,2,2);}}
const TX={stone:0,dirt:1,grassTop:2,grassSide:3,cobble:4,sand:5,sandstone:6,gravel:7,logSide:8,logTop:9,planks:10,leaves:11,water:12,snow:13,snowSide:14,ice:15,coal:16,iron:17,gold:18,diamond:19,glass:20,craftSide:21,craftTop:22,furnaceSide:23,furnaceFront:24,chestSide:25,chestFront:26,torch:27,cactus:28,bricks:29,bookshelf:30,ironBlock:31,goldBlock:32,bedrock:33,
  farmland:43,tallgrass:44,wheat:45,carrot:46,potato:47,sugarcane:48,dandelion:49,rose:50,sapling:51,glowstone:52,ladder:53,door:54,bedTex:55,
  stonebrick:56,mossycobble:57,lantern:58,mushroom:59,berry:60,emeraldOre:61,
  pumpkin:34,pumpkinFront:35,hay:36,tnt:37,obsidian:38,slime:39,quartz:62,
  ady0:40,ady1:41,ady2:42};
function buildAtlas(){
  spk(TX.stone,'#8a8a92',['#7e7e86','#969696','#777'],60);
  spk(TX.dirt,'#866043',['#7a5639','#946a4a','#71502f'],70);
  spk(TX.grassTop,'#6ab04a',['#5da640','#79c558','#54993a'],80);
  {const{cx,cy}=tc(TX.grassSide);ax.drawImage(atlas,tc(TX.dirt).cx,tc(TX.dirt).cy,ATILE,ATILE,cx,cy,ATILE,ATILE);ax.fillStyle='#6ab04a';ax.fillRect(cx,cy,ATILE,7);RS=4;for(let k=0;k<14;k++){ax.fillStyle='#5da640';ax.fillRect(cx+((rr()*16)|0)*2,cy+6,2,2);}}
  spk(TX.cobble,'#6f6f77',['#5c5c64','#8a8a92','#4d4d55'],90);
  spk(TX.sand,'#e3d3a0',['#d9c992','#ede0ac','#cdbd84'],55);
  spk(TX.sandstone,'#ddca94',['#cfbb86','#e8d7a4'],40);
  spk(TX.gravel,'#8b8780',['#76726b','#9d998f','#615e58'],90);
  {fill(TX.logSide,'#6e4a28');const{cx,cy}=tc(TX.logSide);for(let gx=0;gx<16;gx+=3){ax.fillStyle='#5b3c20';ax.fillRect(cx+gx*2,cy,2,ATILE);}RS=9;for(let k=0;k<24;k++){ax.fillStyle=rr()>.5?'#7a5430':'#5b3c20';ax.fillRect(cx+((rr()*16)|0)*2,cy+((rr()*16)|0)*2,2,2);}}
  {fill(TX.logTop,'#a8814c');const{cx,cy}=tc(TX.logTop);ax.strokeStyle='#7a5d34';for(let r=1;r<=3;r++){ax.lineWidth=2;ax.beginPath();ax.arc(cx+16,cy+16,r*4,0,7);ax.stroke();}}
  {fill(TX.planks,'#b08a4f');const{cx,cy}=tc(TX.planks);ax.fillStyle='#9a7641';for(let gy=0;gy<16;gy+=4)ax.fillRect(cx,cy+gy*2,ATILE,1);}
  spk(TX.leaves,'#3f9a3a',['#46a83f','#358231','#52b84a','#2e7029'],110);
  {fill(TX.water,'#2f6fc6');const{cx,cy}=tc(TX.water);RS=6;for(let k=0;k<14;k++){ax.fillStyle='#3f7fd6';ax.fillRect(cx+((rr()*16)|0)*2,cy+((rr()*16)|0)*2,4,1);}}
  spk(TX.snow,'#f3f7ff',['#e6eefc','#fff','#dfeaf8'],30);
  {const{cx,cy}=tc(TX.snowSide);ax.drawImage(atlas,tc(TX.dirt).cx,tc(TX.dirt).cy,ATILE,ATILE,cx,cy,ATILE,ATILE);ax.fillStyle='#f3f7ff';ax.fillRect(cx,cy,ATILE,8);}
  spk(TX.ice,'#9fd0f0',['#8ec4ec','#b6e0fb'],26);
  {ax.drawImage(atlas,tc(TX.stone).cx,tc(TX.stone).cy,ATILE,ATILE,tc(TX.coal).cx,tc(TX.coal).cy,ATILE,ATILE);RS=2;const{cx,cy}=tc(TX.coal);for(let k=0;k<6;k++){ax.fillStyle='#1c1c1c';ax.fillRect(cx+2+((rr()*12)|0)*2,cy+2+((rr()*12)|0)*2,3,3);}}
  {ax.drawImage(atlas,tc(TX.stone).cx,tc(TX.stone).cy,ATILE,ATILE,tc(TX.iron).cx,tc(TX.iron).cy,ATILE,ATILE);RS=3;const{cx,cy}=tc(TX.iron);for(let k=0;k<6;k++){ax.fillStyle='#d8a07a';ax.fillRect(cx+2+((rr()*12)|0)*2,cy+2+((rr()*12)|0)*2,3,3);}}
  {ax.drawImage(atlas,tc(TX.stone).cx,tc(TX.stone).cy,ATILE,ATILE,tc(TX.gold).cx,tc(TX.gold).cy,ATILE,ATILE);RS=5;const{cx,cy}=tc(TX.gold);for(let k=0;k<6;k++){ax.fillStyle='#ffd24d';ax.fillRect(cx+2+((rr()*12)|0)*2,cy+2+((rr()*12)|0)*2,3,3);}}
  {ax.drawImage(atlas,tc(TX.stone).cx,tc(TX.stone).cy,ATILE,ATILE,tc(TX.diamond).cx,tc(TX.diamond).cy,ATILE,ATILE);RS=8;const{cx,cy}=tc(TX.diamond);for(let k=0;k<6;k++){ax.fillStyle='#69e7df';ax.fillRect(cx+2+((rr()*12)|0)*2,cy+2+((rr()*12)|0)*2,3,3);}}
  {const{cx,cy}=tc(TX.glass);ax.clearRect(cx,cy,ATILE,ATILE);ax.fillStyle='rgba(190,228,255,.28)';ax.fillRect(cx,cy,ATILE,ATILE);ax.strokeStyle='#d3eeff';ax.lineWidth=3;ax.strokeRect(cx+1,cy+1,ATILE-2,ATILE-2);}
  {ax.drawImage(atlas,tc(TX.planks).cx,tc(TX.planks).cy,ATILE,ATILE,tc(TX.craftSide).cx,tc(TX.craftSide).cy,ATILE,ATILE);const{cx,cy}=tc(TX.craftSide);ax.strokeStyle='#5e4524';ax.lineWidth=2;ax.strokeRect(cx+3,cy+12,26,17);ax.beginPath();ax.moveTo(cx+16,cy+12);ax.lineTo(cx+16,cy+29);ax.stroke();}
  {ax.drawImage(atlas,tc(TX.planks).cx,tc(TX.planks).cy,ATILE,ATILE,tc(TX.craftTop).cx,tc(TX.craftTop).cy,ATILE,ATILE);const{cx,cy}=tc(TX.craftTop);ax.strokeStyle='#5e4524';ax.lineWidth=2;for(let i=0;i<=2;i++){ax.beginPath();ax.moveTo(cx+i*15+1,cy+1);ax.lineTo(cx+i*15+1,cy+31);ax.stroke();ax.beginPath();ax.moveTo(cx+1,cy+i*15+1);ax.lineTo(cx+31,cy+i*15+1);ax.stroke();}}
  {ax.drawImage(atlas,tc(TX.stone).cx,tc(TX.stone).cy,ATILE,ATILE,tc(TX.furnaceSide).cx,tc(TX.furnaceSide).cy,ATILE,ATILE);}
  {ax.drawImage(atlas,tc(TX.stone).cx,tc(TX.stone).cy,ATILE,ATILE,tc(TX.furnaceFront).cx,tc(TX.furnaceFront).cy,ATILE,ATILE);const{cx,cy}=tc(TX.furnaceFront);ax.fillStyle='#1a1a1a';ax.fillRect(cx+8,cy+14,16,12);ax.fillStyle='#ff7b29';ax.fillRect(cx+11,cy+20,10,6);}
  {fill(TX.chestSide,'#b07a36');}
  {fill(TX.chestFront,'#b07a36');const{cx,cy}=tc(TX.chestFront);ax.fillStyle='#8a5d28';ax.fillRect(cx,cy+13,ATILE,3);ax.fillStyle='#3a3a3a';ax.fillRect(cx+14,cy+13,4,6);}
  {const{cx,cy}=tc(TX.torch);ax.clearRect(cx,cy,ATILE,ATILE);ax.fillStyle='#6e4a28';ax.fillRect(cx+14,cy+12,4,16);ax.fillStyle='#ffcf3a';ax.fillRect(cx+13,cy+8,6,6);ax.fillStyle='#fff2a0';ax.fillRect(cx+14,cy+9,3,3);}
  {fill(TX.cactus,'#3f7d3a');const{cx,cy}=tc(TX.cactus);ax.fillStyle='#2f6e2c';ax.fillRect(cx+2,cy,2,ATILE);ax.fillRect(cx+28,cy,2,ATILE);}
  {fill(TX.bricks,'#b14a3c');const{cx,cy}=tc(TX.bricks);ax.fillStyle='#e7d6c4';for(let gy=0;gy<16;gy+=4)ax.fillRect(cx,cy+gy*2,ATILE,1);for(let gy=0;gy<16;gy+=4){const off=(gy/4)%2?8:0;for(let gx=off;gx<16;gx+=8)ax.fillRect(cx+gx*2,cy+gy*2,1,8);}}
  {ax.drawImage(atlas,tc(TX.planks).cx,tc(TX.planks).cy,ATILE,ATILE,tc(TX.bookshelf).cx,tc(TX.bookshelf).cy,ATILE,ATILE);const{cx,cy}=tc(TX.bookshelf);const cl=['#c0392b','#2980b9','#27ae60','#8e44ad','#d4a017'];RS=4;ax.fillStyle='#5e4524';ax.fillRect(cx,cy+15,ATILE,2);for(let row=0;row<2;row++)for(let gx=1;gx<15;gx+=2){ax.fillStyle=cl[(rr()*cl.length)|0];ax.fillRect(cx+gx*2,cy+2+row*15,3,12);}}
  {fill(TX.ironBlock,'#d8d8de');const{cx,cy}=tc(TX.ironBlock);ax.strokeStyle='#b9b9c2';ax.lineWidth=2;ax.strokeRect(cx+3,cy+3,26,26);}
  {fill(TX.goldBlock,'#ffd34d');const{cx,cy}=tc(TX.goldBlock);ax.strokeStyle='#e6b52e';ax.lineWidth=2;ax.strokeRect(cx+3,cy+3,26,26);}
  spk(TX.bedrock,'#3a3a40',['#2a2a30','#4a4a52','#222'],100);
  // farmland: dirt with furrows + moist center
  {ax.drawImage(atlas,tc(TX.dirt).cx,tc(TX.dirt).cy,ATILE,ATILE,tc(TX.farmland).cx,tc(TX.farmland).cy,ATILE,ATILE);const{cx,cy}=tc(TX.farmland);ax.fillStyle='#5a3a1f';for(let gx=4;gx<32;gx+=8)ax.fillRect(cx+gx,cy,3,ATILE);ax.fillStyle='#3f2a14';ax.fillRect(cx+12,cy+12,8,8);}
  // glowstone
  {fill(TX.glowstone,'#ffe79a');const{cx,cy}=tc(TX.glowstone);ax.fillStyle='#fff7d0';for(let k=0;k<8;k++){RS=k+1;ax.fillRect(cx+((rr()*12)|0)*2+2,cy+((rr()*12)|0)*2+2,4,4);}ax.fillStyle='#d8a93a';ax.strokeRect(cx+2,cy+2,28,28);}
  // door: planks with panels + handle
  {ax.drawImage(atlas,tc(TX.planks).cx,tc(TX.planks).cy,ATILE,ATILE,tc(TX.door).cx,tc(TX.door).cy,ATILE,ATILE);const{cx,cy}=tc(TX.door);ax.strokeStyle='#5e4524';ax.lineWidth=2;ax.strokeRect(cx+4,cy+3,24,12);ax.strokeRect(cx+4,cy+17,24,12);ax.fillStyle='#3a2a14';ax.fillRect(cx+24,cy+15,3,3);}
  // ladder: transparent + rails + rungs
  {const{cx,cy}=tc(TX.ladder);ax.clearRect(cx,cy,ATILE,ATILE);ax.fillStyle='#8a5a2a';ax.fillRect(cx+4,cy,3,ATILE);ax.fillRect(cx+25,cy,3,ATILE);for(let gy=3;gy<32;gy+=7)ax.fillRect(cx+4,cy+gy,24,3);}
  // bed top
  {fill(TX.bedTex,'#c93b5e');const{cx,cy}=tc(TX.bedTex);ax.fillStyle='#fff';ax.fillRect(cx+3,cy+3,12,10);ax.fillStyle='#7a4a2a';ax.fillRect(cx,cy+26,ATILE,6);}
  // crops & plants (cross, transparent bg)
  function plant(t,draw){const{cx,cy}=tc(t);ax.clearRect(cx,cy,ATILE,ATILE);draw(cx,cy);}
  plant(TX.tallgrass,(cx,cy)=>{ax.fillStyle='#5da640';for(let i=0;i<7;i++){const x=cx+4+i*3;ax.fillRect(x,cy+16+((i%3)*2),2,16-((i%3)*2));}});
  plant(TX.wheat,(cx,cy)=>{ax.fillStyle='#caa23a';for(let i=0;i<6;i++){const x=cx+5+i*4;ax.fillRect(x,cy+6,2,24);}ax.fillStyle='#e8d27a';for(let i=0;i<6;i++){const x=cx+4+i*4;ax.fillRect(x,cy+6,4,7);}});
  plant(TX.carrot,(cx,cy)=>{ax.fillStyle='#3f9a3a';for(let i=0;i<5;i++)ax.fillRect(cx+6+i*4,cy+4,3,16);ax.fillStyle='#e07a1f';ax.fillRect(cx+12,cy+20,8,9);});
  plant(TX.potato,(cx,cy)=>{ax.fillStyle='#3f8a3a';for(let i=0;i<5;i++)ax.fillRect(cx+6+i*4,cy+6,3,18);ax.fillStyle='#c9a05a';ax.fillRect(cx+13,cy+22,6,6);});
  plant(TX.sugarcane,(cx,cy)=>{ax.fillStyle='#7fb04a';ax.fillRect(cx+11,cy,4,ATILE);ax.fillRect(cx+17,cy,4,ATILE);ax.fillStyle='#5f9030';for(let gy=4;gy<32;gy+=8)ax.fillRect(cx+11,cy+gy,10,2);});
  plant(TX.dandelion,(cx,cy)=>{ax.fillStyle='#3f9a3a';ax.fillRect(cx+15,cy+14,2,16);ax.fillStyle='#ffd83a';ax.beginPath();ax.arc(cx+16,cy+11,6,0,7);ax.fill();});
  plant(TX.rose,(cx,cy)=>{ax.fillStyle='#3f9a3a';ax.fillRect(cx+15,cy+14,2,16);ax.fillStyle='#d6324a';ax.beginPath();ax.arc(cx+16,cy+10,6,0,7);ax.fill();});
  plant(TX.sapling,(cx,cy)=>{ax.fillStyle='#6e4a28';ax.fillRect(cx+15,cy+18,2,12);ax.fillStyle='#3f9a3a';ax.beginPath();ax.arc(cx+16,cy+12,8,0,7);ax.fill();});
  // stone bricks
  {fill(TX.stonebrick,'#7e7e86');const{cx,cy}=tc(TX.stonebrick);ax.strokeStyle='#5f5f67';ax.lineWidth=2;ax.strokeRect(cx+1,cy+1,15,15);ax.strokeRect(cx+16,cy+1,15,15);ax.strokeRect(cx+1,cy+16,15,15);ax.strokeRect(cx+16,cy+16,15,15);}
  // mossy cobblestone
  {ax.drawImage(atlas,tc(TX.cobble).cx,tc(TX.cobble).cy,ATILE,ATILE,tc(TX.mossycobble).cx,tc(TX.mossycobble).cy,ATILE,ATILE);const{cx,cy}=tc(TX.mossycobble);RS=12;for(let k=0;k<26;k++){ax.fillStyle=rr()>.5?'#4a7a3a':'#3f6e30';ax.fillRect(cx+((rr()*16)|0)*2,cy+((rr()*16)|0)*2,2,2);}}
  // lantern (glowing)
  {fill(TX.lantern,'#caa23a');const{cx,cy}=tc(TX.lantern);ax.fillStyle='#fff2a0';ax.fillRect(cx+8,cy+8,16,18);ax.fillStyle='#ffd24d';ax.fillRect(cx+11,cy+11,10,12);ax.fillStyle='#6e5a1f';ax.fillRect(cx+13,cy+2,6,6);ax.fillRect(cx+4,cy+26,24,4);}
  // red mushroom (cross)
  plant(TX.mushroom,(cx,cy)=>{ax.fillStyle='#efe8d8';ax.fillRect(cx+13,cy+18,6,12);ax.fillStyle='#c0392b';ax.beginPath();ax.arc(cx+16,cy+15,9,Math.PI,0);ax.fill();ax.fillStyle='#fff';ax.fillRect(cx+11,cy+11,3,3);ax.fillRect(cx+18,cy+13,3,3);});
  // berry bush (cross)
  plant(TX.berry,(cx,cy)=>{ax.fillStyle='#2f6e2c';for(let i=0;i<5;i++)ax.fillRect(cx+6+i*4,cy+6,3,20);ax.fillStyle='#c0294a';ax.fillRect(cx+10,cy+16,4,4);ax.fillRect(cx+18,cy+12,4,4);ax.fillRect(cx+14,cy+22,4,4);});
  // emerald ore
  {ax.drawImage(atlas,tc(TX.stone).cx,tc(TX.stone).cy,ATILE,ATILE,tc(TX.emeraldOre).cx,tc(TX.emeraldOre).cy,ATILE,ATILE);RS=21;const{cx,cy}=tc(TX.emeraldOre);for(let k=0;k<6;k++){const gx=2+((rr()*12)|0),gy=2+((rr()*12)|0);ax.fillStyle='#2ecc71';ax.fillRect(cx+gx*2,cy+gy*2,3,3);ax.fillStyle='#27ae60';ax.fillRect(cx+gx*2,cy+gy*2+1,3,1);}}
  [TX.ady0,TX.ady1,TX.ady2].forEach(t=>{fill(t,'#c9577f');const{cx,cy}=tc(t);ax.fillStyle='#fff';ax.font='bold 16px sans-serif';ax.textAlign='center';ax.fillText('A',cx+16,cy+22);ax.textAlign='left';});
  // pumpkin (ribbed orange)
  {fill(TX.pumpkin,'#df8a2a');const{cx,cy}=tc(TX.pumpkin);ax.fillStyle='#c8761f';for(let gx=2;gx<16;gx+=4)ax.fillRect(cx+gx*2,cy,2,ATILE);ax.fillStyle='#7a5018';ax.fillRect(cx+13,cy,6,5);}
  // pumpkin carved face
  {ax.drawImage(atlas,tc(TX.pumpkin).cx,tc(TX.pumpkin).cy,ATILE,ATILE,tc(TX.pumpkinFront).cx,tc(TX.pumpkinFront).cy,ATILE,ATILE);const{cx,cy}=tc(TX.pumpkinFront);ax.fillStyle='#3a2a08';ax.beginPath();ax.moveTo(cx+7,cy+10);ax.lineTo(cx+13,cy+10);ax.lineTo(cx+10,cy+15);ax.closePath();ax.fill();ax.beginPath();ax.moveTo(cx+19,cy+10);ax.lineTo(cx+25,cy+10);ax.lineTo(cx+22,cy+15);ax.closePath();ax.fill();ax.fillRect(cx+7,cy+20,18,5);ax.fillStyle=cy?'#3a2a08':'#3a2a08';for(let i=0;i<4;i++)ax.fillRect(cx+8+i*5,cy+20,2,3);}
  // hay bale
  {fill(TX.hay,'#cda83a');const{cx,cy}=tc(TX.hay);ax.fillStyle='#b8932f';for(let gy=0;gy<16;gy+=3)ax.fillRect(cx,cy+gy*2,ATILE,1);ax.fillStyle='#8a6f20';ax.fillRect(cx,cy,2,ATILE);ax.fillRect(cx+30,cy,2,ATILE);}
  // tnt
  {fill(TX.tnt,'#c0392b');const{cx,cy}=tc(TX.tnt);ax.fillStyle='#f2f2f2';ax.fillRect(cx,cy+11,ATILE,10);ax.fillStyle='#222';ax.font='bold 9px sans-serif';ax.textAlign='center';ax.fillText('TNT',cx+16,cy+19);ax.textAlign='left';}
  // obsidian
  {fill(TX.obsidian,'#231832');const{cx,cy}=tc(TX.obsidian);RS=44;for(let k=0;k<10;k++){ax.fillStyle=rr()>.5?'#332247':'#180f24';ax.fillRect(cx+((rr()*16)|0)*2,cy+((rr()*16)|0)*2,3,3);}ax.fillStyle='#5a3f88';ax.fillRect(cx+6,cy+8,2,2);ax.fillRect(cx+22,cy+18,2,2);}
  // slime block
  {fill(TX.slime,'#6fce72');const{cx,cy}=tc(TX.slime);ax.strokeStyle='#4ea551';ax.lineWidth=2;ax.strokeRect(cx+4,cy+4,24,24);ax.fillStyle='#8fe092';ax.fillRect(cx+8,cy+8,5,5);}
  // quartz
  {fill(TX.quartz,'#ece8e0');const{cx,cy}=tc(TX.quartz);ax.fillStyle='#dcd6c8';for(let gy=0;gy<16;gy+=5)ax.fillRect(cx,cy+gy*2,ATILE,1);}
}
buildAtlas();
const atlasTex=gl.createTexture();
function upAtlas(){gl.bindTexture(gl.TEXTURE_2D,atlasTex);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,atlas);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST_MIPMAP_NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.generateMipmap(gl.TEXTURE_2D);}
upAtlas();
function drawPhoto(t,uri){return new Promise(res=>{if(!uri){res();return;}const im=new Image();im.onload=()=>{const{cx,cy}=tc(t);ax.clearRect(cx,cy,ATILE,ATILE);ax.drawImage(im,cx,cy,ATILE,ATILE);ax.strokeStyle='#ffc94d';ax.lineWidth=3;ax.strokeRect(cx+1,cy+1,ATILE-2,ATILE-2);res();};im.onerror=()=>res();im.src=uri;});}
Promise.all([drawPhoto(TX.ady0,PHOTOS.adyah0),drawPhoto(TX.ady1,PHOTOS.adyah1),drawPhoto(TX.ady2,PHOTOS.adyah2)]).then(()=>{upAtlas();try{renderHotbar();}catch(e){}});
const INS=0.5/AW;
function uvOf(i){const c=i%ACOLS,r=(i/ACOLS)|0;return{u0:c/ACOLS+INS,v0:r/AROWS+INS,u1:(c+1)/ACOLS-INS,v1:(r+1)/AROWS-INS};}

/* sprite atlas (mobs) */
const FAMILY=window.FAMILY||{};
const ST=64,SCOLS=4,SROWS=4,SW=ST*SCOLS,SH2=ST*SROWS;
const spr=document.createElement('canvas');spr.width=SW;spr.height=SH2;const sx2=spr.getContext('2d');
const SP={zombie:0,spider:1,skeleton:2,hero:3,villager:4,pig:5,cow:6,sheep:7,chicken:8,momV:9,dadV:10,aaravV:11,wpig:12,wchk:13,baby:14};
function sc(i){return{cx:(i%SCOLS)*ST,cy:((i/SCOLS)|0)*ST};}
function pigBody(cx,cy){sx2.fillStyle='#e89aa6';sx2.fillRect(cx+12,cy+30,40,22);sx2.fillStyle='#d98090';sx2.fillRect(cx+44,cy+32,12,10);sx2.fillStyle='#3a1f24';sx2.fillRect(cx+48,cy+35,3,3);sx2.fillRect(cx+52,cy+35,3,3);sx2.fillStyle='#caa';sx2.fillRect(cx+16,cy+50,6,10);sx2.fillRect(cx+40,cy+50,6,10);sx2.fillStyle='#f4b0bc';sx2.fillRect(cx+14,cy+26,8,8);sx2.fillRect(cx+42,cy+26,8,8);} // pink ears poke up for the face
function chickenBody(cx,cy){sx2.fillStyle='#fafafa';sx2.fillRect(cx+16,cy+30,30,20);sx2.fillStyle='#e0a020';sx2.beginPath();sx2.moveTo(cx+30,cy+34);sx2.lineTo(cx+22,cy+38);sx2.lineTo(cx+30,cy+42);sx2.closePath();sx2.fill();sx2.fillStyle='#c0392b';sx2.fillRect(cx+26,cy+24,10,5);sx2.fillStyle='#e0a020';sx2.fillRect(cx+22,cy+50,4,9);sx2.fillRect(cx+36,cy+50,4,9);sx2.fillStyle='#eee';sx2.beginPath();sx2.moveTo(cx+46,cy+34);sx2.lineTo(cx+58,cy+40);sx2.lineTo(cx+46,cy+46);sx2.closePath();sx2.fill();}
function crown(cx,cy){sx2.fillStyle='#ffd24d';sx2.beginPath();sx2.moveTo(cx+20,cy+12);sx2.lineTo(cx+23,cy+2);sx2.lineTo(cx+28,cy+9);sx2.lineTo(cx+32,cy+1);sx2.lineTo(cx+36,cy+9);sx2.lineTo(cx+41,cy+2);sx2.lineTo(cx+44,cy+12);sx2.closePath();sx2.fill();sx2.fillStyle='#e6324a';sx2.fillRect(cx+30,cy+6,4,4);sx2.fillStyle='#5bc0ff';sx2.fillRect(cx+23,cy+7,3,3);sx2.fillRect(cx+38,cy+7,3,3);}
function knightBody(cx,cy){ // Adyah the Brave
  sx2.fillStyle='#7a1f3a';sx2.beginPath();sx2.moveTo(cx+22,cy+28);sx2.lineTo(cx+42,cy+28);sx2.lineTo(cx+50,cy+60);sx2.lineTo(cx+14,cy+60);sx2.closePath();sx2.fill(); // cape
  sx2.fillStyle='#5b7fb0';sx2.fillRect(cx+22,cy+28,20,26); // breastplate
  sx2.fillStyle='#7a9cc8';sx2.fillRect(cx+14,cy+28,9,8);sx2.fillRect(cx+41,cy+28,9,8); // pauldrons
  sx2.fillStyle='#cfd8ea';sx2.fillRect(cx+30,cy+30,4,22); // shine
  sx2.fillStyle='#d8b48c';sx2.fillRect(cx+12,cy+34,6,16);sx2.fillRect(cx+46,cy+34,6,16); // arms
  sx2.fillStyle='#dfe6f0';sx2.fillRect(cx+50,cy+10,3,30);sx2.fillStyle='#c0a040';sx2.fillRect(cx+46,cy+38,11,3); // sword
  sx2.fillStyle='#3a4a66';sx2.fillRect(cx+24,cy+54,7,8);sx2.fillRect(cx+33,cy+54,7,8); // legs
}
function slimeBody(cx,cy){ // Mama Slime
  sx2.fillStyle='rgba(74,184,74,0.82)';sx2.beginPath();sx2.moveTo(cx+9,cy+52);sx2.quadraticCurveTo(cx+4,cy+16,cx+32,cy+14);sx2.quadraticCurveTo(cx+60,cy+16,cx+55,cy+52);sx2.quadraticCurveTo(cx+32,cy+60,cx+9,cy+52);sx2.closePath();sx2.fill();
  sx2.fillStyle='rgba(150,235,150,0.55)';sx2.beginPath();sx2.arc(cx+20,cy+26,5,0,7);sx2.fill();sx2.beginPath();sx2.arc(cx+44,cy+40,4,0,7);sx2.fill();
  sx2.fillStyle='rgba(40,140,40,0.55)';sx2.fillRect(cx+16,cy+54,7,7);sx2.fillRect(cx+30,cy+56,6,6);sx2.fillRect(cx+42,cy+54,7,7); // drips
}
function golemBody(cx,cy){ // Boulder Dad
  sx2.fillStyle='#7d7d85';sx2.fillRect(cx+15,cy+22,34,34);
  sx2.fillStyle='#6a6a72';sx2.fillRect(cx+6,cy+26,9,22);sx2.fillRect(cx+49,cy+26,9,22); // arms
  sx2.fillStyle='#565660';sx2.fillRect(cx+4,cy+44,13,13);sx2.fillRect(cx+47,cy+44,13,13); // fists
  sx2.strokeStyle='#ff7b29';sx2.lineWidth=2;sx2.beginPath();sx2.moveTo(cx+22,cy+30);sx2.lineTo(cx+27,cy+40);sx2.lineTo(cx+23,cy+52);sx2.stroke();sx2.beginPath();sx2.moveTo(cx+40,cy+34);sx2.lineTo(cx+44,cy+44);sx2.stroke(); // glowing cracks
  sx2.fillStyle='#4a7a3a';sx2.fillRect(cx+17,cy+24,9,4);sx2.fillRect(cx+38,cy+50,9,4); // moss
  sx2.fillStyle='#8a8a92';sx2.fillRect(cx+22,cy+18,8,5);sx2.fillRect(cx+34,cy+18,8,5); // horns
}
function birdBody(cx,cy){ // Lil' Aarav Bird
  sx2.fillStyle='#5bb0e8';sx2.beginPath();sx2.arc(cx+32,cy+38,16,0,7);sx2.fill();
  sx2.fillStyle='#3f90c8';sx2.beginPath();sx2.moveTo(cx+18,cy+32);sx2.lineTo(cx+4,cy+40);sx2.lineTo(cx+18,cy+48);sx2.closePath();sx2.fill();sx2.beginPath();sx2.moveTo(cx+46,cy+32);sx2.lineTo(cx+60,cy+40);sx2.lineTo(cx+46,cy+48);sx2.closePath();sx2.fill(); // wings
  sx2.fillStyle='#fff';sx2.beginPath();sx2.arc(cx+32,cy+42,9,0,7);sx2.fill(); // belly
  sx2.fillStyle='#e0a020';sx2.beginPath();sx2.moveTo(cx+29,cy+40);sx2.lineTo(cx+35,cy+40);sx2.lineTo(cx+32,cy+47);sx2.closePath();sx2.fill(); // beak
  sx2.fillStyle='#e0a020';sx2.fillRect(cx+27,cy+52,3,6);sx2.fillRect(cx+34,cy+52,3,6); // feet
}
function buildSpr(){sx2.clearRect(0,0,SW,SH2);
  {const{cx,cy}=sc(SP.zombie);sx2.fillStyle='#4e7a3a';sx2.fillRect(cx+22,cy+6,20,20);sx2.fillStyle='#0c1a0c';sx2.fillRect(cx+26,cy+13,4,4);sx2.fillRect(cx+34,cy+13,4,4);sx2.fillStyle='#3a5e8a';sx2.fillRect(cx+18,cy+26,28,30);sx2.fillStyle='#4e7a3a';sx2.fillRect(cx+10,cy+28,8,16);sx2.fillRect(cx+46,cy+28,8,16);}
  {const{cx,cy}=sc(SP.spider);sx2.fillStyle='#201210';sx2.fillRect(cx+22,cy+24,20,16);sx2.fillRect(cx+16,cy+18,14,12);sx2.fillStyle='#c11';sx2.fillRect(cx+19,cy+21,4,4);sx2.fillRect(cx+25,cy+21,4,4);sx2.strokeStyle='#201210';sx2.lineWidth=3;for(let s=-1;s<=1;s++){sx2.beginPath();sx2.moveTo(cx+24,cy+30);sx2.lineTo(cx+5,cy+24+s*8);sx2.stroke();sx2.beginPath();sx2.moveTo(cx+40,cy+30);sx2.lineTo(cx+59,cy+24+s*8);sx2.stroke();}}
  {const{cx,cy}=sc(SP.skeleton);sx2.fillStyle='#e9ecef';sx2.fillRect(cx+24,cy+6,16,18);sx2.fillStyle='#222';sx2.fillRect(cx+27,cy+12,4,4);sx2.fillRect(cx+33,cy+12,4,4);sx2.fillStyle='#cdd2d8';sx2.fillRect(cx+28,cy+26,8,28);sx2.fillRect(cx+18,cy+28,6,20);sx2.fillRect(cx+40,cy+28,6,20);}
  {const{cx,cy}=sc(SP.hero);knightBody(cx,cy);}
  {const{cx,cy}=sc(SP.villager);sx2.fillStyle='#caa37a';sx2.fillRect(cx+20,cy+4,24,22);sx2.fillStyle='#7a5a3a';sx2.fillRect(cx+16,cy+26,32,30);sx2.fillStyle='#caa37a';sx2.fillRect(cx+12,cy+30,6,16);sx2.fillRect(cx+46,cy+30,6,16);sx2.fillStyle='#3a2c1e';sx2.fillRect(cx+26,cy+12,4,4);sx2.fillRect(cx+34,cy+12,4,4);sx2.fillStyle='#b58a63';sx2.fillRect(cx+30,cy+16,4,8);}
  {const{cx,cy}=sc(SP.pig);pigBody(cx,cy);}
  {const{cx,cy}=sc(SP.cow);sx2.fillStyle='#4a3a2e';sx2.fillRect(cx+12,cy+22,40,26);sx2.fillStyle='#fff';sx2.fillRect(cx+18,cy+26,10,8);sx2.fillRect(cx+34,cy+34,10,8);sx2.fillStyle='#4a3a2e';sx2.fillRect(cx+44,cy+22,12,12);sx2.fillStyle='#222';sx2.fillRect(cx+48,cy+26,3,3);sx2.fillStyle='#3a2a1e';sx2.fillRect(cx+16,cy+48,6,8);sx2.fillRect(cx+40,cy+48,6,8);}
  {const{cx,cy}=sc(SP.sheep);sx2.fillStyle='#f2f2ee';sx2.fillRect(cx+12,cy+20,38,28);sx2.fillStyle='#e8e8e2';for(let i=0;i<6;i++)sx2.fillRect(cx+14+i*6,cy+20,5,5);sx2.fillStyle='#caa37a';sx2.fillRect(cx+44,cy+24,12,12);sx2.fillStyle='#222';sx2.fillRect(cx+50,cy+28,3,3);sx2.fillStyle='#555';sx2.fillRect(cx+16,cy+48,5,8);sx2.fillRect(cx+40,cy+48,5,8);}
  {const{cx,cy}=sc(SP.chicken);chickenBody(cx,cy);}
  {const{cx,cy}=sc(SP.momV);slimeBody(cx,cy);}
  {const{cx,cy}=sc(SP.dadV);golemBody(cx,cy);}
  {const{cx,cy}=sc(SP.aaravV);birdBody(cx,cy);}
  {const{cx,cy}=sc(SP.wpig);pigBody(cx,cy);}
  {const{cx,cy}=sc(SP.wchk);chickenBody(cx,cy);}
  {const{cx,cy}=sc(SP.baby);sx2.fillStyle='#f2d0b0';sx2.fillRect(cx+24,cy+30,18,16);sx2.fillStyle='#e89aa6';sx2.fillRect(cx+38,cy+30,8,8);}
}
buildSpr();
const sprTex=gl.createTexture();
function upSpr(){gl.bindTexture(gl.TEXTURE_2D,sprTex);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,spr);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);}
upSpr();
// faces are oval PNGs with alpha — composite directly (no extra clip), so they blend onto the creature
function sprFace(tile,uri,rx,ry,rw,rh){return new Promise(res=>{if(!uri){res();return;}const im=new Image();im.onload=()=>{const{cx,cy}=sc(tile);sx2.drawImage(im,cx+rx,cy+ry,rw,rh);res();};im.onerror=()=>res();im.src=uri;});}
Promise.all([
  sprFace(SP.hero,FAMILY.adyah,16,0,32,32),
  sprFace(SP.momV,FAMILY.mom,18,14,28,28),
  sprFace(SP.dadV,FAMILY.dad,18,14,28,28),
  sprFace(SP.aaravV,FAMILY.aarav,18,16,28,28),
  sprFace(SP.wpig,FAMILY.dad,18,18,28,28),
  sprFace(SP.wchk,FAMILY.aarav,20,16,24,24)
]).then(()=>{const h=sc(SP.hero);crown(h.cx,h.cy);upSpr();});
function sprUV(i){const c=i%SCOLS,r=(i/SCOLS)|0;const e=.5/SW;return{u0:c/SCOLS+e,v0:r/SROWS+e,u1:(c+1)/SCOLS-e,v1:(r+1)/SROWS-e};}
/* polished character atlas (pre-rendered PNGs with the real faces) */
const CHARS=window.CHARS||[];
const CHC=4,CHR=4,CHTS=160,CHAW=CHTS*CHC,CHAH=CHTS*CHR;
const chCanvas=document.createElement('canvas');chCanvas.width=CHAW;chCanvas.height=CHAH;const chx=chCanvas.getContext('2d');
const charTex=gl.createTexture();
function upChar(){gl.bindTexture(gl.TEXTURE_2D,charTex);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,chCanvas);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);}
upChar();
const CHAR_IDX={};CHARS.forEach((c,i)=>{if(i<CHC*CHR)CHAR_IDX[c.name]=i;});
const VILLAGER_CHARS=CHARS.map((c,i)=>c.arch==='villager'?i:-1).filter(i=>i>=0&&i<CHC*CHR);
function villagerChar(){return VILLAGER_CHARS.length?VILLAGER_CHARS[(Math.random()*VILLAGER_CHARS.length)|0]:0;}
Promise.all(CHARS.slice(0,CHC*CHR).map((c,i)=>new Promise(res=>{const im=new Image();im.onload=()=>{const cx=(i%CHC)*CHTS,cy=((i/CHC)|0)*CHTS;chx.clearRect(cx,cy,CHTS,CHTS);chx.drawImage(im,cx,cy,CHTS,CHTS);res();};im.onerror=()=>res();im.src=c.uri;}))).then(upChar);
function charUV(i){const c=i%CHC,r=(i/CHC)|0,e=0.5/CHAW;return{u0:c/CHC+e,v0:r/CHR+e,u1:(c+1)/CHC-e,v1:(r+1)/CHR-e};}
function charFor(name){return CHAR_IDX[name]!==undefined?CHAR_IDX[name]:0;}
function randChar(){return (Math.random()*Math.min(CHARS.length,CHC*CHR))|0;}

/* ----------------------------- blocks & items ----------------------------- */
// tool types: 0 none,1 pick,2 axe,3 shovel  ; tier 0 hand..3 iron
const B={
 1:{n:'Stone',t:TX.stone,s:TX.stone,b:TX.stone,hard:1.5,tool:1,tier:1,drop:4},
 2:{n:'Dirt',t:TX.dirt,s:TX.dirt,b:TX.dirt,hard:.5,tool:3,drop:2},
 3:{n:'Grass',t:TX.grassTop,s:TX.grassSide,b:TX.dirt,hard:.6,tool:3,drop:2},
 4:{n:'Cobblestone',t:TX.cobble,s:TX.cobble,b:TX.cobble,hard:2,tool:1,tier:1,drop:4},
 5:{n:'Sand',t:TX.sand,s:TX.sand,b:TX.sand,hard:.5,tool:3,drop:5,grav:1},
 6:{n:'Sandstone',t:TX.sandstone,s:TX.sandstone,b:TX.sandstone,hard:1.6,tool:1,tier:1,drop:6},
 7:{n:'Gravel',t:TX.gravel,s:TX.gravel,b:TX.gravel,hard:.6,tool:3,drop:7,grav:1},
 8:{n:'Oak Log',t:TX.logTop,s:TX.logSide,b:TX.logTop,hard:2,tool:2,drop:8},
 9:{n:'Planks',t:TX.planks,s:TX.planks,b:TX.planks,hard:1.4,tool:2,drop:9},
 10:{n:'Leaves',t:TX.leaves,s:TX.leaves,b:TX.leaves,hard:.3,tool:0,drop:0},
 11:{n:'Water',t:TX.water,s:TX.water,b:TX.water,liquid:true,opaque:false,hard:99},
 12:{n:'Snow',t:TX.snow,s:TX.snowSide,b:TX.dirt,hard:.6,tool:3,drop:12},
 13:{n:'Ice',t:TX.ice,s:TX.ice,b:TX.ice,hard:1,tool:1,drop:0,opaque:false},
 14:{n:'Coal Ore',t:TX.coal,s:TX.coal,b:TX.coal,hard:3,tool:1,tier:1,drop:101},
 15:{n:'Iron Ore',t:TX.iron,s:TX.iron,b:TX.iron,hard:3,tool:1,tier:2,drop:102},
 16:{n:'Gold Ore',t:TX.gold,s:TX.gold,b:TX.gold,hard:3,tool:1,tier:3,drop:103},
 17:{n:'Diamond Ore',t:TX.diamond,s:TX.diamond,b:TX.diamond,hard:3,tool:1,tier:3,drop:104},
 18:{n:'Glass',t:TX.glass,s:TX.glass,b:TX.glass,hard:.4,tool:0,drop:18,opaque:false},
 19:{n:'Crafting Table',t:TX.craftTop,s:TX.craftSide,b:TX.planks,hard:1.4,tool:2,drop:19},
 20:{n:'Furnace',t:TX.stone,s:TX.furnaceSide,b:TX.stone,front:TX.furnaceFront,hard:2,tool:1,tier:1,drop:20},
 21:{n:'Chest',t:TX.planks,s:TX.chestSide,b:TX.planks,front:TX.chestFront,hard:1.4,tool:2,drop:21},
 22:{n:'Torch',t:TX.torch,s:TX.torch,b:TX.torch,hard:.1,tool:0,drop:22,opaque:false,light:1},
 23:{n:'Cactus',t:TX.cactus,s:TX.cactus,b:TX.cactus,hard:.4,tool:0,drop:23,opaque:false,hurt:1},
 24:{n:'Bricks',t:TX.bricks,s:TX.bricks,b:TX.bricks,hard:2,tool:1,tier:1,drop:24},
 25:{n:'Bookshelf',t:TX.planks,s:TX.bookshelf,b:TX.planks,hard:1.4,tool:2,drop:25},
 26:{n:'Iron Block',t:TX.ironBlock,s:TX.ironBlock,b:TX.ironBlock,hard:3,tool:1,tier:2,drop:26},
 27:{n:'Gold Block',t:TX.goldBlock,s:TX.goldBlock,b:TX.goldBlock,hard:3,tool:1,tier:1,drop:27},
 28:{n:'Bedrock',t:TX.bedrock,s:TX.bedrock,b:TX.bedrock,hard:Infinity,tool:0,drop:0},
 29:{n:'Snowy Grass',t:TX.snow,s:TX.snowSide,b:TX.dirt,hard:.6,tool:3,drop:2},
 30:{n:'Adyah Block',t:TX.ady0,s:TX.ady0,b:TX.ady0,hard:1,tool:0,drop:30},
 31:{n:'Adyah Block 2',t:TX.ady1,s:TX.ady1,b:TX.ady1,hard:1,tool:0,drop:31},
 32:{n:'Adyah Block 3',t:TX.ady2,s:TX.ady2,b:TX.ady2,hard:1,tool:0,drop:32},
 33:{n:'Farmland',t:TX.farmland,s:TX.dirt,b:TX.dirt,hard:.5,tool:3,drop:2},
 34:{n:'Tall Grass',t:TX.tallgrass,s:TX.tallgrass,b:TX.tallgrass,shape:'cross',opaque:false,hard:.05,tool:0,drop:0},
 35:{n:'Wheat',t:TX.wheat,s:TX.wheat,b:TX.wheat,shape:'cross',opaque:false,hard:.05,tool:0,drop:0,crop:'wheat'},
 36:{n:'Carrots',t:TX.carrot,s:TX.carrot,b:TX.carrot,shape:'cross',opaque:false,hard:.05,tool:0,drop:0,crop:'carrot'},
 37:{n:'Potatoes',t:TX.potato,s:TX.potato,b:TX.potato,shape:'cross',opaque:false,hard:.05,tool:0,drop:0,crop:'potato'},
 38:{n:'Sugar Cane',t:TX.sugarcane,s:TX.sugarcane,b:TX.sugarcane,shape:'cross',opaque:false,hard:.1,tool:0,drop:38},
 39:{n:'Dandelion',t:TX.dandelion,s:TX.dandelion,b:TX.dandelion,shape:'cross',opaque:false,hard:.05,tool:0,drop:39},
 40:{n:'Rose',t:TX.rose,s:TX.rose,b:TX.rose,shape:'cross',opaque:false,hard:.05,tool:0,drop:40},
 41:{n:'Sapling',t:TX.sapling,s:TX.sapling,b:TX.sapling,shape:'cross',opaque:false,hard:.05,tool:0,drop:41},
 42:{n:'Glowstone',t:TX.glowstone,s:TX.glowstone,b:TX.glowstone,hard:.5,tool:0,drop:42,light:15},
 43:{n:'Oak Slab',t:TX.planks,s:TX.planks,b:TX.planks,shape:'slab',opaque:false,hard:1.2,tool:2,drop:43},
 44:{n:'Oak Fence',t:TX.planks,s:TX.planks,b:TX.planks,shape:'fence',opaque:false,hard:1.4,tool:2,drop:44},
 45:{n:'Oak Stairs',t:TX.planks,s:TX.planks,b:TX.planks,shape:'stairs',opaque:false,hard:1.4,tool:2,drop:45},
 46:{n:'Glass Pane',t:TX.glass,s:TX.glass,b:TX.glass,shape:'pane',opaque:false,hard:.3,tool:0,drop:46},
 47:{n:'Oak Door',t:TX.door,s:TX.door,b:TX.door,shape:'door',opaque:false,hard:1.4,tool:2,drop:47},
 48:{n:'Ladder',t:TX.ladder,s:TX.ladder,b:TX.ladder,shape:'ladder',opaque:false,hard:.4,tool:0,drop:48},
 49:{n:'Cobble Slab',t:TX.cobble,s:TX.cobble,b:TX.cobble,shape:'slab',opaque:false,hard:2,tool:1,tier:1,drop:49},
 50:{n:'Cobble Stairs',t:TX.cobble,s:TX.cobble,b:TX.cobble,shape:'stairs',opaque:false,hard:2,tool:1,tier:1,drop:50},
 51:{n:'Bed',t:TX.bedTex,s:TX.bedTex,b:TX.planks,shape:'bed',opaque:false,hard:.4,tool:0,drop:51,bed:1},
 52:{n:'Stone Bricks',t:TX.stonebrick,s:TX.stonebrick,b:TX.stonebrick,hard:2,tool:1,tier:1,drop:52},
 53:{n:'Mossy Cobble',t:TX.mossycobble,s:TX.mossycobble,b:TX.mossycobble,hard:2,tool:1,tier:1,drop:53},
 54:{n:'Lantern',t:TX.lantern,s:TX.lantern,b:TX.lantern,hard:.4,tool:0,drop:54,light:14},
 55:{n:'Mushroom',t:TX.mushroom,s:TX.mushroom,b:TX.mushroom,shape:'cross',opaque:false,hard:.05,tool:0,drop:55},
 56:{n:'Berry Bush',t:TX.berry,s:TX.berry,b:TX.berry,shape:'cross',opaque:false,hard:.05,tool:0,drop:0,bush:1},
 57:{n:'Emerald Ore',t:TX.emeraldOre,s:TX.emeraldOre,b:TX.emeraldOre,hard:3,tool:1,tier:3,drop:158},
 58:{n:'Pumpkin',t:TX.pumpkin,s:TX.pumpkin,b:TX.pumpkin,front:TX.pumpkinFront,hard:.8,tool:2,drop:58},
 59:{n:'Hay Bale',t:TX.hay,s:TX.hay,b:TX.hay,hard:.6,tool:0,drop:59},
 60:{n:'TNT',t:TX.tnt,s:TX.tnt,b:TX.tnt,hard:.4,tool:0,drop:60},
 61:{n:'Obsidian',t:TX.obsidian,s:TX.obsidian,b:TX.obsidian,hard:10,tool:1,tier:3,drop:61},
 62:{n:'Slime Block',t:TX.slime,s:TX.slime,b:TX.slime,opaque:false,hard:.3,tool:0,drop:62},
 63:{n:'Quartz Block',t:TX.quartz,s:TX.quartz,b:TX.quartz,hard:1.4,tool:1,tier:1,drop:63},
};
const isOpaque=id=>{const d=B[id];return d&&d.opaque!==false&&!d.liquid;};
const isSolid=id=>{const d=B[id];return id!==0&&d&&!d.liquid;};
function solidShape(id,meta){if(id===0)return false;const d=B[id];if(!d||d.liquid)return false;const s=d.shape;if(s==='cross'||s==='torch'||s==='ladder'||s==='bed')return false;if(s==='door')return !((meta||0)&4);return true;}
// items (non-block ids >=100)
const IT={
 100:{n:'Stick',ic:'stick'},101:{n:'Coal',ic:'coal'},102:{n:'Iron Ingot',ic:'iron'},103:{n:'Gold Ingot',ic:'goldi'},104:{n:'Diamond',ic:'diamond'},105:{n:'Apple',ic:'apple',heal:5},
 110:{n:'Wood Pickaxe',tool:1,tier:1,dur:60,dmg:2},111:{n:'Wood Axe',tool:2,tier:1,dur:60,dmg:3},112:{n:'Wood Shovel',tool:3,tier:1,dur:60,dmg:2},113:{n:'Wood Sword',tool:0,tier:1,dur:60,dmg:4,weapon:1},
 120:{n:'Stone Pickaxe',tool:1,tier:2,dur:130,dmg:3},121:{n:'Stone Axe',tool:2,tier:2,dur:130,dmg:4},122:{n:'Stone Shovel',tool:3,tier:2,dur:130,dmg:3},123:{n:'Stone Sword',tool:0,tier:2,dur:130,dmg:5,weapon:1},
 130:{n:'Iron Pickaxe',tool:1,tier:3,dur:250,dmg:4},131:{n:'Iron Axe',tool:2,tier:3,dur:250,dmg:5},132:{n:'Iron Shovel',tool:3,tier:3,dur:250,dmg:4},133:{n:'Iron Sword',tool:0,tier:3,dur:250,dmg:7,weapon:1},
 140:{n:'Diamond Pickaxe',tool:1,tier:4,dur:800,dmg:5},141:{n:'Diamond Sword',tool:0,tier:4,dur:800,dmg:9,weapon:1},
 150:{n:'Wheat Seeds',ic:'seeds',plant:35},151:{n:'Wheat',ic:'wheat'},152:{n:'Bread',ic:'bread',heal:6},153:{n:'Bone Meal',ic:'bonemeal'},
 154:{n:'Carrot',ic:'carrot',heal:4,plant:36},155:{n:'Potato',ic:'potato',heal:2,plant:37},156:{n:'Bone',ic:'bone'},
 157:{n:'Berries',ic:'berry',heal:3},158:{n:'Emerald',ic:'emerald'},159:{n:'Golden Apple',ic:'goldapple',heal:12},
 160:{n:'Raw Pork',ic:'rawpork'},161:{n:'Cooked Pork',ic:'cookpork',heal:8},162:{n:'Raw Beef',ic:'rawbeef'},163:{n:'Steak',ic:'cookbeef',heal:8},164:{n:'Raw Chicken',ic:'rawchk'},165:{n:'Cooked Chicken',ic:'cookchk',heal:6},166:{n:'Leather',ic:'leather'},167:{n:'Feather',ic:'feather'},168:{n:'Egg',ic:'egg'},169:{n:'Wool',ic:'wool'},
 170:{n:'Wood Hoe',tool:4,tier:1,dur:60},171:{n:'Stone Hoe',tool:4,tier:2,dur:130},172:{n:'Iron Hoe',tool:4,tier:3,dur:250},
 // more tools & weapons
 142:{n:'Diamond Axe',tool:2,tier:4,dur:800,dmg:6},143:{n:'Diamond Shovel',tool:3,tier:4,dur:800,dmg:5},144:{n:'Diamond Hoe',tool:4,tier:4,dur:800},
 145:{n:'Emerald Blade',tool:0,tier:4,dur:1000,dmg:11,weapon:1},146:{n:'Bow',tool:0,tier:3,dur:200,dmg:6,weapon:1,ic:'bow'},147:{n:'Arrow',ic:'arrow'},
 148:{n:'Hero Sword',tool:0,tier:4,dur:1500,dmg:13,weapon:1},149:{n:'Battle Hammer',tool:1,tier:4,dur:900,dmg:9,weapon:1},
 // foods
 173:{n:'Cooked Mutton',ic:'cookmutton',heal:8},174:{n:'Melon Slice',ic:'melon',heal:2},175:{n:'Cookie',ic:'cookie',heal:2},176:{n:'Cake',ic:'cake',heal:14},
 177:{n:'Pumpkin Pie',ic:'pie',heal:8},178:{n:'Mushroom Stew',ic:'stew',heal:6},179:{n:'Honey Bottle',ic:'honey',heal:6},180:{n:'Golden Carrot',ic:'goldcarrot',heal:10},
 181:{n:'Cooked Fish',ic:'fish',heal:5},198:{n:'Enchanted Apple',ic:'goldapple',heal:20},
 // materials
 182:{n:'Slimeball',ic:'slime'},183:{n:'Dragon Scale',ic:'scale'},184:{n:'Magic Crystal',ic:'crystal'},185:{n:'String',ic:'string'},186:{n:'Gunpowder',ic:'gunpowder'},
 187:{n:'Clay Ball',ic:'clay'},188:{n:'Paper',ic:'paper'},189:{n:'Book',ic:'book'},190:{n:'Sugar',ic:'sugar'},191:{n:'Pumpkin Seeds',ic:'seeds',plant:58},
 192:{n:'Raw Mutton',ic:'rawmutton'},193:{n:'Raw Fish',ic:'rawfish'},
 // quest & gadget collectibles
 194:{n:"Adyah's Compass",ic:'compass'},195:{n:'Treasure Map',ic:'map'},196:{n:'Golden Crown',ic:'crown'},197:{n:'Dragon Egg',ic:'egg2'},199:{n:'Star Shard',ic:'star',weapon:1,tool:0,tier:4,dur:300,dmg:8},
 // ===== new magical weapons =====
 200:{n:'Fire Sword',tool:0,tier:5,dur:900,dmg:14,weapon:1},
 201:{n:'Frost Blade',tool:0,tier:6,dur:900,dmg:13,weapon:1},
 202:{n:'Shadow Dagger',tool:0,tier:8,dur:700,dmg:11,weapon:1},
 203:{n:'Rainbow Sword',tool:0,tier:9,dur:1200,dmg:16,weapon:1},
 204:{n:'Dragon Slayer',tool:0,tier:10,dur:1500,dmg:18,weapon:1},
 205:{n:'Magic Wand',tool:0,tier:8,dur:500,dmg:9,weapon:1},
 206:{n:'Thunder Hammer',tool:1,tier:7,dur:900,dmg:13,weapon:1},
 207:{n:"Adyah's Star Blade",tool:0,tier:10,dur:2000,dmg:20,weapon:1},
 // ===== potions / fun foods =====
 208:{n:'Healing Potion',ic:'potion',heal:18},209:{n:'Berry Juice',ic:'juice',heal:8},210:{n:'Chocolate Bar',ic:'choc',heal:7},
 211:{n:'Ice Cream',ic:'icecream',heal:5},212:{n:'Pizza Slice',ic:'pizza',heal:11},213:{n:'Hero Burger',ic:'burger',heal:13},
 214:{n:'Rainbow Candy',ic:'candy',heal:4},215:{n:'Phoenix Elixir',ic:'elixir',heal:25},
 // ===== gems & collectibles =====
 216:{n:'Ruby',ic:'ruby'},217:{n:'Sapphire',ic:'sapphire'},218:{n:'Amethyst',ic:'amethyst'},219:{n:'Topaz',ic:'topaz'},
 220:{n:'Magic Ring',ic:'ring'},221:{n:'Hero Medal',ic:'medal'},222:{n:'Lucky Coin',ic:'coin'},223:{n:'Fairy Dust',ic:'fairydust'},
 224:{n:'Dragon Heart',ic:'heart',heal:30},225:{n:'Family Locket',ic:'locket',heal:12},226:{n:'Star Map',ic:'starmap'},
};
function itemName(id){return id<100?(B[id]?B[id].n:'?'):(IT[id]?IT[id].n:'?');}
function maxStack(id){return (id>=100&&IT[id]&&IT[id].tool!==undefined)?1:64;}
function toolOf(id){return id>=100&&IT[id]&&IT[id].tool!==undefined?{tool:IT[id].tool,tier:IT[id].tier,dmg:IT[id].dmg||1,weapon:IT[id].weapon}:null;}
// recipes
const REC=[
 {o:9,n:4,i:[[8,1]]},
 {o:100,n:4,i:[[9,2]]},
 {o:19,n:1,i:[[9,4]]},
 {o:22,n:4,i:[[101,1],[100,1]]},
 {o:20,n:1,i:[[4,8]],need:19},
 {o:21,n:1,i:[[9,8]],need:19},
 {o:18,n:1,i:[[5,1]],need:20},
 {o:24,n:4,i:[[1,4]],need:20},
 {o:110,n:1,i:[[9,3],[100,2]],need:19},{o:111,n:1,i:[[9,3],[100,2]],need:19},{o:112,n:1,i:[[9,1],[100,2]],need:19},{o:113,n:1,i:[[9,2],[100,1]],need:19},
 {o:120,n:1,i:[[4,3],[100,2]],need:19},{o:121,n:1,i:[[4,3],[100,2]],need:19},{o:122,n:1,i:[[4,1],[100,2]],need:19},{o:123,n:1,i:[[4,2],[100,1]],need:19},
 {o:130,n:1,i:[[102,3],[100,2]],need:19},{o:131,n:1,i:[[102,3],[100,2]],need:19},{o:133,n:1,i:[[102,2],[100,1]],need:19},
 {o:140,n:1,i:[[104,3],[100,2]],need:19},{o:141,n:1,i:[[104,2],[100,1]],need:19},
 // new magical weapons & treats
 {o:200,n:1,i:[[133,1],[101,3]],need:19},        // Fire Sword: iron sword + coal
 {o:201,n:1,i:[[133,1],[15,2]],need:19},          // Frost Blade: iron sword + ice
 {o:202,n:1,i:[[104,1],[100,1]],need:19},         // Shadow Dagger
 {o:203,n:1,i:[[141,1],[184,2]],need:19},         // Rainbow Sword: diamond sword + magic crystal
 {o:204,n:1,i:[[148,1],[183,2]],need:19},         // Dragon Slayer: hero sword + dragon scale
 {o:205,n:1,i:[[100,1],[184,2]],need:19},         // Magic Wand
 {o:206,n:1,i:[[149,1],[103,3]],need:19},         // Thunder Hammer: battle hammer + gold
 {o:207,n:1,i:[[148,1],[199,1],[104,2]],need:19}, // Adyah's Star Blade: hero sword + star shard + diamonds
 {o:208,n:1,i:[[157,2],[20,1]],need:19},          // Healing Potion: berries + glass
 {o:212,n:1,i:[[152,1],[162,1]],need:19},         // Pizza Slice: bread + beef
 {o:213,n:1,i:[[152,1],[163,1]],need:19},         // Hero Burger: bread + steak
 {o:215,n:1,i:[[159,1],[184,1]],need:19},         // Phoenix Elixir: golden apple + magic crystal
 {o:26,n:1,i:[[102,9]],need:19},{o:27,n:1,i:[[103,9]],need:19},
 {o:25,n:1,i:[[9,6],[100,3]],need:19},
 // farming & food
 {o:152,n:1,i:[[151,3]],need:19},               // bread
 {o:153,n:3,i:[[156,1]]},                         // bonemeal from bone
 {o:170,n:1,i:[[9,2],[100,2]],need:19},{o:171,n:1,i:[[4,2],[100,2]],need:19},{o:172,n:1,i:[[102,2],[100,2]],need:19}, // hoes
 // building set
 {o:43,n:6,i:[[9,3]],need:19},{o:49,n:6,i:[[4,3]],need:19},   // slabs
 {o:45,n:4,i:[[9,6]],need:19},{o:50,n:4,i:[[4,6]],need:19},   // stairs
 {o:44,n:3,i:[[9,4],[100,2]],need:19},                         // fence
 {o:46,n:8,i:[[18,6]],need:19},                                // glass panes
 {o:47,n:3,i:[[9,6]],need:19},                                 // door
 {o:48,n:3,i:[[100,7]],need:19},                               // ladder
 {o:51,n:1,i:[[9,3],[34,3]],need:19},                          // bed (planks + grass tufts as "wool" stand-in)
 {o:52,n:4,i:[[4,4]],need:19},                                 // stone bricks from cobble
 {o:54,n:1,i:[[22,1],[102,1]],need:19},                        // lantern from torch + iron
 // new tools & weapons
 {o:142,n:1,i:[[104,3],[100,2]],need:19},{o:143,n:1,i:[[104,1],[100,2]],need:19},{o:144,n:1,i:[[104,2],[100,2]],need:19}, // diamond axe/shovel/hoe
 {o:145,n:1,i:[[158,2],[100,1]],need:19},                       // emerald blade
 {o:146,n:1,i:[[100,3],[185,3]],need:19},                       // bow (sticks + string)
 {o:147,n:4,i:[[100,1],[167,1]],need:19},                       // arrows (stick + feather)
 {o:148,n:1,i:[[104,2],[158,1],[100,1]],need:19},               // hero sword
 {o:149,n:1,i:[[104,3],[1,2]],need:19},                         // battle hammer
 // new building blocks
 {o:60,n:1,i:[[186,5],[5,4]],need:19},                          // TNT (gunpowder + sand)
 {o:59,n:1,i:[[151,9]],need:19},                                // hay bale from wheat
 {o:63,n:4,i:[[158,1],[1,4]],need:19},                          // quartz-ish from emerald+stone
 // food
 {o:175,n:8,i:[[151,2],[190,1]],need:19},                       // cookies
 {o:176,n:1,i:[[151,3],[190,2],[168,1]],need:19},               // cake
 {o:177,n:1,i:[[58,1],[190,1],[168,1]],need:19},                // pumpkin pie
 {o:178,n:1,i:[[55,2],[155,1]],need:19},                        // mushroom stew
 {o:180,n:1,i:[[154,1],[103,1]],need:19},                       // golden carrot
 {o:198,n:1,i:[[105,1],[27,8]],need:19},                        // enchanted apple
 // materials & misc
 {o:190,n:1,i:[[38,1]]},                                        // sugar from sugar cane
 {o:188,n:3,i:[[38,3]],need:19},                                // paper from sugar cane
 {o:189,n:1,i:[[188,3],[166,1]],need:19},                       // book
 {o:196,n:1,i:[[103,5]],need:19},                               // golden crown
 {o:191,n:4,i:[[58,1]],need:19},                                // pumpkin seeds
];

/* ----------------------------- world / chunks ----------------------------- */
const CH=16,H=72,SEA=30;
let SEED=12345;
const chunks=new Map();            // "cx,cz" -> {blocks:Uint8Array, gen, mesh, dirty, buf, count, min,max}
const editStore=new Map();         // "cx,cz" -> Map(localIdx -> id)
const villages=new Map();          // "cx,cz" -> [wx,wy,wz] village centers
const ckey=(cx,cz)=>cx+','+cz;
const lidx=(x,y,z)=>(y*CH+z)*CH+x;
function hash3(x,y,z){let h=(Math.imul(x,374761393)+Math.imul(y,668265263)+Math.imul(z,1274126177)+Math.imul(SEED,2246822519))|0;h=Math.imul(h^(h>>>13),1274126177);h^=h>>>16;return (h>>>0)/4294967295;}
function hash2(x,z){return hash3(x,57,z);}
const smooth=t=>t*t*(3-2*t);
function vnoise2(x,z){const x0=Math.floor(x),z0=Math.floor(z),fx=smooth(x-x0),fz=smooth(z-z0);const a=hash2(x0,z0),b=hash2(x0+1,z0),c=hash2(x0,z0+1),d=hash2(x0+1,z0+1);return(a*(1-fx)+b*fx)*(1-fz)+(c*(1-fx)+d*fx)*fz;}
function vnoise3(x,y,z){const x0=Math.floor(x),y0=Math.floor(y),z0=Math.floor(z),fx=smooth(x-x0),fy=smooth(y-y0),fz=smooth(z-z0);
  function L(a,b,t){return a+(b-a)*t;}
  const c000=hash3(x0,y0,z0),c100=hash3(x0+1,y0,z0),c010=hash3(x0,y0+1,z0),c110=hash3(x0+1,y0+1,z0),c001=hash3(x0,y0,z0+1),c101=hash3(x0+1,y0,z0+1),c011=hash3(x0,y0+1,z0+1),c111=hash3(x0+1,y0+1,z0+1);
  return L(L(L(c000,c100,fx),L(c010,c110,fx),fy),L(L(c001,c101,fx),L(c011,c111,fx),fy),fz);}
function biomeAt(wx,wz){const st=v=>Math.max(0,Math.min(1,(v-0.5)*2.1+0.5));const temp=st(vnoise2(wx*0.0045+100,wz*0.0045+100)),hum=st(vnoise2(wx*0.0045-50,wz*0.0045-50)),m=vnoise2(wx*0.0026+9,wz*0.0026+9);
  if(m>0.70)return 'mountains';if(temp>0.62&&hum<0.42)return 'desert';if(temp<0.34)return 'snow';if(hum>0.54)return 'forest';return 'plains';}
function heightAt(wx,wz){const b=biomeAt(wx,wz);let n=vnoise2(wx*0.012,wz*0.012)*0.55+vnoise2(wx*0.03,wz*0.03)*0.3+vnoise2(wx*0.08,wz*0.08)*0.15;
  let base=SEA+ (n-0.5)*22;
  if(b==='mountains'){base=SEA+(n-0.4)*60;} else if(b==='desert'){base=SEA+2+(n-0.5)*10;} else if(b==='plains'){base=SEA+1+(n-0.5)*12;}
  return Math.max(6,Math.floor(base));}
function genChunk(cx,cz){
  const blocks=new Uint8Array(CH*CH*H);
  for(let lx=0;lx<CH;lx++)for(let lz=0;lz<CH;lz++){
    const wx=cx*CH+lx, wz=cz*CH+lz;const b=biomeAt(wx,wz);const h=Math.min(H-6,heightAt(wx,wz));
    for(let y=0;y<=h;y++){
      let id=1; // stone
      if(y===0)id=28;
      else if(y>h-1){ id = b==='desert'?5 : b==='snow'?12 : b==='mountains'&&h>SEA+22?1 : 3; if(b==='mountains'&&h>SEA+26)id=1; }
      else if(y>h-4){ id = b==='desert'?6 : 2; }
      else { // ore distribution in stone
        const r=hash3(wx,y,wz);
        if(y<12 && r>0.9965)id=57; else if(y<14 && r>0.992)id=17; else if(y<22 && r>0.986)id=16; else if(y<40 && r>0.97)id=15; else if(r>0.95)id=14;
      }
      // caves
      if(y>3 && y<h-1){ const c=vnoise3(wx*0.07,y*0.09,wz*0.07); if(c>0.78){ id=0; } }
      if(id)blocks[lidx(lx,y,lz)]=id;
    }
    // water fill
    if(h<SEA){for(let y=h+1;y<=SEA;y++) if(!blocks[lidx(lx,y,lz)]) blocks[lidx(lx,y,lz)]=11;}
    // snow top layer
    if(b==='snow'&&h>=SEA){ if(!blocks[lidx(lx,h+1,lz)]) blocks[lidx(lx,h+1,lz)]=12; }
    // trees / cacti / plants (deterministic)
    if(h>SEA){
      const tr=hash3(wx*3+1,7,wz*3+2);const top=blocks[lidx(lx,h,lz)];const above=h+1<H?blocks[lidx(lx,h+1,lz)]:1;
      if((b==='forest'&&tr>0.86)||(b==='plains'&&tr>0.965)){ /* trees placed in cross-chunk pass below */ }
      else if(b==='desert'&&tr>0.97){ for(let k=0;k<3;k++) setLocal(blocks,lx,h+1+k,lz,23); }
      else if(top===3&&!above){const g=hash3(wx*5+2,3,wz*5+7);if(g>0.80)setLocal(blocks,lx,h+1,lz,34);else if(g>0.755)setLocal(blocks,lx,h+1,lz,56);else if(g>0.74)setLocal(blocks,lx,h+1,lz,g>0.747?39:40);else if(b==='forest'&&g<0.035)setLocal(blocks,lx,h+1,lz,55);}
      if(top===5&&h<=SEA+1&&!above){const sg=hash3(wx*2+9,5,wz*2+3);if(sg>0.9){for(let k=0;k<2+(sg>0.97?1:0);k++)setLocal(blocks,lx,h+1+k,lz,38);}}
    }
  }
  // trees: placed across chunk borders so canopies are never cut off
  for(let mx=-2;mx<CH+2;mx++)for(let mz=-2;mz<CH+2;mz++){const wx=cx*CH+mx,wz=cz*CH+mz;const tb=treeBaseAt(wx,wz);if(tb>=0)growTree(blocks,mx,mz,tb+1,wx,wz);}
  // buried treasure: carve a hidden chamber + chest
  const trz=chunkTreasure(cx,cz);
  if(trz){const wx=cx*CH+trz.lx,wz=cz*CH+trz.lz;const h=Math.min(H-6,heightAt(wx,wz));const ty=Math.max(7,h-6);
    for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++)for(let dy=0;dy<=2;dy++){const x=trz.lx+dx,z=trz.lz+dz;if(x>=0&&x<CH&&z>=0&&z<CH)blocks[lidx(x,ty+dy,z)]=0;}
    for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++){const x=trz.lx+dx,z=trz.lz+dz;if(x>=0&&x<CH&&z>=0&&z<CH)blocks[lidx(x,ty-1,z)]=24;}
    blocks[lidx(trz.lx,ty-1,trz.lz)]=27;            // gold block beneath
    blocks[lidx(trz.lx,ty,trz.lz)]=21;              // treasure chest
    if(ty+3<H)blocks[lidx(trz.lx,ty+1,trz.lz)]=42;  // glowstone lamp above (a glowing secret)
  }
  // village: a cluster of houses on flat land (plains/forest)
  if(chunkVillage(cx,cz)){
    const ccx=cx*CH+8,ccz=cz*CH+8;let gy=Math.min(H-9,heightAt(ccx,ccz));
    if(gy>SEA && biomeAt(ccx,ccz)!=='mountains' && biomeAt(ccx,ccz)!=='snow'){
      for(let lx=0;lx<CH;lx++)for(let lz=0;lz<CH;lz++){blocks[lidx(lx,gy,lz)]=3;for(let y=gy+1;y<gy+8&&y<H;y++)blocks[lidx(lx,y,lz)]=0;for(let y=gy-1;y>gy-4&&y>0;y--)if(!blocks[lidx(lx,y,lz)])blocks[lidx(lx,y,lz)]=2;}
      for(let lx=0;lx<CH;lx++)blocks[lidx(lx,gy,8)]=4;                 // path
      for(let lz=0;lz<CH;lz++)blocks[lidx(8,gy,lz)]=4;
      setLocal(blocks,8,gy+1,8,44);setLocal(blocks,8,gy+2,8,54);       // central lamp
      const spots=[[1,1],[9,1],[1,9],[9,9]];
      for(let i=0;i<4;i++){if(hash3(cx*7+i,9,cz*7-i)<0.22)continue;villageHouse(blocks,spots[i][0],spots[i][1],gy,i+cx+cz);}
      villages.set(ckey(cx,cz),[ccx,gy+1,ccz]);
    }
  }
  return blocks;
}
function chunkVillage(cx,cz){
  if(hash3(cx,4242,cz)<=0.975)return false;
  for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++)if(biomeAt((cx+dx)*CH+8,(cz+dz)*CH+8)!=='plains')return false; // open plains all around — no tree crowding
  const h0=heightAt(cx*CH+2,cz*CH+2),h1=heightAt(cx*CH+14,cz*CH+2),h2=heightAt(cx*CH+2,cz*CH+14),h3=heightAt(cx*CH+14,cz*CH+14),hc=heightAt(cx*CH+8,cz*CH+8);
  const mn=Math.min(h0,h1,h2,h3,hc),mx=Math.max(h0,h1,h2,h3,hc);
  return (mx-mn)<=2 && mn>SEA;   // only on flat land above water
}
function villageHouse(blocks,ox,oz,gy,seed){
  const W=6,Dp=6,Hh=4,wall=(hash3(ox,seed,oz)>0.5)?9:4,roof=(hash3(ox+3,seed,oz+3)>0.5)?24:52;
  for(let x=0;x<=W;x++)for(let z=0;z<=Dp;z++)setLocal(blocks,ox+x,gy,oz+z,9);            // plank floor
  for(let y=1;y<=Hh;y++){for(let x=0;x<=W;x++){setLocal(blocks,ox+x,gy+y,oz,wall);setLocal(blocks,ox+x,gy+y,oz+Dp,wall);}for(let z=0;z<=Dp;z++){setLocal(blocks,ox,gy+y,oz+z,wall);setLocal(blocks,ox+W,gy+y,oz+z,wall);}}
  for(let x=0;x<=W;x++)for(let z=0;z<=Dp;z++)setLocal(blocks,ox+x,gy+Hh+1,oz+z,roof);     // flat roof (no overhang)
  setLocal(blocks,ox+3,gy+1,oz,0);setLocal(blocks,ox+3,gy+2,oz,0);setLocal(blocks,ox+3,gy+1,oz,47); // door
  setLocal(blocks,ox+1,gy+2,oz,46);setLocal(blocks,ox+5,gy+2,oz,46);setLocal(blocks,ox,gy+2,oz+3,46);setLocal(blocks,ox+W,gy+2,oz+3,46); // windows
  setLocal(blocks,ox+1,gy+1,oz+1,51);          // bed
  setLocal(blocks,ox+W-1,gy+1,oz+Dp-1,21);     // chest
  setLocal(blocks,ox+3,gy+1,oz+3,22);          // torch
}
function setLocal(blocks,lx,y,lz,id){ if(lx<0||lx>=CH||lz<0||lz>=CH||y<0||y>=H)return; blocks[lidx(lx,y,lz)]=id; }
function treeBaseAt(wx,wz){const b=biomeAt(wx,wz);if(b!=='forest'&&b!=='plains')return -1;const h=Math.min(H-6,heightAt(wx,wz));if(h<=SEA)return -1;const tr=hash3(wx*3+1,7,wz*3+2);if((b==='forest'&&tr>0.86)||(b==='plains'&&tr>0.965))return h;return -1;}
function growTree(blocks,lx,lz,baseY,wx,wz){const hh=4+((hash3(wx,7,wz)*3)|0);const ty=baseY+hh;
  for(let i=0;i<hh;i++)setLocal(blocks,lx,baseY+i,lz,8);
  // full rounded canopy: two wide layers (5x5, corners trimmed) + a 3x3 top
  for(let dy=0;dy<=3;dy++){const rad=dy<2?2:1;for(let dx=-rad;dx<=rad;dx++)for(let dz=-rad;dz<=rad;dz++){
    if(dy<2&&Math.abs(dx)===2&&Math.abs(dz)===2)continue;
    if(dx===0&&dz===0&&dy<1)continue;
    const x=lx+dx,z=lz+dz,yy=ty-1+dy;if(x>=0&&x<CH&&z>=0&&z<CH&&yy>=0&&yy<H&&!blocks[lidx(x,yy,z)])blocks[lidx(x,yy,z)]=10;}}}
function ensureGen(cx,cz){const k=ckey(cx,cz);let ch=chunks.get(k);if(ch&&ch.blocks)return ch;
  if(!ch){ch={blocks:null,meta:null,light:null,buf:null,count:0,dirty:true,min:[cx*CH,0,cz*CH],max:[cx*CH+CH,H,cz*CH+CH]};chunks.set(k,ch);}
  ch.blocks=genChunk(cx,cz);ch.meta=new Uint8Array(CH*CH*H);
  const ed=editStore.get(k);if(ed){for(const[idx,val]of ed){ch.blocks[idx]=val&255;ch.meta[idx]=(val>>8)&255;}}
  const trz=chunkTreasure(cx,cz);
  if(trz){const wx=cx*CH+trz.lx,wz=cz*CH+trz.lz;const h=Math.min(H-6,heightAt(wx,wz));const ty=Math.max(7,h-6);
    if(ch.blocks[lidx(trz.lx,ty,trz.lz)]===21){const bk=bekey(wx,ty,wz);if(!blockEntities.has(bk)&&!treasureSpots[bk]){const rng=mulberry((SEED^Math.imul(wx,73856093)^Math.imul(wz,19349663))>>>0);blockEntities.set(bk,{type:'chest',treasure:true,items:padTo27(rollLoot(rng))});treasureSpots[bk]=1;}}}
  computeLight(ch,cx,cz);ch.dirty=true;return ch;}
function relight(cx,cz){const ch=chunks.get(ckey(cx,cz));if(ch&&ch.blocks){computeLight(ch,cx,cz);ch.dirty=true;}}
function getBlock(wx,wy,wz){if(wy<0)return 28;if(wy>=H)return 0;const cx=Math.floor(wx/CH),cz=Math.floor(wz/CH);const ch=chunks.get(ckey(cx,cz));if(!ch||!ch.blocks)return 0;return ch.blocks[lidx(wx-cx*CH,wy,wz-cz*CH)];}
function solidAt(wx,wy,wz){const id=getBlock(wx,wy,wz);if(id===0)return false;const d=B[id];if(!d||d.liquid)return false;const s=d.shape;if(!s||s==='slab'||s==='stairs'||s==='fence'||s==='pane')return true;if(s==='door')return !(getMeta(wx,wy,wz)&4);return false;}
function setBlock(wx,wyc,wz,id,meta){if(wyc<0||wyc>=H)return;meta=meta||0;const cx=Math.floor(wx/CH),cz=Math.floor(wz/CH),k=ckey(cx,cz);const ch=ensureGen(cx,cz);const lx=wx-cx*CH,lz=wz-cz*CH;
  const idx=lidx(lx,wyc,lz);ch.blocks[idx]=id;ch.meta[idx]=meta;ch.dirty=true;
  let ed=editStore.get(k);if(!ed){ed=new Map();editStore.set(k,ed);}ed.set(idx,id|(meta<<8));
  relight(cx,cz);
  if(lx===0)relight(cx-1,cz); if(lx===CH-1)relight(cx+1,cz); if(lz===0)relight(cx,cz-1); if(lz===CH-1)relight(cx,cz+1);
  scheduleSave();}
function setMeta(wx,wyc,wz,meta){const cx=Math.floor(wx/CH),cz=Math.floor(wz/CH),k=ckey(cx,cz);const ch=ensureGen(cx,cz);const idx=lidx(wx-cx*CH,wyc,wz-cz*CH);ch.meta[idx]=meta;ch.dirty=true;let ed=editStore.get(k);if(!ed){ed=new Map();editStore.set(k,ed);}ed.set(idx,ch.blocks[idx]|(meta<<8));scheduleSave();}

/* ---- metadata + light access ---- */
function getMeta(wx,wy,wz){if(wy<0||wy>=H)return 0;const cx=Math.floor(wx/CH),cz=Math.floor(wz/CH);const ch=chunks.get(ckey(cx,cz));if(!ch||!ch.meta)return 0;return ch.meta[lidx(wx-cx*CH,wy,wz-cz*CH)];}
function getLight(wx,wy,wz){if(wy>=H)return 0xF0;if(wy<0)return 0;const cx=Math.floor(wx/CH),cz=Math.floor(wz/CH);const ch=chunks.get(ckey(cx,cz));if(!ch||!ch.light)return 0xF0;return ch.light[lidx(wx-cx*CH,wy,wz-cz*CH)];}
function blocksLight(id){return isOpaque(id);} // opaque full cubes block light
const EMIT={22:14,42:15,20:13,54:14}; // torch, glowstone, lit furnace, lantern
function computeLight(ch,cx,cz){const size=CH*CH*H;if(!ch.light)ch.light=new Uint8Array(size);const L=ch.light;L.fill(0);const bl=ch.blocks;
  const q=[];
  // skylight: full 15 down each column until blocked
  for(let lx=0;lx<CH;lx++)for(let lz=0;lz<CH;lz++){for(let y=H-1;y>=0;y--){const id=bl[lidx(lx,y,lz)];if(blocksLight(id))break;const i=lidx(lx,y,lz);L[i]=(15<<4)|(L[i]&15);q.push(i);}}
  // BFS skylight
  let head=0;while(head<q.length){const i=q[head++];const cur=L[i]>>4;if(cur<=1)continue;const y=(i/(CH*CH))|0,rem=i-y*CH*CH,lz=(rem/CH)|0,lx=rem-lz*CH;
    const nb=[[lx+1,y,lz],[lx-1,y,lz],[lx,y+1,lz],[lx,y-1,lz],[lx,y,lz+1],[lx,y,lz-1]];
    for(const[nx,ny,nz]of nb){if(nx<0||nx>=CH||nz<0||nz>=CH||ny<0||ny>=H)continue;const ni=lidx(nx,ny,nz);if(blocksLight(bl[ni]))continue;if((L[ni]>>4)<cur-1){L[ni]=((cur-1)<<4)|(L[ni]&15);q.push(ni);}}}
  // blocklight from emitters
  const q2=[];for(let i=0;i<size;i++){const id=bl[i];const e=EMIT[id];if(e){L[i]=(L[i]&0xF0)|e;q2.push(i);}}
  head=0;while(head<q2.length){const i=q2[head++];const cur=L[i]&15;if(cur<=1)continue;const y=(i/(CH*CH))|0,rem=i-y*CH*CH,lz=(rem/CH)|0,lx=rem-lz*CH;
    const nb=[[lx+1,y,lz],[lx-1,y,lz],[lx,y+1,lz],[lx,y-1,lz],[lx,y,lz+1],[lx,y,lz-1]];
    for(const[nx,ny,nz]of nb){if(nx<0||nx>=CH||nz<0||nz>=CH||ny<0||ny>=H)continue;const ni=lidx(nx,ny,nz);if(blocksLight(bl[ni]))continue;if((L[ni]&15)<cur-1){L[ni]=(L[ni]&0xF0)|(cur-1);q2.push(ni);}}}
}
function sampleLight(wx,wy,wz){const lv=getLight(wx,wy,wz);return[(lv>>4)/15,(lv&15)/15];}

/* ---- shapes ---- */
const SHADE={top:1.0,bot:0.5,nz:0.8,sz:0.8,px:0.9,nx:0.7};
function shapeOf(id){const d=B[id];return d&&d.shape?d.shape:'cube';}
// emit one quad: corners are [x,y,z]*4 (CCW), uv mapped bl,br,tr,tl
function quad(arr,c0,c1,c2,c3,uv,shade,sky,blk){const U=[uv.u0,uv.v1,uv.u1,uv.v1,uv.u1,uv.v0,uv.u0,uv.v0];const cs=[c0,c1,c2,c3];const ix=[0,1,2,0,2,3];
  for(const i of ix){const c=cs[i];arr.push(c[0],c[1],c[2],U[i*2],U[i*2+1],shade,sky,blk);}}
function cubeFace(arr,x,y,z,dir,tile,shade,sky,blk){const uv=uvOf(tile);let v;
  switch(dir){case 0:v=[[x,y+1,z+1],[x+1,y+1,z+1],[x+1,y+1,z],[x,y+1,z]];break;case 1:v=[[x,y,z],[x+1,y,z],[x+1,y,z+1],[x,y,z+1]];break;
   case 2:v=[[x+1,y,z],[x,y,z],[x,y+1,z],[x+1,y+1,z]];break;case 3:v=[[x,y,z+1],[x+1,y,z+1],[x+1,y+1,z+1],[x,y+1,z+1]];break;
   case 4:v=[[x+1,y,z],[x+1,y,z+1],[x+1,y+1,z+1],[x+1,y+1,z]];break;case 5:v=[[x,y,z+1],[x,y,z],[x,y+1,z],[x,y+1,z+1]];break;}
  quad(arr,v[0],v[1],v[2],v[3],uv,shade,sky,blk);}
// generic axis-aligned box in local 0..1 (a..b), all 6 faces, double-not-culled
function boxShape(arr,x,y,z,a,b,tile,sl){const uv=uvOf(tile);const[ax,ay,az]=a,[bx,by,bz]=b;const X0=x+ax,X1=x+bx,Y0=y+ay,Y1=y+by,Z0=z+az,Z1=z+bz;const sky=sl[0],blk=sl[1];
  quad(arr,[X0,Y1,Z1],[X1,Y1,Z1],[X1,Y1,Z0],[X0,Y1,Z0],uv,SHADE.top,sky,blk);   // top
  quad(arr,[X0,Y0,Z0],[X1,Y0,Z0],[X1,Y0,Z1],[X0,Y0,Z1],uv,SHADE.bot,sky,blk);   // bottom
  quad(arr,[X1,Y0,Z0],[X0,Y0,Z0],[X0,Y1,Z0],[X1,Y1,Z0],uv,SHADE.sz,sky,blk);    // -z
  quad(arr,[X0,Y0,Z1],[X1,Y0,Z1],[X1,Y1,Z1],[X0,Y1,Z1],uv,SHADE.nz,sky,blk);    // +z
  quad(arr,[X1,Y0,Z0],[X1,Y0,Z1],[X1,Y1,Z1],[X1,Y1,Z0],uv,SHADE.px,sky,blk);    // +x
  quad(arr,[X0,Y0,Z1],[X0,Y0,Z0],[X0,Y1,Z0],[X0,Y1,Z1],uv,SHADE.nx,sky,blk);}   // -x
function crossShape(arr,x,y,z,tile,sl){const uv=uvOf(tile);const sky=sl[0],blk=sl[1];const e=0.146;
  // two diagonal planes, double-sided
  const A=[[x+e,y,z+e],[x+1-e,y,z+1-e],[x+1-e,y+1,z+1-e],[x+e,y+1,z+e]];
  const Bp=[[x+1-e,y,z+e],[x+e,y,z+1-e],[x+e,y+1,z+1-e],[x+1-e,y+1,z+e]];
  quad(arr,A[0],A[1],A[2],A[3],uv,0.95,sky,blk);quad(arr,A[3],A[2],A[1],A[0],uv,0.95,sky,blk);
  quad(arr,Bp[0],Bp[1],Bp[2],Bp[3],uv,0.95,sky,blk);quad(arr,Bp[3],Bp[2],Bp[1],Bp[0],uv,0.95,sky,blk);}

function meshChunk(ch,cx,cz){
  const arr=[];const bx=cx*CH,bz=cz*CH;const bl=ch.blocks,mt=ch.meta;
  for(let y=0;y<H;y++)for(let lz=0;lz<CH;lz++)for(let lx=0;lx<CH;lx++){
    const id=bl[lidx(lx,y,lz)];if(!id)continue;const d=B[id];if(!d)continue;const wx=bx+lx,wz=bz+lz;const meta=mt?mt[lidx(lx,y,lz)]:0;
    const shape=shapeOf(id);
    if(shape==='cross'){const sl=sampleLight(wx,y,wz);crossShape(arr,wx,y,wz,d.t,sl);continue;}
    if(shape!=='cube'){meshShape(arr,wx,y,wz,id,d,meta);continue;}
    const vis=(nx,ny,nz)=>{const nb=getBlock(nx,ny,nz);if(nb===0)return true;if(shapeOf(nb)!=='cube')return true;return !isOpaque(nb)&&nb!==id;};
    const top=d.t,side=d.s,bot=d.b;
    if(vis(wx,y+1,wz)){const sl=sampleLight(wx,y+1,wz);cubeFace(arr,wx,y,wz,0,top,SHADE.top,sl[0],sl[1]);}
    if(vis(wx,y-1,wz)){const sl=sampleLight(wx,y-1,wz);cubeFace(arr,wx,y,wz,1,bot,SHADE.bot,sl[0],sl[1]);}
    if(vis(wx,y,wz-1)){const sl=sampleLight(wx,y,wz-1);cubeFace(arr,wx,y,wz,2,side,SHADE.sz,sl[0],sl[1]);}
    if(vis(wx,y,wz+1)){const sl=sampleLight(wx,y,wz+1);cubeFace(arr,wx,y,wz,3,side,SHADE.nz,sl[0],sl[1]);}
    if(vis(wx+1,y,wz)){const sl=sampleLight(wx+1,y,wz);cubeFace(arr,wx,y,wz,4,side,SHADE.px,sl[0],sl[1]);}
    if(vis(wx-1,y,wz)){const sl=sampleLight(wx-1,y,wz);cubeFace(arr,wx,y,wz,5,side,SHADE.nx,sl[0],sl[1]);}
  }
  const data=new Float32Array(arr);
  if(!ch.buf)ch.buf=gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,ch.buf);gl.bufferData(gl.ARRAY_BUFFER,data,gl.DYNAMIC_DRAW);
  ch.count=arr.length/8;ch.dirty=false;
}
function meshShape(arr,x,y,z,id,d,meta){const sl=sampleLight(x,y,z);const shape=d.shape;const tile=d.s;
  if(shape==='slab'){const top=(meta&1)?[[0,0.5,0],[1,1,1]]:[[0,0,0],[1,0.5,1]];boxShape(arr,x,y,z,top[0],top[1],tile,sl);return;}
  if(shape==='torch'){boxShape(arr,x,y,z,[0.43,0,0.43],[0.57,0.55,0.57],tile,[Math.max(sl[0],0.2),Math.max(sl[1],0.9)]);return;}
  if(shape==='ladder'){const f=meta&3;const t=0.08;const box={0:[[0,0,1-t],[1,1,1]],1:[[0,0,0],[1,1,t]],2:[[1-t,0,0],[1,1,1]],3:[[0,0,0],[t,1,1]]}[f];boxShape(arr,x,y,z,box[0],box[1],tile,sl);return;}
  if(shape==='pane'){const t=0.07,c=0.5;boxShape(arr,x,y,z,[0.5-t/2,0,0],[0.5+t/2,1,1],tile,sl);boxShape(arr,x,y,z,[0,0,0.5-t/2],[1,1,0.5+t/2],tile,sl);return;}
  if(shape==='fence'){boxShape(arr,x,y,z,[0.375,0,0.375],[0.625,1,0.625],tile,sl);boxShape(arr,x,y,z,[0.4,0.2,0],[0.6,0.85,1],tile,sl);boxShape(arr,x,y,z,[0,0.2,0.4],[1,0.85,0.6],tile,sl);return;}
  if(shape==='door'){const open=(meta&4),f=meta&3;const t=0.18;let box;if(!open){box={0:[[0,0,0],[1,1,t]],1:[[0,0,1-t],[1,1,1]],2:[[0,0,0],[t,1,1]],3:[[1-t,0,0],[1,1,1]]}[f];}else{box={0:[[0,0,0],[t,1,1]],1:[[1-t,0,0],[1,1,1]],2:[[0,0,1-t],[1,1,1]],3:[[0,0,0],[1,1,t]]}[f];}boxShape(arr,x,y,z,box[0],box[1],tile,sl);return;}
  if(shape==='stairs'){const f=meta&3;boxShape(arr,x,y,z,[0,0,0],[1,0.5,1],tile,sl);const q={0:[[0,0.5,0],[1,1,0.5]],1:[[0,0.5,0.5],[1,1,1]],2:[[0,0.5,0],[0.5,1,1]],3:[[0.5,0.5,0],[1,1,1]]}[f];boxShape(arr,x,y,z,q[0],q[1],tile,sl);return;}
  if(shape==='bed'){boxShape(arr,x,y,z,[0,0,0],[1,0.55,1],tile,sl);return;}
  // fallback small box
  boxShape(arr,x,y,z,[0.1,0,0.1],[0.9,1,0.9],tile,sl);
}

/* streaming */
let RENDER_DIST=6;
function streamChunks(budgetGen,budgetMesh){
  const pcx=Math.floor(player.pos[0]/CH),pcz=Math.floor(player.pos[2]/CH);
  let gens=0,meshes=0;const need=[];
  for(let dx=-RENDER_DIST;dx<=RENDER_DIST;dx++)for(let dz=-RENDER_DIST;dz<=RENDER_DIST;dz++){
    const dist=dx*dx+dz*dz;if(dist>(RENDER_DIST+0.5)*(RENDER_DIST+0.5))continue;need.push([pcx+dx,pcz+dz,dist]);}
  need.sort((a,b)=>a[2]-b[2]);
  for(const[cx,cz]of need){const ch=chunks.get(ckey(cx,cz));if(!ch||!ch.blocks){if(gens<budgetGen){ensureGen(cx,cz);gens++;}}}
  for(const[cx,cz]of need){const ch=chunks.get(ckey(cx,cz));if(ch&&ch.blocks&&ch.dirty){
    // need neighbors generated for correct borders
    ensureGen(cx+1,cz);ensureGen(cx-1,cz);ensureGen(cx,cz+1);ensureGen(cx,cz-1);
    if(meshes<budgetMesh){meshChunk(ch,cx,cz);meshes++;}}}
  // unload far chunks
  const keep=RENDER_DIST+3;
  for(const[k,ch]of chunks){const p=k.split(',');const cx=+p[0],cz=+p[1];if(Math.abs(cx-pcx)>keep||Math.abs(cz-pcz)>keep){if(ch.buf)gl.deleteBuffer(ch.buf);chunks.delete(k);}}
}

/* ----------------------------- player ----------------------------- */
const player={pos:[0,0,0],vel:[0,0,0],yaw:0,pitch:0,onGround:false,fly:false,hp:20,maxhp:20,hunger:20,maxh:20,exhaust:0,hurtCd:0,W:0.6,H:1.8,EYE:1.62,inWater:false};
let MODE='survival',DIFF='normal',WORLDNAME="Adyah's World",dayNum=1,dayTime=0.27,spawnPoint=null;
let treasureSpots={},treasuresFound=0;
// loot table for buried treasure / dungeon chests
function rollLoot(rng){const pool=[[104,1,3],[103,2,5],[102,2,6],[101,3,8],[105,2,4],[152,1,3],[42,2,5],[27,1,2],[133,1,1],[130,1,1],[30,1,2],[31,1,1],[153,2,4],[18,4,8],[158,1,3],[159,1,1],[54,2,4],[53,4,8],[52,4,8],[140,1,1]];
  const items=[];const n=3+((rng()*4)|0);for(let i=0;i<n;i++){const p=pool[(rng()*pool.length)|0];const c=p[1]+((rng()*(p[2]-p[1]+1))|0);items.push({id:p[0],count:c});}return items;}
function chunkTreasure(cx,cz){if(hash3(cx,7777,cz)<0.93)return null;const lx=2+((hash3(cx,1,cz)*12)|0),lz=2+((hash3(cx,2,cz)*12)|0);return{lx,lz};}
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function padTo27(items){const a=new Array(27).fill(null);for(let i=0;i<items.length&&i<27;i++)a[i]=items[i];return a;}
const DIFFS={peaceful:{mobs:false,dmg:0,hunger:0,regen:1,starve:0},easy:{mobs:true,dmg:.6,hunger:.6,regen:1,starve:1},normal:{mobs:true,dmg:1,hunger:1,regen:.5,starve:1},hard:{mobs:true,dmg:1.6,hunger:1.35,regen:.3,starve:0}};
function df(){return DIFFS[DIFF];}
function frontVec(){const cp=Math.cos(player.pitch),sp=Math.sin(player.pitch),sy=Math.sin(player.yaw),cy=Math.cos(player.yaw);return[cp*sy,sp,-cp*cy];}
function hits(px,py,pz){const hw=player.W/2;for(let x=Math.floor(px-hw);x<=Math.floor(px+hw);x++)for(let y=Math.floor(py);y<=Math.floor(py+player.H);y++)for(let z=Math.floor(pz-hw);z<=Math.floor(pz+hw);z++)if(solidAt(x,y,z))return true;return false;}
function moveAxis(axis,amt){const steps=Math.max(1,Math.ceil(Math.abs(amt)/0.2)),inc=amt/steps;for(let i=0;i<steps;i++){const t=player.pos.slice();t[axis]+=inc;if(hits(t[0],t[1],t[2])){if(axis===1){if(inc<0)player.onGround=true;player.vel[1]=0;}return;}player.pos[axis]=t[axis];}}
const keys={};
function updatePlayer(dt){
  const eyeB=getBlock(Math.floor(player.pos[0]),Math.floor(player.pos[1]+player.EYE),Math.floor(player.pos[2]));
  player.inWater=(getBlock(Math.floor(player.pos[0]),Math.floor(player.pos[1]),Math.floor(player.pos[2]))===11);
  const sprint=(keys['ShiftLeft']&&!player.fly&&MODE!=='creativeNoSprint')?1.45:1;
  if(player.slowT>0)player.slowT-=dt; if(player._bowCd>0)player._bowCd-=dt; if(viewSwing>0)viewSwing-=dt;
  let speed=(player.fly?9:(player.inWater?3.2:4.6))*sprint*(player.slowT>0?0.45:1);
  const fx=Math.sin(player.yaw),fz=-Math.cos(player.yaw),rx=Math.cos(player.yaw),rz=Math.sin(player.yaw);let mx=0,mz=0;
  if(keys['KeyW']){mx+=fx;mz+=fz;}if(keys['KeyS']){mx-=fx;mz-=fz;}if(keys['KeyD']){mx+=rx;mz+=rz;}if(keys['KeyA']){mx-=rx;mz-=rz;}
  const ml=Math.hypot(mx,mz);if(ml>0){mx/=ml;mz/=ml;player.exhaust+=dt*(sprint>1?0.06:0.03);}
  player.onGround=false;moveAxis(0,mx*speed*dt);moveAxis(2,mz*speed*dt);
  const onLad=!player.fly&&(getBlock(Math.floor(player.pos[0]),Math.floor(player.pos[1]),Math.floor(player.pos[2]))===48||getBlock(Math.floor(player.pos[0]),Math.floor(player.pos[1]+1),Math.floor(player.pos[2]))===48);
  if(player.fly){let vy=0;if(keys['Space'])vy+=speed*dt;if(keys['ShiftLeft'])vy-=speed*dt;moveAxis(1,vy);}
  else if(onLad){player.vel[1]=0;let vy=keys['KeyW']?2.6:(keys['KeyS']||keys['ShiftLeft'])?-2.6:-0.7;moveAxis(1,vy*dt);if(keys['Space']){player.vel[1]=6;player.onGround=false;}}
  else{const g=player.inWater?8:24;player.vel[1]-=g*dt;const term=player.inWater?-6:-40;if(player.vel[1]<term)player.vel[1]=term;moveAxis(1,player.vel[1]*dt);
    if(keys['Space']){if(player.onGround){player.vel[1]=8.4;player.onGround=false;player.exhaust+=0.05;}else if(player.inWater){player.vel[1]=4;}}}
  if(player.pos[1]<-20)hurt(8,'void');
  if(player.hurtCd>0)player.hurtCd-=dt;
  // cactus contact
  for(let x=Math.floor(player.pos[0]-0.3);x<=Math.floor(player.pos[0]+0.3);x++)for(let z=Math.floor(player.pos[2]-0.3);z<=Math.floor(player.pos[2]+0.3);z++){if(getBlock(x,Math.floor(player.pos[1]+0.5),z)===23)hurt(1,'mob');}
  // hunger & regen (survival only)
  if(MODE==='survival'){
    if(player.exhaust>=1){player.exhaust-=1;player.hunger=Math.max(0,player.hunger - 1*df().hunger);}
    if(player.hunger>=18 && player.hp<player.maxhp){player.hp=Math.min(player.maxhp,player.hp+df().regen*dt*1.2);}
    if(player.hunger<=0 && df().starve===0){player.hp-=dt*0.6;if(player.hp<=0)die();}
    else if(player.hunger<=0 && df().starve===1){player.hp=Math.max(1,player.hp-dt*0.4);}
  } else { player.hp=player.maxhp; }
}
function hurt(n,cause){if(MODE==='creative'&&cause!=='void')return;if(player.hurtCd>0&&cause==='mob')return;n*=(cause==='mob'?df().dmg:1);if(n<=0)return;player.hp-=n;player.hurtCd=cause==='mob'?0.6:0.25;hitFlash();
  if(player.hp<=0)die();}
let dead=false;
function die(){if(dead)return;dead=true;document.exitPointerLock();paused=true;document.getElementById('death').classList.remove('hidden');for(let i=mobs.length-1;i>=0;i--)if(mobs[i].hostile)mobs.splice(i,1);}
function respawn(){dead=false;document.getElementById('death').classList.add('hidden');player.hp=player.maxhp;player.hunger=Math.max(player.hunger,10);player.vel=[0,0,0];player.pos=spawnPoint?spawnPoint.slice():findSpawn();paused=false;canvas.requestPointerLock();}

/* ----------------------------- inventory ----------------------------- */
let inv=new Array(36).fill(null); // {id,count,dur?}
let selSlot=0;
function addItem(id,count){count=count||1;
  if(MODE==='creative')return true;
  const ms=maxStack(id);
  for(let i=0;i<36;i++){const s=inv[i];if(s&&s.id===id&&s.count<ms){const add=Math.min(ms-s.count,count);s.count+=add;count-=add;if(count<=0)return true;}}
  for(let i=0;i<36;i++){if(!inv[i]){const add=Math.min(ms,count);inv[i]={id,count:add};if(id>=110)inv[i].dur=IT[id].dur;count-=add;if(count<=0)return true;}}
  return count<=0;}
function removeItems(id,count){let have=0;for(const s of inv)if(s&&s.id===id)have+=s.count;if(have<count)return false;let need=count;for(let i=0;i<36;i++){const s=inv[i];if(s&&s.id===id){const t=Math.min(s.count,need);s.count-=t;need-=t;if(s.count<=0)inv[i]=null;if(need<=0)break;}}return true;}
function countItem(id){let n=0;for(const s of inv)if(s&&s.id===id)n+=s.count;return n;}
function heldItem(){return inv[selSlot];}

/* ----------------------------- raycast ----------------------------- */
function raycast(reach){reach=reach||6;const eye=[player.pos[0],player.pos[1]+player.EYE,player.pos[2]],d=frontVec();
  let x=Math.floor(eye[0]),y=Math.floor(eye[1]),z=Math.floor(eye[2]);const sX=Math.sign(d[0]),sY=Math.sign(d[1]),sZ=Math.sign(d[2]);
  const tdx=Math.abs(1/d[0]),tdy=Math.abs(1/d[1]),tdz=Math.abs(1/d[2]);
  let tx=d[0]>0?(x+1-eye[0])/d[0]:(d[0]<0?(eye[0]-x)/-d[0]:1e9),ty=d[1]>0?(y+1-eye[1])/d[1]:(d[1]<0?(eye[1]-y)/-d[1]:1e9),tz=d[2]>0?(z+1-eye[2])/d[2]:(d[2]<0?(eye[2]-z)/-d[2]:1e9);
  let f=[0,0,0];
  for(let i=0;i<128;i++){const b=getBlock(x,y,z);if(b!==0&&!(B[b]&&B[b].liquid))return{x,y,z,id:b,px:x+f[0],py:y+f[1],pz:z+f[2]};
    if(tx<ty&&tx<tz){x+=sX;tx+=tdx;f=[-sX,0,0];}else if(ty<tz){y+=sY;ty+=tdy;f=[0,-sY,0];}else{z+=sZ;tz+=tdz;f=[0,0,-sZ];}
    if(Math.hypot(x-eye[0],y-eye[1],z-eye[2])>reach)break;}
  return null;}

/* ----------------------------- interaction ----------------------------- */
let breaking=null,breakProg=0;
function nearStation(id){const px=Math.round(player.pos[0]),py=Math.round(player.pos[1]),pz=Math.round(player.pos[2]);for(let x=px-3;x<=px+3;x++)for(let y=py-2;y<=py+2;y++)for(let z=pz-3;z<=pz+3;z++)if(getBlock(x,y,z)===id)return true;return false;}
function miningTime(blockId,held){const d=B[blockId];if(!d)return 0.2;if(d.hard===Infinity)return Infinity;let base=d.hard;
  const t=toolOf(held);let mult=4;
  if(t&&t.tool===d.tool&&d.tool!==0){mult = t.tier>= (d.tier||1)? (1.5 - t.tier*0.18) : 3;}
  else if(d.tool===0){mult=1;}
  return Math.max(0.05, base*mult*0.5);}
function canDrop(blockId,held){const d=B[blockId];if(!d||!d.drop)return false;if(d.tool&&d.tool!==0){const t=toolOf(held);const need=d.tier||1;if(!t||t.tool!==d.tool||t.tier<need)return false;}return true;}
function startBreak(){const hit=raycast();if(!hit){breaking=null;return;}
  if(hit.id===28){toast('Bedrock is unbreakable');breaking=null;return;}
  if(!breaking||breaking.x!==hit.x||breaking.y!==hit.y||breaking.z!==hit.z){breaking={x:hit.x,y:hit.y,z:hit.z,id:hit.id};breakProg=0;}
}
function updateBreak(dt){
  const bw=document.getElementById('breakwrap');
  if(!mouseDown||paused||invOpen){breaking=null;bw.classList.remove('show');return;}
  const hit=raycast();
  const mob=mobInAim();
  if(mob){breaking=null;bw.classList.remove('show');return;} // attacking instead
  if(!hit){breaking=null;bw.classList.remove('show');return;}
  if(!breaking||breaking.x!==hit.x||breaking.y!==hit.y||breaking.z!==hit.z){breaking={x:hit.x,y:hit.y,z:hit.z,id:hit.id};breakProg=0;}
  if(hit.id===28){bw.classList.remove('show');return;}
  const held=heldItem()&&heldItem().id;
  if(MODE==='creative'){mineBlock(hit.x,hit.y,hit.z,hit.id,true);breaking=null;bw.classList.remove('show');return;}
  const time=miningTime(hit.id,held);
  breakProg+=dt;bw.classList.add('show');document.getElementById('breakbar').style.width=Math.min(100,breakProg/time*100)+'%';
  if(breakProg>=time){mineBlock(hit.x,hit.y,hit.z,hit.id,false);breaking=null;breakProg=0;bw.classList.remove('show');}
}
function mineBlock(x,y,z,id,creative){const held=heldItem()&&heldItem().id;const d=B[id];
  if(!creative){
    if(d.crop){const m=getMeta(x,y,z),mature=m>=7;
      if(d.crop==='wheat'){addItem(150,1+(Math.random()*2|0));if(mature)addItem(151,1);}
      else if(d.crop==='carrot'){addItem(154,mature?2+(Math.random()*2|0):1);}
      else if(d.crop==='potato'){addItem(155,mature?2+(Math.random()*2|0):1);}
    } else if(id===34){ if(Math.random()>0.7)addItem(150,1); }
    else if(id===56){ addItem(157,1+(Math.random()*2|0)); }
    else if(canDrop(id,held)){let drop=d.drop;if(id===10){const r=Math.random();drop=r>0.92?105:r>0.8?100:0;}if(drop)addItem(drop,1);damageTool(held,d.tool);}
  }
  if(id===21||id===20){const be=getBE(x,y,z);if(be){const all=[].concat(be.items||[],be.input?[be.input]:[],be.fuel?[be.fuel]:[],be.output?[be.output]:[]);for(const s of all)if(s)addItem(s.id,s.count);blockEntities.delete(bekey(x,y,z));}}
  setBlock(x,y,z,0);sfx('break');spawnParticles(x+0.5,y+0.5,z+0.5,blkCol(id),12,{spd:2.5,up:2.5,ttl:0.7,size:0.1,grav:18});
  const above=getBlock(x,y+1,z);if(above&&B[above]&&(B[above].shape==='cross')){setBlock(x,y+1,z,0);}
  else if(above&&B[above]&&B[above].grav)collapse(x,y+1,z);
}
/* crop growth */
let growAcc=0;
function nearWater(wx,wy,wz){for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++)if(getBlock(wx+dx,wy-1,wz+dz)===11)return true;return false;}
function tickGrowth(dt){growAcc+=dt;if(growAcc<2)return;growAcc=0;const pcx=Math.floor(player.pos[0]/CH),pcz=Math.floor(player.pos[2]/CH);let changed=false;
  for(const[k,ch]of chunks){if(!ch.blocks)continue;const p=k.split(',');const cx=+p[0],cz=+p[1];if(Math.abs(cx-pcx)>3||Math.abs(cz-pcz)>3)continue;
    for(let t=0;t<8;t++){const lx=(Math.random()*CH)|0,lz=(Math.random()*CH)|0,y=(Math.random()*H)|0;const idx=lidx(lx,y,lz);const id=ch.blocks[idx];
      if(B[id]&&B[id].crop){const m=ch.meta[idx];if(m<7){const wx=cx*CH+lx,wz=cz*CH+lz;if(Math.random()<(nearWater(wx,y,wz)?0.7:0.35)){ch.meta[idx]=m+1;ch.dirty=true;const ed=editStore.get(k)||(editStore.set(k,new Map()).get(k));ed.set(idx,id|((m+1)<<8));changed=true;}}}}}
  if(changed)scheduleSave();
}
function collapse(x,y,z){const id=getBlock(x,y,z);let ny=y;while(getBlock(x,ny-1,z)===0&&ny>1)ny--;if(ny!==y){setBlock(x,y,z,0);setBlock(x,ny,z,id);}}
function damageTool(id){if(!id||id<110)return;const s=heldItem();if(!s||s.id!==id)return;if(s.dur===undefined)s.dur=IT[id].dur;s.dur-=1;if(s.dur<=0){inv[selSlot]=null;sfx('break');}}
function facingFromYaw(){const fx=Math.sin(player.yaw),fz=-Math.cos(player.yaw);if(Math.abs(fx)>Math.abs(fz))return fx>0?3:2;return fz>0?1:0;}
function consume(item){if(MODE!=='creative'){item.count--;if(item.count<=0)inv[selSlot]=null;}renderHotbar();}
function placeBlock(){const item=heldItem();if(!item)return;const id=item.id;if(id>=100)return;const d=B[id];if(!d)return;
  const hit=raycast();if(!hit)return;const tx=hit.px,ty=hit.py,tz=hit.pz;
  if(getBlock(tx,ty,tz)!==0)return;
  if(solidShape(id,0)&&playerBox(tx,ty,tz))return;
  for(const m of mobs)if(Math.floor(m.pos[0])===tx&&Math.floor(m.pos[2])===tz&&Math.abs(m.pos[1]-ty)<2)return;
  if(d.shape==='cross'&&!solidAt(tx,ty-1,tz))return;
  let meta=0;const f=facingFromYaw();
  if(d.shape==='stairs'||d.shape==='door')meta=f;
  else if(d.shape==='ladder'){const nx=hit.x-tx,nz=hit.z-tz;meta=nx>0?2:nx<0?3:nz>0?0:1;}
  setBlock(tx,ty,tz,id,meta);
  if(id===21)blockEntities.set(bekey(tx,ty,tz),{type:'chest',items:new Array(27).fill(null)});
  else if(id===20)blockEntities.set(bekey(tx,ty,tz),{type:'furnace',input:null,fuel:null,output:null,prog:0});
  sfx('place');consume(item);}
function useOrPlace(){const hit=raycast();const item=heldItem();
  const aim=mobInAim();
  if(aim){
    if(aim.animal&&item&&(item.id===150||item.id===151||item.id===154)){aim.love=20;consume(item);toast('❤️');sfx('place');return;}
    if(!aim.hostile&&!aim.animal){greetVillager(aim);return;}
  }
  if(hit){const tid=getBlock(hit.x,hit.y,hit.z);
    if(tid===47){toggleDoor(hit.x,hit.y,hit.z);return;}
    if(tid===51){sleepInBed();return;}
    if(tid===21){openChest(hit.x,hit.y,hit.z);return;}
    if(tid===20){openFurnace(hit.x,hit.y,hit.z);return;}}
  if(item){const it=item.id>=100?IT[item.id]:null;
    if(it&&it.tool===4&&hit){const tid=getBlock(hit.x,hit.y,hit.z);if(tid===3||tid===2){setBlock(hit.x,hit.y,hit.z,33,0);damageTool(item.id);sfx('place');return;}}
    if(it&&it.plant&&hit){if(getBlock(hit.px,hit.py,hit.pz)===0&&getBlock(hit.px,hit.py-1,hit.pz)===33){setBlock(hit.px,hit.py,hit.pz,it.plant,0);consume(item);sfx('place');return;}}
    if(item.id===153&&hit){const tid=getBlock(hit.x,hit.y,hit.z);if(B[tid]&&B[tid].crop){setMeta(hit.x,hit.y,hit.z,7);consume(item);sfx('place');return;}}
    if(it&&it.heal){eatHeld();return;}
    if(item.id<100){placeBlock();return;}}
}
function toggleDoor(x,y,z){setMeta(x,y,z,getMeta(x,y,z)^4);sfx('place');}
function sleepInBed(){if(isNight()){dayTime=0.27;dayNum++;toast('You slept. Good morning!');spawnPoint=[player.pos[0],player.pos[1]+0.2,player.pos[2]];scheduleSave();}else toast('You can only sleep at night.');}
function playerBox(x,y,z){const hw=player.W/2,p=player.pos;return x>=Math.floor(p[0]-hw)&&x<=Math.floor(p[0]+hw)&&z>=Math.floor(p[2]-hw)&&z<=Math.floor(p[2]+hw)&&y>=Math.floor(p[1])&&y<=Math.floor(p[1]+player.H);}
function eatHeld(){const s=heldItem();if(!s)return;const it=IT[s.id];if(it&&it.heal){player.hunger=Math.min(player.maxh,player.hunger+it.heal);player.hp=Math.min(player.maxhp,player.hp+2);s.count--;if(s.count<=0)inv[selSlot]=null;sfx('place');toast('Ate '+it.n);renderHotbar();}}

/* ----------------------------- block entities: chest & furnace ----------------------------- */
const blockEntities=new Map();
const bekey=(x,y,z)=>x+','+y+','+z;
let openBE=null;
const SMELT={160:161,162:163,164:165,5:18,15:102,16:103,192:173,193:181,187:24}; // raw meat->cooked, sand->glass, ore->ingot, mutton/fish, clay->brick
const FUEL={101:1,9:1,8:1,100:1,4:0}; // valid fuels (coal, planks, log, stick)
function getBE(x,y,z){return blockEntities.get(bekey(x,y,z));}
function beCell(s,onClick){const c=document.createElement('div');c.className='cell';if(s){c.appendChild(itemIcon(s.id,34));if(s.count>1)c.insertAdjacentHTML('beforeend',`<span class="ct">${s.count}</span>`);}c.onclick=onClick;return c;}
function closeBEUI(){const cu=document.getElementById('chestui'),fu=document.getElementById('furnaceui');if(cu)cu.classList.add('hidden');if(fu)fu.classList.add('hidden');openBE=null;invOpen=false;if(started&&!paused&&!dead)canvas.requestPointerLock();}
// chest
function openChest(x,y,z){let be=getBE(x,y,z);if(!be){be={type:'chest',items:new Array(27).fill(null)};blockEntities.set(bekey(x,y,z),be);}
  if(be.treasure&&!be.opened){be.opened=1;treasuresFound++;toast('✨ Treasure found! ('+treasuresFound+' total) ✨');sfx('xp');scheduleSave();}
  const ct=document.getElementById('chesttitle');if(ct)ct.textContent=be.treasure?'💎 Treasure Chest':'Chest';
  openBE={x,y,z};invOpen=true;if(document.pointerLockElement)document.exitPointerLock();document.getElementById('chestui').classList.remove('hidden');renderChest();}
function renderChest(){const be=getBE(openBE.x,openBE.y,openBE.z);if(!be)return;const cg=document.getElementById('chestgrid'),pg=document.getElementById('chestplayer');cg.innerHTML='';pg.innerHTML='';
  be.items.forEach((s,i)=>cg.appendChild(beCell(s,()=>{const it=be.items[i];if(it){if(addItem(it.id,it.count))be.items[i]=null;renderChest();renderHotbar();scheduleSave();}})));
  for(let i=0;i<36;i++)pg.appendChild(beCell(inv[i],()=>{const s=inv[i];if(!s)return;for(let j=0;j<27;j++){if(!be.items[j]){be.items[j]=s;inv[i]=null;break;}else if(be.items[j].id===s.id&&be.items[j].count<maxStack(s.id)){be.items[j].count+=s.count;inv[i]=null;break;}}renderChest();renderHotbar();scheduleSave();}));}
// furnace
function openFurnace(x,y,z){let be=getBE(x,y,z);if(!be){be={type:'furnace',input:null,fuel:null,output:null,prog:0};blockEntities.set(bekey(x,y,z),be);}openBE={x,y,z};invOpen=true;if(document.pointerLockElement)document.exitPointerLock();document.getElementById('furnaceui').classList.remove('hidden');renderFurnace();}
function setFSlot(id,s,onClick){const el=document.getElementById(id);el.innerHTML='';if(s){el.appendChild(itemIcon(s.id,34));if(s.count>1)el.insertAdjacentHTML('beforeend',`<span class="ct">${s.count}</span>`);}el.onclick=onClick;}
function renderFurnace(){const be=getBE(openBE.x,openBE.y,openBE.z);if(!be)return;
  setFSlot('f-input',be.input,()=>{if(be.input){if(addItem(be.input.id,be.input.count))be.input=null;renderFurnace();renderHotbar();scheduleSave();}});
  setFSlot('f-fuel',be.fuel,()=>{if(be.fuel){if(addItem(be.fuel.id,be.fuel.count))be.fuel=null;renderFurnace();renderHotbar();scheduleSave();}});
  setFSlot('f-output',be.output,()=>{if(be.output){if(addItem(be.output.id,be.output.count))be.output=null;renderFurnace();renderHotbar();scheduleSave();}});
  document.getElementById('f-prog').style.width=Math.min(100,(be.prog/3*100))+'%';
  const pg=document.getElementById('furnplayer');pg.innerHTML='';for(let i=0;i<36;i++)pg.appendChild(beCell(inv[i],()=>{const s=inv[i];if(!s)return;const slot=(FUEL[s.id]!==undefined)?'fuel':'input';if(!be[slot]){be[slot]={id:s.id,count:s.count};inv[i]=null;}else if(be[slot].id===s.id){be[slot].count+=s.count;inv[i]=null;}renderFurnace();renderHotbar();scheduleSave();}));}
function tickFurnaces(dt){let needRender=false;for(const[k,be]of blockEntities){if(be.type!=='furnace')continue;
  const can=be.input&&SMELT[be.input.id]!==undefined&&be.fuel&&(!be.output||(be.output.id===SMELT[be.input.id]&&be.output.count<64));
  if(can){be.prog+=dt;if(be.prog>=3){be.prog=0;const out=SMELT[be.input.id];be.input.count--;if(be.input.count<=0)be.input=null;be.fuel.count--;if(be.fuel.count<=0)be.fuel=null;if(be.output)be.output.count++;else be.output={id:out,count:1};needRender=true;scheduleSave();}}
  else if(be.prog>0)be.prog=Math.max(0,be.prog-dt);}
  if(needRender&&openBE&&!document.getElementById('furnaceui').classList.contains('hidden'))renderFurnace();}

/* ----------------------------- mobs ----------------------------- */
const mobs=[];
const projectiles=[];
function spawnProjectile(x,y,z,dx,dy,dz,spd,dmg,col,owner){projectiles.push({pos:[x,y,z],vel:[dx*spd,dy*spd,dz*spd],life:owner==='player'?2.6:3,dmg:dmg,col:col||[1.4,0.6,0.15],owner:owner||'mob',arrow:owner==='player'});}
function updateProjectiles(dt){for(let i=projectiles.length-1;i>=0;i--){const p=projectiles[i];p.life-=dt;p.pos[0]+=p.vel[0]*dt;p.pos[1]+=p.vel[1]*dt;p.pos[2]+=p.vel[2]*dt;
  if(p.life<=0){projectiles.splice(i,1);continue;}
  if(solidAt(Math.floor(p.pos[0]),Math.floor(p.pos[1]),Math.floor(p.pos[2]))){projectiles.splice(i,1);continue;}
  if(p.owner==='player'){let hit=null;for(const m of mobs){if(m.dead||!m.hostile)continue;const ex=p.pos[0]-m.pos[0],ey=p.pos[1]-(m.pos[1]+m.H*0.5),ez=p.pos[2]-m.pos[2],r=m.W*0.6+0.35;if(ex*ex+ey*ey+ez*ez<r*r){hit=m;break;}}
    if(hit){showHit(p.dmg,hit.hp-p.dmg<=0);damageMob(hit,p.dmg);projectiles.splice(i,1);}}
  else{const ddx=p.pos[0]-player.pos[0],ddy=p.pos[1]-(player.pos[1]+1.0),ddz=p.pos[2]-player.pos[2];if(ddx*ddx+ddy*ddy+ddz*ddz<1.3){if(!dead)hurt(p.dmg,'mob');projectiles.splice(i,1);}}}}
/* ----------------------------- particles ----------------------------- */
const particles=[];
const BLKCOL={1:[0.5,0.5,0.52],2:[0.55,0.4,0.25],3:[0.42,0.66,0.32],4:[0.46,0.46,0.48],5:[0.85,0.78,0.55],6:[0.82,0.74,0.5],7:[0.5,0.48,0.46],8:[0.55,0.42,0.26],10:[0.7,0.55,0.32],16:[0.2,0.2,0.22],17:[0.74,0.62,0.5],18:[0.95,0.8,0.3],19:[0.4,0.85,0.95]};
function blkCol(id){return BLKCOL[id]||[0.55,0.5,0.45];}
function spawnParticles(x,y,z,col,count,o){o=o||{};const spd=o.spd||3,up=o.up||3,size=o.size||0.09,ttl=o.ttl||0.6,grav=o.grav==null?20:o.grav;
  for(let i=0;i<count;i++){const a=Math.random()*6.28,r=Math.random()*spd;
    particles.push({pos:[x+(Math.random()-0.5)*0.3,y+(Math.random()-0.5)*0.3,z+(Math.random()-0.5)*0.3],vel:[Math.cos(a)*r,up*(0.4+Math.random()),Math.sin(a)*r],life:ttl*(0.7+Math.random()*0.6),ttl:ttl,col:[col[0]*(0.85+Math.random()*0.3),col[1]*(0.85+Math.random()*0.3),col[2]*(0.85+Math.random()*0.3)],size:size*(0.7+Math.random()*0.7),grav:grav});}
  if(particles.length>500)particles.splice(0,particles.length-500);}
function deathBurst(m){const cy=m.pos[1]+(m.H||1.5)*0.5,base=(m.char&&typeof CHARS!=='undefined'&&CHARS[m.char]&&MONCOL[CHARS[m.char].person])||[0.85,0.8,0.7],n=m.boss?44:18;
  spawnParticles(m.pos[0],cy,m.pos[2],base,n,{spd:m.boss?7:4.5,up:m.boss?6:4,ttl:m.boss?1.3:0.8,size:m.boss?0.24:0.14,grav:14});
  spawnParticles(m.pos[0],cy,m.pos[2],[1,1,1],(n*0.5)|0,{spd:3,up:3,ttl:0.6,size:0.12,grav:6});
  if(m.hostile||m.boss){spawnParticles(m.pos[0],cy,m.pos[2],[0.62,0.04,0.05],m.boss?60:30,{spd:m.boss?6.5:4.2,up:m.boss?3.5:2.6,ttl:1.0,size:m.boss?0.19:0.13,grav:24});}}
function emitBladeGlow(){const f=frontVec(),right=[view[0],view[4],view[8]],up=[view[1],view[5],view[9]];const eye=[player.pos[0],player.pos[1]+player.EYE,player.pos[2]];
  const d=0.95,rx=0.5,ry=-0.45;
  const bx=eye[0]+f[0]*d+right[0]*rx+up[0]*ry,by=eye[1]+f[1]*d+right[1]*rx+up[1]*ry,bz=eye[2]+f[2]*d+right[2]*rx+up[2]*ry;
  const burst=(viewSwing>0)?5:1;
  for(let i=0;i<burst;i++)particles.push({pos:[bx+(Math.random()-0.5)*0.28,by+(Math.random()-0.5)*0.28,bz+(Math.random()-0.5)*0.28],vel:[(Math.random()-0.5)*0.8,0.25+Math.random()*0.5,(Math.random()-0.5)*0.8],life:0.28+Math.random()*0.22,ttl:0.5,col:[1.95,1.55,0.55],size:0.028+Math.random()*0.03,grav:0.7});}
function updateParticles(dt){for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.life-=dt;if(p.life<=0){particles.splice(i,1);continue;}p.vel[1]-=p.grav*dt;p.pos[0]+=p.vel[0]*dt;p.pos[1]+=p.vel[1]*dt;p.pos[2]+=p.vel[2]*dt;}}
function drawParticles(){if(!particles.length)return;const V=[];for(const p of particles){const s=p.size*Math.max(0.25,p.life/p.ttl);pushBox(V,p.pos[0],p.pos[2],0,0,s,s,p.pos[1]-s,p.pos[1]+s,p.col,null,0,0,0,0);}if(V.length)drawModelV(V);}
function damageMob(m,dmg){m.hp-=dmg;m.hurtCd=0.25;if(m.animal)m.flee=6;spawnParticles(m.pos[0],m.pos[1]+(m.H||1.5)*0.5,m.pos[2],[1,0.85,0.3],6,{spd:2.4,up:2,ttl:0.35,size:0.07,grav:10});if(m.hostile||m.boss)spawnParticles(m.pos[0],m.pos[1]+(m.H||1.5)*0.5,m.pos[2],[0.62,0.04,0.05],9,{spd:3,up:1.6,ttl:0.5,size:0.09,grav:22});const dx=m.pos[0]-player.pos[0],dz=m.pos[2]-player.pos[2],dl=Math.hypot(dx,dz)||1;m.pos[0]+=dx/dl*0.4;m.pos[2]+=dz/dl*0.4;
  if(m.hp<=0){m.dead=1;sfx('xp');deathBurst(m);if(m.hostile){if(Math.random()>0.6)addItem(105,1);if(m.type==='dragon'){addItem(183,2);addItem(197,1);addItem(103,5);addItem(159,2);toast('🐉 DRAGON SLAIN!  Loot: Dragon Scale ×2, Dragon Egg, Gold ×5!');}else if(m.type==='spider')addItem(185,2);else if(m.type==='skeleton')addItem(156,2);else if(m.type==='demon'){addItem(186,2);addItem(184,1);}else if(m.type==='slimeking')addItem(182,4);try{questEvent('kill',m.type);}catch(e){}}else if(m.animal){animalDrops(m);}else if(m.fam){toast('Be nice to '+m.fam+'! 😟');}}}
function spawnMob(type,x,y,z){const dm=df().dmg||1;const day=1+dayNum*0.04;
  const m={pos:[x,y,z],vel:[0,0,0],onGround:false,type,hostile:true,hurtCd:0,atkCd:0,W:0.6,H:1.8};
  if(type==='zombie'){m.spr=SP.zombie;m.char=charFor('monster_ogre');m.hp=22*day;m.dmg=4*dm;m.speed=2.0;m.W=1.0;m.H=2.0;}
  else if(type==='spider'){m.spr=SP.spider;m.char=charFor('monster_spider');m.hp=14*day;m.dmg=2*dm;m.speed=3.2;m.W=1.4;m.H=1.3;}
  else if(type==='skeleton'){m.spr=SP.skeleton;m.char=charFor('monster_alien');m.hp=16*day;m.dmg=3*dm;m.speed=2.3;m.ranged=1;m.proj='bolt';m.W=0.9;m.H=1.8;}
  else if(type==='dragon'){m.char=charFor('monster_dragon');m.hp=60*day;m.dmg=7*dm;m.speed=2.8;m.W=1.7;m.H=2.9;m.boss=1;m.flying=1;m.ranged=1;m._ph=Math.random()*6.28;}
  else if(type==='demon'){m.char=charFor('monster_demon');m.hp=30*day;m.dmg=5*dm;m.speed=2.4;m.ranged=1;m.proj='fire';m.W=1.1;m.H=2.2;}
  else if(type==='slimeking'){m.char=charFor('monster_slimeking');m.hp=40*day;m.dmg=3*dm;m.speed=1.6;m.W=1.7;m.H=1.7;}
  else if(type==='villager'){m.hostile=false;m.hp=20;m.speed=1.2;m.wt=0;m.char=villagerChar();m.W=0.7;m.H=1.8;m.fam=(CHARS[m.char]?CHARS[m.char].person:'').replace(/^\w/,c=>c.toUpperCase());}
  else if(type==='hero'){m.hostile=false;m.hp=20;m.speed=1;m.hero=1;m.wt=0;m.fam='Adyah';m.char=charFor('adyah_villager');m.W=0.7;m.H=1.85;}
  else if(type==='momV'){m.hostile=false;m.hp=20;m.speed=1.2;m.wt=0;m.fam='Mom';m.char=charFor('mom_villager');m.W=0.7;m.H=1.8;}
  else if(type==='dadV'){m.hostile=false;m.hp=20;m.speed=1.1;m.wt=0;m.fam='Dad';m.char=charFor('dad_villager');m.W=0.7;m.H=1.8;}
  else if(type==='aaravV'){m.hostile=false;m.hp=16;m.speed=1.4;m.wt=0;m.fam='Aarav';m.char=charFor('aarav_villager');m.W=0.7;m.H=1.7;}
  else if(type==='classicV'){m.hostile=false;m.hp=20;m.speed=1.0;m.wt=0;m.classic=1;m.W=0.7;m.H=1.85;m.fam='Villager';}
  else if(['pig','cow','sheep','chicken','wpig','wchk'].includes(type)){m.hostile=false;m.animal=type;m.baseAnimal={wpig:'pig',wchk:'chicken'}[type]||type;m.hp=10;m.speed=1.4;m.wt=0;m.W=0.7;m.H=(type==='chicken'||type==='wchk')?0.7:1.0;m.flee=0;m.love=0;m.egg=4+Math.random()*6;m.spr={pig:SP.pig,cow:SP.cow,sheep:SP.sheep,chicken:SP.chicken,wpig:SP.wpig,wchk:SP.wchk}[type];}
  m.maxhp=m.hp;mobs.push(m);return m;}
function updateBossBar(){const el=document.getElementById('bossbar');if(!el)return;let boss=null,bd=1e9;for(const m of mobs){if(m.boss&&!m.dead){const d=Math.hypot(m.pos[0]-player.pos[0],m.pos[2]-player.pos[2]);if(d<bd){bd=d;boss=m;}}}
  if(!boss||bd>55){el.style.display='none';return;}el.style.display='block';const f=el.querySelector('.bbfill');if(f)f.style.width=(Math.max(0,Math.min(1,boss.hp/(boss.maxhp||boss.hp)))*100)+'%';}
const ANIMAL_NAME={pig:'Pig',cow:'Cow',sheep:'Sheep',chicken:'Chicken',wpig:'Dad-Pig',wchk:'Aarav-Chicken'};
function animalDrops(m){const a=m.baseAnimal||m.animal;if(m.baby)return;
  if(a==='pig')addItem(160,1+(Math.random()*2|0));
  else if(a==='cow'){addItem(162,1+(Math.random()*2|0));addItem(166,1+(Math.random()*2|0));}
  else if(a==='sheep')addItem(169,1+(Math.random()*2|0));
  else if(a==='chicken'){addItem(164,1);addItem(167,1+(Math.random()*2|0));}
  if(m.type==='wpig'||m.type==='wchk')toast('😅 was that really a '+ANIMAL_NAME[m.type]+'?!');}
const FAM_LINES={
 Mom:['Adyah! That dragon is back — please be careful!','Take this, beta. Go show that dragon who is boss!','I will keep the garden safe. You be brave!'],
 Dad:['A real hero needs a real sword, Adyah.','The dragon is strong... but you are stronger!','Go on, son. The whole village believes in you.'],
 Aarav:['Adyah! Can I fight the dragon too? Please?','You are the bravest, Adyah!','Get the dragon! Get it!'],
 Adyah:['I am Adyah! I will protect the village!','No dragon scares me!','To adventure!']};
const VILLAGER_LINES=['We are counting on you, hero.','That dragon must be stopped!','Be careful out there, Adyah.','Bring peace back to our village!'];
function greetVillager(m){const lines=m.fam&&FAM_LINES[m.fam]?FAM_LINES[m.fam]:VILLAGER_LINES;toast((m.fam||'Villager')+': '+lines[(Math.random()*lines.length)|0]);sfx('place');try{questEvent('talk',m.fam);}catch(e){}}
/* ----------------------------- quest chain ----------------------------- */
const QUESTS=[
 {id:'meet',title:'Meet the Village',desc:'Right-click Mom, Dad and Aarav to talk to them.',need:3,prog:0,rewardText:'+3 Bread',reward(){addItem(152,3);}},
 {id:'arm',title:'Arm Yourself',desc:'Get any sword into your inventory (craft one!).',need:1,prog:0,auto:()=>hasWeapon(),rewardText:'+Stone Sword',reward(){addItem(120,1);}},
 {id:'hunt',title:'Clear the Webs',desc:'Defeat 3 spiders threatening the village.',need:3,prog:0,rewardText:'+Iron Sword',reward(){addItem(133,1);}},
 {id:'boss',title:'Defend the Village',desc:'Find and defeat the mighty Dragon!',need:1,prog:0,rewardText:'+Hero Sword & Star Shard',reward(){addItem(148,1);addItem(199,1);}},
];
let qIdx=0; const qMet=new Set();
function curQuest(){return qIdx<QUESTS.length?QUESTS[qIdx]:null;}
function hasWeapon(){for(const s of inv){if(s&&IT[s.id]&&IT[s.id].weapon)return true;}return false;}
function questAdvance(){const q=curQuest();if(!q)return;if(q.reward)q.reward();toast('🏆 Quest complete: '+q.title+'!  '+(q.rewardText||''));sfx('xp');qIdx++;const n=curQuest();if(n)setTimeout(()=>toast('📜 New quest: '+n.title),1500);try{renderHotbar();}catch(e){}}
function questEvent(type,data){const q=curQuest();if(!q)return;
  if(type==='talk'&&q.id==='meet'){if(['Mom','Dad','Aarav'].includes(data)){qMet.add(data);q.prog=qMet.size;if(q.prog>=q.need)questAdvance();}}
  else if(type==='kill'){if(q.id==='hunt'&&data==='spider'){q.prog++;if(q.prog>=q.need)questAdvance();}else if(q.id==='boss'&&data==='dragon'){q.prog++;if(q.prog>=q.need)questAdvance();}}}
function renderQuest(){const el=document.getElementById('quest');if(!el)return;
  let q=curQuest(); if(q&&q.auto&&q.prog<q.need&&q.auto()){q.prog=q.need;questAdvance();q=curQuest();}
  if(!q){el.style.display='block';el.innerHTML='<b>QUEST</b> <span class="qdone">✓ All quests done — Adyah is a legend! 🏆</span>';return;}
  el.style.display='block';const pc=q.need>1?(' ('+q.prog+'/'+q.need+')'):'';
  el.innerHTML='<b>QUEST</b> '+q.title+pc+' <span class="qd">'+q.desc+'</span>';}
let animalTimer=3,villageTimer=3;
let mobTimer=3, villagerSpawned=false;
function mobHits(m,px,py,pz){const hw=m.W/2;for(let x=Math.floor(px-hw);x<=Math.floor(px+hw);x++)for(let y=Math.floor(py);y<=Math.floor(py+m.H);y++)for(let z=Math.floor(pz-hw);z<=Math.floor(pz+hw);z++)if(solidAt(x,y,z))return true;return false;}
function mobMove(m,axis,amt){const hw=m.W/2,steps=Math.max(1,Math.ceil(Math.abs(amt)/0.25)),inc=amt/steps;for(let i=0;i<steps;i++){const p=m.pos.slice();p[axis]+=inc;if(mobHits(m,p[0],p[1],p[2])){if(axis===1){if(inc<0)m.onGround=true;m.vel[1]=0;}return;}m.pos[axis]=p[axis];}}
function updateMobs(dt){const night=isNight();
  updateProjectiles(dt);
  for(const m of mobs){
    m.hurtCd=Math.max(0,m.hurtCd-dt);m.atkCd=Math.max(0,m.atkCd-dt);
    const dx=player.pos[0]-m.pos[0],dz=player.pos[2]-m.pos[2],dist=Math.hypot(dx,dz);
    let tx=0,tz=0;
    if(m.type==='dragon'){
      const gy=surfaceY(Math.floor(m.pos[0]),Math.floor(m.pos[2]));
      if(m.diveCd==null)m.diveCd=4+Math.random()*3;
      if(m.diving>0){
        m.diving-=dt;const ix=dx/(dist||1),iz=dz/(dist||1),iy=(player.pos[1]+1)-m.pos[1];
        mobMove(m,0,ix*9.5*dt);mobMove(m,2,iz*9.5*dt);m.pos[1]+=Math.max(-10*dt,Math.min(10*dt,iy));
        if(dist<2.9&&m.atkCd<=0){hurt(Math.round(m.dmg*1.5),'mob');m.atkCd=1.0;m.diving=0;m.diveCd=5+Math.random()*4;}
        if(m.diving<=0)m.diveCd=5+Math.random()*4;
      }else{
        m.diveCd-=dt;
        let a=Math.atan2(dx,dz);if(dist<8)a+=Math.PI;else if(dist<15)a+=1.3;
        if(dist<26){mobMove(m,0,Math.sin(a)*m.speed*dt);mobMove(m,2,Math.cos(a)*m.speed*dt);}
        const hov=gy+5.5+Math.sin(performance.now()/650+(m._ph||0))*1.3;m.pos[1]+=(hov-m.pos[1])*Math.min(1,dt*2.0);
        if(m.diveCd<=0&&dist>5&&dist<18){m.diving=1.4;sfx('hurt');toast('🐉 The dragon swoops down!');}
        else if(dist<24&&m.atkCd<=0){const fx=dx,fy=(player.pos[1]+1)-(m.pos[1]+m.H*0.4),fz=dz,fl=Math.hypot(fx,fy,fz)||1;spawnProjectile(m.pos[0],m.pos[1]+m.H*0.4,m.pos[2],fx/fl,fy/fl,fz/fl,15,m.dmg,[1.6,0.55,0.12]);m.atkCd=2.4;sfx('hurt');}
      }
      m.vel[1]=0;m.onGround=false;if(m.pos[1]<-30)m.dead=1;continue;
    }
    if(m.hostile){
      if(dist<26){let a=Math.atan2(dx,dz);tx=Math.sin(a);tz=Math.cos(a);}
      if(!night && m.type!=='spider' && !m.flying){m.hp-=dt*5;if(m.hp<=0){m.dead=1;continue;}} // burn by day (except spiders/flyers)
    }else{
      if(m.flee>0){m.flee-=dt;const a=Math.atan2(-dx,-dz);tx=Math.sin(a);tz=Math.cos(a);}
      else{m.wt-=dt;if(m.wt<=0){m.wt=2+Math.random()*3;m.dir=Math.random()*6.28;m.go=Math.random()>0.4;}if(m.go){tx=Math.sin(m.dir);tz=Math.cos(m.dir);}}
      if(m.animal){if(m.love>0)m.love-=dt;if(m.baby){m.growT-=dt;if(m.growT<=0){m.baby=false;m.H/=0.6;m.W/=0.7;}}if(m.egg!==undefined){m.egg-=dt;if(m.egg<=0){m.egg=8+Math.random()*8;if((m.baseAnimal||m.animal)==='chicken'&&MODE==='survival'&&dist<6)addItem(168,1);}}}
    }
    m.onGround=false;mobMove(m,0,tx*m.speed*dt);mobMove(m,2,tz*m.speed*dt);
    if(m.flying){const gy=surfaceY(Math.floor(m.pos[0]),Math.floor(m.pos[2]));const hov=gy+5+Math.sin(performance.now()/650+(m._ph||0))*1.4;m.pos[1]+=(hov-m.pos[1])*Math.min(1,dt*2.0);m.vel[1]=0;m.onGround=false;}
    else{m.vel[1]-=24*dt;if(m.vel[1]<-40)m.vel[1]=-40;mobMove(m,1,m.vel[1]*dt);
      if(m.onGround&&(tx||tz)){const nx=m.pos[0]+tx*0.3,nz=m.pos[2]+tz*0.3;if(mobHits(m,nx,m.pos[1],nz)&&!mobHits(m,nx,m.pos[1]+1,nz))m.pos[1]+=1;}}
    if(m.pos[1]<-30)m.dead=1;
    if(m.hostile){const dy=Math.abs(player.pos[1]-m.pos[1]);
      if(m.type==='dragon'){if(dist<24&&m.atkCd<=0){const fx=player.pos[0]-m.pos[0],fy=(player.pos[1]+1)-(m.pos[1]+m.H*0.4),fz=player.pos[2]-m.pos[2],fl=Math.hypot(fx,fy,fz)||1;spawnProjectile(m.pos[0],m.pos[1]+m.H*0.4,m.pos[2],fx/fl,fy/fl,fz/fl,15,m.dmg,[1.6,0.55,0.12]);m.atkCd=2.3;sfx('hurt');}}
      else if(m.ranged&&m.proj){if(dist<17&&dist>2&&m.atkCd<=0){const fx=player.pos[0]-m.pos[0],fy=(player.pos[1]+1)-(m.pos[1]+m.H*0.6),fz=player.pos[2]-m.pos[2],fl=Math.hypot(fx,fy,fz)||1;const col=m.proj==='bolt'?[0.4,0.95,1.7]:[1.6,0.55,0.12];spawnProjectile(m.pos[0],m.pos[1]+m.H*0.6,m.pos[2],fx/fl,fy/fl,fz/fl,m.proj==='bolt'?20:14,m.dmg,col);m.atkCd=1.7;}}
      else{if(dist<1.5&&dy<2.5&&m.atkCd<=0){hurt(m.dmg,'mob');m.atkCd=0.9;if(m.type==='spider'){player.slowT=2.0;toast('🕸️ Caught in webbing! Slowed!');}}}}
  }
  // breeding: two fed animals of same kind nearby -> baby
  for(let i=0;i<mobs.length;i++){const a=mobs[i];if(!a.animal||a.love<=0||a.baby)continue;for(let j=i+1;j<mobs.length;j++){const b=mobs[j];if(!b.animal||b.love<=0||b.baby)continue;if((a.baseAnimal||a.animal)!==(b.baseAnimal||b.animal))continue;if(Math.hypot(a.pos[0]-b.pos[0],a.pos[2]-b.pos[2])<2.2){a.love=0;b.love=0;const baby=spawnMob(a.baseAnimal||a.animal,a.pos[0],a.pos[1],a.pos[2]);baby.baby=true;baby.growT=40;baby.H*=0.6;baby.W*=0.7;toast('🐣 A baby '+(a.baseAnimal||a.animal)+' was born!');break;}}}
  for(let i=mobs.length-1;i>=0;i--)if(mobs[i].dead)mobs.splice(i,1);
  // spawn the family village once near spawn
  if(!villagerSpawned){villagerSpawned=true;const sp=findSpawn();spawnMob('hero',sp[0]+2,sp[1],sp[2]+2);spawnMob('momV',sp[0]-2,sp[1],sp[2]+1);spawnMob('dadV',sp[0]+1,sp[1],sp[2]-2);spawnMob('aaravV',sp[0]-1,sp[1],sp[2]-1);for(let i=0;i<2;i++)spawnMob('villager',sp[0]+(Math.random()*10-5),sp[1],sp[2]+(Math.random()*10-5));}
  // passive animals (daytime, on grass)
  animalTimer-=dt;if(animalTimer<=0){animalTimer=8;if(mobs.filter(x=>x.animal).length<10){const a=Math.random()*6.28,r=12+Math.random()*14;const x=Math.floor(player.pos[0]+Math.sin(a)*r),z=Math.floor(player.pos[2]+Math.cos(a)*r);const gy=surfaceY(x,z);if(gy>2&&getBlock(x,gy,z)===3){const roll=Math.random();let t=roll<0.3?'pig':roll<0.55?'cow':roll<0.8?'sheep':'chicken';if(Math.random()<0.07)t=Math.random()<0.5?'wpig':'wchk';spawnMob(t,x+0.5,gy+1,z+0.5);}}}
  // populate nearby villages with villagers who live there
  villageTimer-=dt;if(villageTimer<=0){villageTimer=4;for(const[k,v]of villages){const d=Math.hypot(v[0]-player.pos[0],v[2]-player.pos[2]);if(d<34){const near=mobs.filter(x=>(x.classic||x.fam==='Villager')&&Math.hypot(x.pos[0]-v[0],x.pos[2]-v[2])<12).length;if(near<4){const ang=Math.random()*6.28,rr=2+Math.random()*6;spawnMob('classicV',v[0]+Math.sin(ang)*rr,v[1]+1,v[2]+Math.cos(ang)*rr);}break;}}}
  // hostile spawns at night
  if(df().mobs && night){mobTimer-=dt;if(mobTimer<=0){mobTimer=Math.max(1.5,5-dayNum*0.1);const cap=({easy:6,normal:10,hard:16})[DIFF]||10;
    if(mobs.filter(x=>x.hostile).length<cap){for(let i=0;i<2;i++){const a=Math.random()*6.28,r=16+Math.random()*10;const x=player.pos[0]+Math.sin(a)*r,z=player.pos[2]+Math.cos(a)*r;const gy=surfaceY(Math.floor(x),Math.floor(z));if(gy<2)continue;const roll=Math.random();const t=roll<0.30?'zombie':roll<0.52?'spider':roll<0.70?'skeleton':roll<0.84?'demon':roll<0.95?'slimeking':'dragon';spawnMob(t,Math.floor(x)+0.5,gy+1,Math.floor(z)+0.5);}}}}
}
function surfaceY(x,z){for(let y=H-1;y>1;y--)if(solidAt(x,y,z))return y;return 0;}
function findSpawn(){const x=0,z=0;ensureGen(Math.floor(x/CH),Math.floor(z/CH));let y=surfaceY(x,z);return[x+0.5,y+1.2,z+0.5];}
function mobInAim(){const eye=[player.pos[0],player.pos[1]+player.EYE,player.pos[2]],d=frontVec();let best=null,bd=3.6;for(const m of mobs){const cx=m.pos[0]-eye[0],cy=m.pos[1]+m.H/2-eye[1],cz=m.pos[2]-eye[2];const dist=Math.hypot(cx,cy,cz);if(dist>3.6)continue;const dot=(cx*d[0]+cy*d[1]+cz*d[2])/dist;if(dot>0.85&&dist<bd){bd=dist;best=m;}}return best;}
function attack(){const m=mobInAim();if(!m)return false;const held=heldItem()&&heldItem().id;const t=toolOf(held);let dmg=t&&t.dmg?t.dmg:1;sfx('hit');showHit(dmg,m.hp-dmg<=0);if(held>=110)damageTool(held,0);damageMob(m,dmg);return true;}
function shootBow(){if(player._bowCd>0)return;const have=MODE==='creative'||countItem(147)>0;if(!have){toast('Out of arrows!');return;}if(MODE!=='creative')removeItems(147,1);
  const f=frontVec(),eye=[player.pos[0],player.pos[1]+player.EYE,player.pos[2]];
  spawnProjectile(eye[0]+f[0]*0.6,eye[1]+f[1]*0.6,eye[2]+f[2]*0.6,f[0],f[1],f[2],32,(IT[146]&&IT[146].dmg)||6,[0.86,0.82,0.7],'player');
  swingHand();sfx('hit');player._bowCd=0.42;try{renderHotbar();}catch(e){}}
/* combat feedback */
let _dmgpop=null;
function showHit(dmg,killed){const cross=document.getElementById('cross');if(cross){cross.classList.add('hit');setTimeout(()=>cross.classList.remove('hit'),130);}
  if(!_dmgpop){_dmgpop=document.createElement('div');_dmgpop.id='dmgpop';document.body.appendChild(_dmgpop);}
  const n=document.createElement('div');n.className='dmgnum';n.textContent=killed?'KO!':('-'+Math.round(dmg));n.style.left=(Math.random()*44-22)+'px';if(killed)n.style.color='#ff5b5b';_dmgpop.appendChild(n);setTimeout(()=>n.remove(),720);}

/* ----------------------------- day / sky ----------------------------- */
const DAY_LEN=600;
function isNight(){return dayTime>0.74||dayTime<0.06;}
function skyColor(){const night=[0.04,0.05,0.11],dawn=[0.92,0.55,0.42],day=[0.49,0.74,0.94],dusk=[0.95,0.5,0.38];const t=dayTime;const L=(a,b,k)=>[a[0]+(b[0]-a[0])*k,a[1]+(b[1]-a[1])*k,a[2]+(b[2]-a[2])*k];if(t<0.06)return night;if(t<0.16)return L(night,dawn,(t-0.06)/0.1);if(t<0.26)return L(dawn,day,(t-0.16)/0.1);if(t<0.72)return day;if(t<0.8)return L(day,dusk,(t-0.72)/0.08);if(t<0.88)return L(dusk,night,(t-0.8)/0.08);return night;}
function dayBright(){if(dayTime>0.26&&dayTime<0.72)return 1;if(dayTime<0.06||dayTime>0.88)return 0.32;if(dayTime<0.26)return 0.32+(dayTime-0.06)/0.2*0.68;return 0.32+(0.88-dayTime)/0.16*0.68;}

/* ----------------------------- input ----------------------------- */
let mouseDown=false,paused=false,invOpen=false,started=false,muted=false;
canvas.addEventListener('mousedown',e=>{if(document.pointerLockElement!==canvas)return;if(e.button===0){mouseDown=true;const h=heldItem();if(h&&h.id===146){shootBow();return;}swingHand();if(!attack())startBreak();}else if(e.button===2){useOrPlace();}});
addEventListener('mouseup',e=>{if(e.button===0)mouseDown=false;});
canvas.addEventListener('contextmenu',e=>e.preventDefault());
canvas.addEventListener('click',()=>{if(started&&!paused&&!invOpen&&document.pointerLockElement!==canvas)canvas.requestPointerLock();});
addEventListener('mousemove',e=>{if(document.pointerLockElement!==canvas)return;const s=0.0023;player.yaw+=e.movementX*s;player.pitch-=e.movementY*s;const l=Math.PI/2-0.01;player.pitch=Math.max(-l,Math.min(l,player.pitch));});
addEventListener('wheel',e=>{if(document.pointerLockElement!==canvas)return;selSlot=(selSlot+(e.deltaY>0?1:-1)+9)%9;renderHotbar();});
addEventListener('keydown',e=>{keys[e.code]=true;if(!started)return;
  if(e.code==='KeyE'){if(openBE)closeBEUI();else toggleInv();}
  else if(e.code==='Escape'){if(openBE)closeBEUI();else if(invOpen)toggleInv();else togglePause();}
  else if(e.code==='KeyF'&&MODE==='creative'){player.fly=!player.fly;player.vel[1]=0;toast(player.fly?'Flying':'Walking');}
  else if(e.code==='KeyQ'){eatHeld();}
  else if(e.code==='KeyM'){muted=!muted;toast(muted?'Muted':'Sound on');}
  else if(e.code.startsWith('Digit')){const n=+e.code.slice(5);if(n>=1&&n<=9){selSlot=n-1;renderHotbar();}}
  if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','KeyE'].includes(e.code))e.preventDefault();});
addEventListener('keyup',e=>{keys[e.code]=false;});
document.addEventListener('pointerlockchange',()=>{if(document.pointerLockElement!==canvas&&started&&!invOpen&&!paused&&!dead)togglePause();});

/* ----------------------------- sound ----------------------------- */
let actx=null;function audio(){if(!actx){try{actx=new(window.AudioContext||window.webkitAudioContext)();}catch(e){}}return actx;}
function tone(f,d,ty,v,sl){const a=audio();if(!a||muted)return;const o=a.createOscillator(),g=a.createGain();o.type=ty||'square';o.frequency.value=f;if(sl)o.frequency.exponentialRampToValueAtTime(Math.max(40,f*sl),a.currentTime+d);g.gain.value=v||0.06;g.gain.exponentialRampToValueAtTime(0.0001,a.currentTime+d);o.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+d);}
function sfx(k){if(muted)return;({break:()=>tone(160,0.1,'square',0.05,0.6),place:()=>tone(300,0.08,'square',0.05,1.2),hit:()=>tone(130,0.07,'square',0.06,0.7),hurt:()=>tone(200,0.2,'sawtooth',0.08,0.4),xp:()=>{tone(620,0.08,'sine',0.06,1.3);}}[k]||(()=>{}))();}

/* ----------------------------- UI ----------------------------- */
function pip(on,half){return `<span class="pip${on?' on':''}${half?' half':''}"></span>`;}
function renderBars(){const hb=document.getElementById('healthbar'),hu=document.getElementById('hungerbar');
  let s='';const hh=Math.round(player.hp);for(let i=0;i<10;i++){const on=hh>=i*2+2,half=hh===i*2+1;s+=pip(on,half);}hb.innerHTML=s;
  let s2='';const hn=Math.round(player.hunger);for(let i=0;i<10;i++){const on=hn>=i*2+2,half=hn===i*2+1;s2+=pip(on,half);}hu.innerHTML=s2;
  if(MODE==='creative'){document.getElementById('bars').style.visibility='hidden';}else{document.getElementById('bars').style.visibility='visible';}}
function itemIcon(id,size){const c=document.createElement('canvas');c.width=c.height=size||34;const g=c.getContext('2d');g.imageSmoothingEnabled=false;const S=c.width;
  if(id<100){const d=B[id];if(d){const{cx,cy}=tc(d.t);g.drawImage(atlas,cx,cy,ATILE,ATILE,0,0,S,S);}return c;}
  const it=IT[id];const k=it&&it.ic;
  if(it&&it.tool!==undefined){ // tool icon: handle + head color by tier
    const col=['#9a7641','#9a7641','#9a9aa2','#d8d8de','#69e7df','#ff5522','#55ccff','#ffdd33','#aa55ff','#ff44aa','#ffcc00'][it.tier]||'#999';
    g.fillStyle='#6e4a28';g.fillRect(S*0.45,S*0.2,S*0.1,S*0.7);
    g.fillStyle=col;
    if(it.tool===1){g.fillRect(S*0.2,S*0.2,S*0.6,S*0.12);g.fillRect(S*0.2,S*0.2,S*0.12,S*0.22);g.fillRect(S*0.68,S*0.2,S*0.12,S*0.22);}
    else if(it.tool===2){g.fillRect(S*0.4,S*0.12,S*0.3,S*0.22);}
    else if(it.tool===3){g.fillRect(S*0.38,S*0.12,S*0.24,S*0.2);}
    else if(it.tool===4){g.fillRect(S*0.32,S*0.12,S*0.36,S*0.12);g.fillRect(S*0.56,S*0.12,S*0.12,S*0.2);} // hoe
    else{g.fillRect(S*0.43,S*0.1,S*0.14,S*0.5);g.fillStyle='#c0a060';g.fillRect(S*0.36,S*0.58,S*0.28,0.1*S);} // sword
    return c;}
  // materials
  const mc={stick:'#9a7641',coal:'#222',iron:'#d8c0b0',goldi:'#ffd24d',diamond:'#69e7df',apple:'#d33',seeds:'#caa23a',wheat:'#e8d27a',bread:'#b9853f',bonemeal:'#eaeaea',carrot:'#e07a1f',potato:'#c9a05a',bone:'#eeeee0',rawpork:'#e89aa6',cookpork:'#9a6a3a',rawbeef:'#c0392b',cookbeef:'#7a4a2a',rawchk:'#e8c0b0',cookchk:'#caa060',leather:'#8a5a2a',feather:'#f0f0f0',egg:'#f5f0e0',wool:'#f2f2ee',berry:'#c0294a',emerald:'#2ecc71',goldapple:'#ffd24d',
    cookmutton:'#9a5a3a',melon:'#e0413a',cookie:'#c89a52',cake:'#f3e9d6',pie:'#d79a3a',stew:'#9a6a3a',honey:'#f0a51e',goldcarrot:'#ffcf3d',fish:'#c98a5a',rawmutton:'#e08a90',rawfish:'#7aa0c0',
    slime:'#6fce72',scale:'#3f9a52',crystal:'#a06ff0',string:'#e8e8e8',gunpowder:'#555',clay:'#9aa0ad',paper:'#f2f2e8',book:'#8a3a2a',sugar:'#f0f0f0',compass:'#cfcfcf',map:'#d8c79a',crown:'#ffd24d',egg2:'#8fd0a0',star:'#ffe14d',
    potion:'#e0394a',juice:'#ff9a2e',choc:'#5a3a1a',icecream:'#f3e4c8',pizza:'#e0a83a',burger:'#a86a3a',candy:'#ff5fa0',elixir:'#ff7a2e',ruby:'#e0143c',sapphire:'#2a6cf0',amethyst:'#9a4ff0',topaz:'#f0c020',ring:'#ffd24d',medal:'#ffcf3d',coin:'#ffd24d',fairydust:'#ff9ae0',heart:'#e0143c',locket:'#ffd24d',starmap:'#d8c79a'}[k]||'#aaa';
  g.fillStyle=mc;
  if(k==='apple'||k==='goldapple'){g.beginPath();g.arc(S/2,S*0.55,S*0.28,0,7);g.fill();g.fillStyle='#6a3';g.fillRect(S*0.48,S*0.2,S*0.06,S*0.18);}
  else if(k==='stick'){g.fillRect(S*0.46,S*0.18,S*0.08,S*0.64);}
  else if(k==='cake'){g.fillRect(S*0.22,S*0.4,S*0.56,S*0.4);g.fillStyle='#e94f6d';g.fillRect(S*0.22,S*0.34,S*0.56,S*0.1);g.fillStyle='#d33';g.beginPath();g.arc(S*0.5,S*0.34,S*0.06,0,7);g.fill();}
  else if(k==='cookie'){g.beginPath();g.arc(S/2,S/2,S*0.3,0,7);g.fill();g.fillStyle='#5a3a1a';for(const[a,b]of[[0.4,0.45],[0.6,0.55],[0.5,0.65],[0.45,0.4]])g.fillRect(S*a,S*b,S*0.07,S*0.07);}
  else if(k==='crown'){g.beginPath();g.moveTo(S*0.25,S*0.7);g.lineTo(S*0.25,S*0.4);g.lineTo(S*0.37,S*0.55);g.lineTo(S*0.5,S*0.35);g.lineTo(S*0.63,S*0.55);g.lineTo(S*0.75,S*0.4);g.lineTo(S*0.75,S*0.7);g.closePath();g.fill();g.fillStyle='#d33';g.beginPath();g.arc(S*0.5,S*0.6,S*0.05,0,7);g.fill();}
  else if(k==='star'){g.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?S*0.13:S*0.3;g.lineTo(S/2+Math.cos(a)*r,S/2+Math.sin(a)*r);}g.closePath();g.fill();}
  else if(k==='bow'){g.strokeStyle=mc='#9a7641';g.lineWidth=S*0.06;g.beginPath();g.arc(S*0.3,S*0.5,S*0.34,-1.1,1.1);g.stroke();g.strokeStyle='#eee';g.lineWidth=2;g.beginPath();g.moveTo(S*0.42,S*0.18);g.lineTo(S*0.42,S*0.82);g.stroke();}
  else if(k==='arrow'){g.strokeStyle='#9a7641';g.lineWidth=S*0.05;g.beginPath();g.moveTo(S*0.2,S*0.8);g.lineTo(S*0.8,S*0.2);g.stroke();g.fillStyle='#cfcfcf';g.beginPath();g.moveTo(S*0.8,S*0.2);g.lineTo(S*0.66,S*0.26);g.lineTo(S*0.74,S*0.34);g.closePath();g.fill();}
  else if(k==='compass'){g.beginPath();g.arc(S/2,S/2,S*0.3,0,7);g.fill();g.fillStyle='#c0392b';g.beginPath();g.moveTo(S*0.5,S*0.3);g.lineTo(S*0.56,S*0.5);g.lineTo(S*0.5,S*0.7);g.lineTo(S*0.44,S*0.5);g.closePath();g.fill();}
  else if(k==='map'){g.fillRect(S*0.22,S*0.22,S*0.56,S*0.56);g.strokeStyle='#a08040';g.lineWidth=2;g.strokeRect(S*0.22,S*0.22,S*0.56,S*0.56);g.fillStyle='#c0392b';g.font='bold '+(S*0.4)+'px sans-serif';g.fillText('✕',S*0.36,S*0.62);}
  else if(k==='honey'){g.fillRect(S*0.34,S*0.3,S*0.32,S*0.5);g.fillStyle='#cfa800';g.fillRect(S*0.38,S*0.2,S*0.24,S*0.12);}
  else if(k==='crystal'){g.beginPath();g.moveTo(S*0.5,S*0.2);g.lineTo(S*0.7,S*0.5);g.lineTo(S*0.5,S*0.82);g.lineTo(S*0.3,S*0.5);g.closePath();g.fill();g.fillStyle='#c9a8ff';g.beginPath();g.moveTo(S*0.5,S*0.2);g.lineTo(S*0.5,S*0.82);g.lineTo(S*0.3,S*0.5);g.closePath();g.fill();}
  else if(k==='ruby'||k==='sapphire'||k==='amethyst'||k==='topaz'){g.beginPath();g.moveTo(S*0.5,S*0.2);g.lineTo(S*0.76,S*0.42);g.lineTo(S*0.5,S*0.82);g.lineTo(S*0.24,S*0.42);g.closePath();g.fill();g.globalAlpha=0.45;g.fillStyle='#fff';g.beginPath();g.moveTo(S*0.5,S*0.2);g.lineTo(S*0.62,S*0.42);g.lineTo(S*0.5,S*0.82);g.closePath();g.fill();g.globalAlpha=1;}
  else if(k==='potion'||k==='elixir'||k==='juice'){g.fillStyle='#d8e6f0';g.fillRect(S*0.43,S*0.18,S*0.14,S*0.14);g.fillStyle=mc;g.beginPath();g.arc(S*0.5,S*0.6,S*0.24,0,7);g.fill();g.fillRect(S*0.4,S*0.36,S*0.2,S*0.24);g.globalAlpha=0.35;g.fillStyle='#fff';g.beginPath();g.arc(S*0.42,S*0.55,S*0.06,0,7);g.fill();g.globalAlpha=1;}
  else if(k==='heart'||k==='locket'){g.beginPath();g.arc(S*0.37,S*0.42,S*0.15,0,7);g.arc(S*0.63,S*0.42,S*0.15,0,7);g.moveTo(S*0.22,S*0.48);g.lineTo(S*0.5,S*0.8);g.lineTo(S*0.78,S*0.48);g.closePath();g.fill();}
  else if(k==='coin'||k==='medal'||k==='ring'){g.beginPath();g.arc(S/2,S/2,S*0.3,0,7);g.fill();g.fillStyle='#fff4b8';g.beginPath();g.arc(S/2,S/2,S*0.17,0,7);g.fill();g.fillStyle=mc;if(k==='ring'){g.globalCompositeOperation='destination-out';g.beginPath();g.arc(S/2,S/2,S*0.1,0,7);g.fill();g.globalCompositeOperation='source-over';}}
  else if(k==='fairydust'){for(let i=0;i<7;i++){const a=i/7*6.28,r=S*0.26;g.beginPath();for(let j=0;j<10;j++){const aa=-1.57+j*0.628,rr=j%2?S*0.03:S*0.07;g.lineTo(S/2+Math.cos(a)*r+Math.cos(aa)*rr,S/2+Math.sin(a)*r+Math.sin(aa)*rr);}g.closePath();g.fill();}}
  else if(k==='choc'){g.fillRect(S*0.28,S*0.28,S*0.44,S*0.44);g.strokeStyle='#3a2410';g.lineWidth=2;for(let i=1;i<3;i++){g.beginPath();g.moveTo(S*0.28,S*0.28+i*S*0.147);g.lineTo(S*0.72,S*0.28+i*S*0.147);g.stroke();g.beginPath();g.moveTo(S*0.28+i*S*0.147,S*0.28);g.lineTo(S*0.28+i*S*0.147,S*0.72);g.stroke();}}
  else if(k==='pizza'){g.beginPath();g.moveTo(S*0.5,S*0.18);g.lineTo(S*0.8,S*0.78);g.lineTo(S*0.2,S*0.78);g.closePath();g.fill();g.fillStyle='#c0392b';for(const[a,b]of[[0.42,0.5],[0.6,0.58],[0.5,0.68]]){g.beginPath();g.arc(S*a,S*b,S*0.05,0,7);g.fill();}}
  else if(k==='burger'){g.fillStyle='#d8a24a';g.beginPath();g.arc(S*0.5,S*0.36,S*0.26,3.14,0);g.fill();g.fillStyle='#6a3a1a';g.fillRect(S*0.24,S*0.46,S*0.52,S*0.12);g.fillStyle='#5fa83a';g.fillRect(S*0.22,S*0.42,S*0.56,S*0.06);g.fillStyle='#d8a24a';g.fillRect(S*0.26,S*0.6,S*0.48,S*0.1);}
  else if(k==='icecream'){g.fillStyle='#caa05a';g.beginPath();g.moveTo(S*0.5,S*0.82);g.lineTo(S*0.36,S*0.5);g.lineTo(S*0.64,S*0.5);g.closePath();g.fill();g.fillStyle=mc;g.beginPath();g.arc(S*0.5,S*0.42,S*0.18,0,7);g.fill();g.fillStyle='#e0143c';g.beginPath();g.arc(S*0.5,S*0.26,S*0.05,0,7);g.fill();}
  else if(k==='candy'){g.beginPath();g.arc(S*0.5,S*0.5,S*0.2,0,7);g.fill();g.fillStyle='#fff';g.globalAlpha=0.5;for(let i=0;i<3;i++){g.fillRect(S*0.34,S*0.4+i*S*0.08,S*0.32,S*0.03);}g.globalAlpha=1;g.fillStyle=mc;g.beginPath();g.moveTo(S*0.3,S*0.5);g.lineTo(S*0.16,S*0.4);g.lineTo(S*0.16,S*0.6);g.closePath();g.fill();g.beginPath();g.moveTo(S*0.7,S*0.5);g.lineTo(S*0.84,S*0.4);g.lineTo(S*0.84,S*0.6);g.closePath();g.fill();}
  else if(k==='starmap'){g.fillRect(S*0.2,S*0.22,S*0.6,S*0.56);g.fillStyle='#3a4a8a';g.fillRect(S*0.24,S*0.26,S*0.52,S*0.48);g.fillStyle='#ffe14d';for(const[a,b]of[[0.36,0.4],[0.6,0.36],[0.5,0.58],[0.4,0.64]]){g.beginPath();g.arc(S*a,S*b,S*0.03,0,7);g.fill();}}
  else{g.fillRect(S*0.24,S*0.3,S*0.5,S*0.4);}
  return c;}
const hotbarEl=document.getElementById('hotbar');
function renderHotbar(){hotbarEl.innerHTML='';for(let i=0;i<9;i++){const s=inv[i];const slot=document.createElement('div');slot.className='slot'+(i===selSlot?' active':'');
  if(s){slot.appendChild(itemIcon(s.id,38));if(s.count>1)slot.insertAdjacentHTML('beforeend',`<span class="ct">${s.count}</span>`);if(s.dur!==undefined&&IT[s.id])slot.insertAdjacentHTML('beforeend',`<span class="dur"><i style="width:${Math.max(0,s.dur/IT[s.id].dur*100)}%"></i></span>`);}
  slot.insertAdjacentHTML('beforeend',`<span class="k">${i+1}</span>`);slot.onclick=()=>{selSlot=i;renderHotbar();};hotbarEl.appendChild(slot);}updateHeld();}
const heldEl=document.getElementById('helditem');
function updateHeld(){if(!heldEl)return;const s=inv[selSlot];heldEl.innerHTML='';if(!s){heldEl.classList.add('empty');return;}heldEl.classList.remove('empty');const c=itemIcon(s.id,120);heldEl.appendChild(c);}
function swingHand(){viewSwing=0.35;
  try{const f=frontVec(),right=[view[0],view[4],view[8]],up=[view[1],view[5],view[9]];const eye=[player.pos[0],player.pos[1]+player.EYE,player.pos[2]];
    for(let i=0;i<9;i++){const a=(i/8-0.5)*1.5,cw=Math.cos(a),sw2=Math.sin(a);
      particles.push({pos:[eye[0]+f[0]*1.6+right[0]*cw*0.9-up[0]*sw2*0.7, eye[1]+f[1]*1.6+right[1]*cw*0.9-up[1]*sw2*0.7, eye[2]+f[2]*1.6+right[2]*cw*0.9-up[2]*sw2*0.7],vel:[0,0,0],life:0.13,ttl:0.13,col:[2.2,2.3,2.6],size:0.085,grav:0});}}catch(e){}
  if(!heldEl)return;heldEl.classList.remove('swing');void heldEl.offsetWidth;heldEl.classList.add('swing');}
let toastT;function toast(m){const el=document.getElementById('toast');el.textContent=m;el.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>el.classList.remove('show'),1500);}
function hitFlash(){const f=document.getElementById('hitflash');f.classList.add('on');setTimeout(()=>f.classList.remove('on'),120);sfx('hurt');}
function renderReadout(fps,nchunks){const b=biomeAt(Math.floor(player.pos[0]),Math.floor(player.pos[2]));
  document.getElementById('ro-coords').textContent=`x ${player.pos[0].toFixed(0)}  y ${player.pos[1].toFixed(0)}  z ${player.pos[2].toFixed(0)}`;
  const hh=Math.floor(dayTime*24),mm=Math.floor((dayTime*24-hh)*60);
  document.getElementById('ro-meta').textContent=`${b[0].toUpperCase()+b.slice(1)} · Day ${dayNum} · ${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')}`;
  document.getElementById('ro-fps').textContent=`${fps} fps · ${nchunks} chunks`;renderQuest();}

/* inventory + crafting screen */
const invEl=document.getElementById('inv');
function toggleInv(){if(MODE==='creative'&&!invOpen){openCreativeInv();return;}invOpen=!invOpen;invEl.classList.toggle('hidden',!invOpen);if(invOpen){buildInvUI();if(document.pointerLockElement)document.exitPointerLock();}else if(started&&!paused&&!dead)canvas.requestPointerLock();}
let creativeMode=false;
function openCreativeInv(){invOpen=true;creativeMode=true;invEl.classList.remove('hidden');buildCreativeUI();if(document.pointerLockElement)document.exitPointerLock();}
function cellFor(s,onClick){const c=document.createElement('div');c.className='cell';if(s){c.appendChild(itemIcon(s.id,34));if(s.count>1)c.insertAdjacentHTML('beforeend',`<span class="ct">${s.count}</span>`);}c.onclick=onClick;return c;}
function buildInvUI(){creativeMode=false;const bp=document.getElementById('backpack'),ih=document.getElementById('invhotbar');bp.innerHTML='';ih.innerHTML='';
  for(let i=9;i<36;i++){bp.appendChild(cellFor(inv[i],()=>moveSlot(i)));}
  for(let i=0;i<9;i++){ih.appendChild(cellFor(inv[i],()=>moveSlot(i)));}
  buildRecipes();}
let moveFrom=null;
function moveSlot(i){if(moveFrom===null){if(inv[i]){moveFrom=i;}}else{const tmp=inv[i];inv[i]=inv[moveFrom];inv[moveFrom]=tmp;moveFrom=null;}buildInvUI();renderHotbar();}
function buildCreativeUI(){const bp=document.getElementById('backpack'),ih=document.getElementById('invhotbar');bp.innerHTML='';ih.innerHTML='';document.getElementById('recipes').innerHTML='<p class="muted">Creative mode — click any block to put it on your hotbar slot 1, or pick a slot first.</p>';
  const ids=Object.keys(B).map(Number);for(const id of ids){const c=document.createElement('div');c.className='cell';c.appendChild(itemIcon(id,34));c.onclick=()=>{inv[selSlot]={id,count:1};renderHotbar();toast(B[id].n);};bp.appendChild(c);}
  const iids=Object.keys(IT).map(Number);for(const id of iids){const c=document.createElement('div');c.className='cell';c.appendChild(itemIcon(id,34));c.onclick=()=>{inv[selSlot]={id,count:(IT[id].tool!==undefined?1:64)};renderHotbar();toast(itemName(id));};bp.appendChild(c);}
  for(let i=0;i<9;i++){ih.appendChild(cellFor(inv[i],()=>{}));}}
function buildRecipes(){const box=document.getElementById('recipes');box.innerHTML='';const table=nearStation(19),furn=nearStation(20);
  for(const r of REC){const can = (!r.need||(r.need===19?table:furn)) && r.i.every(([id,n])=>countItem(id)>=n);
    const row=document.createElement('div');row.className='recipe '+(can?'can':'cant');
    row.appendChild(itemIcon(r.o,30));
    const txt=document.createElement('div');txt.innerHTML=`<div class="rt">${itemName(r.o)}${r.n>1?' ×'+r.n:''}</div><div class="rc">${r.i.map(([id,n])=>n+'× '+itemName(id)).join(', ')}${r.need?' · needs '+(r.need===19?'Table':'Furnace'):''}</div>`;
    row.appendChild(txt);
    if(can)row.onclick=()=>{for(const[id,n]of r.i)removeItems(id,n);addItem(r.o,r.n);buildInvUI();renderHotbar();sfx('place');};
    box.appendChild(row);}}

/* pause / start */
function togglePause(){paused=!paused;document.getElementById('pause').classList.toggle('hidden',!paused);if(paused){if(document.pointerLockElement)document.exitPointerLock();doSave(false);document.getElementById('pause-stats').textContent=`${WORLDNAME} · ${MODE} · ${DIFF} · Day ${dayNum}`;}else if(!dead)canvas.requestPointerLock();}

/* ----------------------------- save / load ----------------------------- */
let saveT;
function buildSave(){const ed={};for(const[k,m]of editStore){const o={};for(const[i,id]of m)o[i]=id;ed[k]=o;}
  const beo={};for(const[k,v]of blockEntities)beo[k]=v;
  return{v:1,seed:SEED,mode:MODE,diff:DIFF,name:WORLDNAME,day:dayNum,time:dayTime,rd:RENDER_DIST,spawn:spawnPoint,treas:treasureSpots,
    player:{pos:player.pos.slice(),yaw:player.yaw,pitch:player.pitch,hp:player.hp,hunger:player.hunger,fly:player.fly},
    inv:inv.map(s=>s?{id:s.id,count:s.count,dur:s.dur}:null),sel:selSlot,edits:ed,be:beo};}
async function doSave(flash){const ok=await Store.save(buildSave());if(ok&&flash){/* could flash */}return ok;}
function scheduleSave(){clearTimeout(saveT);saveT=setTimeout(()=>doSave(false),1500);}
function applySave(s){SEED=s.seed;MODE=s.mode||'survival';DIFF=s.diff||'normal';WORLDNAME=s.name||"Adyah's World";dayNum=s.day||1;dayTime=typeof s.time==='number'?s.time:0.27;RENDER_DIST=s.rd||6;
  editStore.clear();if(s.edits){for(const k in s.edits){const m=new Map();const o=s.edits[k];for(const i in o)m.set(+i,o[i]);editStore.set(k,m);}}
  if(s.player){player.pos=s.player.pos.slice();player.yaw=s.player.yaw||0;player.pitch=s.player.pitch||0;player.hp=s.player.hp||20;player.hunger=s.player.hunger!=null?s.player.hunger:20;player.fly=!!s.player.fly;}
  if(Array.isArray(s.inv))inv=s.inv.map(x=>x?{id:x.id,count:x.count,dur:x.dur}:null);
  selSlot=s.sel||0;spawnPoint=s.spawn||null;
  blockEntities.clear();if(s.be){for(const k in s.be)blockEntities.set(k,s.be[k]);}
  if(s.treas)treasureSpots=s.treas;}

/* ----------------------------- render loop ----------------------------- */
const proj=new Float32Array(16),view=new Float32Array(16),vp=new Float32Array(16);
function resize(){const dpr=Math.min(devicePixelRatio||1,2);canvas.width=(innerWidth*dpr)|0;canvas.height=(innerHeight*dpr)|0;gl.viewport(0,0,canvas.width,canvas.height);}
addEventListener('resize',resize);gl.enable(gl.DEPTH_TEST);gl.enable(gl.CULL_FACE);gl.cullFace(gl.BACK);gl.frontFace(gl.CCW);
let last=performance.now(),fpsT=0,fpsN=0,fpsV=0;
const BODYCOL={adyah:[0.30,0.62,0.42],mom:[0.80,0.46,0.60],dad:[0.30,0.46,0.72],aarav:[0.36,0.72,0.62]};
const MONCOL={dragon:[0.29,0.64,0.34],alien:[0.30,0.42,0.30],slimeking:[0.38,0.80,0.45],demon:[0.69,0.20,0.19],ogre:[0.43,0.59,0.31],spider:[0.17,0.14,0.20]};
const SKIN=[0.84,0.67,0.51];
function pushBox(V,mx,mz,lx,lz,hx,hz,y0,y1,col,faceUV,yaw,limbR,pivotY,pivotZ,rollR,pivotXr){
  const cy=Math.cos(yaw),sy=Math.sin(yaw),cr=Math.cos(limbR||0),sr=Math.sin(limbR||0),crl=Math.cos(rollR||0),srl=Math.sin(rollR||0);
  function tx(x,y,z){ if(limbR){const dy=y-pivotY,dz=z-pivotZ;y=pivotY+dy*cr-dz*sr;z=pivotZ+dy*sr+dz*cr;} if(rollR){const dx=x-(pivotXr||0),dy=y-pivotY;x=(pivotXr||0)+dx*crl-dy*srl;y=pivotY+dx*srl+dy*crl;} const wx=x*cy+z*sy,wz=-x*sy+z*cy; return [mx+wx,y,mz+wz]; }
  const x0=lx-hx,x1=lx+hx,z0=lz-hz,z1=lz+hz;
  const c000=tx(x0,y0,z0),c100=tx(x1,y0,z0),c001=tx(x0,y0,z1),c101=tx(x1,y0,z1),c010=tx(x0,y1,z0),c110=tx(x1,y1,z0),c011=tx(x0,y1,z1),c111=tx(x1,y1,z1);
  function quad(a,b,c,d,sh,uv){ const uvs=uv?[[uv[0],uv[3]],[uv[2],uv[3]],[uv[2],uv[1]],[uv[0],uv[1]]]:[[0,0],[0,0],[0,0],[0,0]]; const tf=uv?1:0; const vs=[a,b,c,a,c,d],ui=[0,1,2,0,2,3]; for(let i=0;i<6;i++){const p=vs[i],u=uvs[ui[i]];V.push(p[0],p[1],p[2],col[0],col[1],col[2],u[0],u[1],tf,sh);} }
  quad(c001,c101,c111,c011,0.93,faceUV); quad(c100,c000,c010,c110,0.82,null); quad(c000,c001,c011,c010,0.72,null); quad(c101,c100,c110,c111,0.72,null); quad(c011,c111,c110,c010,1.0,null); quad(c000,c100,c101,c001,0.5,null);
}
function drawMobs3D(){
  const eye=[player.pos[0],player.pos[1]+player.EYE,player.pos[2]],db=dayBright(),clock=performance.now()/1000;
  gl.useProgram(mProg);gl.uniformMatrix4fv(mU.proj,false,proj);gl.uniformMatrix4fv(mU.view,false,view);
  gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,charTex);gl.uniform1i(mU.tex,0);gl.uniform1f(mU.day,db);
  gl.disable(gl.CULL_FACE);
  for(const m of mobs){ const isChar=m.char!==undefined,isClassic=!!m.classic; if(!isChar&&!isClassic)continue;
    const arch=isClassic?'classic':((CHARS[m.char]&&CHARS[m.char].arch)||'villager');
    const person=isChar?((CHARS[m.char]&&CHARS[m.char].person)||''):'';
    const mx=m.pos[0],mz=m.pos[2],yaw=Math.atan2(eye[0]-mx,eye[2]-mz);
    if(m._ph===undefined)m._ph=Math.random()*6.28;
    const moving=(m._lx!==undefined)&&(Math.hypot(mx-m._lx,mz-m._lz)>0.004); m._wp=(m._wp||0)+(moving?0.5:0); if(!moving)m._wp*=0.85; m._lx=mx; m._lz=mz;
    const sw=Math.sin(m._wp)*0.6;
    let hop=0,wave=0,headBob=0;
    if(arch==='monster'){ hop=Math.abs(Math.sin(clock*2.2+m._ph))*0.10; headBob=Math.sin(clock*3.0+m._ph)*0.06; }
    else { hop=moving?0:Math.abs(Math.sin(clock*2.8+m._ph))*0.11; wave=Math.sin(clock*4.0+m._ph)*0.5; headBob=Math.sin(clock*2.0+m._ph)*0.05; }
    const my=m.pos[1]+hop;
    const tcUV=isChar?charUV(m.char):null;
    const fr=(a,b,c,d)=>{const u0=tcUV.u0+(tcUV.u1-tcUV.u0)*a,u1=tcUV.u0+(tcUV.u1-tcUV.u0)*c,v0=tcUV.v0+(tcUV.v1-tcUV.v0)*b,v1=tcUV.v0+(tcUV.v1-tcUV.v0)*d;return [u0,v0,u1,v1];};
    const V=[];
    if(arch==='monster'){
      const col=MONCOL[person]||[0.4,0.5,0.35],H=m.H||2.2,W=(m.W||1.2),dk=[col[0]*0.78,col[1]*0.78,col[2]*0.78],bone=[0.88,0.86,0.78];
      if(person==='dragon'){
        const flap=Math.sin(clock*2.6+m._ph)*0.28,mem=[dk[0]*0.85,dk[1]*0.85,dk[2]*0.85],edge=[Math.min(1,dk[0]*1.25),Math.min(1,dk[1]*1.25),Math.min(1,dk[2]*1.25)];
        // 4 legs under a low horizontal body
        for(const sx of [-1,1])for(const sz of [-1,1]) pushBox(V,mx,mz,sx*0.17*W,sz*0.26*W,0.07*W,0.08*W,my,my+0.28*H,dk,null,yaw,0,0,0);
        // horizontal body
        pushBox(V,mx,mz,0,-0.02*W,0.20*W,0.40*W,my+0.26*H,my+0.48*H,col,null,yaw,0,0,0);
        // long tapering tail
        pushBox(V,mx,mz,0,-0.54*W,0.07*W,0.16*W,my+0.28*H,my+0.42*H,dk,null,yaw,0,0,0);
        pushBox(V,mx,mz,0,-0.76*W,0.05*W,0.14*W,my+0.30*H,my+0.42*H,dk,null,yaw,0,0,0);
        pushBox(V,mx,mz,0,-0.96*W,0.03*W,0.12*W,my+0.32*H,my+0.42*H,dk,null,yaw,0,0,0);
        // BIG bat wings: WIDE in X, TALL in Y, THIN in Z so the broad face points at the camera; tilted up/out into a V, flapping
        pushBox(V,mx,mz, 0.42*W,-0.05*W, 0.32*W,0.03*W, my+0.32*H, my+0.80*H, mem, null, yaw, 0,my+0.56*H,0,  (0.5+flap), 0.12*W);
        pushBox(V,mx,mz,-0.42*W,-0.05*W, 0.32*W,0.03*W, my+0.32*H, my+0.80*H, mem, null, yaw, 0,my+0.56*H,0, -(0.5+flap),-0.12*W);
        // wing top bone (lighter edge)
        pushBox(V,mx,mz, 0.42*W,-0.05*W, 0.32*W,0.045*W, my+0.74*H, my+0.80*H, edge, null, yaw, 0,my+0.77*H,0,  (0.5+flap), 0.12*W);
        pushBox(V,mx,mz,-0.42*W,-0.05*W, 0.32*W,0.045*W, my+0.74*H, my+0.80*H, edge, null, yaw, 0,my+0.77*H,0, -(0.5+flap),-0.12*W);
        // neck
        pushBox(V,mx,mz,0,0.34*W,0.10*W,0.12*W,my+0.40*H,my+0.60*H+headBob,col,null,yaw,0,0,0);
        // head + face, forward
        pushBox(V,mx,mz,0,0.46*W,0.16*W,0.16*W,my+0.56*H+headBob,my+0.80*H+headBob,col,fr(0.28,0.10,0.72,0.60),yaw,0,0,0);
        // snout
        pushBox(V,mx,mz,0,0.60*W,0.10*W,0.08*W,my+0.58*H+headBob,my+0.68*H+headBob,col,null,yaw,0,0,0);
        // horns
        for(const sgn of [-1,1]) pushBox(V,mx,mz,sgn*0.10*W,0.42*W,0.028*W,0.028*W,my+0.78*H+headBob,my+0.94*H+headBob,bone,null,yaw,0,0,0);
      } else if(person==='spider'){ const bot=my+0.34*H,top=my+0.64*H;   // body lifted off the ground
        // 8 clear bent legs: a horizontal segment out + a vertical segment down to the ground (4 per side)
        for(let i=0;i<4;i++){const lz=(i-1.5)*0.22*W,wob=Math.sin(clock*6+i*1.3)*0.06*W;
          pushBox(V,mx,mz, 0.32*W,lz, 0.20*W,0.045*W, bot+0.03, bot+0.10, dk, null, yaw,0,0,0);              // R upper
          pushBox(V,mx,mz, 0.52*W+wob,lz, 0.05*W,0.05*W, my, bot+0.09, dk, null, yaw,0,0,0);                 // R lower (to ground)
          pushBox(V,mx,mz,-0.32*W,lz, 0.20*W,0.045*W, bot+0.03, bot+0.10, dk, null, yaw,0,0,0);              // L upper
          pushBox(V,mx,mz,-0.52*W-wob,lz, 0.05*W,0.05*W, my, bot+0.09, dk, null, yaw,0,0,0);                 // L lower
        }
        // round abdomen (back) + cephalothorax head (front, with red-eyed face)
        pushBox(V,mx,mz,0,-0.16*W,0.30*W,0.34*W,bot,top,col,null,yaw,0,0,0);
        pushBox(V,mx,mz,0,0.26*W,0.21*W,0.19*W,bot+0.01,top-0.02,col,fr(0.26,0.26,0.74,0.70),yaw,0,0,0);
      } else if(person==='alien'){ const legY1=my+0.34*H,bodyY1=legY1+0.28*H,headY1=bodyY1+0.36*H;
        for(const sgn of [-1,1]) pushBox(V,mx,mz,sgn*0.07*W,0,0.05*W,0.05*W,my,legY1,col,null,yaw,sw,legY1,0); // thin legs
        pushBox(V,mx,mz,0,0,0.10*W,0.08*W,legY1,bodyY1,col,null,yaw,0,0,0); // slim body
        for(const sgn of [-1,1]) pushBox(V,mx,mz,sgn*0.16*W,0,0.04*W,0.05*W,legY1+0.02*H,bodyY1+0.02*H,col,null,yaw,sgn*0.35,bodyY1,0); // arms
        pushBox(V,mx,mz,0,0,0.22*W,0.19*W,bodyY1+headBob,headY1+headBob,col,fr(0.26,0.12,0.74,0.62),yaw,0,0,0); // big head+face
        for(const sgn of [-1,1]) pushBox(V,mx,mz,sgn*0.085*W,0.205*W,0.045*W,0.03*W,headY1-0.17*H+headBob,headY1-0.09*H+headBob,[2.2,0.08,0.08],null,yaw,0,0,0); // GLOWING red eyes
        pushBox(V,mx,mz,0,0.205*W,0.10*W,0.02*W,bodyY1+0.05*H+headBob,bodyY1+0.10*H+headBob,[1.6,0.05,0.05],null,yaw,0,0,0); // snarling mouth
        for(const sgn of [-1,1]) pushBox(V,mx,mz,sgn*0.10*W,0,0.012*W,0.012*W,headY1+headBob,headY1+0.14*H+headBob,col,null,yaw,sgn*0.25,headY1,0); // antennae
      } else if(person==='slimeking'){ const b0=my,b1=my+0.66*H;
        pushBox(V,mx,mz,0,0,0.36*W,0.36*W,b0,b1,col,fr(0.30,0.30,0.70,0.62),yaw,0,0,0); // blob
        for(let i=0;i<5;i++){const a=(i-2)*0.13*W; pushBox(V,mx,mz,a,0,0.028*W,0.028*W,b1,b1+0.11*H,[1.0,0.84,0.3],null,yaw,0,0,0);} // crown spikes
        pushBox(V,mx,mz,0,0,0.30*W,0.30*W,b1,b1+0.04*H,[1.0,0.84,0.3],null,yaw,0,0,0); // crown band
      } else { // demon / ogre: bulky brute
        const legY1=my+0.38*H,bodyY1=legY1+0.34*H,headY1=bodyY1+0.30*H;
        pushBox(V,mx,mz,-0.18*W,0,0.13*W,0.13*W,my,legY1,dk,null,yaw,sw,legY1,0);
        pushBox(V,mx,mz,0.18*W,0,0.13*W,0.13*W,my,legY1,dk,null,yaw,-sw,legY1,0);
        pushBox(V,mx,mz,0,0,0.34*W,0.24*W,legY1,bodyY1,col,null,yaw,0,0,0);
        pushBox(V,mx,mz,-0.46*W,0,0.13*W,0.14*W,legY1,bodyY1+0.04,col,null,yaw,-0.3-wave*0.4,bodyY1,0);
        pushBox(V,mx,mz,0.46*W,0,0.13*W,0.14*W,legY1,bodyY1+0.04,col,null,yaw,-0.3+wave*0.4,bodyY1,0);
        pushBox(V,mx,mz,0,0,0.24*W,0.22*W,bodyY1+headBob,headY1+headBob,col,fr(0.30,0.12,0.70,0.58),yaw,0,0,0);
        if(person==='demon'){for(const sgn of [-1,1]) pushBox(V,mx,mz,sgn*0.15*W,0,0.04*W,0.04*W,headY1-0.02*H+headBob,headY1+0.16*H+headBob,dk,null,yaw,sgn*0.4,headY1,0);}
      }
    } else if(arch==='classic'){
      const H=m.H||1.85,W=(m.W||0.7)*1.5,robe=[0.46,0.32,0.22],robeDk=[0.36,0.25,0.17],skin=[0.80,0.66,0.52],nose=[0.86,0.70,0.55];
      const legY1=my+0.45*H,bodyY1=legY1+0.32*H,headY1=bodyY1+0.30*H;
      pushBox(V,mx,mz,-0.10*W,0,0.08*W,0.09*W,my,legY1,robeDk,null,yaw,sw,legY1,0);
      pushBox(V,mx,mz,0.10*W,0,0.08*W,0.09*W,my,legY1,robeDk,null,yaw,-sw,legY1,0);
      pushBox(V,mx,mz,0,0,0.22*W,0.13*W,legY1,bodyY1,robe,null,yaw,0,0,0);
      pushBox(V,mx,mz,0,0.10*W,0.24*W,0.06*W,legY1+0.10*H,legY1+0.20*H,robeDk,null,yaw,0,0,0);
      pushBox(V,mx,mz,0,0,0.17*W,0.16*W,bodyY1+headBob,headY1+headBob,skin,null,yaw,0,0,0);
      pushBox(V,mx,mz,0,0.16*W,0.045*W,0.05*W,bodyY1+0.09*H+headBob,bodyY1+0.20*H+headBob,nose,null,yaw,0,0,0);
      pushBox(V,mx,mz,0,0.165*W,0.10*W,0.012*W,bodyY1+0.21*H+headBob,bodyY1+0.235*H+headBob,[0.2,0.13,0.08],null,yaw,0,0,0);
    } else {
      const H=m.H||1.85,W=(m.W||0.7)*1.5,robe=BODYCOL[person]||[0.55,0.38,0.26],robeDk=[robe[0]*0.78,robe[1]*0.78,robe[2]*0.78];
      const legY1=my+0.45*H,bodyY1=legY1+0.32*H,headY1=bodyY1+0.30*H;
      pushBox(V,mx,mz,-0.10*W,0,0.08*W,0.09*W,my,legY1,robeDk,null,yaw,sw,legY1,0);
      pushBox(V,mx,mz,0.10*W,0,0.08*W,0.09*W,my,legY1,robeDk,null,yaw,-sw,legY1,0);
      pushBox(V,mx,mz,0,0,0.22*W,0.13*W,legY1,bodyY1,robe,null,yaw,0,0,0);
      pushBox(V,mx,mz,-0.30*W,0,0.07*W,0.09*W,legY1+0.02*H,bodyY1,robe,null,yaw,-0.2-wave,bodyY1,0);
      pushBox(V,mx,mz,0.30*W,0,0.07*W,0.09*W,legY1+0.02*H,bodyY1,robe,null,yaw,-0.2+wave,bodyY1,0);
      pushBox(V,mx,mz,0,0,0.18*W,0.16*W,bodyY1+headBob,headY1+headBob,SKIN,fr(0.34,0.15,0.66,0.50),yaw,0,0,0);
    }
    if(!V.length)continue;
    drawModelV(V);
  }
  // fireballs / projectiles
  for(const p of projectiles){const V=[];if(p.arrow){pushBox(V,p.pos[0],p.pos[2],0,0,0.06,0.06,p.pos[1]-0.06,p.pos[1]+0.06,p.col,null,0,0,0,0);pushBox(V,p.pos[0],p.pos[2],0,0,0.03,0.03,p.pos[1]+0.06,p.pos[1]+0.22,[0.55,0.4,0.25],null,0,0,0,0);}else{const r=0.20+Math.sin(clock*20+p.pos[0])*0.03;pushBox(V,p.pos[0],p.pos[2],0,0,r,r,p.pos[1]-r,p.pos[1]+r,p.col,null,0,0,0,0);pushBox(V,p.pos[0],p.pos[2],0,0,r*0.6,r*0.6,p.pos[1]+r*0.6,p.pos[1]+r*1.6,[1.7,0.9,0.3],null,0,0,0,0);}drawModelV(V);}
  drawParticles();
  gl.enable(gl.CULL_FACE);
}
function drawModelV(V){const ST=40;gl.bindBuffer(gl.ARRAY_BUFFER,modelBuf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(V),gl.DYNAMIC_DRAW);
  gl.enableVertexAttribArray(mA.pos);gl.vertexAttribPointer(mA.pos,3,gl.FLOAT,false,ST,0);
  gl.enableVertexAttribArray(mA.col);gl.vertexAttribPointer(mA.col,3,gl.FLOAT,false,ST,12);
  gl.enableVertexAttribArray(mA.uv);gl.vertexAttribPointer(mA.uv,2,gl.FLOAT,false,ST,24);
  gl.enableVertexAttribArray(mA.tex);gl.vertexAttribPointer(mA.tex,1,gl.FLOAT,false,ST,32);
  gl.enableVertexAttribArray(mA.sh);gl.vertexAttribPointer(mA.sh,1,gl.FLOAT,false,ST,36);
  gl.drawArrays(gl.TRIANGLES,0,V.length/10);}
function updateVM(){const s=inv[selSlot];if(!s){vmReady=false;vmItemId=-1;return;}if(s.id===vmItemId&&vmReady)return;vmItemId=s.id;const ic=itemIcon(s.id,128);
  gl.bindTexture(gl.TEXTURE_2D,vmTex);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,ic);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);vmReady=true;}
function drawViewmodel(){const s=inv[selSlot];if(!s)return;updateVM();if(!vmReady)return;
  const ar=canvas.width/canvas.height;const sw=viewSwing>0?Math.sin((1-viewSwing/0.35)*Math.PI):0;
  const cx=0.60-sw*0.62,cy=-0.58+sw*0.32,S=0.42,rot=-0.30-sw*1.8,cr=Math.cos(rot),sr=Math.sin(rot);
  function P(ux,uy){const lx=ux*S,ly=uy*S;const rx=lx*cr-ly*sr,ry=lx*sr+ly*cr;return [cx+rx/ar,cy+ry];}
  const a=P(-1,-1),b=P(1,-1),c=P(1,1),d=P(-1,1);
  const v=[a[0],a[1],0,0, b[0],b[1],1,0, c[0],c[1],1,1, a[0],a[1],0,0, c[0],c[1],1,1, d[0],d[1],0,1];
  gl.useProgram(hudProg);gl.disable(gl.DEPTH_TEST);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.disable(gl.CULL_FACE);
  gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,vmTex);gl.uniform1i(hU.tex,0);
  gl.bindBuffer(gl.ARRAY_BUFFER,hudBuf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(v),gl.DYNAMIC_DRAW);
  gl.enableVertexAttribArray(hA.pos);gl.vertexAttribPointer(hA.pos,2,gl.FLOAT,false,16,0);gl.enableVertexAttribArray(hA.uv);gl.vertexAttribPointer(hA.uv,2,gl.FLOAT,false,16,8);
  gl.drawArrays(gl.TRIANGLES,0,6);gl.disable(gl.BLEND);gl.enable(gl.DEPTH_TEST);gl.enable(gl.CULL_FACE);}
function drawSprites(){const right=[view[0],view[4],view[8]],up=[view[1],view[5],view[9]];const eye=[player.pos[0],player.pos[1]+player.EYE,player.pos[2]];
  const list=mobs.filter(m=>m.char===undefined&&!m.classic).map(m=>({m,d:(m.pos[0]-eye[0])**2+(m.pos[2]-eye[2])**2}));list.sort((a,b)=>b.d-a.d);
  gl.disable(gl.CULL_FACE);gl.useProgram(sProg);gl.uniformMatrix4fv(sU.proj,false,proj);gl.uniformMatrix4fv(sU.view,false,view);gl.activeTexture(gl.TEXTURE0);gl.uniform1i(sU.tex,0);
  const db=dayBright();let bound=-1;
  for(const {m} of list){const isChar=(m.char!==undefined);
    if(isChar?bound!==1:bound!==0){gl.bindTexture(gl.TEXTURE_2D,isChar?charTex:sprTex);bound=isChar?1:0;}
    const uv=isChar?charUV(m.char):sprUV(m.spr);const hh=m.H||1.8;const hw=isChar?hh*0.5:(m.W||0.6)*0.9;const c=[m.pos[0],m.pos[1]+hh/2,m.pos[2]];
    const rX=right[0]*hw,rY=right[1]*hw,rZ=right[2]*hw,uX=up[0]*hh/2,uY=up[1]*hh/2,uZ=up[2]*hh/2;
    const v=[c[0]-rX-uX,c[1]-rY-uY,c[2]-rZ-uZ,uv.u0,uv.v1, c[0]+rX-uX,c[1]+rY-uY,c[2]+rZ-uZ,uv.u1,uv.v1, c[0]+rX+uX,c[1]+rY+uY,c[2]+rZ+uZ,uv.u1,uv.v0, c[0]-rX-uX,c[1]-rY-uY,c[2]-rZ-uZ,uv.u0,uv.v1, c[0]+rX+uX,c[1]+rY+uY,c[2]+rZ+uZ,uv.u1,uv.v0, c[0]-rX+uX,c[1]-rY+uY,c[2]-rZ+uZ,uv.u0,uv.v0];
    gl.bindBuffer(gl.ARRAY_BUFFER,sprBuf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(v),gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(sA.pos);gl.vertexAttribPointer(sA.pos,3,gl.FLOAT,false,20,0);gl.enableVertexAttribArray(sA.uv);gl.vertexAttribPointer(sA.uv,2,gl.FLOAT,false,20,12);
    const tnt=m.hurtCd>0?[1.6,0.7,0.7]:[db,db,db];gl.uniform4f(sU.tint,tnt[0],tnt[1],tnt[2],1);gl.drawArrays(gl.TRIANGLES,0,6);}
  gl.enable(gl.CULL_FACE);}
const sprBuf=gl.createBuffer();const lineBuf=gl.createBuffer();
function drawHighlight(){if(!breaking&&!raycast())return;const hit=raycast();if(!hit||mobInAim())return;const x=hit.x,y=hit.y,z=hit.z;
  const p=[x,y,z,x+1,y,z,x+1,y,z,x+1,y,z+1,x+1,y,z+1,x,y,z+1,x,y,z+1,x,y,z,x,y+1,z,x+1,y+1,z,x+1,y+1,z,x+1,y+1,z+1,x+1,y+1,z+1,x,y+1,z+1,x,y+1,z+1,x,y+1,z,x,y,z,x,y+1,z,x+1,y,z,x+1,y+1,z,x+1,y,z+1,x+1,y+1,z+1,x,y,z+1,x,y+1,z+1];
  gl.bindBuffer(gl.ARRAY_BUFFER,lineBuf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(p),gl.DYNAMIC_DRAW);gl.useProgram(lProg);gl.uniformMatrix4fv(lU.proj,false,proj);gl.uniformMatrix4fv(lU.view,false,view);gl.enableVertexAttribArray(lA.pos);gl.vertexAttribPointer(lA.pos,3,gl.FLOAT,false,0,0);gl.drawArrays(gl.LINES,0,24);}
function loop(now){const dt=Math.min(0.05,(now-last)/1000);last=now;
  if(started)updateParticles(dt);
  if(started&&!paused&&!invOpen&&!dead){updatePlayer(dt);updateMobs(dt);updateBreak(dt);tickGrowth(dt);const prev=dayTime;dayTime=(dayTime+dt/DAY_LEN)%1;if(prev>dayTime){dayNum++;scheduleSave();}}
  if(started&&!paused&&!dead)tickFurnaces(dt);
  if(started)streamChunks(4,3);
  const sky=skyColor();gl.clearColor(sky[0]*dayBright()+0.0,sky[1]*dayBright(),sky[2]*dayBright(),1);
  gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
  const eye=[player.pos[0],player.pos[1]+player.EYE,player.pos[2]],f=frontVec();
  const far=(RENDER_DIST+0.5)*CH;
  M4.perspective(proj,Math.PI/2.4,canvas.width/canvas.height,0.08,far+40);
  M4.lookAt(view,eye,[eye[0]+f[0],eye[1]+f[1],eye[2]+f[2]],[0,1,0]);
  M4.mul(vp,proj,view);const planes=frustumPlanes(vp);
  if(started){const _h=heldItem();if(_h&&_h.id===148)emitBladeGlow();}
  gl.useProgram(wProg);gl.uniformMatrix4fv(wU.proj,false,proj);gl.uniformMatrix4fv(wU.view,false,view);gl.uniform3fv(wU.sky,sky);gl.uniform1f(wU.day,dayBright());gl.uniform1f(wU.far,far);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,atlasTex);gl.uniform1i(wU.tex,0);
  let drawn=0;
  const pcx=Math.floor(player.pos[0]/CH),pcz=Math.floor(player.pos[2]/CH);
  for(const[k,ch]of chunks){if(!ch.buf||ch.count===0)continue;
    const ccx=ch.min[0]/CH,ccz=ch.min[2]/CH;const near=Math.abs(ccx-pcx)<=1&&Math.abs(ccz-pcz)<=1;
    if(!near&&!aabbInFrustum(planes,ch.min[0],ch.min[1],ch.min[2],ch.max[0],ch.max[1],ch.max[2]))continue;
    gl.bindBuffer(gl.ARRAY_BUFFER,ch.buf);gl.enableVertexAttribArray(wA.pos);gl.vertexAttribPointer(wA.pos,3,gl.FLOAT,false,32,0);gl.enableVertexAttribArray(wA.uv);gl.vertexAttribPointer(wA.uv,2,gl.FLOAT,false,32,12);gl.enableVertexAttribArray(wA.sh);gl.vertexAttribPointer(wA.sh,1,gl.FLOAT,false,32,20);gl.enableVertexAttribArray(wA.sky);gl.vertexAttribPointer(wA.sky,1,gl.FLOAT,false,32,24);gl.enableVertexAttribArray(wA.blk);gl.vertexAttribPointer(wA.blk,1,gl.FLOAT,false,32,28);
    gl.drawArrays(gl.TRIANGLES,0,ch.count);drawn++;}
  if(started){drawSprites();drawMobs3D();drawHighlight();drawViewmodel();}
  // hud
  if(started&&!paused){renderBars();updateBossBar();}
  fpsT+=dt;fpsN++;if(fpsT>=0.5){fpsV=Math.round(fpsN/fpsT);fpsT=0;fpsN=0;if(started)renderReadout(fpsV,drawn);}
  requestAnimationFrame(loop);}

/* periodic save + flush */
setInterval(()=>{if(started&&!dead)doSave(false);},15000);
window.addEventListener('beforeunload',()=>{if(started)Store.save(buildSave());});
if(window.gameAPI){window.gameAPI.onFlushSave?.(async()=>{await doSave(false);window.gameAPI.flushDone?.();});window.gameAPI.onNewWorld?.(()=>location.reload());}

/* ----------------------------- menus / boot ----------------------------- */
const overlay=document.getElementById('overlay');
function segWire(segId,cb){const seg=document.getElementById(segId);seg.querySelectorAll('button').forEach(b=>b.onclick=()=>{seg.querySelectorAll('button').forEach(x=>x.classList.remove('on'));b.classList.add('on');cb(b.dataset.v);});}
let pendMode='survival',pendDiff='normal';
segWire('segMode',v=>{pendMode=v;document.getElementById('diffField').style.opacity=v==='creative'?0.4:1;document.getElementById('modeHint').textContent=v==='creative'?'Unlimited blocks, flight (F), no danger.':'Gather, craft, eat, and survive the nights.';});
segWire('segDiff',v=>{pendDiff=v;document.getElementById('diffHint').textContent={peaceful:'No hostile mobs. Build in peace.',easy:'Few weak mobs, gentle hunger.',normal:'Hostile mobs at night, balanced.',hard:'Tougher mobs, hunger can kill you.'}[v];});
document.getElementById('newBtn').onclick=()=>{document.getElementById('start-main').classList.add('hidden');document.getElementById('start-new').classList.remove('hidden');};
document.getElementById('backBtn').onclick=()=>{document.getElementById('start-new').classList.add('hidden');document.getElementById('start-main').classList.remove('hidden');};
document.getElementById('createBtn').onclick=async()=>{await Store.clear();SEED=(Math.random()*1e9)|0;MODE=pendMode;DIFF=pendDiff;WORLDNAME=document.getElementById('worldName').value||"Adyah's World";dayNum=1;dayTime=0.27;inv=new Array(36).fill(null);selSlot=0;
  if(MODE==='survival'){inv[0]={id:113,count:1,dur:IT[113].dur};inv[1]={id:110,count:1,dur:IT[110].dur};inv[2]={id:170,count:1,dur:IT[170].dur};inv[3]={id:150,count:8};} // sword, pickaxe, hoe, seeds
  player.hp=20;player.hunger=20;player.fly=MODE==='creative';
  beginWorld(true);};
document.getElementById('continueBtn').onclick=()=>{beginWorld(false);};
document.getElementById('resumeBtn').onclick=()=>togglePause();
document.getElementById('saveQuitBtn').onclick=async()=>{await doSave(false);location.reload();};
document.getElementById('respawnBtn').onclick=()=>respawn();
document.getElementById('chestClose').onclick=()=>closeBEUI();
document.getElementById('furnClose').onclick=()=>closeBEUI();
const rdS=document.getElementById('rdSlider');rdS.oninput=()=>{RENDER_DIST=+rdS.value;document.getElementById('rdVal').textContent=rdS.value;scheduleSave();};

function setModePill(){document.getElementById('modepill').textContent=(MODE.toUpperCase())+' · '+DIFF.toUpperCase();}
function beginWorld(isNew){
  overlay.classList.add('hidden');started=true;audio();setModePill();
  // ensure spawn area
  if(isNew){player.pos=findSpawn();}
  else{ // make sure chunk under saved pos exists
    ensureGen(Math.floor(player.pos[0]/CH),Math.floor(player.pos[2]/CH));
    if(!solidAt(Math.floor(player.pos[0]),Math.floor(player.pos[1]-1),Math.floor(player.pos[2]))&&player.pos[1]<2)player.pos=findSpawn();}
  // pre-generate a ring so player doesn't fall
  streamChunks(60,30);
  renderHotbar();renderBars();
  document.getElementById('rdSlider').value=RENDER_DIST;document.getElementById('rdVal').textContent=RENDER_DIST;
  canvas.requestPointerLock();doSave(false);
}
async function boot(){resize();
  const save=await Store.load();
  if(save&&save.seed!==undefined){applySave(save);document.getElementById('continueBtn').style.display='inline-block';
    document.getElementById('savemeta').textContent=`${save.name||"Adyah's World"} · ${save.mode} · ${save.diff} · Day ${save.day||1}`;}
  else{document.getElementById('continueBtn').style.display='none';}
  requestAnimationFrame(loop);
}
boot();

/* automation/demo hook (harmless; used to script a gameplay recording) */
try{window.__mc={
  get player(){return player;}, keys,
  look:(dy,dp)=>{player.yaw+=dy;player.pitch=Math.max(-1.5,Math.min(1.5,player.pitch+(dp||0)));},
  walk:(c,v)=>{keys[c]=v;},
  sel:(i)=>{selSlot=i;renderHotbar();},
  mine:()=>{const h=raycast();if(h&&h.id!==28)mineBlock(h.x,h.y,h.z,h.id,MODE==='creative');},
  place:()=>placeBlock(),
  use:()=>useOrPlace(),
  jump:()=>{if(player.onGround){player.vel[1]=8.4;player.onGround=false;}},
  setTime:(t)=>{dayTime=t;},
  heal:()=>{player.hp=player.maxhp;player.hunger=player.maxh;},
  give:(id,n)=>{addItem(id,n||1);renderHotbar();},
  tp:(x,y,z)=>{player.pos=[x,y,z];player.vel=[0,0,0];},
  spawnAnimal:(t)=>{spawnMob(t||'pig',player.pos[0]+(Math.random()*4-2),player.pos[1]+1,player.pos[2]+(Math.random()*4-2));},
  surf:(x,z)=>surfaceY(x,z),
  spawnAt:(t,x,y,z)=>spawnMob(t,x,y,z),
  set:(x,y,z,id,meta)=>setBlock(x,y,z,id,meta||0),
  clearMobs:()=>{mobs.length=0;villagerSpawned=true;},
  e:()=>toggleInv(),
  attack:()=>attack(),
  get mobs(){return mobs;},
  faceNearest:(maxD)=>{let best=null,bd=1e9;for(const m of mobs){const dx=m.pos[0]-player.pos[0],dy=(m.pos[1]+m.H*0.5)-(player.pos[1]+1.5),dz=m.pos[2]-player.pos[2];const d=Math.hypot(dx,dy,dz);if(d<bd){bd=d;best={dx,dy,dz,d,m};}}if(!best||(maxD&&best.d>maxD))return null;player.yaw=Math.atan2(best.dx,-best.dz);player.pitch=Math.max(-1.5,Math.min(1.5,Math.atan2(best.dy,Math.hypot(best.dx,best.dz))));return +best.d.toFixed(2);},
  setHot:(i,id,n)=>{inv[i]={id,count:n||1};selSlot=Math.max(0,Math.min(8,i));renderHotbar();},
  villages:()=>[...villages.values()],
  findVillage:()=>{ for(let R=0;R<40;R++){ for(let cx=-R;cx<=R;cx++)for(let cz=-R;cz<=R;cz++){ if(Math.max(Math.abs(cx),Math.abs(cz))!==R)continue; if(chunkVillage(cx,cz)){ensureGen(cx,cz);const v=villages.get(ckey(cx,cz));if(v)return v;} } } return null; },
  swing:()=>{swingHand();},
  shoot:()=>{shootBow();},
  info:()=>({pos:player.pos.map(n=>+n.toFixed(1)),yaw:+player.yaw.toFixed(2),mobs:mobs.length,hp:Math.round(player.hp),started})
};}catch(e){}
