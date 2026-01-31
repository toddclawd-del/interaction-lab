import{r as e,j as t}from"./index-D5HXmxLr.js";import{w as b,C as U,s as F}from"./react-three-fiber.esm-CDC9DQDc.js";const R={ripple:`
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
  `},_=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;function w({mode:c,color:r}){const s=e.useRef(null),i=e.useRef({uTime:{value:0},uSize:{value:1},uColor:{value:new U(r)}});return F(({clock:a})=>{i.current.uTime.value=a.getElapsedTime()}),e.useEffect(()=>{i.current.uColor.value.set(r)},[r]),t.jsxs("mesh",{ref:s,children:[t.jsx("planeGeometry",{args:[2,2]}),t.jsx("shaderMaterial",{vertexShader:_,fragmentShader:R[c],uniforms:i.current,transparent:!0,depthWrite:!1})]})}function z({mode:c="ripple",color:r="#667eea",size:s=40,expandOnHover:i=!0,expandedSize:a=80,hoverTargets:d="a, button, [data-cursor-expand]",mobileEnabled:f=!0,className:y=""}){const[h,g]=e.useState({x:0,y:0}),[p,x]=e.useState(s),[C,m]=e.useState(!1),[o,E]=e.useState(!1),[j,S]=e.useState([]),T=e.useRef(0);e.useEffect(()=>{E("ontouchstart"in window)},[]),e.useEffect(()=>{if(o)return;const n=v=>{g({x:v.clientX,y:v.clientY}),m(!0)},u=()=>m(!1),l=()=>m(!0);return document.addEventListener("mousemove",n),document.addEventListener("mouseleave",u),document.addEventListener("mouseenter",l),()=>{document.removeEventListener("mousemove",n),document.removeEventListener("mouseleave",u),document.removeEventListener("mouseenter",l)}},[o]),e.useEffect(()=>{if(!i||o)return;const n=l=>{l.target.matches(d)&&x(a)},u=l=>{l.target.matches(d)&&x(s)};return document.addEventListener("mouseover",n),document.addEventListener("mouseout",u),()=>{document.removeEventListener("mouseover",n),document.removeEventListener("mouseout",u)}},[i,d,s,a,o]);const L=e.useCallback(n=>{if(!f||!o)return;const u=n.touches[0]||n.changedTouches[0];if(!u)return;const l={id:T.current++,x:u.clientX,y:u.clientY};S(v=>[...v,l]),setTimeout(()=>{S(v=>v.filter(M=>M.id!==l.id))},1e3)},[f,o]);return o&&!f?null:t.jsxs(t.Fragment,{children:[!o&&t.jsx("div",{className:`shader-cursor ${y}`,style:{position:"fixed",left:h.x,top:h.y,width:p,height:p,transform:"translate(-50%, -50%)",pointerEvents:"none",zIndex:9999,opacity:C?1:0,transition:"width 0.2s, height 0.2s, opacity 0.2s",mixBlendMode:"screen"},children:t.jsx(b,{gl:{antialias:!0,alpha:!0},style:{width:"100%",height:"100%"},children:t.jsx(w,{mode:c,color:r})})}),o&&f&&t.jsx("div",{style:{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999},onTouchStart:L,children:j.map(n=>t.jsx("div",{style:{position:"absolute",left:n.x,top:n.y,width:a*2,height:a*2,transform:"translate(-50%, -50%)",animation:"rippleFade 1s ease-out forwards"},children:t.jsx(b,{gl:{antialias:!0,alpha:!0},style:{width:"100%",height:"100%"},children:t.jsx(w,{mode:"ripple",color:r})})},n.id))}),t.jsx("style",{children:`
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
      `})]})}function k(){const[c,r]=e.useState("ripple"),[s,i]=e.useState("#667eea");return{mode:c,color:s,setMode:r,setColor:i,props:{mode:c,color:s}}}function P({children:c,defaultMode:r="ripple",defaultColor:s="#667eea",modeByElement:i={},colorByElement:a={}}){const[d,f]=e.useState(r),[y,h]=e.useState(s);return e.useEffect(()=>{const g=x=>{const C=x.target;for(const[m,o]of Object.entries(i))if(C.matches(m)){f(o);break}for(const[m,o]of Object.entries(a))if(C.matches(m)){h(o);break}},p=()=>{f(r),h(s)};return document.addEventListener("mouseover",g),document.addEventListener("mouseout",p),()=>{document.removeEventListener("mouseover",g),document.removeEventListener("mouseout",p)}},[r,s,i,a]),t.jsxs(t.Fragment,{children:[c,t.jsx(z,{mode:d,color:y})]})}export{z as ShaderCursor,P as ShaderCursorProvider,z as default,k as useShaderCursor};
