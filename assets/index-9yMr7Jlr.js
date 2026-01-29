import{r as c,j as e,L as b}from"./index-DzH-DfHV.js";import{w as I,u as M,z as F,s as A,A as L,V as z}from"./Texture-BbKtgX8Z.js";import{L as P}from"./lenis-DTHSWqDp.js";const W=`uniform float uScrollSpeed;
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
`,w=["https://picsum.photos/seed/wavy1/600/800","https://picsum.photos/seed/wavy2/600/800","https://picsum.photos/seed/wavy3/600/800","https://picsum.photos/seed/wavy4/600/800","https://picsum.photos/seed/wavy5/600/800","https://picsum.photos/seed/wavy6/600/800","https://picsum.photos/seed/wavy7/600/800","https://picsum.photos/seed/wavy8/600/800"];function C(a,n){return(a%n+n)%n}const R=c.forwardRef(({imageUrl:a,scale:n,geometry:l,position:p=[0,0,0],curveStrength:g=0,curveFrequency:s=0},x)=>{const m=c.useRef(null),r=x||m,t=L(a),d=c.useMemo(()=>{var o,u;return t?[((o=t.image)==null?void 0:o.width)||600,((u=t.image)==null?void 0:u.height)||800]:[1,1]},[t]),f=c.useMemo(()=>({uniforms:{uTexture:{value:t},uPlaneSizes:{value:new z(n[0],n[1])},uImageSizes:{value:new z(d[0],d[1])},uScrollSpeed:{value:0},uCurveStrength:{value:g},uCurveFrequency:{value:s},uOpacity:{value:1}},vertexShader:W,fragmentShader:E,transparent:!0}),[t,n,d,g,s]);return e.jsxs("mesh",{position:p,ref:r,scale:n,children:[e.jsx("primitive",{object:l,attach:"geometry"}),e.jsx("shaderMaterial",{...f})]})});R.displayName="GLImage";function y({position:a=[0,0,0],imageSize:n,gap:l,curveStrength:p=.8,curveFrequency:g=.5,direction:s="vertical",scrollMultiplier:x=.01,lenis:m,nativeScroll:r,isMobile:t=!1}){const d=c.useRef([]),f=c.useRef(0),o=c.useMemo(()=>new F(1,1,32,32),[]),u=c.useMemo(()=>w.length*l+w.length*(s==="vertical"?n[1]:n[0]),[l,n,s]);return c.useEffect(()=>{if(t&&r||!m)return;const h=({velocity:i})=>{f.current=i};return m.on("scroll",h),()=>{m.off("scroll",h)}},[m,t,r]),A(()=>{const h=t&&r?r.current.velocity:f.current;d.current.forEach(i=>{if(!i)return;const S=i.material;S.uniforms&&(S.uniforms.uScrollSpeed.value=h*x),s==="vertical"?(i.position.y-=h*x,i.position.y=C(i.position.y+u/2,u)-u/2):(i.position.x-=h*x,i.position.x=C(i.position.x+u/2,u)-u/2)}),f.current*=.95}),e.jsx("group",{position:a,children:w.map((h,i)=>{const S=s==="vertical"?[0,i*(n[1]+l)-u/2+n[1]/2,0]:[i*(n[0]+l)-u/2+n[0]/2,0,0];return e.jsx(R,{imageUrl:h,scale:[n[0],n[1],1],geometry:o,position:S,curveStrength:p,curveFrequency:g,ref:j=>{j&&(d.current[i]=j)}},i)})})}function q({variant:a,lenis:n,nativeScroll:l,isMobileDevice:p}){const{viewport:g}=M(),s=g.width<4.5,r=Math.min(g.width,g.height)*(s?.4:.25),t=r*1.33;if(a==="single")return e.jsx(y,{imageSize:[r*(s?1.2:1),t*(s?1.2:1)],gap:t*.15,curveStrength:s?.3:.6,curveFrequency:.4,lenis:n,nativeScroll:l,isMobile:p});if(a==="dual"){const d=s?r*.55:r*.8,f=s?.8:.9;return e.jsxs(e.Fragment,{children:[e.jsx(y,{position:[-d,0,0],imageSize:[r*f,t*f],gap:t*.12,curveStrength:s?.3:.5,curveFrequency:.35,scrollMultiplier:.012,lenis:n,nativeScroll:l,isMobile:p}),e.jsx(y,{position:[d,t*.5,0],imageSize:[r*f,t*f],gap:t*.12,curveStrength:s?-.3:-.5,curveFrequency:.35,scrollMultiplier:-.01,lenis:n,nativeScroll:l,isMobile:p})]})}if(a==="triple"){if(s){const f=r*.55;return e.jsxs(e.Fragment,{children:[e.jsx(y,{position:[-f,0,0],imageSize:[r*.75,t*.75],gap:t*.1,curveStrength:.25,curveFrequency:.3,scrollMultiplier:.01,lenis:n,nativeScroll:l,isMobile:p}),e.jsx(y,{position:[f,t*.4,0],imageSize:[r*.75,t*.75],gap:t*.1,curveStrength:-.25,curveFrequency:.3,scrollMultiplier:-.008,lenis:n,nativeScroll:l,isMobile:p})]})}const d=r*1.1;return e.jsxs(e.Fragment,{children:[e.jsx(y,{position:[-d,0,-.5],imageSize:[r*.75,t*.75],gap:t*.1,curveStrength:.4,curveFrequency:.3,scrollMultiplier:.008,lenis:n,nativeScroll:l,isMobile:p}),e.jsx(y,{position:[0,t*.3,0],imageSize:[r,t],gap:t*.15,curveStrength:0,curveFrequency:0,scrollMultiplier:.015,lenis:n,nativeScroll:l,isMobile:p}),e.jsx(y,{position:[d,-t*.2,-.5],imageSize:[r*.75,t*.75],gap:t*.1,curveStrength:-.4,curveFrequency:.3,scrollMultiplier:-.01,lenis:n,nativeScroll:l,isMobile:p})]})}return e.jsx(y,{imageSize:[r*1,t*1],gap:r*.15,curveStrength:.5,curveFrequency:.3,direction:"horizontal",lenis:n,nativeScroll:l,isMobile:p})}const k=()=>typeof window>"u"?!1:/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)||window.innerWidth<768,G=()=>{try{const a=document.createElement("canvas");return!!(window.WebGLRenderingContext&&(a.getContext("webgl")||a.getContext("experimental-webgl")))}catch{return!1}};function D(){const[a,n]=c.useState("dual"),l=c.useRef(null),[p,g]=c.useState(!1),[s,x]=c.useState(null),[m]=c.useState(k),[r]=c.useState(G),t=c.useRef({scroll:0,velocity:0}),d=c.useRef(0),f=c.useRef(Date.now());return r?(c.useEffect(()=>{if(m){g(!0);const o=()=>{const u=Date.now(),h=Math.max(u-f.current,1),i=window.scrollY,S=(i-d.current)/h*16;t.current={scroll:i,velocity:S*.5},d.current=i,f.current=u};return window.addEventListener("scroll",o,{passive:!0}),()=>window.removeEventListener("scroll",o)}else try{let o=function(i){u.raf(i),h=requestAnimationFrame(o)};const u=new P({duration:1.2,easing:i=>Math.min(1,1.001-Math.pow(2,-10*i)),orientation:a==="horizontal"?"horizontal":"vertical",gestureOrientation:a==="horizontal"?"horizontal":"vertical",smoothWheel:!0,infinite:!0});l.current=u,g(!0);let h;return h=requestAnimationFrame(o),()=>{cancelAnimationFrame(h),u.destroy(),l.current=null,g(!1)}}catch(o){console.error("Lenis initialization failed:",o),x("Scroll initialization failed")}},[a,m]),s?e.jsxs("div",{style:{...v.container,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:"1rem"},children:[e.jsxs("p",{style:{color:"#ff6b6b",fontSize:"1.2rem"},children:["⚠️ ",s]}),e.jsx(b,{to:"/",style:{color:"#fff",textDecoration:"underline"},children:"← Back to Home"})]}):e.jsxs("div",{style:v.container,children:[!p&&e.jsx("div",{style:{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",zIndex:100},children:e.jsx("p",{style:{color:"#666"},children:"Loading..."})}),e.jsx(b,{to:"/",style:v.backButton,children:"← Back"}),e.jsx("div",{style:v.controls,children:["single","dual","triple","horizontal"].map(o=>e.jsx("button",{onClick:()=>n(o),style:{...v.button,...a===o?v.buttonActive:{}},children:o.charAt(0).toUpperCase()+o.slice(1)},o))}),e.jsx("div",{style:v.hint,children:a==="horizontal"?"← Scroll horizontally →":"↑ Scroll to explore ↓"}),e.jsxs(I,{camera:{position:[0,0,5],fov:50},style:v.canvas,gl:{antialias:!m,alpha:!0,powerPreference:"high-performance",failIfMajorPerformanceCaveat:!1},dpr:m?1:[1,2],onCreated:({gl:o})=>{console.log("WebGL context created:",o.getContext().getParameter(o.getContext().VERSION))},onError:o=>{console.error("Canvas error:",o),x("WebGL initialization failed")},children:[e.jsx("color",{attach:"background",args:["#0a0a0a"]}),p&&e.jsx(q,{variant:a,lenis:l.current,nativeScroll:t,isMobileDevice:m})]}),e.jsx("div",{style:v.branding,children:"WAVY CAROUSEL"}),e.jsx("div",{style:v.scrollArea})]})):e.jsxs("div",{style:{minHeight:"100vh",background:"#0a0a0a",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"2rem",color:"#fff",textAlign:"center"},children:[e.jsx("div",{style:{fontSize:"3rem",marginBottom:"1rem"},children:"⚠️"}),e.jsx("h2",{style:{marginBottom:"0.5rem"},children:"WebGL Not Supported"}),e.jsx("p",{style:{color:"#888",marginBottom:"1.5rem"},children:"This interaction requires WebGL which isn't available on your device/browser."}),e.jsx(b,{to:"/",style:{color:"#fff",textDecoration:"underline"},children:"← Back to Home"})]})}const v={container:{position:"fixed",top:0,left:0,width:"100vw",height:"100vh",overflow:"hidden",background:"#0a0a0a"},backButton:{position:"fixed",top:16,left:16,color:"rgba(255, 255, 255, 0.5)",textDecoration:"none",fontSize:14,fontWeight:500,zIndex:100,padding:"4px 8px",background:"rgba(0, 0, 0, 0.5)",borderRadius:4},controls:{position:"fixed",top:60,left:"50%",transform:"translateX(-50%)",display:"flex",gap:6,zIndex:100,flexWrap:"wrap",justifyContent:"center",maxWidth:"90vw"},button:{padding:"6px 12px",fontSize:11,fontWeight:500,textTransform:"uppercase",letterSpacing:"0.05em",color:"rgba(255, 255, 255, 0.5)",background:"rgba(255, 255, 255, 0.05)",borderWidth:1,borderStyle:"solid",borderColor:"rgba(255, 255, 255, 0.1)",borderRadius:4,cursor:"pointer",transition:"all 0.2s ease",whiteSpace:"nowrap"},buttonActive:{color:"#fff",background:"rgba(255, 255, 255, 0.15)",borderColor:"rgba(255, 255, 255, 0.3)"},hint:{position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",color:"rgba(255, 255, 255, 0.3)",fontSize:12,fontWeight:400,letterSpacing:"0.1em",zIndex:100,animation:"pulse 2s ease-in-out infinite"},canvas:{position:"absolute",top:0,left:0,width:"100%",height:"100%"},branding:{position:"fixed",top:16,right:16,color:"rgba(255, 255, 255, 0.3)",fontFamily:"monospace",fontSize:10,letterSpacing:"0.1em",pointerEvents:"none",userSelect:"none",zIndex:100},scrollArea:{position:"absolute",top:0,left:0,width:"100%",height:"500vh",pointerEvents:"none"}};export{D as WavyCarousel,D as default};
