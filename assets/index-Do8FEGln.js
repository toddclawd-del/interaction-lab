import{j as t}from"./three-vendor-CgYOwSjb.js";import{r as a}from"./react-vendor-DtyY8K5c.js";const A=12;function D(E={}){const{enableTilt:o=!0,enableSpotlight:c=!0,tiltStrength:b=.5,maxTilt:v=A}=E,f=a.useRef(null),d=a.useRef(null),[u,g]=a.useState({isHovered:!1,isPressed:!1,isFocused:!1,spotlightX:"50%",spotlightY:"50%",rotateX:0,rotateY:0}),[p,S]=a.useState(!1);a.useEffect(()=>{const e=window.matchMedia("(prefers-reduced-motion: reduce)");S(e.matches);const h=s=>S(s.matches);return e.addEventListener("change",h),()=>e.removeEventListener("change",h)},[]);const x=a.useCallback((e,h)=>{if(!f.current)return;const s=f.current.getBoundingClientRect(),l=(e-s.left)/s.width*100,F=(h-s.top)/s.height*100,w=Math.max(0,Math.min(100,l)),m=Math.max(0,Math.min(100,F)),G=(e-s.left)/s.width-.5,k=(h-s.top)/s.height-.5,y=v*b,R=p||!o?0:k*-y,P=p||!o?0:G*y;g(I=>({...I,spotlightX:c?`${w}%`:"50%",spotlightY:c?`${m}%`:"50%",rotateX:R,rotateY:P}))},[o,c,b,v,p]),B=a.useCallback(e=>{d.current&&cancelAnimationFrame(d.current),d.current=requestAnimationFrame(()=>{x(e.clientX,e.clientY)})},[x]),T=a.useCallback(()=>{g(e=>({...e,isHovered:!0}))},[]),C=a.useCallback(()=>{d.current&&(cancelAnimationFrame(d.current),d.current=null),g(e=>({...e,isHovered:!1,isPressed:!1,rotateX:0,rotateY:0}))},[]),M=a.useCallback(()=>{g(e=>({...e,isPressed:!0}))},[]),i=a.useCallback(()=>{g(e=>({...e,isPressed:!1}))},[]),z=a.useCallback(()=>{g(e=>({...e,isFocused:!0,spotlightX:"50%",spotlightY:"50%"}))},[]),j=a.useCallback(()=>{g(e=>({...e,isFocused:!1}))},[]);a.useEffect(()=>()=>{d.current&&cancelAnimationFrame(d.current)},[]);const n={onMouseMove:B,onMouseEnter:T,onMouseLeave:C,onMouseDown:M,onMouseUp:i,onFocus:z,onBlur:j},W={"--spotlight-x":u.spotlightX,"--spotlight-y":u.spotlightY,"--rotate-x":`${u.rotateX}deg`,"--rotate-y":`${u.rotateY}deg`};return{ref:f,state:u,handlers:n,style:W,prefersReducedMotion:p}}const Y={subtle:{spotlightGradient:`radial-gradient(
      circle at var(--spotlight-x) var(--spotlight-y),
      rgba(255, 255, 255, 0.3) 0%,
      rgba(255, 255, 255, 0.1) 30%,
      transparent 60%
    )`,activeGradient:`radial-gradient(
      circle at var(--spotlight-x) var(--spotlight-y),
      rgba(255, 255, 255, 0.45) 0%,
      rgba(255, 255, 255, 0.15) 25%,
      transparent 50%
    )`,focusGradient:`radial-gradient(
      circle at 50% 50%,
      rgba(255, 255, 255, 0.35) 0%,
      rgba(255, 255, 255, 0.1) 40%,
      transparent 70%
    )`,baseStyles:{background:"linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",color:"#ffffff",border:"1px solid rgba(255, 255, 255, 0.1)"}},glossy:{spotlightGradient:`radial-gradient(
      circle at var(--spotlight-x) var(--spotlight-y),
      rgba(255, 255, 255, 0.5) 0%,
      rgba(255, 255, 255, 0.2) 20%,
      rgba(255, 255, 255, 0.05) 40%,
      transparent 60%
    )`,activeGradient:`radial-gradient(
      circle at var(--spotlight-x) var(--spotlight-y),
      rgba(255, 255, 255, 0.7) 0%,
      rgba(255, 255, 255, 0.3) 15%,
      rgba(255, 255, 255, 0.1) 35%,
      transparent 50%
    )`,focusGradient:`radial-gradient(
      circle at 50% 50%,
      rgba(255, 255, 255, 0.5) 0%,
      rgba(255, 255, 255, 0.15) 35%,
      transparent 60%
    )`,borderGlow:`linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.3) 0%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 255, 255, 0.3) 100%
    )`,baseStyles:{background:"linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)",color:"#ffffff",border:"1px solid rgba(255, 255, 255, 0.15)"}},neon:{spotlightGradient:`radial-gradient(
      circle at var(--spotlight-x) var(--spotlight-y),
      rgba(102, 126, 234, 0.6) 0%,
      rgba(118, 75, 162, 0.3) 25%,
      rgba(240, 147, 251, 0.1) 45%,
      transparent 65%
    )`,activeGradient:`radial-gradient(
      circle at var(--spotlight-x) var(--spotlight-y),
      rgba(102, 126, 234, 0.85) 0%,
      rgba(118, 75, 162, 0.5) 20%,
      rgba(240, 147, 251, 0.2) 40%,
      transparent 55%
    )`,focusGradient:`radial-gradient(
      circle at 50% 50%,
      rgba(102, 126, 234, 0.6) 0%,
      rgba(118, 75, 162, 0.25) 35%,
      transparent 60%
    )`,borderGlow:`linear-gradient(
      135deg,
      rgba(102, 126, 234, 0.6) 0%,
      rgba(118, 75, 162, 0.4) 50%,
      rgba(240, 147, 251, 0.6) 100%
    )`,baseStyles:{background:"linear-gradient(135deg, #0f0c29 0%, #1a1a2e 100%)",color:"#ffffff",border:"1px solid rgba(102, 126, 234, 0.3)"}},glass:{spotlightGradient:`radial-gradient(
      circle at var(--spotlight-x) var(--spotlight-y),
      rgba(255, 255, 255, 0.4) 0%,
      rgba(255, 255, 255, 0.15) 30%,
      rgba(255, 255, 255, 0.05) 50%,
      transparent 70%
    )`,activeGradient:`radial-gradient(
      circle at var(--spotlight-x) var(--spotlight-y),
      rgba(255, 255, 255, 0.55) 0%,
      rgba(255, 255, 255, 0.25) 25%,
      rgba(255, 255, 255, 0.1) 45%,
      transparent 60%
    )`,focusGradient:`radial-gradient(
      circle at 50% 50%,
      rgba(255, 255, 255, 0.45) 0%,
      rgba(255, 255, 255, 0.15) 40%,
      transparent 65%
    )`,borderGlow:`linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.25) 0%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 255, 255, 0.25) 100%
    )`,baseStyles:{background:"rgba(255, 255, 255, 0.08)",color:"#ffffff",border:"1px solid rgba(255, 255, 255, 0.18)"}}},L="cubic-bezier(0.34, 1.56, 0.64, 1)",r=a.forwardRef(function(o,c){const{children:b,variant:v="subtle",enableTilt:f=!0,enableSpotlight:d=!0,enableBorderGlow:u=!1,tiltStrength:g=.5,spotlightSize:p=180,spotlightIntensity:S=.5,className:x,style:B,...T}=o,C="as"in o?o.as:"button",M="href"in o?o.href:void 0,i="disabled"in o?o.disabled:!1,z="onClick"in o?o.onClick:void 0,{ref:j,state:n,handlers:W,style:e,prefersReducedMotion:h}=D({enableTilt:f&&!i,enableSpotlight:d&&!i,tiltStrength:g}),s=a.useMemo(()=>H=>{j.current=H,typeof c=="function"?c(H):c&&(c.current=H)},[c,j]),l=Y[v]||Y.subtle,F=a.useMemo(()=>i?"none":n.isPressed?l.activeGradient:n.isFocused&&!n.isHovered?l.focusGradient:l.spotlightGradient,[i,n.isPressed,n.isFocused,n.isHovered,l]),w={...e,position:"relative",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:"0.5rem",padding:"0.875rem 1.75rem",fontSize:"1rem",fontWeight:500,lineHeight:1.5,textDecoration:"none",borderRadius:"0.75rem",overflow:"hidden",cursor:i?"not-allowed":"pointer",userSelect:"none",WebkitTapHighlightColor:"transparent",background:l.baseStyles.background,color:l.baseStyles.color,border:l.baseStyles.border,perspective:"1000px",transformStyle:"preserve-3d",transform:h?"none":`perspective(1000px) rotateX(var(--rotate-x)) rotateY(var(--rotate-y))${n.isPressed?" scale(0.98)":""}`,transition:h?"none":n.isHovered?"transform 100ms ease-out":`transform 300ms ${L}`,opacity:i?.5:1,pointerEvents:i?"none":"auto",...B},m=u&&l.borderGlow&&!i?{position:"absolute",inset:"-1px",borderRadius:"inherit",padding:"1px",background:l.borderGlow,WebkitMask:"linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",WebkitMaskComposite:"xor",maskComposite:"exclude",opacity:n.isHovered||n.isFocused?1:0,transition:"opacity 200ms ease-out",pointerEvents:"none"}:void 0,G={position:"absolute",inset:0,borderRadius:"inherit",background:F,backgroundSize:`${p}px ${p}px`,opacity:i||!n.isHovered&&!n.isFocused?0:S,transition:h?"none":"opacity 200ms ease-out",pointerEvents:"none",zIndex:1},k={position:"relative",zIndex:2,display:"flex",alignItems:"center",justifyContent:"center",gap:"inherit"},y=i?{}:{...W,onClick:z},{as:R,href:P,disabled:I,onClick:$,...X}=T;return C==="a"?t.jsxs("a",{ref:s,className:x,style:w,href:M,"aria-disabled":i||void 0,...y,...X,children:[m&&t.jsx("span",{style:m,"aria-hidden":"true"}),t.jsx("span",{style:G,"aria-hidden":"true"}),t.jsx("span",{style:k,children:b})]}):t.jsxs("button",{ref:s,className:x,style:w,disabled:i,"aria-disabled":i||void 0,...y,...X,children:[m&&t.jsx("span",{style:m,"aria-hidden":"true"}),t.jsx("span",{style:G,"aria-hidden":"true"}),t.jsx("span",{style:k,children:b})]})});function U(){return t.jsxs("div",{style:{minHeight:"100vh",background:"linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)",padding:"4rem 2rem",display:"flex",flexDirection:"column",gap:"4rem"},children:[t.jsxs("header",{style:{maxWidth:"800px",margin:"0 auto"},children:[t.jsx("a",{href:"#/",style:{color:"#667eea",marginBottom:"2rem",display:"inline-block",textDecoration:"none"},children:"← Back to Home"}),t.jsx("h1",{style:{color:"white",fontSize:"clamp(2rem, 5vw, 3rem)",marginBottom:"1rem"},children:"Spotlight Tilt Button"}),t.jsx("p",{style:{color:"#888",fontSize:"1.125rem",lineHeight:1.6},children:"Cursor-reactive buttons with radial highlight + 3D perspective tilt. Move your cursor across each button to see the effect."})]}),t.jsxs("section",{style:{maxWidth:"800px",margin:"0 auto",width:"100%"},children:[t.jsx("h2",{style:{color:"white",fontSize:"1.5rem",marginBottom:"1.5rem"},children:"Variants"}),t.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))",gap:"1.5rem"},children:[t.jsx(r,{variant:"subtle",children:"Subtle"}),t.jsx(r,{variant:"glossy",children:"Glossy"}),t.jsx(r,{variant:"neon",children:"Neon"}),t.jsx(r,{variant:"glass",children:"Glass"})]})]}),t.jsxs("section",{style:{maxWidth:"800px",margin:"0 auto",width:"100%"},children:[t.jsx("h2",{style:{color:"white",fontSize:"1.5rem",marginBottom:"1.5rem"},children:"With Border Glow"}),t.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))",gap:"1.5rem"},children:[t.jsx(r,{variant:"glossy",enableBorderGlow:!0,children:"Glossy + Glow"}),t.jsx(r,{variant:"neon",enableBorderGlow:!0,children:"Neon + Glow"}),t.jsx(r,{variant:"glass",enableBorderGlow:!0,children:"Glass + Glow"})]})]}),t.jsxs("section",{style:{maxWidth:"800px",margin:"0 auto",width:"100%"},children:[t.jsx("h2",{style:{color:"white",fontSize:"1.5rem",marginBottom:"1.5rem"},children:"Effect Isolation"}),t.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))",gap:"1.5rem"},children:[t.jsx(r,{variant:"neon",enableTilt:!1,children:"Spotlight Only"}),t.jsx(r,{variant:"neon",enableSpotlight:!1,children:"Tilt Only"}),t.jsx(r,{variant:"neon",enableTilt:!1,enableSpotlight:!1,children:"None (static)"})]})]}),t.jsxs("section",{style:{maxWidth:"800px",margin:"0 auto",width:"100%"},children:[t.jsx("h2",{style:{color:"white",fontSize:"1.5rem",marginBottom:"1.5rem"},children:"Intensity Variations"}),t.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))",gap:"1.5rem"},children:[t.jsx(r,{variant:"glossy",tiltStrength:.2,children:"Gentle Tilt (0.2)"}),t.jsx(r,{variant:"glossy",tiltStrength:1,children:"Strong Tilt (1.0)"}),t.jsx(r,{variant:"glossy",spotlightIntensity:.8,children:"Bright Spotlight"}),t.jsx(r,{variant:"glossy",spotlightSize:300,children:"Large Spotlight"})]})]}),t.jsxs("section",{style:{maxWidth:"800px",margin:"0 auto",width:"100%"},children:[t.jsx("h2",{style:{color:"white",fontSize:"1.5rem",marginBottom:"1.5rem"},children:"States"}),t.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))",gap:"1.5rem"},children:[t.jsx(r,{variant:"neon",children:"Normal"}),t.jsx(r,{variant:"neon",disabled:!0,children:"Disabled"})]}),t.jsx("p",{style:{color:"#666",marginTop:"1rem",fontSize:"0.875rem"},children:"Tab to each button to see the keyboard focus state (centered spotlight, no tilt)."})]}),t.jsxs("section",{style:{maxWidth:"800px",margin:"0 auto",width:"100%"},children:[t.jsx("h2",{style:{color:"white",fontSize:"1.5rem",marginBottom:"1.5rem"},children:"Polymorphic (as Link)"}),t.jsx(r,{as:"a",href:"https://github.com",variant:"glossy",enableBorderGlow:!0,children:"View on GitHub →"})]}),t.jsxs("section",{style:{maxWidth:"800px",margin:"0 auto",width:"100%",background:"rgba(255, 255, 255, 0.03)",borderRadius:"1.5rem",padding:"3rem",textAlign:"center"},children:[t.jsx("h2",{style:{color:"white",fontSize:"clamp(1.5rem, 4vw, 2.5rem)",marginBottom:"1rem"},children:"Ready to get started?"}),t.jsx("p",{style:{color:"#888",marginBottom:"2rem",maxWidth:"400px",margin:"0 auto 2rem"},children:"The premium button interaction that makes users want to click."}),t.jsxs("div",{style:{display:"flex",gap:"1rem",justifyContent:"center",flexWrap:"wrap"},children:[t.jsx(r,{variant:"neon",enableBorderGlow:!0,children:"Start Free Trial"}),t.jsx(r,{variant:"glass",children:"Learn More"})]})]}),t.jsxs("section",{style:{maxWidth:"800px",margin:"0 auto",width:"100%"},children:[t.jsx("h2",{style:{color:"white",fontSize:"1.5rem",marginBottom:"1.5rem"},children:"Usage"}),t.jsx("pre",{style:{background:"rgba(0, 0, 0, 0.4)",padding:"1.5rem",borderRadius:"0.75rem",overflow:"auto",fontSize:"0.875rem",color:"#a5d6ff"},children:`import { SpotlightTiltButton } from './spotlight-tilt-button'

// Basic usage
<SpotlightTiltButton>
  Click me
</SpotlightTiltButton>

// With variant and border glow
<SpotlightTiltButton 
  variant="neon" 
  enableBorderGlow
>
  Premium CTA
</SpotlightTiltButton>

// Customize intensity
<SpotlightTiltButton
  variant="glossy"
  tiltStrength={0.8}
  spotlightIntensity={0.6}
  spotlightSize={200}
>
  Custom Settings
</SpotlightTiltButton>

// As a link
<SpotlightTiltButton as="a" href="/signup">
  Sign Up →
</SpotlightTiltButton>`})]})]})}export{r as SpotlightTiltButton,U as SpotlightTiltButtonDemo,U as default};
