import{r as s,j as t}from"./index-CCAqVQMD.js";import{R as M,u as j}from"./ResponsiveShader-C-RFcTjC.js";import{C,V as P,s as k}from"./react-three-fiber.esm-TSoCGjoX.js";const S=`
precision highp float;

varying vec2 vUv;

uniform float uTime;
uniform vec2 uMouse;
uniform float uRevealProgress;
uniform float uRevealDirection; // 0: left, 1: right, 2: top, 3: bottom, 4: center, 5: diagonal
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float uNoiseAmount;

// Hash function
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x),
             mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
}

float fbm(vec2 p) {
  float f = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 4; i++) {
    f += amp * noise(p);
    p *= 2.0;
    amp *= 0.5;
  }
  return f;
}

void main() {
  vec2 uv = vUv;
  float time = uTime * 0.5;
  
  // Calculate reveal mask based on direction
  float revealMask = 0.0;
  float progress = uRevealProgress;
  
  // Add noise to the reveal edge
  float noiseEdge = fbm(uv * 5.0 + time) * uNoiseAmount;
  
  int dir = int(uRevealDirection);
  if (dir == 0) { // Left to right
    revealMask = step(uv.x, progress + noiseEdge * 0.1);
  } else if (dir == 1) { // Right to left
    revealMask = step(1.0 - uv.x, progress + noiseEdge * 0.1);
  } else if (dir == 2) { // Top to bottom
    revealMask = step(1.0 - uv.y, progress + noiseEdge * 0.1);
  } else if (dir == 3) { // Bottom to top
    revealMask = step(uv.y, progress + noiseEdge * 0.1);
  } else if (dir == 4) { // Center radial
    float dist = length(uv - 0.5) * 1.414; // Normalize to 0-1
    revealMask = smoothstep(progress + 0.05, progress - 0.05, dist - noiseEdge * 0.1);
  } else { // Diagonal
    float diag = (uv.x + uv.y) * 0.5;
    revealMask = smoothstep(progress - 0.05, progress + 0.05, diag + noiseEdge * 0.1);
  }
  
  // Create the underlying shader pattern (domain warp)
  vec2 flowUv = uv;
  flowUv += (uMouse - 0.5) * 0.1 * progress;
  
  float warp1 = fbm(flowUv * 2.0 + time * 0.2);
  float warp2 = fbm(flowUv * 3.0 + vec2(5.2, 1.3) - time * 0.15);
  vec2 warpedUv = flowUv + vec2(warp1, warp2) * 0.4;
  
  float pattern = fbm(warpedUv * 2.0 + time * 0.1);
  
  // Color based on pattern
  vec3 shaderColor;
  if (pattern < 0.4) {
    shaderColor = mix(uColor1, uColor2, pattern * 2.5);
  } else {
    shaderColor = mix(uColor2, uColor3, (pattern - 0.4) * 1.67);
  }
  
  // Add intensity based on progress
  shaderColor *= 0.8 + progress * 0.4;
  
  // Edge glow at reveal boundary
  float edge = abs(revealMask - 0.5) * 2.0;
  edge = 1.0 - smoothstep(0.9, 1.0, edge);
  shaderColor += (uColor2 + uColor3) * 0.5 * edge * 0.5;
  
  // Output with alpha based on reveal
  gl_FragColor = vec4(shaderColor, revealMask);
}
`,U=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`,R={left:0,right:1,top:2,bottom:3,center:4,diagonal:5};function E({progress:c,direction:n,colors:i,noiseAmount:d}){const r=s.useRef(null),{mouse:a}=j(),o=s.useRef({uTime:{value:0},uMouse:{value:new P(.5,.5)},uRevealProgress:{value:0},uRevealDirection:{value:R[n]},uColor1:{value:new C(i[0])},uColor2:{value:new C(i[1])},uColor3:{value:new C(i[2])},uNoiseAmount:{value:d}});return k(({clock:f})=>{o.current.uTime.value=f.getElapsedTime(),o.current.uMouse.value.lerp(a,.1),o.current.uRevealProgress.value+=(c-o.current.uRevealProgress.value)*.1}),s.useEffect(()=>{o.current.uRevealDirection.value=R[n]},[n]),t.jsxs("mesh",{ref:r,children:[t.jsx("planeGeometry",{args:[2,2]}),t.jsx("shaderMaterial",{vertexShader:U,fragmentShader:S,uniforms:o.current,transparent:!0})]})}function I({children:c,direction:n="left",colors:i=["#667eea","#764ba2","#f093fb"],noiseAmount:d=.5,triggerOffset:r=.3,revealRange:a=.5,className:o="",style:f}){const p=s.useRef(null),[m,h]=s.useState(0);return s.useEffect(()=>{const l=()=>{if(!p.current)return;const x=p.current.getBoundingClientRect(),e=window.innerHeight,g=x.top,u=e*(1-r),v=e*(1-r-a);if(g>u)h(0);else if(g<v)h(1);else{const w=(u-g)/(u-v);h(Math.max(0,Math.min(1,w)))}};return window.addEventListener("scroll",l,{passive:!0}),l(),()=>window.removeEventListener("scroll",l)},[r,a]),t.jsxs("div",{ref:p,className:o,style:{position:"relative",width:"100%",minHeight:"400px",overflow:"hidden",...f},children:[t.jsx("div",{style:{position:"relative",zIndex:1},children:c}),t.jsx("div",{style:{position:"absolute",inset:0,zIndex:2,pointerEvents:"none"},children:t.jsx(M,{trackMouse:!0,mobileInteraction:"scroll",pauseWhenHidden:!0,children:t.jsx(E,{progress:m,direction:n,colors:i,noiseAmount:d})})})]})}function A({children:c,direction:n="left",colors:i=["#667eea","#764ba2","#f093fb"],noiseAmount:d=.5,triggerOffset:r=.3,revealRange:a=.5,shaderOpacity:o=1,className:f="",style:p}){const m=s.useRef(null),[h,l]=s.useState(0);s.useEffect(()=>{const e=()=>{if(!m.current)return;const g=m.current.getBoundingClientRect(),u=window.innerHeight,v=g.top,w=u*(1-r),b=u*(1-r-a);if(v>w)l(0);else if(v<b)l(1);else{const y=(w-v)/(w-b);l(Math.max(0,Math.min(1,y)))}};return window.addEventListener("scroll",e,{passive:!0}),e(),()=>window.removeEventListener("scroll",e)},[r,a]);const x=()=>{const e=h*100;switch(n){case"left":return`inset(0 ${100-e}% 0 0)`;case"right":return`inset(0 0 0 ${100-e}%)`;case"top":return`inset(0 0 ${100-e}% 0)`;case"bottom":return`inset(${100-e}% 0 0 0)`;case"center":return`circle(${e}% at 50% 50%)`;case"diagonal":return`polygon(0 0, ${e*2}% 0, 0 ${e*2}%)`;default:return"none"}};return t.jsxs("div",{ref:m,className:f,style:{position:"relative",width:"100%",minHeight:"400px",overflow:"hidden",...p},children:[t.jsx("div",{style:{position:"absolute",inset:0,opacity:o},children:t.jsx(M,{trackMouse:!0,mobileInteraction:"scroll",pauseWhenHidden:!0,children:t.jsx(E,{progress:1,direction:n,colors:i,noiseAmount:d})})}),t.jsx("div",{style:{position:"relative",zIndex:1,clipPath:x(),transition:"clip-path 0.1s ease-out"},children:c})]})}export{I as ShaderReveal,A as ShaderRevealInverse,I as default};
