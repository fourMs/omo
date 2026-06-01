#!/usr/bin/env node
/** Generates remaining IDEAS instrument apps. Run: node scripts/generate-idea-apps.mjs */
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function page(title, learn, script, extra = "") {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
  <meta name="theme-color" content="#0d0f14" />
  <title>${title} — OMO</title>
  <link rel="stylesheet" href="../../shared/ui.css" />
  ${extra}
</head>
<body class="app-shell">
  <header class="app-header">
    <a class="back-link" href="../../">←</a>
    <h1>${title}</h1>
  </header>
  <div class="learn-panel panel" id="learnPanel">${learn}</div>
  <div class="main-stage">
    <div id="pad" class="stage-fill play-grid"><div class="touch-dot" id="dot"></div></div>
  </div>
  <script type="module">
${script}
  </script>
</body>
</html>`;
}

const clamp = `const clamp=(v,lo,hi)=>Math.min(hi,Math.max(lo,v));`;
const padBase = `
import { bindLearn, startAudio } from "../../shared/app.js";
import { createMasterBus } from "../../shared/audio.js";
bindLearn();
const pad=document.getElementById("pad");
const dot=document.getElementById("dot");
${clamp}
let ctx,master,built=false,holding=false,activeId=null;
`;

const APPS = [
  {
    slug: "gyro-whirl",
    title: "Spin Chorus",
    section: "synthesis",
    synth: "FM vibrato stack",
    sensors: "Gyro · touch",
    learn: "<h2>Gyro whirl</h2><p><strong>Hold</strong> the pad. <strong>Spin</strong> the phone — rotation rate deepens vibrato and stereo wobble.</p>",
    script: `${padBase}
import { enableSensors, onMotion, primeSensors } from "../../shared/sensors.js";
let osc,amp,pan,lfo,lfoG;
function build(c){ctx=c;({master}=createMasterBus(c,0.5));osc=ctx.createOscillator();amp=ctx.createGain();pan=ctx.createStereoPanner();lfo=ctx.createOscillator();lfoG=ctx.createGain();lfo.frequency.value=5;lfoG.gain.value=0;lfo.connect(lfoG);lfoG.connect(osc.detune);osc.type="sine";osc.connect(amp);amp.connect(pan);pan.connect(master);osc.start();lfo.start();built=true;
primeSensors({needMotion:true,needOrientation:false});enableSensors({needMotion:true,needOrientation:false}).then(ok=>{if(!ok)return;onMotion(({rotAlpha:a,rotBeta:b,rotGamma:g})=>{if(!holding)return;const rate=Math.sqrt(a*a+b*b+g*g);const t=ctx.currentTime;lfo.frequency.setTargetAtTime(3+rate*0.08,t,0.05);lfoG.gain.setTargetAtTime(Math.min(45,rate*0.4),t,0.05);pan.pan.setTargetAtTime(clamp(rate*0.002,-1,1),t,0.06);});});}
function setPad(nx,ny,on){const t=ctx.currentTime;osc.frequency.setTargetAtTime(90*Math.pow(6,nx),t,0.03);amp.gain.setTargetAtTime(on?0.28:0,t,on?0.02:0.06);}
pad.addEventListener("pointerdown",async e=>{e.preventDefault();await startAudio(!built?build:undefined);if(!built)return;holding=true;activeId=e.pointerId;pad.setPointerCapture(activeId);pad.classList.add("active");const r=pad.getBoundingClientRect();setPad(clamp((e.clientX-r.left)/r.width,0,1),clamp((e.clientY-r.top)/r.height,0,1),true);});
pad.addEventListener("pointermove",e=>{if(!holding||e.pointerId!==activeId)return;const r=pad.getBoundingClientRect();setPad(clamp((e.clientX-r.left)/r.width,0,1),clamp((e.clientY-r.top)/r.height,0,1),true);});
const off=e=>{if(e.pointerId!==activeId)return;holding=false;pad.classList.remove("active");setPad(0.5,0.5,false);};
pad.addEventListener("pointerup",off);pad.addEventListener("pointercancel",off);pad.addEventListener("lostpointercapture",off);`,
  },
  {
    slug: "shake-filter",
    title: "Jerk Wah",
    section: "drones",
    synth: "Subtractive",
    sensors: "Motion · touch",
    learn: "<h2>Shake filter</h2><p><strong>Hold</strong> for tone. <strong>Shake</strong> opens the filter and resonance.</p>",
    script: `${padBase}
import { enableSensors, onMotion, primeSensors } from "../../shared/sensors.js";
let osc,amp,filt,last={x:0,y:0,z:0},primed=false;
function build(c){ctx=c;({master}=createMasterBus(c,0.5));osc=ctx.createOscillator();amp=ctx.createGain();filt=ctx.createBiquadFilter();filt.type="lowpass";amp.gain.value=0;osc.connect(filt);filt.connect(amp);amp.connect(master);osc.start();built=true;
primeSensors({needMotion:true,needOrientation:false});enableSensors({needMotion:true,needOrientation:false}).then(ok=>{if(!ok)return;onMotion(({x,y,z})=>{if(!holding)return;if(!primed){last={x,y,z};primed=true;return;}const j=Math.hypot(x-last.x,y-last.y,z-last.z);last={x,y,z};const t=ctx.currentTime;filt.frequency.setTargetAtTime(400+j*900,t,0.04);filt.Q.setTargetAtTime(4+j*4,t,0.05);});});}
function setPad(nx,on){const t=ctx.currentTime;osc.frequency.setTargetAtTime(90*Math.pow(6,nx),t,0.03);amp.gain.setTargetAtTime(on?0.3:0,t,on?0.02:0.06);}
pad.addEventListener("pointerdown",async e=>{e.preventDefault();await startAudio(!built?build:undefined);if(!built)return;holding=true;activeId=e.pointerId;pad.setPointerCapture(activeId);pad.classList.add("active");const r=pad.getBoundingClientRect();setPad(clamp((e.clientX-r.left)/r.width,0,1),true);});
pad.addEventListener("pointermove",e=>{if(!holding||e.pointerId!==activeId)return;const r=pad.getBoundingClientRect();setPad(clamp((e.clientX-r.left)/r.width,0,1),true);});
const off=e=>{if(e.pointerId!==activeId)return;holding=false;pad.classList.remove("active");setPad(0.5,false);};
pad.addEventListener("pointerup",off);pad.addEventListener("pointercancel",off);`,
  },
  {
    slug: "pocket-metronome",
    title: "Pocket Pulse",
    section: "rhythm",
    synth: "Pulse + duck",
    sensors: "Accel · touch",
    learn: "<h2>Pocket metronome</h2><p>Walking or tapping ducks a steady pulse. <strong>Hold</strong> the pad to hear the beat.</p>",
    script: `import { bindLearn, startAudio } from "../../shared/app.js";
import { createMasterBus } from "../../shared/audio.js";
import { enableSensors, onMotion } from "../../shared/sensors.js";
bindLearn();
let ctx,master,toneGain,built=false,lastStep=0;
const pad=document.getElementById("pad");
function build(c){ctx=c;({master}=createMasterBus(c,0.55));toneGain=ctx.createGain();toneGain.gain.value=0;toneGain.connect(master);built=true;
setInterval(()=>{if(!ctx)return;const t=ctx.currentTime;const o=ctx.createOscillator(),g=ctx.createGain();o.frequency.value=1000;g.gain.setValueAtTime(0.18,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.05);o.connect(g);g.connect(master);o.start(t);o.stop(t+0.07);},500);
enableSensors({needMotion:true,needOrientation:false}).then(ok=>{if(!ok)return;onMotion(({x,y,z})=>{const m=Math.sqrt(x*x+y*y+z*z);if(m>11&&performance.now()-lastStep>280){lastStep=performance.now();toneGain.gain.setTargetAtTime(0.04,ctx.currentTime,0.01);toneGain.gain.setTargetAtTime(0.22,ctx.currentTime+0.1,0.06);}});});}
pad.addEventListener("pointerdown",async()=>{await startAudio(!built?build:undefined);toneGain.gain.value=0.2;pad.classList.add("active");});
pad.addEventListener("pointerup",()=>{toneGain.gain.value=0;pad.classList.remove("active");});`,
  },
  {
    slug: "flat-edge",
    title: "Table Drone",
    section: "drones",
    synth: "Gated drone",
    sensors: "Tilt · touch",
    learn: "<h2>Flat / edge</h2><p>Sound only when the phone is <strong>flat</strong> on a table. <strong>Hold</strong> to enable the gate.</p>",
    script: `${padBase}
import { enableSensors, onOrientation } from "../../shared/sensors.js";
let osc,amp;
function build(c){ctx=c;({master}=createMasterBus(c,0.48));osc=ctx.createOscillator();amp=ctx.createGain();amp.gain.value=0;osc.connect(amp);amp.connect(master);osc.start();built=true;
enableSensors({needMotion:false,needOrientation:true}).then(ok=>{if(!ok)return;onOrientation(o=>{if(!holding)return;const flat=Math.abs(o.beta||0)<18&&Math.abs(o.gamma||0)<18;amp.gain.setTargetAtTime(flat?0.26:0,ctx.currentTime,flat?0.08:0.04);});});}
pad.addEventListener("pointerdown",async e=>{e.preventDefault();await startAudio(!built?build:undefined);holding=true;pad.classList.add("active");const r=pad.getBoundingClientRect();osc.frequency.setTargetAtTime(80*Math.pow(5,clamp((e.clientX-r.left)/r.width,0,1)),ctx.currentTime,0.04);});
pad.addEventListener("pointerup",()=>{holding=false;pad.classList.remove("active");amp.gain.setTargetAtTime(0,ctx.currentTime,0.1);});`,
  },
  {
    slug: "heading-choir",
    title: "Heading Choir",
    section: "drones",
    synth: "Detuned pans",
    sensors: "Compass · touch",
    learn: "<h2>Compass choir</h2><p><strong>Hold</strong> and turn your body — the section you face sings loudest.</p>",
    script: `${padBase}
import { enableSensors, onOrientation, primeSensors } from "../../shared/sensors.js";
let voices=[],headingDeg=0;
function headingFrom(o){if(typeof o.webkitCompassHeading==="number")return o.webkitCompassHeading;return o.alpha??headingDeg;}
function applyHeading(h){headingDeg=((h%360)+360)%360;if(!holding||!ctx)return;const t=ctx.currentTime;let sum=0;const w=[];for(let i=0;i<5;i++){const c=i*72,d=Math.abs(((headingDeg-c+540)%360)-180);w[i]=Math.pow(Math.max(0,1-d/52),2);sum+=w[i];}sum=sum||1;voices.forEach((v,i)=>{const n=w[i]/sum;v.g.gain.setTargetAtTime(0.025+n*0.38,t,0.06);v.p.pan.setTargetAtTime(Math.sin((headingDeg/360+i/5)*Math.PI*2)*0.95,t,0.08);});}
function build(c){ctx=c;({master}=createMasterBus(c,0.48));for(let i=0;i<5;i++){const o=ctx.createOscillator(),g=ctx.createGain(),p=ctx.createStereoPanner();g.gain.value=0;o.frequency.value=110*Math.pow(2,i*7/12);o.connect(g);g.connect(p);p.connect(master);o.start();voices.push({g,p});}built=true;}
primeSensors({needMotion:false,needOrientation:true});enableSensors({needMotion:false,needOrientation:true}).then(ok=>{if(!ok)return;onOrientation(o=>applyHeading(headingFrom(o)));});
pad.addEventListener("pointerdown",async e=>{e.preventDefault();primeSensors({needMotion:false,needOrientation:true});await startAudio(!built?build:undefined);holding=true;pad.classList.add("active");applyHeading(headingDeg);});
pad.addEventListener("pointerup",()=>{holding=false;pad.classList.remove("active");voices.forEach(v=>v.g.gain.setTargetAtTime(0,ctx.currentTime,0.1));});`,
  },
  {
    slug: "tilt-doppler",
    title: "Doppler Tilt",
    section: "melody",
    synth: "Pitch glide",
    sensors: "Tilt · touch",
    learn: "<h2>Tilt doppler</h2><p><strong>Hold</strong> — tilting speed bends pitch like a doppler sweep.</p>",
    script: `${padBase}
import { enableSensors, onOrientation } from "../../shared/sensors.js";
let osc,amp,lastB=0;
function build(c){ctx=c;({master}=createMasterBus(c,0.5));osc=ctx.createOscillator();amp=ctx.createGain();amp.gain.value=0;osc.connect(amp);amp.connect(master);osc.start();built=true;
enableSensors({needMotion:false,needOrientation:true}).then(ok=>{if(!ok)return;onOrientation(o=>{if(!holding)return;const b=o.beta||0;const db=(b-lastB)*50;lastB=b;osc.detune.setTargetAtTime(clamp(db*10,-1200,1200),ctx.currentTime,0.03);});});}
function setPad(nx,on){osc.frequency.setTargetAtTime(150*Math.pow(4,nx),ctx.currentTime,0.03);amp.gain.setTargetAtTime(on?0.3:0,ctx.currentTime,on?0.02:0.06);}
pad.addEventListener("pointerdown",async e=>{e.preventDefault();await startAudio(!built?build:undefined);holding=true;activeId=e.pointerId;pad.setPointerCapture(activeId);pad.classList.add("active");const r=pad.getBoundingClientRect();setPad(clamp((e.clientX-r.left)/r.width,0,1),true);});
pad.addEventListener("pointermove",e=>{if(!holding||e.pointerId!==activeId)return;const r=pad.getBoundingClientRect();setPad(clamp((e.clientX-r.left)/r.width,0,1),true);});
const off=e=>{if(e.pointerId!==activeId)return;holding=false;pad.classList.remove("active");setPad(0.5,false);};
pad.addEventListener("pointerup",off);pad.addEventListener("pointercancel",off);`,
  },
  {
    slug: "room-reverb-send",
    title: "Room Wash",
    section: "texture",
    synth: "Convolver wet",
    sensors: "Mic · touch",
    learn: "<h2>Room reverb send</h2><p><strong>Hold</strong> a tone. Room loudness (mic) pushes more reverb wet.</p>",
    script: `${padBase}
import { registerAudioBoot, primeMicStream } from "../../shared/app.js";
import { createKSReverb } from "../../shared/ks.js";
let osc,dry,wetGain,analyser,micSrc;
function build(c){ctx=c;({master}=createMasterBus(c,0.48));dry=ctx.createGain();wetGain=ctx.createGain();wetGain.gain.value=0;osc=ctx.createOscillator();osc.connect(dry);dry.connect(master);osc.connect(createKSReverb(ctx,wetGain,0.9));wetGain.connect(master);osc.start();built=true;}
registerAudioBoot(async c=>{build(c);const stream=await primeMicStream();micSrc=ctx.createMediaStreamSource(stream);analyser=ctx.createAnalyser();analyser.fftSize=256;micSrc.connect(analyser);const buf=new Float32Array(analyser.fftSize);function tick(){analyser.getFloatTimeDomainData(buf);let s=0;for(let i=0;i<buf.length;i++)s+=buf[i]*buf[i];const rms=Math.sqrt(s/buf.length);if(holding)wetGain.gain.setTargetAtTime(clamp(rms*8,0,0.85),ctx.currentTime,0.08);requestAnimationFrame(tick);}tick();},{mic:true});
function setPad(nx,on){osc.frequency.setTargetAtTime(100*Math.pow(5,nx),ctx.currentTime,0.03);dry.gain.setTargetAtTime(on?0.2:0,ctx.currentTime,on?0.02:0.06);}
pad.addEventListener("pointerdown",async e=>{e.preventDefault();await startAudio();holding=true;pad.classList.add("active");const r=pad.getBoundingClientRect();setPad(clamp((e.clientX-r.left)/r.width,0,1),true);});
pad.addEventListener("pointerup",()=>{holding=false;pad.classList.remove("active");setPad(0.5,false);wetGain.gain.setTargetAtTime(0,ctx.currentTime,0.1);});`,
  },
  {
    slug: "whisper-gate",
    title: "Soft Vowel",
    section: "texture",
    synth: "Formant noise",
    sensors: "Mic · touch",
    learn: "<h2>Whisper gate</h2><p>Only <strong>soft</strong> sounds pass — loud noise is gated out. Hold pad for vowel tone.</p>",
    script: `${padBase}
import { registerAudioBoot, primeMicStream } from "../../shared/app.js";
let noise,filter,analyser,micSrc;
function build(c){ctx=c;({master}=createMasterBus(c,0.45));noise=ctx.createBufferSource();const b=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate);const d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;noise.buffer=b;noise.loop=true;filter=ctx.createBiquadFilter();filter.type="bandpass";filter.frequency.value=600;filter.Q.value=8;const g=ctx.createGain();g.gain.value=0;noise.connect(filter);filter.connect(g);g.connect(master);noise.start();built=true;}
registerAudioBoot(async c=>{build(c);const stream=await primeMicStream();micSrc=ctx.createMediaStreamSource(stream);analyser=ctx.createAnalyser();analyser.fftSize=256;micSrc.connect(analyser);const buf=new Float32Array(analyser.fftSize);let floor=0.01;function tick(){analyser.getFloatTimeDomainData(buf);let s=0;for(let i=0;i<buf.length;i++)s+=buf[i]*buf[i];const rms=Math.sqrt(s/buf.length);floor=floor*0.995+rms*0.005;const pass=rms>floor*1.1&&rms<floor*4;filter.frequency.setTargetAtTime(pass?400+holding*400:200,ctx.currentTime,0.06);requestAnimationFrame(tick);}tick();},{mic:true});
pad.addEventListener("pointerdown",async()=>{await startAudio();holding=true;pad.classList.add("active");});
pad.addEventListener("pointerup",()=>{holding=false;pad.classList.remove("active");});`,
  },
  {
    slug: "clap-architect",
    title: "Clap Grid",
    section: "rhythm",
    synth: "Learned kit",
    sensors: "Mic · touch",
    learn: "<h2>Clap architect</h2><p><strong>Clap</strong> to add steps. Hold pad to hear the evolving grid.</p>",
    script: `import { bindLearn, registerAudioBoot, startAudio } from "../../shared/app.js";
