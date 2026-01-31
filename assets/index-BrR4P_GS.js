import{j as e,r as i}from"./index-CvryfeK-.js";import{R as g,u as d}from"./ResponsiveShader-_ihErD34.js";import{V as m,s as p}from"./react-three-fiber.esm-qmgw6Lw5.js";import{u as y}from"./Texture-Cze0-q3H.js";const D=`
precision highp float;

varying vec2 vUv;

uniform float uTime;
uniform vec2 uMouse;
uniform sampler2D uTexture;
uniform float uHover;
uniform float uScrollProgress;
uniform int uDistortionMode; // 0: ripple, 1: wave, 2: twist, 3: bulge, 4: noise
uniform float uIntensity;

// Noise for organic distortion
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

// Ripple distortion
vec2 rippleDistort(vec2 uv, vec2 center, float time, float intensity) {
  vec2 toCenter = uv - center;
  float dist = length(toCenter);
  float ripple = sin(dist * 30.0 - time * 5.0) * intensity;
  ripple *= exp(-dist * 3.0);
  return uv + normalize(toCenter + 0.001) * ripple * 0.1;
}

// Wave distortion
vec2 waveDistort(vec2 uv, float time, float scroll, float intensity) {
  float waveX = sin(uv.y * 10.0 + time * 2.0 + scroll * 10.0) * intensity * 0.05;
  float waveY = sin(uv.x * 10.0 + time * 1.5) * intensity * 0.03;
  return vec2(uv.x + waveX, uv.y + waveY);
}

// Twist distortion
vec2 twistDistort(vec2 uv, vec2 center, float intensity) {
  vec2 toCenter = uv - center;
  float dist = length(toCenter);
  float angle = atan(toCenter.y, toCenter.x);
  float twist = intensity * exp(-dist * 3.0) * 2.0;
  angle += twist;
  return center + vec2(cos(angle), sin(angle)) * dist;
}

// Bulge distortion
vec2 bulgeDistort(vec2 uv, vec2 center, float intensity) {
  vec2 toCenter = uv - center;
  float dist = length(toCenter);
  float bulge = 1.0 + intensity * exp(-dist * 5.0) * 0.5;
  return center + toCenter * bulge;
}

// Noise distortion
vec2 noiseDistort(vec2 uv, float time, float intensity) {
  float n1 = noise(uv * 5.0 + time * 0.5);
  float n2 = noise(uv * 5.0 + time * 0.5 + 100.0);
  return uv + vec2(n1, n2) * intensity * 0.1;
}

void main() {
  vec2 uv = vUv;
  float time = uTime;
  vec2 mouse = uMouse;
  float intensity = uIntensity * uHover;
  
  // Apply distortion based on mode
  vec2 distortedUv = uv;
  
  if (uDistortionMode == 0) {
    distortedUv = rippleDistort(uv, mouse, time, intensity);
  } else if (uDistortionMode == 1) {
    distortedUv = waveDistort(uv, time, uScrollProgress, uIntensity * (0.3 + uHover * 0.7));
  } else if (uDistortionMode == 2) {
    distortedUv = twistDistort(uv, mouse, intensity);
  } else if (uDistortionMode == 3) {
    distortedUv = bulgeDistort(uv, mouse, intensity);
  } else {
    distortedUv = noiseDistort(uv, time, intensity);
  }
  
  // Add subtle chromatic aberration on hover
  float chromaOffset = uHover * uIntensity * 0.01;
  vec4 colorR = texture2D(uTexture, distortedUv + vec2(chromaOffset, 0.0));
  vec4 colorG = texture2D(uTexture, distortedUv);
  vec4 colorB = texture2D(uTexture, distortedUv - vec2(chromaOffset, 0.0));
  
  vec4 color = vec4(colorR.r, colorG.g, colorB.b, colorG.a);
  
  gl_FragColor = color;
}
`,M=`
precision highp float;

varying vec2 vUv;

uniform float uTime;
uniform vec2 uMouse;
uniform float uHover;
uniform int uDistortionMode;
uniform float uIntensity;

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

void main() {
  vec2 uv = vUv;
  float time = uTime;
  
  // Create a procedural pattern
  float n = noise(uv * 5.0 + time * 0.2);
  
  // Distort based on mouse
  float dist = length(uv - uMouse);
  float ripple = sin(dist * 20.0 - time * 3.0) * 0.5 + 0.5;
  ripple *= exp(-dist * 3.0) * uHover;
  
  // Colors
  vec3 color1 = vec3(0.4, 0.3, 0.9);
  vec3 color2 = vec3(0.9, 0.3, 0.6);
  
  vec3 color = mix(color1, color2, n + ripple * 0.3);
  
  gl_FragColor = vec4(color, 1.0);
}
`,h=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`,f={ripple:0,wave:1,twist:2,bulge:3,noise:4};function w({textureUrl:s,mode:t,intensity:n}){const u=i.useRef(null),{mouse:o,scroll:r,isHovered:l}=d(),a=y(s),c=i.useRef(0),v=i.useRef({uTime:{value:0},uMouse:{value:new m(.5,.5)},uTexture:{value:a},uHover:{value:0},uScrollProgress:{value:0},uDistortionMode:{value:f[t]},uIntensity:{value:n}});return p(({clock:x})=>{v.current.uTime.value=x.getElapsedTime(),v.current.uMouse.value.lerp(o,.1),v.current.uScrollProgress.value=r,c.current+=(l?1:0-c.current)*.08,v.current.uHover.value=c.current}),i.useEffect(()=>{v.current.uDistortionMode.value=f[t]},[t]),i.useEffect(()=>{v.current.uTexture.value=a},[a]),e.jsxs("mesh",{ref:u,children:[e.jsx("planeGeometry",{args:[2,2]}),e.jsx("shaderMaterial",{vertexShader:h,fragmentShader:D,uniforms:v.current})]})}function T({mode:s,intensity:t}){const n=i.useRef(null),{mouse:u,isHovered:o}=d(),r=i.useRef(0),l=i.useRef({uTime:{value:0},uMouse:{value:new m(.5,.5)},uHover:{value:0},uDistortionMode:{value:f[s]},uIntensity:{value:t}});return p(({clock:a})=>{l.current.uTime.value=a.getElapsedTime(),l.current.uMouse.value.lerp(u,.1),r.current+=(o?1:0-r.current)*.08,l.current.uHover.value=r.current}),e.jsxs("mesh",{ref:n,children:[e.jsx("planeGeometry",{args:[2,2]}),e.jsx("shaderMaterial",{vertexShader:h,fragmentShader:M,uniforms:l.current})]})}function R({src:s,alt:t="Distorted image",mode:n="ripple",intensity:u=1,className:o="",style:r}){const[l,a]=i.useState(!1);return e.jsx("div",{className:o,style:{position:"relative",width:"100%",height:"100%",minHeight:"300px",overflow:"hidden",borderRadius:"8px",...r},onMouseEnter:()=>a(!0),onMouseLeave:()=>a(!1),role:"img","aria-label":t,children:e.jsx(g,{trackMouse:!0,mobileInteraction:"touch",pauseWhenHidden:!0,frameloop:l?"always":"demand",children:s?e.jsx(w,{textureUrl:s,mode:n,intensity:u}):e.jsx(T,{mode:n,intensity:u})})})}function j({images:s,columns:t=3,gap:n="1rem",className:u=""}){return e.jsx("div",{className:u,style:{display:"grid",gridTemplateColumns:`repeat(${t}, 1fr)`,gap:n},children:s.map((o,r)=>e.jsx(R,{src:o.src,alt:o.alt,mode:o.mode||"ripple",style:{aspectRatio:"1"}},r))})}export{j as DistortionGallery,R as ShaderDistortion,R as default};
