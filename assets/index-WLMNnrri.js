import{j as o,C as f,V as x,v as h}from"./three-vendor-CgYOwSjb.js";import{r as a}from"./react-vendor-DtyY8K5c.js";import{R as d,u as p}from"./ResponsiveShader-CRqqgd2G.js";const g={liquid:`
    precision highp float;
    varying vec2 vUv;
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uHover;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    
    float smin(float a, float b, float k) {
      float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
      return mix(b, a, h) - k * h * (1.0 - h);
    }
    
    float sdCircle(vec2 p, float r) { return length(p) - r; }
    
    void main() {
      vec2 uv = vUv - 0.5;
      float time = uTime * 0.5;
      vec2 mouse = uMouse - 0.5;
      
      float d = 1000.0;
      for (int i = 0; i < 5; i++) {
        float fi = float(i);
        float angle = fi * 1.256 + time;
        vec2 pos = vec2(cos(angle), sin(angle)) * 0.2;
        pos = mix(pos, mouse * 0.8, uHover * 0.5);
        d = smin(d, sdCircle(uv - pos, 0.08 + 0.02 * sin(time + fi)), 0.15);
      }
      
      float inside = 1.0 - smoothstep(0.0, 0.02, d);
      vec3 color = mix(uColor1 * 0.1, mix(uColor1, uColor2, smoothstep(-0.2, 0.2, d)), inside);
      color += vec3(1.0 - smoothstep(0.0, 0.04, abs(d))) * 0.3;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `,gradient:`
    precision highp float;
    varying vec2 vUv;
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uHover;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    
    float noise(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1,0)), f.x),
                 mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x), f.y);
    }
    
    void main() {
      vec2 uv = vUv;
      float time = uTime * 0.3;
      
      vec2 flow = uv + vec2(noise(uv * 3.0 + time), noise(uv * 3.0 + 10.0 - time)) * 0.1;
      flow += (uMouse - 0.5) * uHover * 0.2;
      
      float n = noise(flow * 2.0 + time);
      vec3 color = mix(uColor1, uColor2, n + uv.y * 0.5);
      
      float glow = smoothstep(0.5, 0.0, length(uv - uMouse)) * uHover * 0.5;
      color += uColor2 * glow;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `,waves:`
    precision highp float;
    varying vec2 vUv;
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uHover;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    
    void main() {
      vec2 uv = vUv;
      float time = uTime * 0.5;
      
      float wave = 0.0;
      for (float i = 1.0; i < 6.0; i++) {
        float freq = i * 3.0;
        float speed = i * 0.3;
        wave += sin(uv.x * freq + time * speed + uMouse.x * uHover * 2.0) / i;
        wave += sin(uv.y * freq * 0.7 + time * speed * 0.8) / i;
      }
      wave = wave * 0.25 + 0.5;
      
      vec3 color = mix(uColor1, uColor2, wave);
      
      float mouseGlow = smoothstep(0.4, 0.0, length(uv - uMouse)) * uHover;
      color += uColor2 * mouseGlow * 0.4;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `,noise:`
    precision highp float;
    varying vec2 vUv;
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uHover;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    
    vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
    
    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865, 0.366025403, -0.577350269, 0.024390243);
      vec2 i = floor(v + dot(v, C.yy));
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
      vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
      m = m * m;
      m = m * m;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 a0 = x - floor(x + 0.5);
      m *= 1.79284 - 0.85373 * (a0 * a0 + h * h);
      vec3 g;
      g.x = a0.x * x0.x + h.x * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }
    
    void main() {
      vec2 uv = vUv;
      float time = uTime * 0.2;
      
      vec2 offset = (uMouse - 0.5) * uHover * 0.3;
      float n1 = snoise((uv + offset) * 3.0 + time);
      float n2 = snoise((uv + offset) * 6.0 - time * 0.5);
      float n = n1 * 0.6 + n2 * 0.4;
      n = n * 0.5 + 0.5;
      
      vec3 color = mix(uColor1, uColor2, n);
      
      gl_FragColor = vec4(color, 1.0);
    }
  `},C=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;function y({variant:i,colors:t}){const n=a.useRef(null),{mouse:s,isHovered:l}=p(),e=a.useRef(0),r=a.useRef({uTime:{value:0},uMouse:{value:new x(.5,.5)},uHover:{value:0},uColor1:{value:new f(t[0])},uColor2:{value:new f(t[1])}});return h(({clock:v})=>{r.current.uTime.value=v.getElapsedTime(),r.current.uMouse.value.lerp(s,.1),e.current+=(l?1:0-e.current)*.1,r.current.uHover.value=e.current}),o.jsxs("mesh",{ref:n,children:[o.jsx("planeGeometry",{args:[2,2]}),o.jsx("shaderMaterial",{vertexShader:C,fragmentShader:g[i],uniforms:r.current})]})}function m({title:i,description:t,variant:n="liquid",colors:s=["#667eea","#764ba2"],onClick:l,expanded:e=!1,onClose:r}){return o.jsxs("div",{onClick:e?void 0:l,style:{position:e?"fixed":"relative",inset:e?0:"auto",zIndex:e?1e3:1,width:"100%",height:e?"100%":"300px",borderRadius:e?0:"16px",overflow:"hidden",cursor:e?"default":"pointer",transition:"all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",boxShadow:e?"none":"0 10px 40px rgba(0,0,0,0.2)"},children:[o.jsx(d,{trackMouse:!0,mobileInteraction:"touch",pauseWhenHidden:!e,frameloop:e?"always":"demand",children:o.jsx(y,{variant:n,colors:s})}),o.jsxs("div",{style:{position:"absolute",inset:0,padding:e?"3rem":"1.5rem",display:"flex",flexDirection:"column",justifyContent:e?"center":"flex-end",alignItems:e?"center":"flex-start",color:"white",textAlign:e?"center":"left",background:`linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent ${e?"100%":"80%"})`},children:[o.jsx("h3",{style:{fontSize:e?"clamp(2rem, 6vw, 4rem)":"1.5rem",fontWeight:600,margin:0,textShadow:"0 2px 10px rgba(0,0,0,0.5)"},children:i}),t&&o.jsx("p",{style:{fontSize:e?"1.25rem":"0.9rem",marginTop:"0.5rem",opacity:.9,maxWidth:e?"600px":"none"},children:t})]}),e&&r&&o.jsx("button",{onClick:r,style:{position:"absolute",top:"2rem",right:"2rem",width:"48px",height:"48px",borderRadius:"50%",border:"2px solid rgba(255,255,255,0.5)",background:"rgba(0,0,0,0.3)",color:"white",fontSize:"1.5rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s"},children:"×"})]})}function M({cards:i=[{title:"Liquid",variant:"liquid",colors:["#667eea","#764ba2"],description:"Metaball effect"},{title:"Gradient",variant:"gradient",colors:["#f093fb","#f5576c"],description:"Flowing colors"},{title:"Waves",variant:"waves",colors:["#4facfe","#00f2fe"],description:"Ocean motion"},{title:"Noise",variant:"noise",colors:["#43e97b","#38f9d7"],description:"Organic texture"}],columns:t=2,gap:n="1.5rem",className:s=""}){const[l,e]=a.useState(null),r=a.useCallback(u=>{e(u)},[]),v=a.useCallback(()=>{e(null)},[]);return o.jsxs("div",{className:s,children:[o.jsx("div",{style:{display:"grid",gridTemplateColumns:`repeat(${t}, 1fr)`,gap:n,padding:"1rem"},children:i.map((u,c)=>o.jsx(m,{...u,variant:u.variant,onClick:()=>r(c)},c))}),l!==null&&o.jsx(m,{...i[l],variant:i[l].variant,expanded:!0,onClose:v})]})}export{M as ShaderCards,M as default};