import { createMasterBus } from "../../shared/audio.js";
import { primeMicStream } from "../../shared/audio.js";
import { createOnsetDetector } from "../../shared/onset-detect.js";
import { playKick, playSnare, playHat } from "../../shared/drum-sounds.js";
bindLearn();
const pad=document.getElementById("pad");
let ctx,master,built=false,steps=Array(8).fill(false),idx=0;
function playStep(i){const t=ctx.currentTime;if(!steps[i])return;if(i%3===0)playKick(ctx,master,t,0.9);else if(i%3===1)playSnare(ctx,master,t,0.85);else playHat(ctx,master,t,0.7);}
function build(c){ctx=c;({master}=createMasterBus(c,0.55));built=true;setInterval(()=>{if(!ctx)return;playStep(idx);idx=(idx+1)%8;},400);}
registerAudioBoot(async c=>{build(c);const stream=await primeMicStream();createOnsetDetector(ctx,stream,{onOnset:()=>{steps[idx]=!steps[idx];}});},{mic:true});
pad.addEventListener("pointerdown",async()=>{await startAudio();pad.classList.add("active");});
pad.addEventListener("pointerup",()=>pad.classList.remove("active"));`,
  },
  {
    slug: "pitch-hive",
    title: "Hum Hive",
    section: "drones",
    synth: "Additive chord",
    sensors: "Mic · touch",
    learn: "<h2>Pitch hive</h2><p>Hum near the mic — partials build a chord. <strong>Hold</strong> to sustain the hive.</p>",
    script: `${padBase}
