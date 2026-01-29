import{r as c,j as e,L as y}from"./index-CNM8PfsK.js";import{w as C,u as I,z as M,s as F,A as R,V as j}from"./Texture-D7GLJgSF.js";import{L as A}from"./lenis-DTHSWqDp.js";const k=`uniform float uScrollSpeed;
uniform float uCurveStrength;
uniform float uCurveFrequency;

varying vec2 vUv;

#define PI 3.141592653

void main() {
  vec3 pos = position;
  vec3 worldPosition = (modelMatrix * vec4(position, 1.0)).xyz;

  // X Displacement depending on the world position Y (creates the wave)
  float xDisplacement = uCurveStrength * cos(worldPosition.y * uCurveFrequency);
  pos.x += xDisplacement;
  pos.x -= uCurveStrength; // Center the curve

  // Y Displacement according to the scroll speed (stretch effect)
  float yDisplacement = -sin(uv.x * PI) * uScrollSpeed;
  pos.y += yDisplacement;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

  // VARYINGS
  vUv = uv;
}
`,P=`precision highp float;

uniform sampler2D uTexture;
uniform vec2 uPlaneSizes;
uniform vec2 uImageSizes;
uniform float uOpacity;

varying vec2 vUv;

void main() {
  // Calculate aspect ratio correction for "object-fit: cover" effect
  vec2 ratio = vec2(
    min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
    min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
  );

  // Apply centered UV mapping
  vec2 uv = vec2(
    vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
    vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
  );

  vec4 finalColor = texture2D(uTexture, uv);
  finalColor.a *= uOpacity;
  gl_FragColor = finalColor;
}
`,S=["https://picsum.photos/seed/wavy1/600/800","https://picsum.photos/seed/wavy2/600/800","https://picsum.photos/seed/wavy3/600/800","https://picsum.photos/seed/wavy4/600/800","https://picsum.photos/seed/wavy5/600/800","https://picsum.photos/seed/wavy6/600/800","https://picsum.photos/seed/wavy7/600/800","https://picsum.photos/seed/wavy8/600/800"];function z(l,t){return(l%t+t)%t}const w=c.forwardRef(({imageUrl:l,scale:t,geometry:u,position:s=[0,0,0],curveStrength:v=0,curveFrequency:d=0},o)=>{const n=c.useRef(null),i=o||n,r=R(l),m=c.useMemo(()=>{var f,a;return r?[((f=r.image)==null?void 0:f.width)||600,((a=r.image)==null?void 0:a.height)||800]:[1,1]},[r]),p=c.useMemo(()=>({uniforms:{uTexture:{value:r},uPlaneSizes:{value:new j(t[0],t[1])},uImageSizes:{value:new j(m[0],m[1])},uScrollSpeed:{value:0},uCurveStrength:{value:v},uCurveFrequency:{value:d},uOpacity:{value:1}},vertexShader:k,fragmentShader:P,transparent:!0}),[r,t,m,v,d]);return e.jsxs("mesh",{position:s,ref:i,scale:t,children:[e.jsx("primitive",{object:u,attach:"geometry"}),e.jsx("shaderMaterial",{...p})]})});w.displayName="GLImage";function g({position:l=[0,0,0],imageSize:t,gap:u,curveStrength:s=.8,curveFrequency:v=.5,direction:d="vertical",scrollMultiplier:o=.01,lenis:n}){const i=c.useRef([]),r=c.useRef(0),m=c.useMemo(()=>new M(1,1,32,32),[]),p=c.useMemo(()=>S.length*u+S.length*(d==="vertical"?t[1]:t[0]),[u,t,d]);return c.useEffect(()=>{if(!n)return;const f=({velocity:a})=>{r.current=a};return n.on("scroll",f),()=>{n.off("scroll",f)}},[n]),F(()=>{const f=r.current;i.current.forEach(a=>{if(!a)return;const x=a.material;x.uniforms&&(x.uniforms.uScrollSpeed.value=f*o),d==="vertical"?(a.position.y-=f*o,a.position.y=z(a.position.y+p/2,p)-p/2):(a.position.x-=f*o,a.position.x=z(a.position.x+p/2,p)-p/2)}),r.current*=.95}),e.jsx("group",{position:l,children:S.map((f,a)=>{const x=d==="vertical"?[0,a*(t[1]+u)-p/2+t[1]/2,0]:[a*(t[0]+u)-p/2+t[0]/2,0,0];return e.jsx(w,{imageUrl:f,scale:[t[0],t[1],1],geometry:m,position:x,curveStrength:s,curveFrequency:v,ref:b=>{b&&(i.current[a]=b)}},a)})})}function D({variant:l,lenis:t}){const{viewport:u}=I(),s=u.width<4.5,o=Math.min(u.width,u.height)*(s?.4:.25),n=o*1.33;if(l==="single")return e.jsx(g,{imageSize:[o*(s?1.2:1),n*(s?1.2:1)],gap:n*.15,curveStrength:s?.3:.6,curveFrequency:.4,lenis:t});if(l==="dual"){const i=s?o*.55:o*.8,r=s?.8:.9;return e.jsxs(e.Fragment,{children:[e.jsx(g,{position:[-i,0,0],imageSize:[o*r,n*r],gap:n*.12,curveStrength:s?.3:.5,curveFrequency:.35,scrollMultiplier:.012,lenis:t}),e.jsx(g,{position:[i,n*.5,0],imageSize:[o*r,n*r],gap:n*.12,curveStrength:s?-.3:-.5,curveFrequency:.35,scrollMultiplier:-.01,lenis:t})]})}if(l==="triple"){if(s){const r=o*.55;return e.jsxs(e.Fragment,{children:[e.jsx(g,{position:[-r,0,0],imageSize:[o*.75,n*.75],gap:n*.1,curveStrength:.25,curveFrequency:.3,scrollMultiplier:.01,lenis:t}),e.jsx(g,{position:[r,n*.4,0],imageSize:[o*.75,n*.75],gap:n*.1,curveStrength:-.25,curveFrequency:.3,scrollMultiplier:-.008,lenis:t})]})}const i=o*1.1;return e.jsxs(e.Fragment,{children:[e.jsx(g,{position:[-i,0,-.5],imageSize:[o*.75,n*.75],gap:n*.1,curveStrength:.4,curveFrequency:.3,scrollMultiplier:.008,lenis:t}),e.jsx(g,{position:[0,n*.3,0],imageSize:[o,n],gap:n*.15,curveStrength:0,curveFrequency:0,scrollMultiplier:.015,lenis:t}),e.jsx(g,{position:[i,-n*.2,-.5],imageSize:[o*.75,n*.75],gap:n*.1,curveStrength:-.4,curveFrequency:.3,scrollMultiplier:-.01,lenis:t})]})}return e.jsx(g,{imageSize:[o*1,n*1],gap:o*.15,curveStrength:.5,curveFrequency:.3,direction:"horizontal",lenis:t})}const q=()=>typeof window>"u"?!1:/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)||window.innerWidth<768;function T(){const[l,t]=c.useState("dual"),u=c.useRef(null),[s,v]=c.useState(!1),[d,o]=c.useState(null),[n]=c.useState(q);return c.useEffect(()=>{try{let i=function(p){r.raf(p),m=requestAnimationFrame(i)};const r=new A({duration:1.2,easing:p=>Math.min(1,1.001-Math.pow(2,-10*p)),orientation:l==="horizontal"?"horizontal":"vertical",gestureOrientation:l==="horizontal"?"horizontal":"vertical",smoothWheel:!0,infinite:!0,touchMultiplier:2});u.current=r,v(!0);let m;return m=requestAnimationFrame(i),()=>{cancelAnimationFrame(m),r.destroy(),u.current=null,v(!1)}}catch(i){console.error("Lenis initialization failed:",i),o("Scroll initialization failed")}},[l]),d?e.jsxs("div",{style:{...h.container,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:"1rem"},children:[e.jsxs("p",{style:{color:"#ff6b6b",fontSize:"1.2rem"},children:["⚠️ ",d]}),e.jsx(y,{to:"/",style:{color:"#fff",textDecoration:"underline"},children:"← Back to Home"})]}):n?e.jsxs("div",{style:{...h.container,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:"1.5rem",padding:"2rem",textAlign:"center"},children:[e.jsx("div",{style:{fontSize:"4rem"},children:"🖥️"}),e.jsx("h2",{style:{color:"#fff",fontSize:"1.5rem",fontWeight:600},children:"Desktop Recommended"}),e.jsx("p",{style:{color:"#888",maxWidth:"300px",lineHeight:1.6},children:"This scroll-driven 3D carousel works best on desktop browsers. The smooth scroll library has compatibility issues on mobile Safari."}),e.jsx(y,{to:"/",style:{color:"#fff",background:"#333",padding:"0.75rem 1.5rem",borderRadius:"8px",textDecoration:"none",marginTop:"1rem"},children:"← Back to Interactions"})]}):e.jsxs("div",{style:h.container,children:[!s&&e.jsx("div",{style:{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",zIndex:100},children:e.jsx("p",{style:{color:"#666"},children:"Loading..."})}),e.jsx(y,{to:"/",style:h.backButton,children:"← Back"}),e.jsx("div",{style:h.controls,children:["single","dual","triple","horizontal"].map(i=>e.jsx("button",{onClick:()=>t(i),style:{...h.button,...l===i?h.buttonActive:{}},children:i.charAt(0).toUpperCase()+i.slice(1)},i))}),e.jsx("div",{style:h.hint,children:l==="horizontal"?"← Scroll horizontally →":"↑ Scroll to explore ↓"}),e.jsxs(C,{camera:{position:[0,0,5],fov:50},style:h.canvas,gl:{antialias:!0,alpha:!0},children:[e.jsx("color",{attach:"background",args:["#0a0a0a"]}),s&&e.jsx(D,{variant:l,lenis:u.current})]}),e.jsx("div",{style:h.branding,children:"WAVY CAROUSEL"}),e.jsx("div",{style:h.scrollArea})]})}const h={container:{position:"fixed",top:0,left:0,width:"100vw",height:"100vh",overflow:"hidden",background:"#0a0a0a"},backButton:{position:"fixed",top:16,left:16,color:"rgba(255, 255, 255, 0.5)",textDecoration:"none",fontSize:14,fontWeight:500,zIndex:100,padding:"4px 8px",background:"rgba(0, 0, 0, 0.5)",borderRadius:4},controls:{position:"fixed",top:60,left:"50%",transform:"translateX(-50%)",display:"flex",gap:6,zIndex:100,flexWrap:"wrap",justifyContent:"center",maxWidth:"90vw"},button:{padding:"6px 12px",fontSize:11,fontWeight:500,textTransform:"uppercase",letterSpacing:"0.05em",color:"rgba(255, 255, 255, 0.5)",background:"rgba(255, 255, 255, 0.05)",borderWidth:1,borderStyle:"solid",borderColor:"rgba(255, 255, 255, 0.1)",borderRadius:4,cursor:"pointer",transition:"all 0.2s ease",whiteSpace:"nowrap"},buttonActive:{color:"#fff",background:"rgba(255, 255, 255, 0.15)",borderColor:"rgba(255, 255, 255, 0.3)"},hint:{position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",color:"rgba(255, 255, 255, 0.3)",fontSize:12,fontWeight:400,letterSpacing:"0.1em",zIndex:100,animation:"pulse 2s ease-in-out infinite"},canvas:{position:"absolute",top:0,left:0,width:"100%",height:"100%"},branding:{position:"fixed",top:16,right:16,color:"rgba(255, 255, 255, 0.3)",fontFamily:"monospace",fontSize:10,letterSpacing:"0.1em",pointerEvents:"none",userSelect:"none",zIndex:100},scrollArea:{position:"absolute",top:0,left:0,width:"100%",height:"500vh",pointerEvents:"none"}};export{T as WavyCarousel,T as default};
