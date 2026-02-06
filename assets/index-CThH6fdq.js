import{u as w,Q as S,L as p,l as b,C as T,V as x,v as M,j as e,y as N}from"./three-vendor-CgYOwSjb.js";import{r as s}from"./react-vendor-DtyY8K5c.js";import{L as P}from"./lenis-DTHSWqDp.js";import{g as v}from"./gsap-vendor-C8pce-KX.js";import{S as f}from"./ScrollTrigger-D1XJUMov.js";const L=`varying vec2 vUv;
varying vec2 vPosition;

void main() {
  vUv = uv;
  vPosition = position.xy;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,E=`precision highp float;

varying vec2 vUv;

uniform sampler2D uTexture;
uniform vec2 uResolution;       // Natural image resolution
uniform vec2 uContainerRes;     // Container/mesh dimensions
uniform float uProgress;        // 0 = hidden, 1 = fully revealed
uniform float uGridSize;        // Number of grid cells
uniform vec3 uColor;            // Background color for unrevealed areas

// Object-fit cover calculation
vec2 getCoverUv(vec2 uv, vec2 textureRes, vec2 containerRes) {
  vec2 textureAspect = textureRes / max(textureRes.x, textureRes.y);
  vec2 containerAspect = containerRes / max(containerRes.x, containerRes.y);
  
  vec2 scale = textureAspect / containerAspect;
  
  if (scale.x < scale.y) {
    scale = vec2(scale.x / scale.y, 1.0);
  } else {
    scale = vec2(1.0, scale.y / scale.x);
  }
  
  return (uv - 0.5) * scale + 0.5;
}