import { registerAudioBoot, primeMicStream } from "../../shared/app.js";
import { detectPitchHz } from "../../shared/pitch.js";
let partials=[],analyser,micSrc;
function build(c){ctx=c;({master}=createMasterBus(c,0.42));for(let i=0;i<5;i++){const o=ctx.createOscillator(),g=ctx.createGain();g.gain.value=0;o.connect(g);g.connect(master);o.start();partials.push({o,g});}built=true;}
registerAudioBoot(async c=>{build(c);const stream=await primeMicStream();micSrc=ctx.createMediaStreamSource(stream);analyser=ctx.createAnalyser();analyser.fftSize=2048;micSrc.connect(analyser);const buf=new Float32Array(analyser.fftSize);function tick(){analyser.getFloatTimeDomainData(buf);const hz=detectPitchHz(buf,ctx.sampleRate);if(hz&&holding){partials.forEach((p,i)=>{p.o.frequency.setTargetAtTime(hz*(i+1)*0.98,ctx.currentTime,0.08);p.g.gain.setTargetAtTime(0.05/(i+1),ctx.currentTime,0.06);});}requestAnimationFrame(tick);}tick();},{mic:true});
pad.addEventListener("pointerdown",async()=>{await startAudio();holding=true;pad.classList.add("active");});
pad.addEventListener("pointerup",()=>{holding=false;pad.classList.remove("active");partials.forEach(p=>p.g.gain.setTargetAtTime(0,ctx.currentTime,0.1));});`,
  },
  {
    slug: "shadow-sequencer",
    title: "Shadow Steps",
    section: "rhythm",
    synth: "8-step mask",
    sensors: "Camera · touch",
    learn: "<h2>Shadow sequencer</h2><p>Front camera brightness — hand shadow toggles steps. Allow camera.</p>",
    script: `import { bindLearn, registerAudioBoot, startAudio } from "../../shared/app.js";
import { createMasterBus } from "../../shared/audio.js";
import { playKick, playSnare } from "../../shared/drum-sounds.js";
bindLearn();
const pad=document.getElementById("pad");
let ctx,master,video,canvas,ctx2,built=false,steps=Array(8).fill(false),idx=0,lastBright=0;
function playStep(i){const t=ctx.currentTime;if(!steps[i])return;i%2?playSnare(ctx,master,t,0.8):playKick(ctx,master,t,0.9);}
function build(c){ctx=c;({master}=createMasterBus(c,0.55));built=true;setInterval(()=>{playStep(idx);idx=(idx+1)%8;},420);}
registerAudioBoot(async c=>{build(c);video=document.createElement("video");video.playsInline=true;video.muted=true;const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"user",width:160,height:120}});video.srcObject=stream;await video.play();canvas=document.createElement("canvas");canvas.width=40;canvas.height=30;ctx2=canvas.getContext("2d");function tick(){ctx2.drawImage(video,0,0,40,30);const d=ctx2.getImageData(0,0,40,30).data;let s=0;for(let i=0;i<d.length;i+=4)s+=d[i];const bright=s/(40*30);if(bright<lastBright-8)steps[idx]=!steps[idx];lastBright=bright;requestAnimationFrame(tick);}tick();});
pad.addEventListener("pointerdown",async()=>{await startAudio();pad.classList.add("active");});
pad.addEventListener("pointerup",()=>pad.classList.remove("active"));`,
  },
  {
    slug: "color-band",
    title: "Hue Scale",
    section: "melody",
    synth: "Quantized melody",
    sensors: "Camera · touch",
    learn: "<h2>Color band</h2><p>Point camera at coloured objects — hue picks scale degree. Hold pad to play.</p>",
    script: `${padBase}
