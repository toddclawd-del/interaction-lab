import{r as o,j as e}from"./index-a-Y0CU2r.js";import{R as w}from"./ResponsiveShader-GnHNjCBW.js";import{V as b,C as U,s as F}from"./react-three-fiber.esm-DYlaUvAv.js";const R={dissolve:`
    precision highp float;
    varying vec2 vUv;
    uniform float uProgress;
    uniform float uTime;
    uniform vec3 uColor;
    
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
      float n = fbm(uv * 8.0 + uTime * 0.5);
      float threshold = uProgress * 1.2 - 0.1;
      float alpha = smoothstep(threshold - 0.1, threshold + 0.1, n);
      
      // Edge glow
      float edge = smoothstep(threshold - 0.15, threshold, n) - smoothstep(threshold, threshold + 0.15, n);
      vec3 color = uColor + vec3(1.0) * edge * 2.0;
      
      gl_FragColor = vec4(color, alpha);
    }
  `,wipe:`
    precision highp float;
    varying vec2 vUv;
    uniform float uProgress;
    uniform float uDirection; // 0: left, 1: right, 2: up, 3: down
    uniform vec3 uColor;
    
    void main() {
      vec2 uv = vUv;
      float p = uProgress;
      float alpha = 0.0;
      
      int dir = int(uDirection);
      if (dir == 0) alpha = step(uv.x, p);
      else if (dir == 1) alpha = step(1.0 - uv.x, p);
      else if (dir == 2) alpha = step(1.0 - uv.y, p);
      else alpha = step(uv.y, p);
      
      // Soft edge
      float edgeWidth = 0.02;
      float edge = 0.0;
      if (dir == 0) edge = smoothstep(p - edgeWidth, p, uv.x) - smoothstep(p, p + edgeWidth, uv.x);
      else if (dir == 1) edge = smoothstep(p - edgeWidth, p, 1.0 - uv.x) - smoothstep(p, p + edgeWidth, 1.0 - uv.x);
      else if (dir == 2) edge = smoothstep(p - edgeWidth, p, 1.0 - uv.y) - smoothstep(p, p + edgeWidth, 1.0 - uv.y);
      else edge = smoothstep(p - edgeWidth, p, uv.y) - smoothstep(p, p + edgeWidth, uv.y);
      
      vec3 color = uColor + vec3(1.0) * edge;
      gl_FragColor = vec4(color, alpha);
    }
  `,circle:`
    precision highp float;
    varying vec2 vUv;
    uniform float uProgress;
    uniform vec2 uCenter;
    uniform vec3 uColor;
    
    void main() {
      vec2 uv = vUv;
      float dist = length(uv - uCenter);
      float maxDist = length(vec2(1.0, 1.0) - uCenter);
      float threshold = uProgress * maxDist * 1.5;
      
      float alpha = smoothstep(threshold + 0.02, threshold - 0.02, dist);
      
      // Edge glow
      float edge = smoothstep(threshold + 0.05, threshold, dist) - smoothstep(threshold, threshold - 0.05, dist);
      vec3 color = uColor + vec3(1.0) * edge;
      
      gl_FragColor = vec4(color, alpha);
    }
  `,pixelate:`
    precision highp float;
    varying vec2 vUv;
    uniform float uProgress;
    uniform vec3 uColor;
    
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }
    
    void main() {
      vec2 uv = vUv;
      
      // Pixel size changes with progress
      float pixelSize = mix(0.001, 0.1, uProgress);
      vec2 pixelUv = floor(uv / pixelSize) * pixelSize;
      
      // Random threshold per pixel
      float threshold = hash(pixelUv * 100.0);
      float alpha = step(threshold, uProgress * 1.5);
      
      gl_FragColor = vec4(uColor, alpha);
    }
  `,radial:`
    precision highp float;
    varying vec2 vUv;
    uniform float uProgress;
    uniform vec2 uCenter;
    uniform vec3 uColor;
    
    void main() {
      vec2 uv = vUv;
      vec2 toCenter = uv - uCenter;
      float angle = atan(toCenter.y, toCenter.x);
      float dist = length(toCenter);
      
      // Swirl effect
      float swirl = angle / 6.283 + 0.5;
      swirl = fract(swirl + uProgress * 2.0);
      
      float threshold = uProgress * 1.5;
      float alpha = smoothstep(threshold - 0.1, threshold + 0.1, swirl * dist * 2.0);
      
      vec3 color = uColor;
      gl_FragColor = vec4(color, alpha);
    }
  `,blinds:`
    precision highp float;
    varying vec2 vUv;
    uniform float uProgress;
    uniform float uSlats;
    uniform int uHorizontal;
    uniform vec3 uColor;
    
    void main() {
      vec2 uv = vUv;
      float coord = uHorizontal == 1 ? uv.y : uv.x;
      float slat = fract(coord * uSlats);
      float alpha = step(slat, uProgress);
      
      // Edge glow
      float edge = smoothstep(uProgress - 0.05, uProgress, slat) - smoothstep(uProgress, uProgress + 0.05, slat);
      vec3 color = uColor + vec3(1.0) * edge;
      
      gl_FragColor = vec4(color, alpha);
    }
  `},D=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;function S({type:s,progress:a,color:n,direction:l=0,center:t=[.5,.5],slats:f=10,horizontal:d=!1}){const p=o.useRef(null),u=o.useRef(0),r=o.useRef({uTime:{value:0},uProgress:{value:0},uColor:{value:new U(n)},uDirection:{value:l},uCenter:{value:new b(t[0],t[1])},uSlats:{value:f},uHorizontal:{value:d?1:0}});return F(({clock:c})=>{r.current.uTime.value=c.getElapsedTime(),u.current+=(a-u.current)*.1,r.current.uProgress.value=u.current}),o.useEffect(()=>{r.current.uColor.value.set(n)},[n]),e.jsxs("mesh",{ref:p,children:[e.jsx("planeGeometry",{args:[2,2]}),e.jsx("shaderMaterial",{vertexShader:D,fragmentShader:R[s],uniforms:r.current,transparent:!0})]})}const T=o.createContext(null);function A(){const s=o.useContext(T);if(!s)throw new Error("usePageTransition must be used within ShaderTransitionProvider");return s}function _({children:s,type:a="dissolve",color:n="#000000",duration:l=1e3,direction:t=0,center:f=[.5,.5],slats:d=10,horizontal:p=!1}){const[u,r]=o.useState(!1),[c,v]=o.useState(0),[C,y]=o.useState(a),i=o.useRef(),g=o.useCallback(h=>{i.current=h,r(!0),v(0);const j=Date.now(),m=l/2,P=()=>{const x=Date.now()-j;x<m?(v(x/m),requestAnimationFrame(P)):x<l?(x>=m&&i.current&&(i.current(),i.current=void 0),v(1-(x-m)/m),requestAnimationFrame(P)):(v(0),r(!1))};requestAnimationFrame(P)},[l]);return e.jsxs(T.Provider,{value:{isTransitioning:u,progress:c,startTransition:g,type:C,setType:y},children:[s,u&&e.jsx("div",{style:{position:"fixed",inset:0,zIndex:9999,pointerEvents:"none"},children:e.jsx(w,{frameloop:"always",children:e.jsx(S,{type:C,progress:c,color:n,direction:t,center:f,slats:d,horizontal:p})})})]})}function z({type:s="dissolve",color:a="#1a1a2e",direction:n=0,center:l=[.5,.5],slats:t=10,horizontal:f=!1,className:d="",style:p}){const[u,r]=o.useState(0),[c,v]=o.useState(!1),C=o.useCallback(()=>{if(c)return;v(!0),r(0);const y=Date.now(),i=2e3,g=()=>{const h=Date.now()-y;h<i/2?(r(h/(i/2)),requestAnimationFrame(g)):h<i?(r(1-(h-i/2)/(i/2)),requestAnimationFrame(g)):(r(0),v(!1))};requestAnimationFrame(g)},[c]);return e.jsxs("div",{className:d,style:{position:"relative",width:"100%",height:"100%",minHeight:"400px",background:"#f0f0f0",borderRadius:"8px",overflow:"hidden",cursor:"pointer",...p},onClick:C,children:[e.jsx("div",{style:{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.5rem",color:"#666"},children:"Click to trigger transition"}),e.jsx("div",{style:{position:"absolute",inset:0,pointerEvents:"none"},children:e.jsx(w,{frameloop:c?"always":"never",children:e.jsx(S,{type:s,progress:u,color:a,direction:n,center:l,slats:t,horizontal:f})})})]})}function q({className:s=""}){const[a,n]=o.useState("dissolve"),l=["dissolve","wipe","circle","pixelate","radial","blinds"];return e.jsxs("div",{className:s,children:[e.jsx("div",{style:{display:"flex",gap:"0.5rem",marginBottom:"1rem",flexWrap:"wrap"},children:l.map(t=>e.jsx("button",{onClick:()=>n(t),style:{padding:"0.5rem 1rem",borderRadius:"4px",border:"none",background:a===t?"#667eea":"#e0e0e0",color:a===t?"white":"black",cursor:"pointer",textTransform:"capitalize"},children:t},t))}),e.jsx(z,{type:a})]})}export{z as ShaderTransitionDemo,_ as ShaderTransitionProvider,q as TransitionShowcase,_ as default,A as usePageTransition};