// Simple pseudo-random
float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
  // Calculate cover UVs for proper aspect ratio
  vec2 coverUv = getCoverUv(vUv, uResolution, uContainerRes);
  
  // Sample texture
  vec4 texColor = texture2D(uTexture, coverUv);
  
  // Grid-based reveal
  vec2 gridPos = floor(vUv * uGridSize);
  float cellRandom = random(gridPos);
  
  // Each cell reveals at a different progress threshold
  // Earlier cells (lower random value) reveal first
  float revealThreshold = cellRandom;
  
  // Smooth transition with slight overlap
  float reveal = smoothstep(
    revealThreshold - 0.1,
    revealThreshold + 0.1,
    uProgress
  );
  
  // Mix between background color and texture
  vec3 bgColor = uColor;
  vec3 finalColor = mix(bgColor, texColor.rgb, reveal);
  float finalAlpha = mix(0.0, texColor.a, reveal);
  
  // Also fade in opacity for unrevealed cells
  float cellOpacity = smoothstep(0.0, 0.05, uProgress);
  
  gl_FragColor = vec4(finalColor, finalAlpha * cellOpacity + (1.0 - cellOpacity) * 0.0);
}
`;v.registerPlugin(f);function A({element:n,gridSize:a=20,bgColor:i="#1a1a1a"}){const o=s.useRef(null),u=s.useRef(null),m=s.useRef(null),[d,g]=s.useState(null),{viewport:c,size:h}=w();s.useEffect(()=>{new S().load(n.src,l=>{l.minFilter=p,l.magFilter=p,l.generateMipmaps=!1,g(l)})},[n.src]);const r=s.useMemo(()=>new b({vertexShader:L,fragmentShader:E,uniforms:{uTexture:{value:null},uResolution:{value:new x(1,1)},uContainerRes:{value:new x(1,1)},uProgress:{value:0},uGridSize:{value:a},uColor:{value:new T(i)}},transparent:!0}),[a,i]);return s.useEffect(()=>{if(d&&r){r.uniforms.uTexture.value=d;const t=d.image;r.uniforms.uResolution.value.set(t.naturalWidth,t.naturalHeight)}},[d,r]),s.useEffect(()=>{if(!n||!r)return;const t=v.to(r.uniforms.uProgress,{value:1,ease:"none",scrollTrigger:{trigger:n,start:"top bottom",end:"center center",scrub:.5,toggleActions:"play reset restart reset"}});return m.current=t.scrollTrigger,()=>{var l;(l=m.current)==null||l.kill(),t.kill()}},[n,r]),M(()=>{if(!o.current||!u.current)return;const t=n.getBoundingClientRect(),l=t.width/h.width*c.width,j=t.height/h.height*c.height,y=(t.left+t.width/2)/h.width*c.width-c.width/2,C=-((t.top+t.height/2)/h.height)*c.height+c.height/2;o.current.scale.set(l,j,1),o.current.position.set(y,C,0),u.current.uniforms.uContainerRes.value.set(t.width,t.height)}),e.jsxs("mesh",{ref:o,children:[e.jsx("planeGeometry",{args:[1,1,1,1]}),e.jsx("primitive",{object:r,ref:u,attach:"material"})]})}v.registerPlugin(f);function G({images:n,gridSize:a}){return e.jsx(e.Fragment,{children:n.map((i,o)=>e.jsx(A,{element:i,gridSize:a},i.src+o))})}function I(){const{camera:n,viewport:a}=w();return s.useEffect(()=>{const o=75*Math.PI/180,u=a.height/(2*Math.tan(o/2));n.position.z=u,n.updateProjectionMatrix()},[n,a]),null}function k({images:n,lenis:a,gridSize:i=20}){return s.useEffect(()=>{if(a)return a.on("scroll",f.update),v.ticker.add(o=>{a.raf(o*1e3)}),v.ticker.lagSmoothing(0),()=>{a.off("scroll",f.update)}},[a]),e.jsxs(N,{style:{position:"fixed",top:0,left:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:10},camera:{fov:75,near:.1,far:1e3},gl:{alpha:!0,antialias:!0},children:[e.jsx(I,{}),e.jsx(G,{images:n,gridSize:i})]})}v.registerPlugin(f);const R=[{id:1,src:"https://picsum.photos/seed/reveal1/800/1000",title:"Northern Light I"},{id:2,src:"https://picsum.photos/seed/reveal2/700/900",title:"Arctic Dawn"},{id:3,src:"https://picsum.photos/seed/reveal3/600/800",title:"Frozen Tundra"},{id:4,src:"https://picsum.photos/seed/reveal4/800/600",title:"Mountain Pass"},{id:5,src:"https://picsum.photos/seed/reveal5/900/700",title:"Ice Formations"},{id:6,src:"https://picsum.photos/seed/reveal6/700/1000",title:"Midnight Sun"},{id:7,src:"https://picsum.photos/seed/reveal7/800/900",title:"Glacier Valley"},{id:8,src:"https://picsum.photos/seed/reveal8/600/700",title:"Aurora Borealis"}];function V(){const n=s.useRef(null),[a,i]=s.useState([]),[o,u]=s.useState(null),[m,d]=s.useState(!1),g=s.useRef([]);s.useEffect(()=>{const r=new P({duration:1.2,easing:t=>Math.min(1,1.001-Math.pow(2,-10*t)),smoothWheel:!0});return u(r),()=>{r.destroy()}},[]);const c=s.useCallback(()=>{const r=g.current.filter(t=>t!==null);r.length===R.length&&(i(r),d(!0),setTimeout(()=>f.refresh(),100))},[]),h=s.useCallback(r=>t=>{g.current[r]=t},[]);return e.jsxs("div",{ref:n,className:"srg-container",children:[m&&a.length>0&&e.jsx(k,{images:a,lenis:o,gridSize:25}),e.jsx("header",{className:"srg-header",children:e.jsxs("h1",{className:"srg-title",children:["Northern",e.jsx("br",{}),"Expeditions",e.jsx("br",{}),e.jsx("span",{className:"srg-title-year",children:"1970–1978"})]})}),e.jsxs("main",{className:"srg-gallery",children:[e.jsx("div",{className:"srg-grid",children:R.map((r,t)=>e.jsxs("div",{className:`srg-grid-item srg-grid-item--${t+1}`,children:[e.jsx("img",{ref:h(t),src:r.src,alt:r.title,className:"srg-image",onLoad:c,crossOrigin:"anonymous",style:{opacity:0}}),e.jsx("p",{className:"srg-image-title",children:r.title})]},r.id))}),e.jsx("div",{className:"srg-prose",children:e.jsx("p",{children:"Dark spruce forest frowned on either side the frozen waterway. The trees had been stripped by a recent wind of their white covering of frost, and they seemed to lean toward each other, black and ominous, in the fading light."})}),e.jsx("div",{className:"srg-prose",children:e.jsx("p",{children:"A vast silence reigned over the land. The land itself was a desolation, lifeless, without movement, so lonely and cold that the spirit of it was not even that of sadness."})})]}),e.jsx("footer",{className:"srg-footer",children:e.jsx("p",{children:"Scroll to reveal • WebGL Shader Gallery"})})]})}export{V as default};