import { registerAudioBoot, startAudio } from "../../shared/app.js";
let osc,amp,video,canvas,ctx2,hue=0;
const scale=[0,2,4,5,7,9,11];
function build(c){ctx=c;({master}=createMasterBus(c,0.5));osc=ctx.createOscillator();amp=ctx.createGain();amp.gain.value=0;osc.connect(amp);amp.connect(master);osc.start();built=true;}
registerAudioBoot(async c=>{build(c);video=document.createElement("video");video.playsInline=true;video.muted=true;const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment",width:120,height:90}});video.srcObject=stream;await video.play();canvas=document.createElement("canvas");canvas.width=32;canvas.height=24;ctx2=canvas.getContext("2d");function tick(){ctx2.drawImage(video,0,0,32,24);const d=ctx2.getImageData(16,12,1,1).data;const r=d[0]/255,g=d[1]/255,b=d[2]/255;const max=Math.max(r,g,b),min=Math.min(r,g,b);let h=0;if(max>min){if(max===r)h=(g-b)/(max-min);else if(max===g)h=2+(b-r)/(max-min);else h=4+(r-g)/(max-min);h*=60;if(h<0)h+=360;}hue=h;requestAnimationFrame(tick);}tick();});
function noteFromHue(){const deg=scale[Math.floor(hue/360*scale.length)%scale.length];return 220*Math.pow(2,deg/12);}
pad.addEventListener("pointerdown",async e=>{e.preventDefault();await startAudio();holding=true;pad.classList.add("active");osc.frequency.setTargetAtTime(noteFromHue(),ctx.currentTime,0.02);amp.gain.setTargetAtTime(0.28,ctx.currentTime,0.02);});
pad.addEventListener("pointermove",()=>{if(holding)osc.frequency.setTargetAtTime(noteFromHue(),ctx.currentTime,0.05);});
pad.addEventListener("pointerup",()=>{holding=false;pad.classList.remove("active");amp.gain.setTargetAtTime(0,ctx.currentTime,0.06);});`,
  },
  {
    slug: "motion-grid",
    title: "Grain Cam",
    section: "texture",
    synth: "Granular density",
    sensors: "Camera · touch",
    learn: "<h2>Motion grid</h2><p>Camera motion energy controls grain rate and filter.</p>",
    script: `${padBase}
import { registerAudioBoot, startAudio } from "../../shared/app.js";
let noise,filt,grainAmp,video,canvas,ctx2,prev=null;
function build(c){ctx=c;({master}=createMasterBus(c,0.45));noise=ctx.createBufferSource();const b=ctx.createBuffer(1,ctx.sampleRate,ctx.sampleRate);const d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;noise.buffer=b;noise.loop=true;filt=ctx.createBiquadFilter();grainAmp=ctx.createGain();grainAmp.gain.value=0;noise.connect(filt);filt.connect(grainAmp);grainAmp.connect(master);noise.start();built=true;}
registerAudioBoot(async c=>{build(c);video=document.createElement("video");video.playsInline=true;video.muted=true;const stream=await navigator.mediaDevices.getUserMedia({video:true});video.srcObject=stream;await video.play();canvas=document.createElement("canvas");canvas.width=48;canvas.height=36;ctx2=canvas.getContext("2d");function tick(){ctx2.drawImage(video,0,0,48,36);const img=ctx2.getImageData(0,0,48,36);if(prev&&holding){let diff=0;for(let i=0;i<img.data.length;i+=4)diff+=Math.abs(img.data[i]-prev[i]);const e=diff/(48*36*255);filt.frequency.setTargetAtTime(200+e*4000,ctx.currentTime,0.04);grainAmp.gain.setTargetAtTime(0.05+e*0.3,ctx.currentTime,0.05);}prev=new Uint8ClampedArray(img.data);requestAnimationFrame(tick);}tick();});
pad.addEventListener("pointerdown",async()=>{await startAudio();holding=true;pad.classList.add("active");});
pad.addEventListener("pointerup",()=>{holding=false;pad.classList.remove("active");grainAmp.gain.setTargetAtTime(0,ctx.currentTime,0.1);});`,
  },
  {
    slug: "torch-pulse",
    title: "Flash Beat",
    section: "rhythm",
    synth: "Click + flash",
    sensors: "Camera · touch",
    learn: "<h2>Torch pulse</h2><p>Tap pad for click; screen flashes on beat. Rear camera preview optional.</p>",
    script: `import { bindLearn, startAudio } from "../../shared/app.js";
import { createMasterBus } from "../../shared/audio.js";
bindLearn();
const pad=document.getElementById("pad");
let ctx,master,built=false;
function flash(){document.body.style.background="#fff8e0";setTimeout(()=>document.body.style.background="",80);}
function click(){const t=ctx.currentTime;const o=ctx.createOscillator(),g=ctx.createGain();o.frequency.value=1200;g.gain.setValueAtTime(0.25,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.06);o.connect(g);g.connect(master);o.start(t);o.stop(t+0.07);flash();}
function build(c){ctx=c;({master}=createMasterBus(c,0.5));built=true;setInterval(()=>{if(built)click();},600);}
pad.addEventListener("pointerdown",async e=>{e.preventDefault();await startAudio(!built?build:undefined);click();pad.classList.add("active");});
pad.addEventListener("pointerup",()=>pad.classList.remove("active"));`,
  },
  {
    slug: "pinch-bass",
    title: "Pinch Sub",
    section: "synthesis",
    synth: "Subtractive bass",
    sensors: "Pinch · touch",
    learn: "<h2>Pinch bass</h2><p>Use <strong>two fingers</strong> — pinch distance controls filter and sub level.</p>",
    script: `${padBase}
let osc,amp,filt,d1=null,d2=null;
function build(c){ctx=c;({master}=createMasterBus(c,0.55));osc=ctx.createOscillator();osc.type="sawtooth";filt=ctx.createBiquadFilter();filt.type="lowpass";amp=ctx.createGain();amp.gain.value=0;osc.connect(filt);filt.connect(amp);amp.connect(master);osc.start();built=true;}
function pinchDist(){if(d1===null||d2===null)return 0.5;return clamp(Math.hypot(d2.x-d1.x,d2.y-d1.y)/300,0.05,1);}
pad.addEventListener("pointerdown",async e=>{e.preventDefault();await startAudio(!built?build:undefined);if(e.pointerType==="touch"){if(d1===null)d1={x:e.clientX,y:e.clientY,id:e.pointerId};else d2={x:e.clientX,y:e.clientY,id:e.pointerId};}pad.classList.add("active");});
pad.addEventListener("pointermove",e=>{if(e.pointerId===d1?.id)d1={x:e.clientX,y:e.clientY,id:e.pointerId};if(e.pointerId===d2?.id)d2={x:e.clientX,y:e.clientY,id:e.pointerId};const p=pinchDist();osc.frequency.setTargetAtTime(55+80*(1-p),ctx.currentTime,0.04);filt.frequency.setTargetAtTime(120+p*1800,ctx.currentTime,0.04);amp.gain.setTargetAtTime(0.15+p*0.25,ctx.currentTime,0.03);});
pad.addEventListener("pointerup",e=>{if(e.pointerId===d1?.id)d1=null;if(e.pointerId===d2?.id)d2=null;if(!d1&&!d2){amp.gain.setTargetAtTime(0,ctx.currentTime,0.06);pad.classList.remove("active");}});`,
  },
  {
    slug: "pressure-pad",
    title: "Force Bright",
    section: "melody",
    synth: "Wavetable scan",
    sensors: "Force · touch",
    learn: "<h2>Pressure pad</h2><p>Hard press (where supported) → louder and brighter.</p>",
    script: `${padBase}
let osc,amp;
function build(c){ctx=c;({master}=createMasterBus(c,0.5));osc=ctx.createOscillator();amp=ctx.createGain();amp.gain.value=0;osc.connect(amp);amp.connect(master);osc.start();built=true;}
pad.addEventListener("pointerdown",async e=>{e.preventDefault();await startAudio(!built?build:undefined);holding=true;activeId=e.pointerId;pad.setPointerCapture(activeId);pad.classList.add("active");const f=e.force>0?e.force:0.5;const r=pad.getBoundingClientRect();osc.frequency.setTargetAtTime(100*Math.pow(6,clamp((e.clientX-r.left)/r.width,0,1)),ctx.currentTime,0.02);osc.type=f>0.6?"square":"sine";amp.gain.setTargetAtTime(0.1+f*0.35,ctx.currentTime,0.02);});
pad.addEventListener("pointermove",e=>{if(e.pointerId!==activeId)return;const f=e.force>0?e.force:0.5;amp.gain.setTargetAtTime(0.1+f*0.35,ctx.currentTime,0.03);});
const off=e=>{if(e.pointerId!==activeId)return;holding=false;pad.classList.remove("active");amp.gain.setTargetAtTime(0,ctx.currentTime,0.06);};
pad.addEventListener("pointerup",off);pad.addEventListener("pointercancel",off);`,
  },
  {
    slug: "edge-strum",
    title: "Rim Pluck",
    section: "synthesis",
    synth: "KS harmonics",
    sensors: "Touch position",
    learn: "<h2>Edge strum</h2><p>Tap near the <strong>edge</strong> for bright harmonics; centre for fundamental.</p>",
    script: `${padBase}
import { createKSPool, karplusPluck } from "../../shared/ks.js";
let pool;
function build(c){ctx=c;({master}=createMasterBus(c,0.55));pool=createKSPool(6);built=true;}
pad.addEventListener("pointerdown",async e=>{e.preventDefault();await startAudio(!built?build:undefined);const r=pad.getBoundingClientRect();const nx=clamp((e.clientX-r.left)/r.width,0,1);const ny=clamp((e.clientY-r.top)/r.height,0,1);const edge=Math.min(nx,1-nx,ny,1-ny)<0.12;const hz=110*Math.pow(4,nx);karplusPluck(ctx,master,pool,hz,{strength:edge?0.7:0.45,dampHz:edge?5000:900,level:0.32});pad.classList.add("active");});
pad.addEventListener("pointerup",()=>pad.classList.remove("active"));`,
  },
  {
    slug: "haptic-click",
    title: "Vibe Lane",
    section: "rhythm",
    synth: "Sequencer + vibe",
    sensors: "Touch · vibrate",
    learn: "<h2>Haptic click</h2><p>Toggle steps on the pad. On Android, rhythm also vibrates.</p>",
    script: `import { bindLearn, registerAudioBoot, startAudio } from "../../shared/app.js";
import { createMasterBus } from "../../shared/audio.js";
import { playHat } from "../../shared/drum-sounds.js";
bindLearn();
const pad=document.getElementById("pad");
let ctx,master,steps=Array(8).fill(true),idx=0,built=false;
function build(c){ctx=c;({master}=createMasterBus(c,0.5));built=true;setInterval(()=>{if(!ctx)return;if(steps[idx]){playHat(ctx,master,ctx.currentTime,0.85);if(navigator.vibrate)navigator.vibrate(12);}idx=(idx+1)%8;},350);}
registerAudioBoot(build);
pad.addEventListener("pointerdown",async e=>{e.preventDefault();await startAudio();const r=pad.getBoundingClientRect();const i=Math.floor(clamp((e.clientX-r.left)/r.width,0,0.99)*8);steps[i]=!steps[i];pad.classList.add("active");});
pad.addEventListener("pointerup",()=>pad.classList.remove("active"));
const clamp=(v,lo,hi)=>Math.min(hi,Math.max(lo,v));`,
  },
  {
    slug: "battery-drone",
    title: "Power Thin",
    section: "drones",
    synth: "Detune drift",
    sensors: "Battery · touch",
    learn: "<h2>Battery drone</h2><p>Low battery subtly thins and detunes the ensemble tone. Hold to play.</p>",
    script: `${padBase}
let osc,amp,osc2;
async function batt(){try{const b=await navigator.getBattery();return b.level;}catch{return 1;}}
function build(c){ctx=c;({master}=createMasterBus(c,0.4));osc=ctx.createOscillator();osc2=ctx.createOscillator();amp=ctx.createGain();amp.gain.value=0;osc.connect(amp);osc2.connect(amp);amp.connect(master);osc.start();osc2.start();built=true;}
pad.addEventListener("pointerdown",async e=>{e.preventDefault();await startAudio(!built?build:undefined);holding=true;pad.classList.add("active");const lv=await batt();const det=(1-lv)*25;osc.frequency.value=110;osc2.frequency.value=110*(1+det*0.002);amp.gain.setTargetAtTime(0.08+lv*0.2,ctx.currentTime,0.04);});
pad.addEventListener("pointerup",()=>{holding=false;pad.classList.remove("active");amp.gain.setTargetAtTime(0,ctx.currentTime,0.1);});`,
  },
  {
    slug: "geo-drone",
    title: "Walk Pan",
    section: "drones",
    synth: "Stereo delay",
    sensors: "GPS · touch",
    learn: "<h2>Geo drone</h2><p>Walking shifts stereo panorama (needs location permission).</p>",
    script: `${padBase}
let osc,pan,g,lastPos=null;
function build(c){ctx=c;({master}=createMasterBus(c,0.45));osc=ctx.createOscillator();pan=ctx.createStereoPanner();g=ctx.createGain();g.gain.value=0;osc.connect(g);g.connect(pan);pan.connect(master);osc.start();built=true;
if(navigator.geolocation)navigator.geolocation.watchPosition(p=>{if(!holding)return;if(lastPos){const dx=(p.coords.longitude-lastPos.lon)*1000;pan.pan.setTargetAtTime(clamp(dx*2,-1,1),ctx.currentTime,0.1);}lastPos={lon:p.coords.longitude,lat:p.coords.latitude};});}
pad.addEventListener("pointerdown",async()=>{await startAudio(!built?build:undefined);holding=true;pad.classList.add("active");osc.frequency.setTargetAtTime(90,ctx.currentTime,0.04);g.gain.setTargetAtTime(0.2,ctx.currentTime,0.04);});
pad.addEventListener("pointerup",()=>{holding=false;pad.classList.remove("active");g.gain.setTargetAtTime(0,ctx.currentTime,0.1);});`,
  },
  {
    slug: "hard-sync-lead",
    title: "Sync Scream",
    section: "synthesis",
    synth: "Hard sync lead",
    sensors: "Touch",
    learn: "<h2>Hard sync lead</h2><p><strong>X</strong> carrier pitch. <strong>Y</strong> modulator ratio — aggressive synced harmonics.</p>",
    script: `${padBase}
let carrier,mod,modGain,out;
function build(c){ctx=c;({master}=createMasterBus(c,0.5));carrier=ctx.createOscillator();mod=ctx.createOscillator();modGain=ctx.createGain();modGain.gain.value=200;out=ctx.createGain();out.gain.value=0;mod.connect(modGain);modGain.connect(carrier.frequency);carrier.connect(out);out.connect(master);carrier.type=mod.type="sawtooth";carrier.start();mod.start();built=true;}
function setPad(nx,ny,on){const t=ctx.currentTime;const hz=80*Math.pow(8,nx);carrier.frequency.setTargetAtTime(hz,t,0.02);mod.frequency.setTargetAtTime(hz*(1.5+ny*6),t,0.02);out.gain.setTargetAtTime(on?0.25:0,t,on?0.02:0.06);}
pad.addEventListener("pointerdown",async e=>{e.preventDefault();await startAudio(!built?build:undefined);holding=true;activeId=e.pointerId;pad.setPointerCapture(activeId);pad.classList.add("active");const r=pad.getBoundingClientRect();setPad(clamp((e.clientX-r.left)/r.width,0,1),clamp((e.clientY-r.top)/r.height,0,1),true);});
pad.addEventListener("pointermove",e=>{if(!holding||e.pointerId!==activeId)return;const r=pad.getBoundingClientRect();setPad(clamp((e.clientX-r.left)/r.width,0,1),clamp((e.clientY-r.top)/r.height,0,1),true);});
const off=e=>{if(e.pointerId!==activeId)return;holding=false;pad.classList.remove("active");setPad(0.5,0.5,false);};
pad.addEventListener("pointerup",off);pad.addEventListener("pointercancel",off);`,
  },
  {
    slug: "am-radio",
    title: "AM Dial",
    section: "synthesis",
    synth: "AM sidebands",
    sensors: "Mic · touch",
    learn: "<h2>AM radio</h2><p>Hold pad — mic biases modulation depth; drag for carrier frequency.</p>",
    script: `${padBase}
import { registerAudioBoot, primeMicStream } from "../../shared/app.js";
let carrier,mod,amp,analyser;
function build(c){ctx=c;({master}=createMasterBus(c,0.48));carrier=ctx.createOscillator();mod=ctx.createOscillator();amp=ctx.createGain();amp.gain.value=0;mod.connect(amp.gain);carrier.connect(amp);amp.connect(master);carrier.start();mod.start();built=true;}
registerAudioBoot(async c=>{build(c);const stream=await primeMicStream();const src=ctx.createMediaStreamSource(stream);analyser=ctx.createAnalyser();analyser.fftSize=256;src.connect(analyser);const buf=new Float32Array(256);function tick(){analyser.getFloatTimeDomainData(buf);let s=0;for(let i=0;i<buf.length;i++)s+=buf[i]*buf[i];mod.frequency.setTargetAtTime(2+Math.sqrt(s/buf.length)*400,ctx.currentTime,0.05);requestAnimationFrame(tick);}tick();},{mic:true});
function setPad(nx,on){carrier.frequency.setTargetAtTime(200*Math.pow(4,nx),ctx.currentTime,0.03);amp.gain.setTargetAtTime(on?0.3:0,ctx.currentTime,on?0.02:0.06);}
pad.addEventListener("pointerdown",async e=>{e.preventDefault();await startAudio();holding=true;activeId=e.pointerId;pad.setPointerCapture(activeId);pad.classList.add("active");const r=pad.getBoundingClientRect();setPad(clamp((e.clientX-r.left)/r.width,0,1),true);});
pad.addEventListener("pointermove",e=>{if(!holding||e.pointerId!==activeId)return;const r=pad.getBoundingClientRect();setPad(clamp((e.clientX-r.left)/r.width,0,1),true);});
const off=e=>{if(e.pointerId!==activeId)return;holding=false;pad.classList.remove("active");setPad(0.5,false);};
pad.addEventListener("pointerup",off);pad.addEventListener("pointercancel",off);`,
  },
  {
    slug: "phase-distortion",
    title: "PD Lead",
    section: "synthesis",
    synth: "Phase distortion",
    sensors: "Touch",
    learn: "<h2>Phase distortion</h2><p>Casio-style waveshape — <strong>Y</strong> scans distortion amount.</p>",
    script: `${padBase}
let osc,shaper,out;
function build(c){ctx=c;({master}=createMasterBus(c,0.5));osc=ctx.createOscillator();shaper=ctx.createWaveShaper();out=ctx.createGain();out.gain.value=0;osc.connect(shaper);shaper.connect(out);out.connect(master);osc.start();built=true;}
function curve(amount){const n=256,c=new Float32Array(n);for(let i=0;i<n;i++){const x=(i/(n-1))*2-1;c[i]=Math.sin(x*Math.PI*(1+amount*3));}return c;}
function setPad(nx,ny,on){const t=ctx.currentTime;osc.frequency.setTargetAtTime(100*Math.pow(6,nx),t,0.02);shaper.curve=curve(1-ny);out.gain.setTargetAtTime(on?0.28:0,t,on?0.02:0.06);}
pad.addEventListener("pointerdown",async e=>{e.preventDefault();await startAudio(!built?build:undefined);holding=true;activeId=e.pointerId;pad.setPointerCapture(activeId);pad.classList.add("active");const r=pad.getBoundingClientRect();setPad(clamp((e.clientX-r.left)/r.width,0,1),clamp((e.clientY-r.top)/r.height,0,1),true);});
pad.addEventListener("pointermove",e=>{if(!holding||e.pointerId!==activeId)return;const r=pad.getBoundingClientRect();setPad(clamp((e.clientX-r.left)/r.width,0,1),clamp((e.clientY-r.top)/r.height,0,1),true);});
const off=e=>{if(e.pointerId!==activeId)return;holding=false;pad.classList.remove("active");setPad(0.5,0.5,false);};
pad.addEventListener("pointerup",off);pad.addEventListener("pointercancel",off);`,
  },
  {
    slug: "supersaw-stack",
    title: "Blade Chorus",
    section: "synthesis",
    synth: "Detuned saws",
    sensors: "Gyro · touch",
    learn: "<h2>SuperSaw stack</h2><p>Hold pad — gyro spread widens detuned saw cluster.</p>",
    script: `${padBase}
import { enableSensors, onMotion, primeSensors } from "../../shared/sensors.js";
let saws=[];
function build(c){ctx=c;({master}=createMasterBus(c,0.42));for(let i=-3;i<=3;i++){const o=ctx.createOscillator(),g=ctx.createGain();o.type="sawtooth";g.gain.value=0;o.connect(g);g.connect(master);o.start();saws.push({o,g,det:i*3});}built=true;
primeSensors({needMotion:true,needOrientation:false});enableSensors({needMotion:true,needOrientation:false}).then(ok=>{if(!ok)return;onMotion(({rotAlpha:a,rotBeta:b,rotGamma:g})=>{if(!holding)return;const spread=Math.sqrt(a*a+b*b+g*g)*0.15;saws.forEach(s=>s.o.detune.setTargetAtTime(s.det*spread,ctx.currentTime,0.05));});});}
function setPad(nx,on){const hz=90*Math.pow(5,nx);saws.forEach(s=>{s.o.frequency.setTargetAtTime(hz,ctx.currentTime,0.03);s.g.gain.setTargetAtTime(on?0.04:0,ctx.currentTime,on?0.02:0.06);});}
pad.addEventListener("pointerdown",async e=>{e.preventDefault();await startAudio(!built?build:undefined);holding=true;pad.classList.add("active");const r=pad.getBoundingClientRect();setPad(clamp((e.clientX-r.left)/r.width,0,1),true);});
pad.addEventListener("pointermove",e=>{if(!holding)return;const r=pad.getBoundingClientRect();setPad(clamp((e.clientX-r.left)/r.width,0,1),true);});
pad.addEventListener("pointerup",()=>{holding=false;pad.classList.remove("active");setPad(0.5,false);});`,
  },
  {
    slug: "pwm-bass",
    title: "Pulse Bass",
    section: "synthesis",
    synth: "Variable pulse",
    sensors: "Tilt · touch",
    learn: "<h2>PWM bass</h2><p>Hold for bass — tilt changes pulse width.</p>",
    script: `${padBase}
import { enableSensors, onOrientation } from "../../shared/sensors.js";
let osc,amp;
function build(c){ctx=c;({master}=createMasterBus(c,0.55));osc=ctx.createOscillator();osc.type="square";amp=ctx.createGain();amp.gain.value=0;osc.connect(amp);amp.connect(master);osc.start();built=true;
enableSensors({needMotion:false,needOrientation:true}).then(ok=>{if(!ok)return;onOrientation(o=>{if(!holding)return;const pw=clamp(0.1+Math.abs(o.beta||0)/90,0.05,0.95);try{osc.setPeriodicWave?.(makePulse(ctx,pw));}catch{}});});}
function makePulse(ctx,duty){const n=64,r=new Float32Array(n),i=new Float32Array(n);for(let k=1;k<n;k++){const h=Math.sin(Math.PI*k*duty)/(k*Math.PI);r[k]=h;i[k]=0;}return ctx.createPeriodicWave(r,i);}
function setPad(nx,on){osc.frequency.setTargetAtTime(50*Math.pow(3,nx),ctx.currentTime,0.03);amp.gain.setTargetAtTime(on?0.35:0,ctx.currentTime,on?0.02:0.06);}
pad.addEventListener("pointerdown",async e=>{e.preventDefault();await startAudio(!built?build:undefined);holding=true;pad.classList.add("active");const r=pad.getBoundingClientRect();setPad(clamp((e.clientX-r.left)/r.width,0,1),true);});
pad.addEventListener("pointerup",()=>{holding=false;pad.classList.remove("active");setPad(0.5,false);});`,
  },
  {
    slug: "bowed-waveguide",
    title: "Drag Bow",
    section: "melody",
    synth: "Continuous KS",
    sensors: "Touch drag",
    learn: "<h2>Bowed waveguide</h2><p>Drag speed = bow energy on a sustained string.</p>",
    script: `${padBase}
import { createKSPool, karplusPluck } from "../../shared/ks.js";
let pool,lastX=0,lastT=0;
function build(c){ctx=c;({master}=createMasterBus(c,0.5));pool=createKSPool(2);built=true;}
pad.addEventListener("pointerdown",async e=>{e.preventDefault();await startAudio(!built?build:undefined);holding=true;activeId=e.pointerId;pad.setPointerCapture(activeId);lastX=e.clientX;lastT=performance.now();pad.classList.add("active");});
pad.addEventListener("pointermove",e=>{if(!holding||e.pointerId!==activeId)return;const dt=Math.max(1,performance.now()-lastT);const v=Math.abs(e.clientX-lastX)/dt;lastX=e.clientX;lastT=performance.now();const r=pad.getBoundingClientRect();if(v>0.2)karplusPluck(ctx,master,pool,100*Math.pow(4,clamp((e.clientY-r.top)/r.height,0,1)),{strength:clamp(v*0.3,0.2,0.9),level:0.25});});
const off=e=>{if(e.pointerId!==activeId)return;holding=false;pad.classList.remove("active");};
pad.addEventListener("pointerup",off);pad.addEventListener("pointercancel",off);`,
  },
  {
    slug: "pluck-bowl",
    title: "Bowl Splash",
    section: "synthesis",
    synth: "Resonant burst",
    sensors: "Touch position",
    learn: "<h2>Pluck bowl</h2><p>Tap position sets strike — bright edge, warm centre.</p>",
    script: `${padBase}
import { createKSPool, karplusPluck } from "../../shared/ks.js";
let pool;
function build(c){ctx=c;({master}=createMasterBus(c,0.55));pool=createKSPool(6);built=true;}
pad.addEventListener("pointerdown",async e=>{e.preventDefault();await startAudio(!built?build:undefined);const r=pad.getBoundingClientRect();const nx=clamp((e.clientX-r.left)/r.width,0,1);const ny=clamp((e.clientY-r.top)/r.height,0,1);const dist=Math.hypot(nx-0.5,ny-0.5);karplusPluck(ctx,master,pool,80+dist*400,{strength:0.6,dampHz:800+dist*3000,level:0.35,decaySec:3});});`,
  },
  {
    slug: "wind-bottle",
    title: "Bottle Breath",
    section: "texture",
    synth: "Noise resonator",
    sensors: "Tilt · touch",
    learn: "<h2>Wind bottle</h2><p>Hold — tilt shapes embouchure (filter + feedback).</p>",
    script: `${padBase}
import { enableSensors, onOrientation } from "../../shared/sensors.js";
let noise,bp,fb,g;
function build(c){ctx=c;({master}=createMasterBus(c,0.4));noise=ctx.createBufferSource();const b=ctx.createBuffer(1,ctx.sampleRate,ctx.sampleRate);const d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;noise.buffer=b;noise.loop=true;bp=ctx.createBiquadFilter();bp.type="bandpass";fb=ctx.createGain();g=ctx.createGain();g.gain.value=0;noise.connect(bp);bp.connect(fb);fb.connect(bp);fb.connect(g);g.connect(master);noise.start();built=true;
enableSensors({needMotion:false,needOrientation:true}).then(ok=>{if(!ok)return;onOrientation(o=>{if(!holding)return;bp.frequency.setTargetAtTime(300+Math.abs(o.beta||0)*15,ctx.currentTime,0.06);fb.gain.setTargetAtTime(0.15+Math.abs(o.gamma||0)*0.005,ctx.currentTime,0.08);});});}
pad.addEventListener("pointerdown",async()=>{await startAudio(!built?build:undefined);holding=true;pad.classList.add("active");g.gain.setTargetAtTime(0.25,ctx.currentTime,0.04);});
pad.addEventListener("pointerup",()=>{holding=false;pad.classList.remove("active");g.gain.setTargetAtTime(0,ctx.currentTime,0.1);});`,
  },
  {
    slug: "grain-rain",
    title: "Shake Dust",
    section: "texture",
    synth: "Grain shower",
    sensors: "Accel · touch",
    learn: "<h2>Grain rain</h2><p>Hold pad — shakes trigger grain bursts.</p>",
    script: `${padBase}
import { enableSensors, onMotion, primeSensors } from "../../shared/sensors.js";
let last={x:0,y:0,z:0},primed=false;
function grain(){const t=ctx.currentTime;const b=ctx.createBuffer(1,Math.floor(ctx.sampleRate*0.04),ctx.sampleRate);const d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.exp(-i/d.length*8);const s=ctx.createBufferSource();s.buffer=b;const g=ctx.createGain();g.gain.setValueAtTime(0.2,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.04);s.connect(g);g.connect(master);s.start(t);}
function build(c){ctx=c;({master}=createMasterBus(c,0.45));built=true;
primeSensors({needMotion:true,needOrientation:false});enableSensors({needMotion:true,needOrientation:false}).then(ok=>{if(!ok)return;onMotion(({x,y,z})=>{if(!holding)return;if(!primed){last={x,y,z};primed=true;return;}const j=Math.hypot(x-last.x,y-last.y,z-last.z);last={x,y,z};if(j>1.5)grain();});});}
pad.addEventListener("pointerdown",async()=>{await startAudio(!built?build:undefined);holding=true;pad.classList.add("active");});
pad.addEventListener("pointerup",()=>{holding=false;pad.classList.remove("active");});`,
  },
  {
    slug: "scrub-tape",
    title: "Tape Scrub",
    section: "texture",
    synth: "Buffer scrub",
    sensors: "Touch drag",
    learn: "<h2>Scrub tape</h2><p>Drag X to scrub a short loop forward/back.</p>",
    script: `${padBase}
let buf,src,g,phase=0;
function build(c){ctx=c;({master}=createMasterBus(c,0.5));buf=ctx.createBuffer(1,ctx.sampleRate*0.5,ctx.sampleRate);const d=buf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.sin(i/40)*Math.exp(-i/d.length*2);g=ctx.createGain();g.gain.value=0;g.connect(master);built=true;}
function scrub(v){const t=ctx.currentTime;phase=clamp(phase+v*0.02,0,1);const s=ctx.createBufferSource();s.buffer=buf;s.playbackRate.value=0.5+v*2;const lg=ctx.createGain();lg.gain.setValueAtTime(0.25,t);lg.gain.exponentialRampToValueAtTime(0.001,t+0.08);s.connect(lg);lg.connect(master);s.start(t,phase*buf.duration,0.07);}
pad.addEventListener("pointerdown",async e=>{e.preventDefault();await startAudio(!built?build:undefined);holding=true;activeId=e.pointerId;pad.setPointerCapture(activeId);lastX=e.clientX;pad.classList.add("active");g.gain.setTargetAtTime(0.2,ctx.currentTime,0.02);});
let lastX=0;
pad.addEventListener("pointermove",e=>{if(!holding||e.pointerId!==activeId)return;scrub((e.clientX-lastX)*0.01);lastX=e.clientX;});
const off=e=>{if(e.pointerId!==activeId)return;holding=false;pad.classList.remove("active");};
pad.addEventListener("pointerup",off);pad.addEventListener("pointercancel",off);`,
  },
  {
    slug: "vocoder-choir",
    title: "Robot Hall",
    section: "texture",
    synth: "Band vocoder",
    sensors: "Mic · tilt",
    learn: "<h2>Vocoder choir</h2><p>Hold — mic through resonant bands; tilt shifts vowel.</p>",
    script: `${padBase}
import { registerAudioBoot, primeMicStream } from "../../shared/app.js";
import { enableSensors, onOrientation } from "../../shared/sensors.js";
let carriers=[],analyser,micSrc;
function build(c){ctx=c;({master}=createMasterBus(c,0.42));for(let i=0;i<4;i++){const o=ctx.createOscillator(),bp=ctx.createBiquadFilter(),g=ctx.createGain();bp.type="bandpass";bp.frequency.value=300*(i+1);bp.Q.value=6;g.gain.value=0;o.connect(bp);bp.connect(g);g.connect(master);o.start();carriers.push({bp,g});}built=true;
enableSensors({needMotion:false,needOrientation:true}).then(ok=>{if(!ok)return;onOrientation(o=>{const v=400+Math.abs(o.beta||0)*8;carriers.forEach((c,i)=>c.bp.frequency.setTargetAtTime(v*(1+i*0.25),ctx.currentTime,0.06));});});}
registerAudioBoot(async c=>{build(c);const stream=await primeMicStream();micSrc=ctx.createMediaStreamSource(stream);const g=ctx.createGain();g.gain.value=0.4;micSrc.connect(g);carriers.forEach(c=>g.connect(c.bp));},{mic:true});
pad.addEventListener("pointerdown",async()=>{await startAudio();holding=true;pad.classList.add("active");carriers.forEach(c=>c.g.gain.setTargetAtTime(0.08,ctx.currentTime,0.04));});
pad.addEventListener("pointerup",()=>{holding=false;pad.classList.remove("active");carriers.forEach(c=>c.g.gain.setTargetAtTime(0,ctx.currentTime,0.08));});`,
  },
  {
    slug: "ir-cathedral",
    title: "Space Convolve",
    section: "texture",
    synth: "IR convolution",
    sensors: "Tilt · touch",
    learn: "<h2>IR cathedral</h2><p>Hold tone — tilt controls wet reverb space.</p>",
    script: `${padBase}
import { createKSReverb } from "../../shared/ks.js";
import { enableSensors, onOrientation } from "../../shared/sensors.js";
let osc,dry,wet,wetGain;
function build(c){ctx=c;({master}=createMasterBus(c,0.48));dry=ctx.createGain();wetGain=ctx.createGain();wetGain.gain.value=0;osc=ctx.createOscillator();osc.connect(dry);dry.connect(master);wet=createKSReverb(ctx,master,1);wet.connect(wetGain);wetGain.connect(master);osc.start();built=true;
enableSensors({needMotion:false,needOrientation:true}).then(ok=>{if(!ok)return;onOrientation(o=>{if(!holding)return;wetGain.gain.setTargetAtTime(clamp(Math.abs(o.beta||0)/60,0,0.9),ctx.currentTime,0.08);});});}
pad.addEventListener("pointerdown",async e=>{e.preventDefault();await startAudio(!built?build:undefined);holding=true;pad.classList.add("active");const r=pad.getBoundingClientRect();osc.frequency.setTargetAtTime(100*Math.pow(4,clamp((e.clientX-r.left)/r.width,0,1)),ctx.currentTime,0.03);dry.gain.setTargetAtTime(0.15,ctx.currentTime,0.02);});
pad.addEventListener("pointerup",()=>{holding=false;pad.classList.remove("active");dry.gain.setTargetAtTime(0,ctx.currentTime,0.08);wetGain.gain.setTargetAtTime(0,ctx.currentTime,0.1);});`,
  },
  {
    slug: "one-shot-orchestra",
    title: "Zone Hits",
    section: "rhythm",
    synth: "Multi-zone",
    sensors: "Touch zones",
    learn: "<h2>One-shot orchestra</h2><p>Pad quadrants = different ensemble hits.</p>",
    script: `${padBase}
function hit(zone){const t=ctx.currentTime;const freqs=[220,330,440,550];const o=ctx.createOscillator(),g=ctx.createGain();o.type=zone%2?"triangle":"square";o.frequency.value=freqs[zone%4];g.gain.setValueAtTime(0.3,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.25);o.connect(g);g.connect(master);o.start(t);o.stop(t+0.26);}
function build(c){ctx=c;({master}=createMasterBus(c,0.55));built=true;}
pad.addEventListener("pointerdown",async e=>{e.preventDefault();await startAudio(!built?build:undefined);const r=pad.getBoundingClientRect();const nx=clamp((e.clientX-r.left)/r.width,0,1);const ny=clamp((e.clientY-r.top)/r.height,0,1);hit((nx>0.5?1:0)+(ny>0.5?2:0));pad.classList.add("active");});
pad.addEventListener("pointerup",()=>pad.classList.remove("active"));`,
  },
  {
    slug: "live-loop-slicer",
    title: "Slice Bar",
    section: "rhythm",
    synth: "Loop slices",
    sensors: "Tilt · touch",
    learn: "<h2>Live loop slicer</h2><p>Records a bar on first hold — tilt jumps slice index.</p>",
    script: `${padBase}
import { enableSensors, onOrientation } from "../../shared/sensors.js";
let buf,slice=0,rec=null;
function build(c){ctx=c;({master}=createMasterBus(c,0.5));buf=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate);const d=buf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.sin(i/30)*0.5+Math.sin(i/17)*0.3;built=true;
enableSensors({needMotion:false,needOrientation:true}).then(ok=>{if(!ok)return;onOrientation(o=>{slice=Math.floor(clamp((o.beta||0+90)/45,0,7));});});}
function playSlice(){const t=ctx.currentTime;const s=ctx.createBufferSource();s.buffer=buf;const len=buf.duration/8;const start=slice*len;s.start(t,start,Math.min(len,0.2));const g=ctx.createGain();g.gain.value=0.28;s.connect(g);g.connect(master);}
pad.addEventListener("pointerdown",async()=>{await startAudio(!built?build:undefined);holding=true;pad.classList.add("active");playSlice();});
pad.addEventListener("pointerup",()=>{holding=false;pad.classList.remove("active");});`,
  },
  {
    slug: "gesture-regression",
    title: "Tilt Learn",
    section: "ai",
    synth: "ML → filter",
    sensors: "Motion · touch",
    learn: "<h2>Gesture → synthesis</h2><p>Train: hold pad at different tilts. Play: tilt predicts filter cutoff.</p>",
    script: `${padBase}
import { enableSensors, onOrientation, primeSensors } from "../../shared/sensors.js";
let osc,amp,filt,train=[],mode="play";
function build(c){ctx=c;({master}=createMasterBus(c,0.5));osc=ctx.createOscillator();amp=ctx.createGain();filt=ctx.createBiquadFilter();filt.type="lowpass";amp.gain.value=0;osc.connect(filt);filt.connect(amp);amp.connect(master);osc.start();built=true;
primeSensors({needMotion:false,needOrientation:true});enableSensors({needMotion:false,needOrientation:true});}
function predict(b){if(!train.length)return 800;let best=train[0],d=1e9;for(const s of train){const dd=(s.b-b)**2;if(dd<d){d=dd;best=s;}}return best.cut;}
pad.addEventListener("pointerdown",async e=>{e.preventDefault();await startAudio(!built?build:undefined);holding=true;pad.classList.add("active");osc.frequency.setTargetAtTime(120,ctx.currentTime,0.02);amp.gain.setTargetAtTime(0.25,ctx.currentTime,0.02);});
pad.addEventListener("pointerup",()=>{holding=false;pad.classList.remove("active");amp.gain.setTargetAtTime(0,ctx.currentTime,0.06);});
pad.addEventListener("dblclick",()=>{mode=mode==="play"?"train":"play";});
enableSensors({needMotion:false,needOrientation:true}).then(ok=>{if(!ok)return;onOrientation(o=>{const b=o.beta||0;if(mode==="train"&&holding)train.push({b,cut:400+Math.abs(b)*40});else if(holding)filt.frequency.setTargetAtTime(predict(b),ctx.currentTime,0.06);});});`,
  },
];

for (const a of APPS) {
  const dir = join(root, "apps", a.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), page(a.title, a.learn, a.script));
  console.log("wrote", a.slug);
}
const hubSnippet = APPS.map(
  (a) => `  { href: "apps/${a.slug}/", title: "${a.title}", section: "${a.section}", synth: "${a.synth}", sensors: "${a.sensors}" },`
).join("\n");
writeFileSync(join(root, "scripts", "hub-catalog-new.txt"), hubSnippet + "\n");
console.log("batch:", APPS.length, "— hub lines in scripts/hub-catalog-new.txt");
