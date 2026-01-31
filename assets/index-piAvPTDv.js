import{r as t,j as c}from"./index-D5HXmxLr.js";import{R as q,u as j}from"./ResponsiveShader-BuVrWm5t.js";import{V as a,u as F,C as R,s as U}from"./react-three-fiber.esm-CDC9DQDc.js";const P=`
precision highp float;

varying vec2 vUv;

uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;
uniform float uMouseDown;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uMetallic;
uniform float uSmoothness;

// Ball positions (up to 12 balls)
uniform vec2 uBalls[12];
uniform float uBallSizes[12];
uniform int uBallCount;

// Smooth minimum for metaball blending
float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

// Circle SDF
float sdCircle(vec2 p, float r) {
  return length(p) - r;
}

void main() {
  vec2 uv = vUv;
  vec2 centeredUv = uv - 0.5;
  float time = uTime;

  // Start with large distance
  float d = 1000.0;

  // Add all balls
  for (int i = 0; i < 12; i++) {
    if (i >= uBallCount) break;
    
    vec2 ballPos = uBalls[i] - 0.5;
    float ballSize = uBallSizes[i];
    
    float ballDist = sdCircle(centeredUv - ballPos, ballSize);
    d = smin(d, ballDist, uSmoothness);
  }

  // Add mouse-following ball
  vec2 mousePos = uMouse - 0.5;
  float mouseSize = 0.08 + uMouseDown * 0.04;
  d = smin(d, sdCircle(centeredUv - mousePos, mouseSize), uSmoothness);

  // Create color based on distance
  float inside = 1.0 - smoothstep(0.0, 0.02, d);

  // Gradient based on distance
  float gradient = smoothstep(-0.2, 0.2, d);

  // Edge highlight for metallic effect
  float edge = 1.0 - smoothstep(0.0, 0.05, abs(d));
  edge *= uMetallic;

  // Mix colors
  vec3 liquidColor = mix(uColor1, uColor2, gradient);
  liquidColor += vec3(edge * 0.5);

  // Internal shading
  float innerShade = smoothstep(-0.15, 0.0, d);
  liquidColor *= 0.7 + 0.3 * innerShade;

  // Specular highlight
  vec2 lightDir = normalize(vec2(1.0, 1.0));
  float specular = pow(max(0.0, dot(normalize(centeredUv - mousePos), lightDir)), 8.0);
  specular *= inside * uMetallic * 0.5;
  liquidColor += vec3(specular);

  // Background
  vec3 bgColor = mix(uColor2 * 0.1, uColor1 * 0.05, uv.y);

  // Final color
  vec3 finalColor = mix(bgColor, liquidColor, inside);

  // Glow around blobs
  float glow = smoothstep(0.1, 0.0, d) * (1.0 - inside);
  finalColor += mix(uColor1, uColor2, 0.5) * glow * 0.3;

  gl_FragColor = vec4(finalColor, 1.0);
}
`,k=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;function T({balls:v,colors:r,metallic:M,smoothness:S,mouseDown:d}){const w=t.useRef(null),{viewport:s}=F(),{mouse:x}=j(),b=new Array(12).fill(null).map(()=>new a(0,0)),m=new Float32Array(12).fill(0),n=t.useRef({uTime:{value:0},uMouse:{value:new a(.5,.5)},uResolution:{value:new a(s.width,s.height)},uMouseDown:{value:0},uColor1:{value:new R(r[0])},uColor2:{value:new R(r[1])},uMetallic:{value:M},uSmoothness:{value:S},uBalls:{value:b},uBallSizes:{value:m},uBallCount:{value:0}});return U(({clock:f})=>{n.current.uTime.value=f.getElapsedTime(),n.current.uMouse.value.lerp(x,.15),n.current.uMouseDown.value+=(d?1:0-n.current.uMouseDown.value)*.1,v.forEach((h,p)=>{p<12&&(n.current.uBalls.value[p].copy(h.position),n.current.uBallSizes.value[p]=h.size)}),n.current.uBallCount.value=Math.min(v.length,12)}),t.useEffect(()=>{n.current.uResolution.value.set(s.width,s.height)},[s]),t.useEffect(()=>{n.current.uColor1.value.set(r[0]),n.current.uColor2.value.set(r[1])},[r]),c.jsxs("mesh",{ref:w,children:[c.jsx("planeGeometry",{args:[2,2]}),c.jsx("shaderMaterial",{vertexShader:k,fragmentShader:P,uniforms:n.current})]})}function X({initialBalls:v=5,colors:r=["#667eea","#764ba2"],metallic:M=.7,smoothness:S=.15,clickToAdd:d=!0,tiltToMove:w=!0,className:s="",style:x}){const[b,m]=t.useState([]),[n,f]=t.useState(!1),[h,p]=t.useState(!1),z=t.useRef(0),y=t.useRef(null);t.useEffect(()=>{p("ontouchstart"in window)},[]),t.useEffect(()=>{const e=[];for(let i=0;i<v;i++)e.push({id:z.current++,position:new a(.2+Math.random()*.6,.2+Math.random()*.6),velocity:new a((Math.random()-.5)*.01,(Math.random()-.5)*.01),size:.06+Math.random()*.04});m(e)},[v]),t.useEffect(()=>{let e;const i=()=>{m(u=>u.map(o=>{const l=o.position.clone();return l.add(o.velocity),(l.x<.1||l.x>.9)&&(o.velocity.x*=-.8),(l.y<.1||l.y>.9)&&(o.velocity.y*=-.8),o.velocity.multiplyScalar(.995),o.velocity.x+=(Math.random()-.5)*5e-4,o.velocity.y+=(Math.random()-.5)*5e-4,l.clamp(new a(.1,.1),new a(.9,.9)),{...o,position:l}})),e=requestAnimationFrame(i)};return e=requestAnimationFrame(i),()=>cancelAnimationFrame(e)},[]),t.useEffect(()=>{if(!h||!w)return;const e=i=>{const u=(i.gamma||0)/45,o=(i.beta||0)/45;m(l=>l.map(g=>({...g,velocity:new a(g.velocity.x+u*.001,g.velocity.y-o*.001)})))};return window.addEventListener("deviceorientation",e),()=>window.removeEventListener("deviceorientation",e)},[h,w]);const E=t.useCallback(e=>{if(!d||!y.current)return;const i=y.current.getBoundingClientRect();let u,o;if("touches"in e){const C=e.touches[0]||e.changedTouches[0];u=C.clientX,o=C.clientY}else u=e.clientX,o=e.clientY;const l=(u-i.left)/i.width,g=1-(o-i.top)/i.height,D={id:z.current++,position:new a(l,g),velocity:new a((Math.random()-.5)*.02,(Math.random()-.5)*.02),size:.05+Math.random()*.05};m(C=>{const B=[...C,D];return B.length>12?B.slice(-12):B})},[d]);return c.jsxs("div",{ref:y,className:s,style:{position:"relative",width:"100%",height:"100%",minHeight:"400px",cursor:d?"pointer":"default",...x},onClick:E,onTouchStart:E,onMouseDown:()=>f(!0),onMouseUp:()=>f(!1),onMouseLeave:()=>f(!1),onTouchEnd:()=>f(!1),children:[c.jsx(q,{trackMouse:!0,mobileInteraction:"touch",pauseWhenHidden:!0,children:c.jsx(T,{balls:b,colors:r,metallic:M,smoothness:S,mouseDown:n})}),d&&c.jsx("div",{style:{position:"absolute",bottom:"1rem",left:"50%",transform:"translateX(-50%)",color:"white",fontSize:"0.875rem",opacity:.6,pointerEvents:"none",textShadow:"0 1px 3px rgba(0,0,0,0.5)"},children:h?"Tap to add blobs • Tilt to move":"Click to add blobs"})]})}export{X as ShaderLiquid,X as default};
