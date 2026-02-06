import{j as e,u as v,C as u,V as f,v as p}from"./three-vendor-CgYOwSjb.js";import{r as l}from"./react-vendor-DtyY8K5c.js";import{R as d,u as h}from"./ResponsiveShader-CRqqgd2G.js";const x=`
precision highp float;

varying vec2 vUv;

uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;
uniform float uScrollProgress;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;

// Noise functions
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p);
    p *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = vUv;
  float time = uTime * 0.3;
  
  // Mouse influence on flow
  vec2 mouseInfluence = (uMouse - 0.5) * 0.3;
  
  // Create flowing aurora bands
  vec2 flowUv = uv;
  flowUv.x += time * 0.1 + mouseInfluence.x;
  flowUv.y += sin(uv.x * 3.0 + time) * 0.1 + mouseInfluence.y;
  
  // Domain warping for organic movement
  float warp1 = fbm(flowUv * 2.0 + time * 0.2);
  float warp2 = fbm(flowUv * 3.0 + vec2(5.2, 1.3) - time * 0.15);
  
  vec2 warpedUv = flowUv + vec2(warp1, warp2) * 0.4;
  
  // Final pattern
  float pattern = fbm(warpedUv * 2.0 + time * 0.1);
  
  // Create aurora bands
  float band1 = smoothstep(0.3, 0.7, pattern + sin(uv.y * 5.0 + time) * 0.2);
  float band2 = smoothstep(0.4, 0.8, pattern + sin(uv.y * 7.0 - time * 0.5) * 0.15);
  
  // Color mixing
  vec3 color = mix(uColor1, uColor2, band1);
  color = mix(color, uColor3, band2 * 0.5);
  
  // Add glow based on mouse proximity
  float mouseGlow = 1.0 - length(uv - uMouse) * 1.5;
  mouseGlow = max(0.0, mouseGlow);
  color += uColor2 * mouseGlow * 0.3;
  
  // Scroll fade effect
  float scrollFade = 1.0 - uScrollProgress * 0.5;
  color *= scrollFade;
  
  // Vignette
  float vignette = 1.0 - length(uv - 0.5) * 0.6;
  color *= vignette;
  
  gl_FragColor = vec4(color, 1.0);
}
`,w=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;function g({colors:r}){const a=l.useRef(null),{viewport:t}=v(),{mouse:i,scroll:s}=h(),o=l.useRef({uTime:{value:0},uMouse:{value:new f(.5,.5)},uResolution:{value:new f(t.width,t.height)},uScrollProgress:{value:0},uColor1:{value:new u(r[0])},uColor2:{value:new u(r[1])},uColor3:{value:new u(r[2])}});return p(({clock:n})=>{o.current.uTime.value=n.getElapsedTime(),o.current.uMouse.value.lerp(i,.1),o.current.uScrollProgress.value=s}),l.useEffect(()=>{o.current.uResolution.value.set(t.width,t.height)},[t]),e.jsxs("mesh",{ref:a,children:[e.jsx("planeGeometry",{args:[2,2]}),e.jsx("shaderMaterial",{vertexShader:w,fragmentShader:x,uniforms:o.current})]})}function C({title:r="Welcome",subtitle:a="Scroll to explore",colors:t=["#0f0c29","#302b63","#24243e"],className:i="",children:s}){const[o,n]=l.useState(0);l.useEffect(()=>{const c=()=>n(window.scrollY);return window.addEventListener("scroll",c,{passive:!0}),()=>window.removeEventListener("scroll",c)},[]);const m=o*.5;return e.jsxs("section",{className:`shader-hero ${i}`,style:{position:"relative",width:"100%",height:"100vh",overflow:"hidden"},children:[e.jsx("div",{style:{position:"absolute",inset:0,transform:`translateY(${m}px)`},children:e.jsx(d,{trackMouse:!0,mobileInteraction:"tilt",pauseWhenHidden:!0,children:e.jsx(g,{colors:t})})}),e.jsx("div",{style:{position:"relative",zIndex:10,height:"100%",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",color:"white",textAlign:"center",padding:"2rem",opacity:1-o/500,transform:`translateY(${o*.3}px)`},children:s||e.jsxs(e.Fragment,{children:[e.jsx("h1",{style:{fontSize:"clamp(3rem, 10vw, 8rem)",fontWeight:700,margin:0,letterSpacing:"-0.02em",textShadow:"0 4px 30px rgba(0,0,0,0.5)"},children:r}),e.jsx("p",{style:{fontSize:"clamp(1rem, 3vw, 1.5rem)",marginTop:"1rem",opacity:.8,textShadow:"0 2px 10px rgba(0,0,0,0.5)"},children:a})]})}),e.jsx("div",{style:{position:"absolute",bottom:"2rem",left:"50%",transform:"translateX(-50%)",opacity:1-o/200},children:e.jsx("div",{style:{width:"24px",height:"40px",border:"2px solid rgba(255,255,255,0.5)",borderRadius:"12px",position:"relative"},children:e.jsx("div",{style:{position:"absolute",top:"8px",left:"50%",transform:"translateX(-50%)",width:"4px",height:"8px",backgroundColor:"white",borderRadius:"2px",animation:"scrollBounce 2s infinite"}})})}),e.jsx("style",{children:`
        @keyframes scrollBounce {
          0%, 100% { transform: translateX(-50%) translateY(0); opacity: 1; }
          50% { transform: translateX(-50%) translateY(10px); opacity: 0.5; }
        }
      `})]})}export{C as ShaderHero,C as default};
