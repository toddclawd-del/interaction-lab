import{r as a,j as t,L as z}from"./index-gpLim1Hb.js";import{w as R,u as I,z as F,s as A,A as P,V as j}from"./Texture-Ba2Jkx_I.js";import{L as q}from"./lenis-DTHSWqDp.js";const L=`uniform float uScrollSpeed;
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
`,E=`precision highp float;

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
`,w=["https://picsum.photos/seed/wavy1/600/800","https://picsum.photos/seed/wavy2/600/800","https://picsum.photos/seed/wavy3/600/800","https://picsum.photos/seed/wavy4/600/800","https://picsum.photos/seed/wavy5/600/800","https://picsum.photos/seed/wavy6/600/800","https://picsum.photos/seed/wavy7/600/800","https://picsum.photos/seed/wavy8/600/800"];function C(u,n){return(u%n+n)%n}const M=a.forwardRef(({imageUrl:u,scale:n,geometry:s,position:p=[0,0,0],curveStrength:h=0,curveFrequency:i=0},y)=>{const m=a.useRef(null),r=y||m,e=P(u),d=a.useMemo(()=>{var g,l;return e?[((g=e.image)==null?void 0:g.width)||600,((l=e.image)==null?void 0:l.height)||800]:[1,1]},[e]),o=a.useMemo(()=>({uniforms:{uTexture:{value:e},uPlaneSizes:{value:new j(n[0],n[1])},uImageSizes:{value:new j(d[0],d[1])},uScrollSpeed:{value:0},uCurveStrength:{value:h},uCurveFrequency:{value:i},uOpacity:{value:1}},vertexShader:L,fragmentShader:E,transparent:!0}),[e,n,d,h,i]);return t.jsxs("mesh",{position:p,ref:r,scale:n,children:[t.jsx("primitive",{object:s,attach:"geometry"}),t.jsx("shaderMaterial",{...o})]})});M.displayName="GLImage";function x({position:u=[0,0,0],imageSize:n,gap:s,curveStrength:p=.8,curveFrequency:h=.5,direction:i="vertical",scrollMultiplier:y=.01,lenis:m,nativeScroll:r,isMobile:e=!1}){const d=a.useRef([]),o=a.useRef(0),g=a.useMemo(()=>new F(1,1,32,32),[]),l=a.useMemo(()=>w.length*s+w.length*(i==="vertical"?n[1]:n[0]),[s,n,i]);return a.useEffect(()=>{if(e&&r||!m)return;const f=({velocity:c})=>{o.current=c};return m.on("scroll",f),()=>{m.off("scroll",f)}},[m,e,r]),A(()=>{const f=e&&r?r.current.velocity:o.current;d.current.forEach(c=>{if(!c)return;const S=c.material;S.uniforms&&(S.uniforms.uScrollSpeed.value=f*y),i==="vertical"?(c.position.y-=f*y,c.position.y=C(c.position.y+l/2,l)-l/2):(c.position.x-=f*y,c.position.x=C(c.position.x+l/2,l)-l/2)}),o.current*=.95}),t.jsx("group",{position:u,children:w.map((f,c)=>{const S=i==="vertical"?[0,c*(n[1]+s)-l/2+n[1]/2,0]:[c*(n[0]+s)-l/2+n[0]/2,0,0];return t.jsx(M,{imageUrl:f,scale:[n[0],n[1],1],geometry:g,position:S,curveStrength:p,curveFrequency:h,ref:b=>{b&&(d.current[c]=b)}},c)})})}function k({variant:u,lenis:n,nativeScroll:s,isMobileDevice:p}){const{viewport:h}=I(),i=h.width<4.5,r=Math.min(h.width,h.height)*(i?.4:.25),e=r*1.33;if(u==="single")return t.jsx(x,{imageSize:[r*(i?1.2:1),e*(i?1.2:1)],gap:e*.15,curveStrength:i?.3:.6,curveFrequency:.4,lenis:n,nativeScroll:s,isMobile:p});if(u==="dual"){const d=i?r*.55:r*.8,o=i?.8:.9;return t.jsxs(t.Fragment,{children:[t.jsx(x,{position:[-d,0,0],imageSize:[r*o,e*o],gap:e*.12,curveStrength:i?.3:.5,curveFrequency:.35,scrollMultiplier:.012,lenis:n,nativeScroll:s,isMobile:p}),t.jsx(x,{position:[d,e*.5,0],imageSize:[r*o,e*o],gap:e*.12,curveStrength:i?-.3:-.5,curveFrequency:.35,scrollMultiplier:-.01,lenis:n,nativeScroll:s,isMobile:p})]})}if(u==="triple"){if(i){const o=r*.55;return t.jsxs(t.Fragment,{children:[t.jsx(x,{position:[-o,0,0],imageSize:[r*.75,e*.75],gap:e*.1,curveStrength:.25,curveFrequency:.3,scrollMultiplier:.01,lenis:n,nativeScroll:s,isMobile:p}),t.jsx(x,{position:[o,e*.4,0],imageSize:[r*.75,e*.75],gap:e*.1,curveStrength:-.25,curveFrequency:.3,scrollMultiplier:-.008,lenis:n,nativeScroll:s,isMobile:p})]})}const d=r*1.1;return t.jsxs(t.Fragment,{children:[t.jsx(x,{position:[-d,0,-.5],imageSize:[r*.75,e*.75],gap:e*.1,curveStrength:.4,curveFrequency:.3,scrollMultiplier:.008,lenis:n,nativeScroll:s,isMobile:p}),t.jsx(x,{position:[0,e*.3,0],imageSize:[r,e],gap:e*.15,curveStrength:0,curveFrequency:0,scrollMultiplier:.015,lenis:n,nativeScroll:s,isMobile:p}),t.jsx(x,{position:[d,-e*.2,-.5],imageSize:[r*.75,e*.75],gap:e*.1,curveStrength:-.4,curveFrequency:.3,scrollMultiplier:-.01,lenis:n,nativeScroll:s,isMobile:p})]})}return t.jsx(x,{imageSize:[r*1,e*1],gap:r*.15,curveStrength:.5,curveFrequency:.3,direction:"horizontal",lenis:n,nativeScroll:s,isMobile:p})}const W=()=>typeof window>"u"?!1:/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)||window.innerWidth<768;function D(){const[u,n]=a.useState("dual"),s=a.useRef(null),[p,h]=a.useState(!1),[i,y]=a.useState(null),[m]=a.useState(W),r=a.useRef({scroll:0,velocity:0}),e=a.useRef(0),d=a.useRef(Date.now());return a.useEffect(()=>{if(m){h(!0);const o=()=>{const g=Date.now(),l=Math.max(g-d.current,1),f=window.scrollY,c=(f-e.current)/l*16;r.current={scroll:f,velocity:c*.5},e.current=f,d.current=g};return window.addEventListener("scroll",o,{passive:!0}),()=>window.removeEventListener("scroll",o)}else try{let o=function(f){g.raf(f),l=requestAnimationFrame(o)};const g=new q({duration:1.2,easing:f=>Math.min(1,1.001-Math.pow(2,-10*f)),orientation:u==="horizontal"?"horizontal":"vertical",gestureOrientation:u==="horizontal"?"horizontal":"vertical",smoothWheel:!0,infinite:!0});s.current=g,h(!0);let l;return l=requestAnimationFrame(o),()=>{cancelAnimationFrame(l),g.destroy(),s.current=null,h(!1)}}catch(o){console.error("Lenis initialization failed:",o),y("Scroll initialization failed")}},[u,m]),i?t.jsxs("div",{style:{...v.container,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:"1rem"},children:[t.jsxs("p",{style:{color:"#ff6b6b",fontSize:"1.2rem"},children:["⚠️ ",i]}),t.jsx(z,{to:"/",style:{color:"#fff",textDecoration:"underline"},children:"← Back to Home"})]}):t.jsxs("div",{style:v.container,children:[!p&&t.jsx("div",{style:{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",zIndex:100},children:t.jsx("p",{style:{color:"#666"},children:"Loading..."})}),t.jsx(z,{to:"/",style:v.backButton,children:"← Back"}),t.jsx("div",{style:v.controls,children:["single","dual","triple","horizontal"].map(o=>t.jsx("button",{onClick:()=>n(o),style:{...v.button,...u===o?v.buttonActive:{}},children:o.charAt(0).toUpperCase()+o.slice(1)},o))}),t.jsx("div",{style:v.hint,children:u==="horizontal"?"← Scroll horizontally →":"↑ Scroll to explore ↓"}),t.jsxs(R,{camera:{position:[0,0,5],fov:50},style:v.canvas,gl:{antialias:!0,alpha:!0},children:[t.jsx("color",{attach:"background",args:["#0a0a0a"]}),p&&t.jsx(k,{variant:u,lenis:s.current,nativeScroll:r,isMobileDevice:m})]}),t.jsx("div",{style:v.branding,children:"WAVY CAROUSEL"}),t.jsx("div",{style:v.scrollArea})]})}const v={container:{position:"fixed",top:0,left:0,width:"100vw",height:"100vh",overflow:"hidden",background:"#0a0a0a"},backButton:{position:"fixed",top:16,left:16,color:"rgba(255, 255, 255, 0.5)",textDecoration:"none",fontSize:14,fontWeight:500,zIndex:100,padding:"4px 8px",background:"rgba(0, 0, 0, 0.5)",borderRadius:4},controls:{position:"fixed",top:60,left:"50%",transform:"translateX(-50%)",display:"flex",gap:6,zIndex:100,flexWrap:"wrap",justifyContent:"center",maxWidth:"90vw"},button:{padding:"6px 12px",fontSize:11,fontWeight:500,textTransform:"uppercase",letterSpacing:"0.05em",color:"rgba(255, 255, 255, 0.5)",background:"rgba(255, 255, 255, 0.05)",borderWidth:1,borderStyle:"solid",borderColor:"rgba(255, 255, 255, 0.1)",borderRadius:4,cursor:"pointer",transition:"all 0.2s ease",whiteSpace:"nowrap"},buttonActive:{color:"#fff",background:"rgba(255, 255, 255, 0.15)",borderColor:"rgba(255, 255, 255, 0.3)"},hint:{position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",color:"rgba(255, 255, 255, 0.3)",fontSize:12,fontWeight:400,letterSpacing:"0.1em",zIndex:100,animation:"pulse 2s ease-in-out infinite"},canvas:{position:"absolute",top:0,left:0,width:"100%",height:"100%"},branding:{position:"fixed",top:16,right:16,color:"rgba(255, 255, 255, 0.3)",fontFamily:"monospace",fontSize:10,letterSpacing:"0.1em",pointerEvents:"none",userSelect:"none",zIndex:100},scrollArea:{position:"absolute",top:0,left:0,width:"100%",height:"500vh",pointerEvents:"none"}};export{D as WavyCarousel,D as default};
