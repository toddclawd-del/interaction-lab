import{j as o,r as p}from"./index-CI1sojri.js";import{R as y,u as h}from"./ResponsiveShader-DZSbrpZJ.js";import{C as f,V as C,s as w}from"./react-three-fiber.esm-CgX3tcfS.js";const S={grain:`
    precision highp float;
    varying vec2 vUv;
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uIntensity;
    uniform float uSpeed;
    uniform vec3 uColor;
    
    float random(vec2 co) {
      return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
    }
    
    void main() {
      vec2 uv = vUv;
      float time = uTime * uSpeed;
      
      // Create grain
      float grain = random(uv * 1000.0 + time) - 0.5;
      grain *= uIntensity;
      
      // Slight variation based on position
      float variation = random(floor(uv * 100.0) + floor(time * 10.0)) * 0.5;
      grain *= 0.5 + variation;
      
      gl_FragColor = vec4(uColor * (0.5 + grain), abs(grain) * 2.0);
    }
  `,perlin:`
    precision highp float;
    varying vec2 vUv;
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uScale;
    uniform float uSpeed;
    uniform float uOctaves;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    
    vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
    vec2 fade(vec2 t) { return t * t * t * (t * (t * 6.0 - 15.0) + 10.0); }
    
    float cnoise(vec2 P) {
      vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
      vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
      Pi = mod(Pi, 289.0);
      vec4 ix = Pi.xzxz;
      vec4 iy = Pi.yyww;
      vec4 fx = Pf.xzxz;
      vec4 fy = Pf.yyww;
      vec4 i = permute(permute(ix) + iy);
      vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0;
      vec4 gy = abs(gx) - 0.5;
      vec4 tx = floor(gx + 0.5);
      gx = gx - tx;
      vec2 g00 = vec2(gx.x, gy.x);
      vec2 g10 = vec2(gx.y, gy.y);
      vec2 g01 = vec2(gx.z, gy.z);
      vec2 g11 = vec2(gx.w, gy.w);
      vec4 norm = 1.79284291400159 - 0.85373472095314 * 
        vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
      g00 *= norm.x; g01 *= norm.y; g10 *= norm.z; g11 *= norm.w;
      float n00 = dot(g00, vec2(fx.x, fy.x));
      float n10 = dot(g10, vec2(fx.y, fy.y));
      float n01 = dot(g01, vec2(fx.z, fy.z));
      float n11 = dot(g11, vec2(fx.w, fy.w));
      vec2 fade_xy = fade(Pf.xy);
      vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
      return 2.3 * mix(n_x.x, n_x.y, fade_xy.y);
    }
    
    float fbm(vec2 p) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 1.0;
      int oct = int(uOctaves);
      for (int i = 0; i < 8; i++) {
        if (i >= oct) break;
        value += amplitude * cnoise(p * frequency);
        frequency *= 2.0;
        amplitude *= 0.5;
      }
      return value;
    }
    
    void main() {
      vec2 uv = vUv;
      float time = uTime * uSpeed;
      
      // Mouse influence
      vec2 mouseOffset = (uMouse - 0.5) * 0.3;
      vec2 p = (uv + mouseOffset) * uScale;
      
      float n = fbm(p + time * 0.5);
      n = n * 0.5 + 0.5;
      
      vec3 color = mix(uColor1, uColor2, n);
      gl_FragColor = vec4(color, 1.0);
    }
  `,simplex:`
    precision highp float;
    varying vec2 vUv;
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uScale;
    uniform float uSpeed;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }
    
    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865, 0.366025403, -0.577350269, 0.024390243);
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
      vec3 a0 = x - floor(x + 0.5);
      m *= 1.79284 - 0.85373 * (a0 * a0 + h * h);
      vec3 g;
      g.x = a0.x * x0.x + h.x * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }
    
    void main() {
      vec2 uv = vUv;
      float time = uTime * uSpeed;
      
      vec2 p = uv * uScale;
      p += (uMouse - 0.5) * 0.5;
      
      float n1 = snoise(p + time * 0.3);
      float n2 = snoise(p * 2.0 - time * 0.2);
      float n = (n1 * 0.6 + n2 * 0.4) * 0.5 + 0.5;
      
      vec3 color = mix(uColor1, uColor2, n);
      gl_FragColor = vec4(color, 1.0);
    }
  `,turbulence:`
    precision highp float;
    varying vec2 vUv;
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uScale;
    uniform float uSpeed;
    uniform float uTurbulence;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    
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
      for (int i = 0; i < 6; i++) {
        f += amp * noise(p);
        p *= 2.0;
        amp *= 0.5;
      }
      return f;
    }
    
    void main() {
      vec2 uv = vUv;
      float time = uTime * uSpeed;
      
      // Mouse adds turbulence
      vec2 mouseOffset = (uMouse - 0.5);
      float mouseDist = length(uv - uMouse);
      float mouseInfluence = exp(-mouseDist * 3.0) * uTurbulence;
      
      vec2 p = uv * uScale;
      
      // Domain warping for turbulence
      float warp1 = fbm(p + time * 0.3);
      float warp2 = fbm(p + vec2(5.2, 1.3) - time * 0.2);
      
      p += vec2(warp1, warp2) * (0.3 + mouseInfluence);
      
      float n = fbm(p + time * 0.1);
      n = n * 0.5 + 0.5;
      
      // Add mouse-induced turbulence
      n += mouseInfluence * 0.3 * sin(time * 5.0 + mouseDist * 10.0);
      n = clamp(n, 0.0, 1.0);
      
      vec3 color = mix(uColor1, uColor2, n);
      gl_FragColor = vec4(color, 1.0);
    }
  `,organic:`
    precision highp float;
    varying vec2 vUv;
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uScale;
    uniform float uSpeed;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    
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
      mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
      for (int i = 0; i < 5; i++) {
        f += amp * noise(p);
        p = rot * p * 2.0;
        amp *= 0.5;
      }
      return f;
    }
    
    void main() {
      vec2 uv = vUv;
      float time = uTime * uSpeed;
      
      vec2 p = uv * uScale;
      
      // Mouse influence on flow
      vec2 flow = (uMouse - 0.5) * 0.3;
      p += flow;
      
      // Multi-layer organic noise
      float n1 = fbm(p + time * 0.2);
      float n2 = fbm(p + vec2(n1 * 0.5, time * 0.15));
      float n3 = fbm(p + vec2(n2 * 0.3, n1 * 0.3) - time * 0.1);
      
      float n = (n1 * 0.3 + n2 * 0.4 + n3 * 0.3);
      
      // Create color bands
      vec3 color;
      if (n < 0.4) {
        color = mix(uColor1, uColor2, n * 2.5);
      } else {
        color = mix(uColor2, uColor3, (n - 0.4) * 1.67);
      }
      
      gl_FragColor = vec4(color, 1.0);
    }
  `},b=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;function M({type:e,color1:i,color2:t,color3:n,scale:c,speed:l,intensity:m=.1,octaves:s=4,turbulence:x=.5}){const v=p.useRef(null),{mouse:u,scroll:d}=h(),r=p.useRef({uTime:{value:0},uMouse:{value:new C(.5,.5)},uScale:{value:c},uSpeed:{value:l},uIntensity:{value:m},uOctaves:{value:s},uTurbulence:{value:x},uColor:{value:new f(i)},uColor1:{value:new f(i)},uColor2:{value:new f(t)},uColor3:{value:new f(n||t)}});return w(({clock:g})=>{r.current.uTime.value=g.getElapsedTime(),r.current.uMouse.value.lerp(u,.1),r.current.uScale.value=c*(1+d*.5)}),p.useEffect(()=>{r.current.uColor.value.set(i),r.current.uColor1.value.set(i),r.current.uColor2.value.set(t),r.current.uColor3.value.set(n||t)},[i,t,n]),o.jsxs("mesh",{ref:v,children:[o.jsx("planeGeometry",{args:[2,2]}),o.jsx("shaderMaterial",{vertexShader:b,fragmentShader:S[e],uniforms:r.current,transparent:e==="grain"})]})}function a({type:e="perlin",colors:i=["#1a1a2e","#16213e"],scale:t=4,speed:n=.2,intensity:c=.1,octaves:l=4,turbulence:m=.5,className:s="",style:x,children:v,overlay:u=!1}){return o.jsxs("div",{className:s,style:{position:"relative",width:"100%",height:"100%",minHeight:"200px",...x},children:[o.jsx("div",{style:{position:u?"absolute":"relative",inset:0,zIndex:u?10:0,pointerEvents:u?"none":"auto",mixBlendMode:u?"overlay":"normal"},children:o.jsx(y,{trackMouse:!0,mobileInteraction:"scroll",pauseWhenHidden:!0,children:o.jsx(M,{type:e,color1:i[0],color2:i[1],color3:i[2],scale:t,speed:n,intensity:c,octaves:l,turbulence:m})})}),v&&o.jsx("div",{style:{position:u?"relative":"absolute",inset:u?"auto":0,zIndex:u?0:1},children:v})]})}const P=e=>o.jsx(a,{...e,type:"grain",overlay:!0}),U=e=>o.jsx(a,{...e,type:"perlin"}),_=e=>o.jsx(a,{...e,type:"simplex"}),I=e=>o.jsx(a,{...e,type:"turbulence"}),O=e=>o.jsx(a,{...e,type:"organic"});export{P as GrainOverlay,O as OrganicNoise,U as PerlinNoise,a as ShaderNoise,_ as SimplexNoise,I as TurbulentNoise,a as default};
