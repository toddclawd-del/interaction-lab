import{r as u,j as t,L as z}from"./index-C4nTjZfU.js";import{w as C,u as I,z as M,s as F,A as R,V as b}from"./Texture-CRLD2sj1.js";import{L as A}from"./lenis-DTHSWqDp.js";const q=`uniform float uScrollSpeed;
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
`,y=["https://picsum.photos/seed/wavy1/600/800","https://picsum.photos/seed/wavy2/600/800","https://picsum.photos/seed/wavy3/600/800","https://picsum.photos/seed/wavy4/600/800","https://picsum.photos/seed/wavy5/600/800","https://picsum.photos/seed/wavy6/600/800","https://picsum.photos/seed/wavy7/600/800","https://picsum.photos/seed/wavy8/600/800"];function j(a,n){return(a%n+n)%n}const w=u.forwardRef(({imageUrl:a,scale:n,geometry:l,position:i=[0,0,0],curveStrength:g=0,curveFrequency:p=0},o)=>{const e=u.useRef(null),c=o||e,r=R(a),m=u.useMemo(()=>{var f,s;return r?[((f=r.image)==null?void 0:f.width)||600,((s=r.image)==null?void 0:s.height)||800]:[1,1]},[r]),h=u.useMemo(()=>({uniforms:{uTexture:{value:r},uPlaneSizes:{value:new b(n[0],n[1])},uImageSizes:{value:new b(m[0],m[1])},uScrollSpeed:{value:0},uCurveStrength:{value:g},uCurveFrequency:{value:p},uOpacity:{value:1}},vertexShader:q,fragmentShader:P,transparent:!0}),[r,n,m,g,p]);return t.jsxs("mesh",{position:i,ref:c,scale:n,children:[t.jsx("primitive",{object:l,attach:"geometry"}),t.jsx("shaderMaterial",{...h})]})});w.displayName="GLImage";function v({position:a=[0,0,0],imageSize:n,gap:l,curveStrength:i=.8,curveFrequency:g=.5,direction:p="vertical",scrollMultiplier:o=.01,lenis:e}){const c=u.useRef([]),r=u.useRef(0),m=u.useMemo(()=>new M(1,1,32,32),[]),h=u.useMemo(()=>y.length*l+y.length*(p==="vertical"?n[1]:n[0]),[l,n,p]);return u.useEffect(()=>{if(!e)return;const f=({velocity:s})=>{r.current=s};return e.on("scroll",f),()=>{e.off("scroll",f)}},[e]),F(()=>{const f=r.current;c.current.forEach(s=>{if(!s)return;const x=s.material;x.uniforms&&(x.uniforms.uScrollSpeed.value=f*o),p==="vertical"?(s.position.y-=f*o,s.position.y=j(s.position.y+h/2,h)-h/2):(s.position.x-=f*o,s.position.x=j(s.position.x+h/2,h)-h/2)}),r.current*=.95}),t.jsx("group",{position:a,children:y.map((f,s)=>{const x=p==="vertical"?[0,s*(n[1]+l)-h/2+n[1]/2,0]:[s*(n[0]+l)-h/2+n[0]/2,0,0];return t.jsx(w,{imageUrl:f,scale:[n[0],n[1],1],geometry:m,position:x,curveStrength:i,curveFrequency:g,ref:S=>{S&&(c.current[s]=S)}},s)})})}function k({variant:a,lenis:n}){const{viewport:l}=I(),i=l.width<4.5,o=Math.min(l.width,l.height)*(i?.4:.25),e=o*1.33;if(a==="single")return t.jsx(v,{imageSize:[o*(i?1.2:1),e*(i?1.2:1)],gap:e*.15,curveStrength:i?.3:.6,curveFrequency:.4,lenis:n});if(a==="dual"){const c=i?o*.55:o*.8,r=i?.8:.9;return t.jsxs(t.Fragment,{children:[t.jsx(v,{position:[-c,0,0],imageSize:[o*r,e*r],gap:e*.12,curveStrength:i?.3:.5,curveFrequency:.35,scrollMultiplier:.012,lenis:n}),t.jsx(v,{position:[c,e*.5,0],imageSize:[o*r,e*r],gap:e*.12,curveStrength:i?-.3:-.5,curveFrequency:.35,scrollMultiplier:-.01,lenis:n})]})}if(a==="triple"){if(i){const r=o*.55;return t.jsxs(t.Fragment,{children:[t.jsx(v,{position:[-r,0,0],imageSize:[o*.75,e*.75],gap:e*.1,curveStrength:.25,curveFrequency:.3,scrollMultiplier:.01,lenis:n}),t.jsx(v,{position:[r,e*.4,0],imageSize:[o*.75,e*.75],gap:e*.1,curveStrength:-.25,curveFrequency:.3,scrollMultiplier:-.008,lenis:n})]})}const c=o*1.1;return t.jsxs(t.Fragment,{children:[t.jsx(v,{position:[-c,0,-.5],imageSize:[o*.75,e*.75],gap:e*.1,curveStrength:.4,curveFrequency:.3,scrollMultiplier:.008,lenis:n}),t.jsx(v,{position:[0,e*.3,0],imageSize:[o,e],gap:e*.15,curveStrength:0,curveFrequency:0,scrollMultiplier:.015,lenis:n}),t.jsx(v,{position:[c,-e*.2,-.5],imageSize:[o*.75,e*.75],gap:e*.1,curveStrength:-.4,curveFrequency:.3,scrollMultiplier:-.01,lenis:n})]})}return t.jsx(v,{imageSize:[o*1,e*1],gap:o*.15,curveStrength:.5,curveFrequency:.3,direction:"horizontal",lenis:n})}function W(){const[a,n]=u.useState("dual"),l=u.useRef(null),[i,g]=u.useState(!1),[p,o]=u.useState(null);return u.useEffect(()=>{try{let e=function(m){c.raf(m),r=requestAnimationFrame(e)};const c=new A({duration:1.2,easing:m=>Math.min(1,1.001-Math.pow(2,-10*m)),orientation:a==="horizontal"?"horizontal":"vertical",gestureOrientation:a==="horizontal"?"horizontal":"vertical",smoothWheel:!0,infinite:!0,touchMultiplier:2});l.current=c,g(!0);let r;return r=requestAnimationFrame(e),()=>{cancelAnimationFrame(r),c.destroy(),l.current=null,g(!1)}}catch(e){console.error("Lenis initialization failed:",e),o("Scroll initialization failed")}},[a]),p?t.jsxs("div",{style:{...d.container,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:"1rem"},children:[t.jsxs("p",{style:{color:"#ff6b6b",fontSize:"1.2rem"},children:["⚠️ ",p]}),t.jsx(z,{to:"/",style:{color:"#fff",textDecoration:"underline"},children:"← Back to Home"})]}):t.jsxs("div",{style:d.container,children:[!i&&t.jsx("div",{style:{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",zIndex:100},children:t.jsx("p",{style:{color:"#666"},children:"Loading..."})}),t.jsx(z,{to:"/",style:d.backButton,children:"← Back"}),t.jsx("div",{style:d.controls,children:["single","dual","triple","horizontal"].map(e=>t.jsx("button",{onClick:()=>n(e),style:{...d.button,...a===e?d.buttonActive:{}},children:e.charAt(0).toUpperCase()+e.slice(1)},e))}),t.jsx("div",{style:d.hint,children:a==="horizontal"?"← Scroll horizontally →":"↑ Scroll to explore ↓"}),t.jsxs(C,{camera:{position:[0,0,5],fov:50},style:d.canvas,gl:{antialias:!0,alpha:!0},children:[t.jsx("color",{attach:"background",args:["#0a0a0a"]}),i&&t.jsx(k,{variant:a,lenis:l.current})]}),t.jsx("div",{style:d.branding,children:"WAVY CAROUSEL"}),t.jsx("div",{style:d.scrollArea})]})}const d={container:{position:"fixed",top:0,left:0,width:"100vw",height:"100vh",overflow:"hidden",background:"#0a0a0a"},backButton:{position:"fixed",top:16,left:16,color:"rgba(255, 255, 255, 0.5)",textDecoration:"none",fontSize:14,fontWeight:500,zIndex:100,padding:"4px 8px",background:"rgba(0, 0, 0, 0.5)",borderRadius:4},controls:{position:"fixed",top:60,left:"50%",transform:"translateX(-50%)",display:"flex",gap:6,zIndex:100,flexWrap:"wrap",justifyContent:"center",maxWidth:"90vw"},button:{padding:"6px 12px",fontSize:11,fontWeight:500,textTransform:"uppercase",letterSpacing:"0.05em",color:"rgba(255, 255, 255, 0.5)",background:"rgba(255, 255, 255, 0.05)",borderWidth:1,borderStyle:"solid",borderColor:"rgba(255, 255, 255, 0.1)",borderRadius:4,cursor:"pointer",transition:"all 0.2s ease",whiteSpace:"nowrap"},buttonActive:{color:"#fff",background:"rgba(255, 255, 255, 0.15)",borderColor:"rgba(255, 255, 255, 0.3)"},hint:{position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",color:"rgba(255, 255, 255, 0.3)",fontSize:12,fontWeight:400,letterSpacing:"0.1em",zIndex:100,animation:"pulse 2s ease-in-out infinite"},canvas:{position:"absolute",top:0,left:0,width:"100%",height:"100%"},branding:{position:"fixed",top:16,right:16,color:"rgba(255, 255, 255, 0.3)",fontFamily:"monospace",fontSize:10,letterSpacing:"0.1em",pointerEvents:"none",userSelect:"none",zIndex:100},scrollArea:{position:"absolute",top:0,left:0,width:"100%",height:"500vh",pointerEvents:"none"}};export{W as WavyCarousel,W as default};
