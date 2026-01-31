import{j as t,r as n}from"./index-DtAQzogC.js";import{R as x,u as d}from"./ResponsiveShader-D9PzUg3m.js";import{u as h,C as u,V as v,s as p}from"./react-three-fiber.esm-BokxmqYQ.js";const C=`
precision highp float;

varying vec2 vUv;

uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uColor4;
uniform float uSpeed;
uniform float uNoiseScale;
uniform float uMouseInfluence;

// Simplex noise
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                     -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
  float f = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 4; i++) {
    f += amp * snoise(p);
    p *= 2.0;
    amp *= 0.5;
  }
  return f;
}

void main() {
  vec2 uv = vUv;
  float time = uTime * uSpeed;
  
  // Mouse influence
  vec2 mouseOffset = (uMouse - 0.5) * uMouseInfluence;
  vec2 flowUv = uv + mouseOffset;
  
  // Create multiple noise layers for organic movement
  float n1 = snoise(flowUv * uNoiseScale + time * 0.3);
  float n2 = snoise(flowUv * uNoiseScale * 1.5 + time * 0.2 + 10.0);
  float n3 = snoise(flowUv * uNoiseScale * 0.8 - time * 0.25 + 5.0);
  
  // Domain warping for aurora-like movement
  vec2 warp = vec2(
    fbm(flowUv * 2.0 + time * 0.15),
    fbm(flowUv * 2.0 + vec2(5.2, 1.3) - time * 0.12)
  );
  
  float n4 = snoise((flowUv + warp * 0.3) * uNoiseScale * 1.2 + time * 0.1);
  
  // Combine noise values
  float combined = n1 * 0.4 + n2 * 0.3 + n3 * 0.2 + n4 * 0.3;
  combined = combined * 0.5 + 0.5; // Normalize to 0-1
  
  // Create smooth color transitions
  vec3 color;
  if (combined < 0.33) {
    color = mix(uColor1, uColor2, combined * 3.0);
  } else if (combined < 0.66) {
    color = mix(uColor2, uColor3, (combined - 0.33) * 3.0);
  } else {
    color = mix(uColor3, uColor4, (combined - 0.66) * 3.0);
  }
  
  // Add subtle brightness variation
  float brightness = 1.0 + fbm(flowUv * 3.0 + time * 0.2) * 0.15;
  color *= brightness;
  
  // Soft glow near mouse
  float mouseGlow = 1.0 - smoothstep(0.0, 0.5, length(uv - uMouse));
  color += (uColor2 + uColor3) * 0.5 * mouseGlow * 0.2 * uMouseInfluence;
  
  // Gentle vignette
  float vignette = 1.0 - length(uv - 0.5) * 0.4;
  color *= vignette;
  
  gl_FragColor = vec4(color, 1.0);
}
`,g=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;function w({colors:e,speed:r=.2,noiseScale:s=2,mouseInfluence:l=.3}){const a=n.useRef(null),{viewport:i}=h(),{mouse:c}=d(),o=n.useRef({uTime:{value:0},uMouse:{value:new v(.5,.5)},uResolution:{value:new v(i.width,i.height)},uColor1:{value:new u(e[0])},uColor2:{value:new u(e[1])},uColor3:{value:new u(e[2])},uColor4:{value:new u(e[3])},uSpeed:{value:r},uNoiseScale:{value:s},uMouseInfluence:{value:l}});return p(({clock:f})=>{o.current.uTime.value=f.getElapsedTime(),o.current.uMouse.value.lerp(c,.05)}),n.useEffect(()=>{o.current.uResolution.value.set(i.width,i.height)},[i]),n.useEffect(()=>{o.current.uColor1.value.set(e[0]),o.current.uColor2.value.set(e[1]),o.current.uColor3.value.set(e[2]),o.current.uColor4.value.set(e[3])},[e]),t.jsxs("mesh",{ref:a,children:[t.jsx("planeGeometry",{args:[2,2]}),t.jsx("shaderMaterial",{vertexShader:g,fragmentShader:C,uniforms:o.current})]})}const b={aurora:["#0f0c29","#302b63","#24243e","#0f0c29"],sunset:["#ff6b6b","#feca57","#ff9ff3","#ff6b6b"],ocean:["#0077b6","#00b4d8","#90e0ef","#caf0f8"],forest:["#1a472a","#2d5a27","#4a7c59","#8eb486"],candy:["#ff0080","#ff8c00","#40e0d0","#ff0080"],midnight:["#0c0c0c","#1a1a2e","#16213e","#1a1a2e"],neon:["#f72585","#7209b7","#3a0ca3","#4cc9f0"],earth:["#8B4513","#D2691E","#CD853F","#DEB887"]};function m({colors:e,preset:r="aurora",speed:s=.2,noiseScale:l=2,mouseInfluence:a=.3,className:i="",style:c,children:o}){const f=e||b[r];return t.jsxs("div",{className:i,style:{position:"relative",width:"100%",height:"100%",minHeight:"200px",...c},children:[t.jsx("div",{style:{position:"absolute",inset:0},children:t.jsx(x,{trackMouse:!0,mobileInteraction:"scroll",pauseWhenHidden:!0,children:t.jsx(w,{colors:f,speed:s,noiseScale:l,mouseInfluence:a})})}),o&&t.jsx("div",{style:{position:"relative",zIndex:1,height:"100%"},children:o})]})}function M({children:e,...r}){return t.jsx(m,{...r,style:{height:"100vh",display:"flex",alignItems:"center",justifyContent:"center",color:"white",...r.style},children:e})}function U({height:e=200,...r}){return t.jsx(m,{...r,mouseInfluence:.1,style:{height:`${e}px`,...r.style}})}export{U as GradientDivider,M as GradientHero,m as ShaderGradient,m as default,b as gradientPresets};
