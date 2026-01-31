import{r as t,j as e}from"./index-CvryfeK-.js";import{w,s as R,C as z}from"./react-three-fiber.esm-qmgw6Lw5.js";const U={ripple:`
    precision highp float;
    varying vec2 vUv;
    uniform float uTime;
    uniform float uSize;
    uniform vec3 uColor;
    
    void main() {
      vec2 uv = vUv - 0.5;
      float dist = length(uv) * 2.0;
      
      float ripple = sin(dist * 20.0 - uTime * 8.0) * 0.5 + 0.5;
      ripple *= 1.0 - smoothstep(0.0, 0.5, dist);
      
      float alpha = ripple * (1.0 - dist * 2.0);
      alpha = max(0.0, alpha);
      
      vec3 color = uColor * (0.5 + ripple * 0.5);
      gl_FragColor = vec4(color, alpha * 0.8);
    }
  `,glow:`
    precision highp float;
    varying vec2 vUv;
    uniform float uTime;
    uniform float uSize;
    uniform vec3 uColor;
    
    void main() {
      vec2 uv = vUv - 0.5;
      float dist = length(uv) * 2.0;
      
      float glow = 1.0 - smoothstep(0.0, 0.5, dist);
      glow = pow(glow, 1.5);
      
      // Pulsing
      float pulse = sin(uTime * 3.0) * 0.2 + 0.8;
      glow *= pulse;
      
      gl_FragColor = vec4(uColor, glow * 0.7);
    }
  `,vortex:`
    precision highp float;
    varying vec2 vUv;
    uniform float uTime;
    uniform float uSize;
    uniform vec3 uColor;
    
    void main() {
      vec2 uv = vUv - 0.5;
      float dist = length(uv) * 2.0;
      float angle = atan(uv.y, uv.x);
      
      // Spiral
      float spiral = sin(angle * 5.0 - dist * 10.0 + uTime * 5.0);
      spiral = spiral * 0.5 + 0.5;
      
      float alpha = spiral * (1.0 - smoothstep(0.0, 0.5, dist));
      
      vec3 color = uColor * (0.6 + spiral * 0.4);
      gl_FragColor = vec4(color, alpha * 0.6);
    }
  `,noise:`
    precision highp float;
    varying vec2 vUv;
    uniform float uTime;
    uniform float uSize;
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
    
    void main() {
      vec2 uv = vUv - 0.5;
      float dist = length(uv) * 2.0;
      
      float n = noise(uv * 10.0 + uTime * 2.0);
      float n2 = noise(uv * 20.0 - uTime * 3.0);
      
      float alpha = (n * 0.5 + n2 * 0.5) * (1.0 - smoothstep(0.0, 0.5, dist));
      
      vec3 color = uColor * (0.5 + n * 0.5);
      gl_FragColor = vec4(color, alpha * 0.7);
    }
  `,blob:`
    precision highp float;
    varying vec2 vUv;
    uniform float uTime;
    uniform float uSize;
    uniform vec3 uColor;
    
    void main() {
      vec2 uv = vUv - 0.5;
      float dist = length(uv) * 2.0;
      
      // Wobbly blob
      float angle = atan(uv.y, uv.x);
      float wobble = sin(angle * 3.0 + uTime * 4.0) * 0.1;
      wobble += sin(angle * 5.0 - uTime * 3.0) * 0.05;
      
      float radius = 0.4 + wobble;
      float blob = 1.0 - smoothstep(radius - 0.05, radius + 0.05, dist);
      
      // Inner gradient
      float inner = 1.0 - dist / radius;
      inner = max(0.0, inner);
      
      vec3 color = uColor * (0.7 + inner * 0.3);
      gl_FragColor = vec4(color, blob * 0.8);
    }
  `},F=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;function S({mode:u,color:s}){const r=t.useRef(null),n=t.useRef(null);return R(({clock:i})=>{n.current&&(n.current.uniforms.uTime.value=i.getElapsedTime())}),t.useEffect(()=>{n.current&&n.current.uniforms.uColor.value.set(s)},[s]),e.jsxs("mesh",{ref:r,children:[e.jsx("planeGeometry",{args:[2,2]}),e.jsx("shaderMaterial",{ref:n,vertexShader:F,fragmentShader:U[u],uniforms:{uTime:{value:0},uSize:{value:1},uColor:{value:new z(s)}},transparent:!0,depthWrite:!1},u)]})}function E({mode:u="ripple",color:s="#667eea",size:r=40,expandOnHover:n=!0,expandedSize:i=80,hoverTargets:v="a, button, [data-cursor-expand]",mobileEnabled:o=!0,className:j=""}){const[p,g]=t.useState({x:0,y:0}),[h,x]=t.useState(r),[y,f]=t.useState(!1),[a,k]=t.useState(!1),[T,C]=t.useState([]),M=t.useRef(0);t.useEffect(()=>{k("ontouchstart"in window)},[]),t.useEffect(()=>{if(a)return;const l=m=>{g({x:m.clientX,y:m.clientY}),f(!0)},d=()=>f(!1),c=()=>f(!0);return document.addEventListener("mousemove",l),document.addEventListener("mouseleave",d),document.addEventListener("mouseenter",c),()=>{document.removeEventListener("mousemove",l),document.removeEventListener("mouseleave",d),document.removeEventListener("mouseenter",c)}},[a]),t.useEffect(()=>{if(!n||a)return;const l=c=>{c.target.closest(v)&&x(i)},d=c=>{const m=c.target,b=c.relatedTarget;m.closest(v)&&(!b||!b.closest(v))&&x(r)};return document.addEventListener("mouseover",l),document.addEventListener("mouseout",d),()=>{document.removeEventListener("mouseover",l),document.removeEventListener("mouseout",d)}},[n,v,r,i,a]);const L=t.useCallback(l=>{if(!o||!a)return;const d=l.touches[0]||l.changedTouches[0];if(!d)return;const c={id:M.current++,x:d.clientX,y:d.clientY};C(m=>[...m,c]),setTimeout(()=>{C(m=>m.filter(b=>b.id!==c.id))},1e3)},[o,a]);return a&&!o?null:e.jsxs(e.Fragment,{children:[!a&&e.jsx("div",{className:`shader-cursor ${j}`,style:{position:"fixed",left:p.x,top:p.y,width:h,height:h,transform:"translate(-50%, -50%)",pointerEvents:"none",zIndex:9999,opacity:y?1:0,transition:"width 0.2s, height 0.2s, opacity 0.2s",mixBlendMode:"screen"},children:e.jsx(w,{gl:{antialias:!0,alpha:!0},style:{width:"100%",height:"100%"},children:e.jsx(S,{mode:u,color:s})})}),a&&o&&e.jsx("div",{style:{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999},onTouchStart:L,children:T.map(l=>e.jsx("div",{style:{position:"absolute",left:l.x,top:l.y,width:i*2,height:i*2,transform:"translate(-50%, -50%)",animation:"rippleFade 1s ease-out forwards"},children:e.jsx(w,{gl:{antialias:!0,alpha:!0},style:{width:"100%",height:"100%"},children:e.jsx(S,{mode:"ripple",color:s})})},l.id))}),e.jsx("style",{children:`
        @keyframes rippleFade {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0;
          }
        }
      `})]})}function I(){const[u,s]=t.useState("ripple"),[r,n]=t.useState("#667eea");return{mode:u,color:r,setMode:s,setColor:n,props:{mode:u,color:r}}}function O({children:u,defaultMode:s="ripple",defaultColor:r="#667eea",modeByElement:n={},colorByElement:i={}}){const[v,o]=t.useState(s),[j,p]=t.useState(r);return t.useEffect(()=>{const g=x=>{const y=x.target;for(const[f,a]of Object.entries(n))if(y.matches(f)){o(a);break}for(const[f,a]of Object.entries(i))if(y.matches(f)){p(a);break}},h=()=>{o(s),p(r)};return document.addEventListener("mouseover",g),document.addEventListener("mouseout",h),()=>{document.removeEventListener("mouseover",g),document.removeEventListener("mouseout",h)}},[s,r,n,i]),e.jsxs(e.Fragment,{children:[u,e.jsx(E,{mode:v,color:j})]})}function W(){const u=["ripple","glow","vortex","noise","blob"],s=["#f72585","#4cc9f0","#06d6a0","#ffd166","#8338ec"],[r,n]=t.useState("ripple"),[i,v]=t.useState("#f72585");return e.jsxs("div",{style:{minHeight:"100vh",background:"#0a0a0a",cursor:"none"},children:[e.jsx(E,{mode:r,color:i,size:50,expandedSize:100}),e.jsxs("div",{style:{padding:"4rem",color:"white"},children:[e.jsx("h1",{style:{marginBottom:"1rem"},children:"Shader Cursor"}),e.jsx("p",{style:{color:"#888",marginBottom:"2rem"},children:"Move your mouse to see the shader effect. Hover buttons to expand."}),e.jsxs("div",{style:{marginBottom:"2rem"},children:[e.jsx("h3",{style:{marginBottom:"1rem",color:"#666"},children:"Effect Mode:"}),e.jsx("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},children:u.map(o=>e.jsx("button",{onClick:()=>n(o),style:{padding:"0.75rem 1.5rem",borderRadius:"8px",border:"none",background:r===o?i:"#222",color:"white",cursor:"none",textTransform:"capitalize",fontSize:"1rem",transition:"background 0.2s"},children:o},o))})]}),e.jsxs("div",{style:{marginBottom:"3rem"},children:[e.jsx("h3",{style:{marginBottom:"1rem",color:"#666"},children:"Color:"}),e.jsx("div",{style:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},children:s.map(o=>e.jsx("button",{onClick:()=>v(o),style:{width:"50px",height:"50px",borderRadius:"50%",border:i===o?"3px solid white":"3px solid transparent",background:o,cursor:"none",transition:"border 0.2s, transform 0.2s"}},o))})]}),e.jsxs("div",{style:{padding:"3rem",background:"#111",borderRadius:"12px",textAlign:"center",marginBottom:"2rem"},children:[e.jsx("p",{style:{fontSize:"1.25rem",marginBottom:"1.5rem"},children:"Hover over these interactive elements:"}),e.jsxs("div",{style:{display:"flex",gap:"1rem",justifyContent:"center",flexWrap:"wrap"},children:[e.jsx("button",{style:{padding:"1rem 2rem",fontSize:"1rem",cursor:"none",background:"#333",border:"none",borderRadius:"8px",color:"white"},children:"Button 1"}),e.jsx("a",{href:"#",onClick:o=>o.preventDefault(),style:{padding:"1rem 2rem",fontSize:"1rem",cursor:"none",background:"#333",borderRadius:"8px",color:"white",textDecoration:"none",display:"inline-block"},children:"Link Element"}),e.jsx("div",{"data-cursor-expand":!0,style:{padding:"1rem 2rem",fontSize:"1rem",cursor:"none",background:"#333",borderRadius:"8px",color:"white"},children:"Custom [data-cursor-expand]"})]})]}),e.jsx("a",{href:"#/",style:{color:i,display:"inline-block",cursor:"none"},children:"← Back to Home"})]})]})}export{E as ShaderCursor,W as ShaderCursorDemo,O as ShaderCursorProvider,E as default,I as useShaderCursor};
