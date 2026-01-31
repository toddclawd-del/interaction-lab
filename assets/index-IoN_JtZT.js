var T=Object.defineProperty;var C=(o,n,r)=>n in o?T(o,n,{enumerable:!0,configurable:!0,writable:!0,value:r}):o[n]=r;var x=(o,n,r)=>C(o,typeof n!="symbol"?n+"":n,r);import{r as s,j as e,L as k}from"./index-CUd0y5HU.js";import{S as w}from"./index-C03LSoLi.js";import{g as m}from"./index-C8pce-KX.js";const v=["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","!","@","#","$","%","^","&","*","-","_","+","=",";",":","<",">",",","/","\\","|","~","`"],j=["#22a3a9","#4ca922","#a99222","#ff6b6b","#6366f1","#ec4899"];class L{constructor(n,r={}){x(this,"element");x(this,"splitter",null);x(this,"originalChars",[]);x(this,"originalColors",[]);x(this,"variant");x(this,"options");this.element=n,this.variant=r.variant||"cursor",this.options={scrambleSpeed:r.scrambleSpeed||.03,scrambleCount:r.scrambleCount||3,staggerDelay:r.staggerDelay||.07,repeatDelay:r.repeatDelay||.04},this.init()}init(){this.splitter=new w(this.element,{types:"words,chars",tagName:"span"});const n=this.getChars();this.originalChars=n.map(r=>r.innerHTML),this.originalColors=n.map(r=>getComputedStyle(r).color),this.element.classList.add("hover-effect"),this.variant==="cursor"?this.element.classList.add("hover-effect--cursor"):this.variant==="background"?this.element.classList.add("hover-effect--bg"):this.variant==="blur"?this.element.classList.add("hover-effect--blur"):this.variant==="glitch"&&this.element.classList.add("hover-effect--glitch")}getChars(){var n;return((n=this.splitter)==null?void 0:n.chars)||[]}animate(){this.reset();const n=this.getChars(),{scrambleSpeed:r,scrambleCount:i,staggerDelay:d,repeatDelay:p}=this.options;n.forEach((l,g)=>{const b=l.innerHTML,a=this.originalColors[g];let c=0;m.fromTo(l,{opacity:0},{duration:r,opacity:1,delay:(g+1)*d,repeat:i,repeatDelay:p,repeatRefresh:!0,onStart:()=>{this.variant==="cursor"&&m.set(l,{"--cursor-opacity":1})},onRepeat:()=>{c++,this.variant==="cursor"&&c===1&&m.set(l,{"--cursor-opacity":0})},onComplete:()=>{m.set(l,{innerHTML:b,color:a,delay:r})},innerHTML:()=>{const h=v[Math.floor(Math.random()*v.length)];if(this.variant==="color"){const u=j[Math.floor(Math.random()*j.length)];m.set(l,{color:u})}return h}})}),(this.variant==="background"||this.variant==="blur")&&m.fromTo(this.element,{"--bg-scale":0},{duration:1,ease:"expo.out","--bg-scale":1}),this.variant==="glitch"&&(m.to(this.element,{duration:.1,"--glitch-intensity":1,ease:"power2.out"}),m.timeline({repeat:3}).to(this.element,{duration:.05,"--glitch-x":()=>(Math.random()-.5)*8,"--glitch-skew":()=>(Math.random()-.5)*5,ease:"none"}).to(this.element,{duration:.05,"--glitch-x":0,"--glitch-skew":0,ease:"none"}),m.to(this.element,{duration:.3,delay:.4,"--glitch-intensity":0,ease:"power2.out"}))}animateOut(){(this.variant==="background"||this.variant==="blur")&&(m.killTweensOf(this.element),m.to(this.element,{duration:.6,ease:"power4.out","--bg-scale":0})),this.variant==="glitch"&&(m.killTweensOf(this.element),m.to(this.element,{duration:.2,"--glitch-intensity":0,"--glitch-x":0,"--glitch-skew":0}))}reset(){this.getChars().forEach((r,i)=>{m.killTweensOf(r),r.innerHTML=this.originalChars[i],r.style.color=this.originalColors[i]}),m.killTweensOf(this.element),m.set(this.element,{"--bg-scale":0})}destroy(){var n;this.reset(),(n=this.splitter)==null||n.revert(),this.element.classList.remove("hover-effect","hover-effect--cursor","hover-effect--bg","hover-effect--blur","hover-effect--glitch")}}const B=[{id:1,name:"Mount Vespera",location:"Planet Thalassa",date:"2157-03-14",code:"V6"},{id:2,name:"Kraxion",location:"Exo-Planet Zyra",date:"2243-11-09",code:"K7"},{id:3,name:"Helion Peak",location:"Planet Elara",date:"2180-05-18",code:"H5"},{id:4,name:"Pyrosphere",location:"Moon Xanthe",date:"2291-06-15",code:"P6"},{id:5,name:"Vulcanus",location:"Asteroid B-612",date:"2312-08-22",code:"V5"},{id:6,name:"Tarkon Fury",location:"Planet Drakonis",date:"2455-12-01",code:"T8"}],I=[{key:"cursor",label:"Cursor",desc:"Blinking cursor indicator during animation"},{key:"background",label:"Background",desc:"Sliding background reveal effect"},{key:"color",label:"Color",desc:"Characters flash random colors"},{key:"blur",label:"Blur",desc:"Frosted glass background effect"},{key:"glitch",label:"Glitch",desc:"RGB split + displacement distortion"}],D=[{icon:"⌨️",title:"Character-Level Animation",desc:"SplitType breaks text into individual characters for precise control"},{icon:"🎲",title:"Randomized Scramble",desc:"Each character cycles through random symbols before settling"},{icon:"🎨",title:"5 Visual Variants",desc:"Cursor, background, color, blur, and glitch effects"},{icon:"📱",title:"Mobile Ready",desc:"IntersectionObserver triggers on scroll for touch devices"}],z=["React","TypeScript","GSAP","SplitType","CSS Variables"],S=["SYSTEM INIT...","LOADING KERNEL v3.14.159","MEMORY CHECK: 640K OK","TERMINAL_TEXT_HOVER ONLINE","READY_"];function y(){if(typeof window>"u")return!0;try{return window.matchMedia("(hover: hover)").matches}catch{return!0}}function f({children:o,variant:n,className:r=""}){const i=s.useRef(null),d=s.useRef(null),p=s.useRef(!1);s.useEffect(()=>{if(i.current){if(d.current=new L(i.current,{variant:n}),!y()){const a=new IntersectionObserver(c=>{c.forEach(h=>{h.isIntersecting&&!p.current&&(p.current=!0,setTimeout(()=>{var u;(u=d.current)==null||u.animate()},Math.random()*300))})},{threshold:.5,rootMargin:"-50px"});return a.observe(i.current),()=>{var c;a.disconnect(),(c=d.current)==null||c.destroy()}}return()=>{var a;(a=d.current)==null||a.destroy()}}},[n]);const l=s.useCallback(()=>{var a;y()&&((a=d.current)==null||a.animate())},[]),g=s.useCallback(()=>{var a;y()&&((a=d.current)==null||a.animateOut())},[]),b=s.useCallback(()=>{var a;y()||(a=d.current)==null||a.animate()},[]);return e.jsx("span",{ref:i,className:r,onMouseEnter:l,onMouseLeave:g,onClick:b,style:t.hoverText,"data-text":o,children:o})}function R({data:o,variant:n,index:r}){return e.jsxs("li",{style:t.listItem,className:"terminal-list-item",children:[e.jsx("span",{style:t.listNumber,children:String(r+1).padStart(2,"0")}),e.jsx(f,{variant:n,children:o.name}),e.jsx(f,{variant:n,children:o.location}),e.jsx(f,{variant:n,children:o.date}),e.jsx(f,{variant:n,children:o.code})]})}function A({onComplete:o}){const[n,r]=s.useState([""]),[i,d]=s.useState(0),[p,l]=s.useState(0),[g,b]=s.useState(!1);return s.useEffect(()=>{const a=setTimeout(()=>b(!0),100);return()=>clearTimeout(a)},[]),s.useEffect(()=>{if(!g)return;if(i>=S.length){const c=setTimeout(o,800);return()=>clearTimeout(c)}const a=S[i];if(p<a.length){const c=setTimeout(()=>{r(h=>{const u=[...h];return u[i]=a.slice(0,p+1),u}),l(h=>h+1)},30+Math.random()*40);return()=>clearTimeout(c)}else{const c=setTimeout(()=>{r(h=>[...h,""]),d(h=>h+1),l(0)},200+Math.random()*300);return()=>clearTimeout(c)}},[g,i,p,o]),e.jsx("div",{style:t.bootScreen,onClick:o,children:e.jsxs("div",{style:{maxWidth:500,padding:"2rem"},children:[n.map((a,c)=>e.jsxs("div",{className:"boot-line",style:t.bootLine,children:[e.jsxs("span",{style:t.bootLineNum,children:["[",String(c).padStart(2,"0"),"]"]}),a,c===i&&e.jsx("span",{className:"boot-cursor"})]},c)),e.jsx("div",{style:{marginTop:"2rem",fontSize:"0.7rem",opacity:.3,textAlign:"center"},children:"TAP TO SKIP"})]})})}function H({crtMode:o,setCrtMode:n}){const[r,i]=s.useState(!1),[d,p]=s.useState(!1);return s.useEffect(()=>{const l=()=>p(window.scrollY>50);return window.addEventListener("scroll",l),()=>window.removeEventListener("scroll",l)},[]),e.jsxs("header",{style:{...t.header,background:d?"rgba(10, 10, 10, 0.95)":"transparent",borderBottom:d?"1px solid rgba(255,255,255,0.1)":"1px solid transparent"},children:[e.jsxs("div",{style:t.headerInner,children:[e.jsxs(k,{to:"/",style:t.logo,children:[e.jsx("span",{style:t.logoIcon,children:"⌨️"}),e.jsx("span",{style:t.logoText,children:"Terminal Text"})]}),e.jsxs("nav",{style:t.headerNav,children:[e.jsx("a",{href:"#demo",style:t.headerLink,children:"Demo"}),e.jsx("a",{href:"#features",style:t.headerLink,children:"Features"}),e.jsx("a",{href:"#about",style:t.headerLink,children:"About"}),e.jsx("a",{href:"https://github.com/toddclawd-del/interaction-lab/tree/main/src/interactions/terminal-text-hover",target:"_blank",rel:"noopener noreferrer",style:t.headerLink,children:"GitHub"}),e.jsxs("button",{onClick:()=>n(!o),style:{...t.crtToggle,background:o?"var(--text-color)":"transparent",color:o?"var(--bg-color)":"var(--text-color)"},children:["CRT ",o?"ON":"OFF"]})]}),e.jsxs("button",{style:t.menuButton,onClick:()=>i(!r),"aria-label":"Toggle menu",children:[e.jsx("span",{style:{...t.menuLine,transform:r?"rotate(45deg) translate(5px, 5px)":"none"}}),e.jsx("span",{style:{...t.menuLine,opacity:r?0:1}}),e.jsx("span",{style:{...t.menuLine,transform:r?"rotate(-45deg) translate(5px, -5px)":"none"}})]})]}),e.jsxs("div",{style:{...t.mobileMenu,maxHeight:r?"400px":"0",padding:r?"1rem 1.5rem":"0 1.5rem",opacity:r?1:0},children:[e.jsx("a",{href:"#demo",style:t.mobileLink,onClick:()=>i(!1),children:"Demo"}),e.jsx("a",{href:"#features",style:t.mobileLink,onClick:()=>i(!1),children:"Features"}),e.jsx("a",{href:"#about",style:t.mobileLink,onClick:()=>i(!1),children:"About"}),e.jsx("a",{href:"https://github.com/toddclawd-del/interaction-lab/tree/main/src/interactions/terminal-text-hover",target:"_blank",rel:"noopener noreferrer",style:t.mobileLink,children:"GitHub →"}),e.jsxs("button",{onClick:()=>{n(!o),i(!1)},style:{...t.mobileLink,background:"none",border:"none",cursor:"pointer",textAlign:"left",width:"100%"},children:["CRT Mode: ",o?"ON":"OFF"]})]})]})}function E({variant:o}){return e.jsx("section",{style:t.hero,children:e.jsxs("div",{style:t.heroContent,children:[e.jsxs("div",{style:t.badge,children:[e.jsx("span",{style:t.badgeDot}),"Open Source Interaction"]}),e.jsxs("h1",{style:t.heroTitle,children:[e.jsx(f,{variant:o,children:"Terminal"}),e.jsx("br",{}),e.jsx(f,{variant:o,children:"Text Hover"})]}),e.jsx("p",{style:t.heroSubtitle,children:"A retro terminal-inspired hover effect. Characters scramble into random symbols before settling back — perfect for menus, lists, and navigation elements."}),e.jsxs("div",{style:t.heroCtas,children:[e.jsx("a",{href:"#demo",style:t.primaryCta,children:"Try the Demo ↓"}),e.jsx("a",{href:"https://github.com/toddclawd-del/interaction-lab/tree/main/src/interactions/terminal-text-hover",target:"_blank",rel:"noopener noreferrer",style:t.secondaryCta,children:"View Source →"})]})]})})}function M({variant:o,setVariant:n}){return e.jsxs("section",{id:"demo",style:t.demoSection,children:[e.jsxs("div",{style:t.sectionHeader,children:[e.jsx("h2",{style:t.sectionTitle,children:"Interactive Demo"}),e.jsx("p",{style:t.sectionSubtitle,children:"Hover over the text below (or scroll on mobile) to see the effect in action."})]}),e.jsxs("div",{style:t.variantSelector,children:[e.jsx("span",{style:t.variantLabel,children:"Select Variant:"}),e.jsx("div",{style:t.variantGrid,children:I.map(r=>e.jsxs("button",{onClick:()=>n(r.key),style:{...t.variantButton,...o===r.key?t.variantButtonActive:{}},children:[e.jsx("span",{style:t.variantName,children:r.label}),e.jsx("span",{style:t.variantDesc,children:r.desc})]},r.key))})]}),e.jsxs("div",{style:t.demoBox,children:[e.jsx("h3",{style:t.demoTitle,children:"Volcanic Eruptions Database"}),e.jsx("ul",{style:t.list,children:B.map((r,i)=>e.jsx(R,{data:r,variant:o,index:i},r.id))}),e.jsxs("div",{style:t.navDemo,children:[e.jsx("h4",{style:t.navDemoTitle,children:"Navigation Links"}),e.jsxs("div",{style:t.navLinks,children:[e.jsx(f,{variant:o,children:"Projects"}),e.jsx(f,{variant:o,children:"About"}),e.jsx(f,{variant:o,children:"Contact"}),e.jsx(f,{variant:o,children:"Archive"})]})]})]})]})}function W(){return e.jsxs("section",{id:"features",style:t.featuresSection,children:[e.jsxs("div",{style:t.sectionHeader,children:[e.jsx("h2",{style:t.sectionTitle,children:"Features"}),e.jsx("p",{style:t.sectionSubtitle,children:"What makes this interaction special."})]}),e.jsx("div",{style:t.featuresGrid,children:D.map((o,n)=>e.jsxs("div",{style:t.featureCard,children:[e.jsx("span",{style:t.featureIcon,children:o.icon}),e.jsx("h3",{style:t.featureTitle,children:o.title}),e.jsx("p",{style:t.featureDesc,children:o.desc})]},n))})]})}function N(){return e.jsx("section",{id:"about",style:t.aboutSection,children:e.jsxs("div",{style:t.aboutContent,children:[e.jsxs("div",{style:t.aboutText,children:[e.jsx("h2",{style:t.sectionTitle,children:"About This Effect"}),e.jsx("p",{style:t.aboutDesc,children:`Inspired by retro terminal interfaces and the iconic "10 PRINT" one-liner from 1982. This effect uses GSAP's powerful animation engine combined with SplitType for character-level text manipulation.`}),e.jsx("p",{style:t.aboutDesc,children:"The scramble effect creates that classic hacker aesthetic — characters cycling through random symbols before resolving to their final form. Perfect for adding personality to menus, navigation, and data displays."}),e.jsxs("div",{style:t.techStack,children:[e.jsx("span",{style:t.techLabel,children:"Built with:"}),e.jsx("div",{style:t.techBadges,children:z.map(o=>e.jsx("span",{style:t.techBadge,children:o},o))})]})]}),e.jsxs("div",{style:t.codePreview,children:[e.jsxs("div",{style:t.codeHeader,children:[e.jsx("span",{style:t.codeDot}),e.jsx("span",{style:t.codeDot}),e.jsx("span",{style:t.codeDot}),e.jsx("span",{style:t.codeFileName,children:"usage.tsx"})]}),e.jsx("pre",{style:t.codeBlock,children:`import { TextAnimator } from './text-animator'

// Create animator
const animator = new TextAnimator(
  element,
  { variant: 'cursor' }
)

// Trigger on hover
element.onmouseenter = () => {
  animator.animate()
}`})]})]})})}function O(){return e.jsxs("footer",{style:t.footer,children:[e.jsxs("div",{style:t.footerInner,children:[e.jsxs("div",{style:t.footerBrand,children:[e.jsx("span",{style:t.footerLogo,children:"⌨️ Terminal Text Hover"}),e.jsx("p",{style:t.footerTagline,children:"Part of the Interaction Lab collection."})]}),e.jsxs("div",{style:t.footerLinks,children:[e.jsxs("div",{style:t.footerCol,children:[e.jsx("h4",{style:t.footerColTitle,children:"Source"}),e.jsx("a",{href:"https://github.com/toddclawd-del/interaction-lab/tree/main/src/interactions/terminal-text-hover",target:"_blank",rel:"noopener noreferrer",style:t.footerLink,children:"View Code"}),e.jsx("a",{href:"https://github.com/toddclawd-del/interaction-lab",target:"_blank",rel:"noopener noreferrer",style:t.footerLink,children:"Full Repo"})]}),e.jsxs("div",{style:t.footerCol,children:[e.jsx("h4",{style:t.footerColTitle,children:"More Labs"}),e.jsx(k,{to:"/",style:t.footerLink,children:"Interaction Lab"}),e.jsx("a",{href:"https://toddclawd-del.github.io/shader-playground",target:"_blank",rel:"noopener noreferrer",style:t.footerLink,children:"Shader Playground"})]}),e.jsxs("div",{style:t.footerCol,children:[e.jsx("h4",{style:t.footerColTitle,children:"Credits"}),e.jsx("a",{href:"https://tympanus.net/codrops/2024/06/19/hover-animations-for-terminal-like-typography/",target:"_blank",rel:"noopener noreferrer",style:t.footerLink,children:"Codrops Tutorial"}),e.jsx("a",{href:"https://gsap.com",target:"_blank",rel:"noopener noreferrer",style:t.footerLink,children:"GSAP"})]})]})]}),e.jsxs("div",{style:t.footerBottom,children:[e.jsx("span",{style:t.footerCopy,children:"© 2025 Open Source under MIT"}),e.jsx("span",{style:t.footerVersion,children:"TERMINAL_V2.0"})]})]})}function K(){const[o,n]=s.useState("cursor"),[r,i]=s.useState(!1),[d,p]=s.useState(!0);s.useEffect(()=>{sessionStorage.getItem("terminal-booted")&&p(!1)},[]);const l=()=>{p(!1),sessionStorage.setItem("terminal-booted","true")};return d?e.jsx(A,{onComplete:l}):e.jsxs("div",{style:t.container,className:`demo-${o} ${r?"crt-mode":""}`,children:[e.jsx("div",{style:t.scanlines,className:"scanlines"}),e.jsx(H,{crtMode:r,setCrtMode:i}),e.jsx(E,{variant:o}),e.jsx(M,{variant:o,setVariant:n}),e.jsx(W,{}),e.jsx(N,{}),e.jsx(O,{}),e.jsx("style",{children:F})]})}const t={container:{minHeight:"100vh",backgroundColor:"var(--bg-color, #0a0a0a)",color:"var(--text-color, #fff)",fontFamily:'"JetBrains Mono", "SF Mono", "Fira Code", monospace',position:"relative",transition:"background-color 0.4s ease, color 0.4s ease"},scanlines:{position:"fixed",top:0,left:0,width:"100%",height:"100%",backgroundImage:"repeating-linear-gradient(transparent, transparent 4px, rgba(0,0,0,0.1) 5px)",pointerEvents:"none",zIndex:100},bootScreen:{position:"fixed",inset:0,background:"#0a0a0a",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1e3,fontFamily:'"JetBrains Mono", monospace',color:"#00ff41"},bootLine:{marginBottom:"0.5rem",fontSize:14},bootLineNum:{color:"#666",marginRight:"1rem"},header:{position:"fixed",top:0,left:0,right:0,zIndex:50,transition:"all 0.3s ease",backdropFilter:"blur(10px)"},headerInner:{maxWidth:"1100px",margin:"0 auto",padding:"1rem 1.5rem",display:"flex",justifyContent:"space-between",alignItems:"center"},logo:{display:"flex",alignItems:"center",gap:"0.5rem",textDecoration:"none",color:"var(--text-color)"},logoIcon:{fontSize:"1.25rem"},logoText:{fontSize:"1rem",fontWeight:600,letterSpacing:"-0.02em"},headerNav:{display:"flex",gap:"1.5rem",alignItems:"center"},headerLink:{color:"var(--text-color)",opacity:.6,textDecoration:"none",fontSize:"0.85rem",transition:"opacity 0.2s",textTransform:"uppercase",letterSpacing:"0.05em"},crtToggle:{padding:"0.4rem 0.75rem",border:"1px solid var(--text-color)",borderRadius:"4px",fontSize:"0.75rem",fontWeight:600,cursor:"pointer",fontFamily:"inherit",textTransform:"uppercase",letterSpacing:"0.05em",transition:"all 0.2s"},menuButton:{display:"none",flexDirection:"column",gap:"5px",background:"none",border:"none",cursor:"pointer",padding:"5px"},menuLine:{width:"22px",height:"2px",background:"var(--text-color)",transition:"all 0.3s ease"},mobileMenu:{overflow:"hidden",transition:"all 0.3s ease",display:"flex",flexDirection:"column",gap:"0.75rem",background:"var(--bg-color)",borderTop:"1px solid rgba(255,255,255,0.1)"},mobileLink:{color:"var(--text-color)",opacity:.8,textDecoration:"none",fontSize:"0.9rem",padding:"0.5rem 0",textTransform:"uppercase",letterSpacing:"0.05em"},hero:{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"6rem 1.5rem 4rem",textAlign:"center"},heroContent:{maxWidth:"700px"},badge:{display:"inline-flex",alignItems:"center",gap:"8px",padding:"6px 14px",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:"4px",fontSize:"0.75rem",fontWeight:500,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"2rem"},badgeDot:{width:"6px",height:"6px",borderRadius:"50%",background:"#22c55e",boxShadow:"0 0 10px #22c55e"},heroTitle:{fontSize:"clamp(3rem, 12vw, 6rem)",fontWeight:700,letterSpacing:"-0.04em",lineHeight:1,marginBottom:"1.5rem",textTransform:"uppercase"},heroSubtitle:{fontSize:"clamp(0.9rem, 2vw, 1.1rem)",opacity:.6,lineHeight:1.7,marginBottom:"2.5rem",maxWidth:"500px",margin:"0 auto 2.5rem"},heroCtas:{display:"flex",gap:"1rem",justifyContent:"center",flexWrap:"wrap"},primaryCta:{padding:"0.8rem 1.75rem",background:"var(--text-color)",color:"var(--bg-color)",borderRadius:"4px",textDecoration:"none",fontWeight:600,fontSize:"0.85rem",textTransform:"uppercase",letterSpacing:"0.05em",transition:"transform 0.2s"},secondaryCta:{padding:"0.8rem 1.75rem",background:"transparent",color:"var(--text-color)",border:"1px solid rgba(255,255,255,0.3)",borderRadius:"4px",textDecoration:"none",fontWeight:500,fontSize:"0.85rem",textTransform:"uppercase",letterSpacing:"0.05em",transition:"border-color 0.2s"},demoSection:{padding:"6rem 1.5rem",borderTop:"1px solid rgba(255,255,255,0.1)"},sectionHeader:{maxWidth:"600px",margin:"0 auto 3rem",textAlign:"center"},sectionTitle:{fontSize:"clamp(1.5rem, 4vw, 2rem)",fontWeight:700,letterSpacing:"-0.02em",marginBottom:"0.75rem",textTransform:"uppercase"},sectionSubtitle:{fontSize:"0.9rem",opacity:.5,lineHeight:1.6},variantSelector:{maxWidth:"900px",margin:"0 auto 2rem"},variantLabel:{display:"block",fontSize:"0.75rem",textTransform:"uppercase",letterSpacing:"0.1em",opacity:.5,marginBottom:"1rem",textAlign:"center"},variantGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(150px, 1fr))",gap:"0.75rem"},variantButton:{padding:"1rem",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"6px",cursor:"pointer",fontFamily:"inherit",color:"inherit",textAlign:"left",transition:"all 0.2s"},variantButtonActive:{background:"rgba(255,255,255,0.1)",borderColor:"var(--text-color)"},variantName:{display:"block",fontWeight:600,fontSize:"0.9rem",marginBottom:"0.25rem",textTransform:"uppercase",letterSpacing:"0.05em"},variantDesc:{display:"block",fontSize:"0.7rem",opacity:.5,lineHeight:1.4},demoBox:{maxWidth:"900px",margin:"0 auto",padding:"2rem",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"8px"},demoTitle:{fontSize:"0.7rem",textTransform:"uppercase",letterSpacing:"0.15em",opacity:.4,marginBottom:"1.5rem"},list:{listStyle:"none",padding:0,margin:"0 0 2rem"},listItem:{display:"grid",gridTemplateColumns:"40px 1fr 1fr 100px 50px",gap:"0.75rem 1.5rem",alignItems:"baseline",padding:"0.6rem 0",borderBottom:"1px solid rgba(255,255,255,0.08)",fontSize:"0.85rem"},listNumber:{fontSize:"0.75rem",fontWeight:600,opacity:.3},hoverText:{cursor:"pointer",lineHeight:1.4},navDemo:{paddingTop:"1rem",borderTop:"1px solid rgba(255,255,255,0.1)"},navDemoTitle:{fontSize:"0.7rem",textTransform:"uppercase",letterSpacing:"0.15em",opacity:.4,marginBottom:"1rem"},navLinks:{display:"flex",gap:"2rem",flexWrap:"wrap",fontSize:"1.1rem",textTransform:"uppercase"},featuresSection:{padding:"6rem 1.5rem",background:"rgba(255,255,255,0.02)",borderTop:"1px solid rgba(255,255,255,0.05)",borderBottom:"1px solid rgba(255,255,255,0.05)"},featuresGrid:{maxWidth:"900px",margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))",gap:"1.5rem"},featureCard:{padding:"1.5rem",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"6px"},featureIcon:{fontSize:"1.5rem",marginBottom:"0.75rem",display:"block"},featureTitle:{fontSize:"0.9rem",fontWeight:600,marginBottom:"0.5rem",textTransform:"uppercase",letterSpacing:"0.02em"},featureDesc:{fontSize:"0.8rem",opacity:.6,lineHeight:1.5,margin:0},aboutSection:{padding:"6rem 1.5rem"},aboutContent:{maxWidth:"900px",margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"3rem",alignItems:"start"},aboutText:{},aboutDesc:{fontSize:"0.9rem",opacity:.7,lineHeight:1.7,marginBottom:"1.5rem"},techStack:{display:"flex",flexWrap:"wrap",alignItems:"center",gap:"0.75rem",marginTop:"2rem"},techLabel:{fontSize:"0.75rem",textTransform:"uppercase",letterSpacing:"0.1em",opacity:.5},techBadges:{display:"flex",gap:"0.5rem",flexWrap:"wrap"},techBadge:{padding:"0.35rem 0.7rem",background:"rgba(255,255,255,0.08)",borderRadius:"4px",fontSize:"0.7rem",fontWeight:500,textTransform:"uppercase",letterSpacing:"0.05em"},codePreview:{background:"rgba(0,0,0,0.4)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"8px",overflow:"hidden"},codeHeader:{padding:"0.75rem 1rem",background:"rgba(255,255,255,0.05)",display:"flex",alignItems:"center",gap:"0.5rem",borderBottom:"1px solid rgba(255,255,255,0.1)"},codeDot:{width:"10px",height:"10px",borderRadius:"50%",background:"rgba(255,255,255,0.2)"},codeFileName:{marginLeft:"auto",fontSize:"0.7rem",opacity:.5},codeBlock:{padding:"1.25rem",margin:0,fontSize:"0.75rem",lineHeight:1.6,overflow:"auto",color:"#22c55e"},footer:{padding:"4rem 1.5rem 2rem",borderTop:"1px solid rgba(255,255,255,0.1)"},footerInner:{maxWidth:"900px",margin:"0 auto",display:"grid",gridTemplateColumns:"1.5fr 2fr",gap:"3rem",marginBottom:"3rem"},footerBrand:{},footerLogo:{fontSize:"1rem",fontWeight:600,marginBottom:"0.5rem",display:"block"},footerTagline:{fontSize:"0.8rem",opacity:.5,margin:0},footerLinks:{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:"2rem"},footerCol:{display:"flex",flexDirection:"column",gap:"0.5rem"},footerColTitle:{fontSize:"0.7rem",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.1em",opacity:.4,marginBottom:"0.25rem"},footerLink:{color:"var(--text-color)",opacity:.6,textDecoration:"none",fontSize:"0.8rem",transition:"opacity 0.2s"},footerBottom:{maxWidth:"900px",margin:"0 auto",paddingTop:"2rem",borderTop:"1px solid rgba(255,255,255,0.1)",display:"flex",justifyContent:"space-between",fontSize:"0.75rem",opacity:.4},footerCopy:{},footerVersion:{textTransform:"uppercase",letterSpacing:"0.1em"}},F=`
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap');
  
  /* Base hover effect styles */
  .hover-effect {
    font-kerning: none;
    position: relative;
    white-space: nowrap;
    display: inline-block;
  }
  
  .hover-effect .word { white-space: nowrap; }
  .hover-effect .char { position: relative; display: inline-block; }
  
  /* Cursor variant */
  .hover-effect--cursor .char { --cursor-opacity: 0; }
  .hover-effect--cursor .char::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 1ch;
    height: 100%;
    background: currentColor;
    opacity: var(--cursor-opacity);
  }
  
  /* Background variant */
  .hover-effect--bg { --bg-scale: 0; }
  .hover-effect--bg::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: calc(100% + 4px);
    background-color: rgba(255, 255, 255, 0.15);
    mix-blend-mode: difference;
    transform-origin: 0% 50%;
    transform: scaleX(var(--bg-scale));
    pointer-events: none;
  }
  
  /* Blur variant */
  .hover-effect--blur { --bg-scale: 0; }
  .hover-effect--blur::before {
    content: '';
    position: absolute;
    left: -8px;
    right: -8px;
    top: -6px;
    bottom: -6px;
    background-color: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border-radius: 4px;
    transform-origin: 50% 100%;
    transform: scaleY(var(--bg-scale));
    pointer-events: none;
    z-index: -1;
  }
  
  /* Glitch effect */
  .hover-effect--glitch {
    --glitch-intensity: 0;
    --glitch-x: 0;
    --glitch-skew: 0;
    position: relative;
    transform: translateX(calc(var(--glitch-x) * 1px)) skewX(calc(var(--glitch-skew) * 1deg));
  }
  .hover-effect--glitch::before,
  .hover-effect--glitch::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: var(--glitch-intensity);
    pointer-events: none;
  }
  .hover-effect--glitch::before {
    color: #ff0040;
    transform: translateX(-2px);
    clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
  }
  .hover-effect--glitch::after {
    color: #00ffff;
    transform: translateX(2px);
    clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
  }
  
  /* Color schemes */
  .demo-cursor { --bg-color: #fff; --text-color: #000; }
  .demo-background { --bg-color: #252a33; --text-color: #c7c0b3; }
  .demo-color { --bg-color: #1d2619; --text-color: #c5c5c5; }
  .demo-blur { --bg-color: #0a0a0a; --text-color: rgba(255, 255, 255, 0.9); }
  .demo-glitch { --bg-color: #0d0d0d; --text-color: #00ff41; }
  
  /* CRT mode */
  .crt-mode { border-radius: 20px; overflow: hidden; }
  .crt-mode::before {
    content: '';
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.3) 90%, rgba(0,0,0,0.6) 100%);
    pointer-events: none;
    z-index: 99;
  }
  .crt-mode .scanlines {
    background-image: 
      repeating-linear-gradient(transparent, transparent 2px, rgba(0,0,0,0.2) 3px, rgba(0,0,0,0.2) 4px),
      repeating-linear-gradient(90deg, rgba(255,0,0,0.03), rgba(0,255,0,0.03) 1px, rgba(0,0,255,0.03) 2px);
  }
  
  /* Boot sequence */
  .boot-cursor {
    display: inline-block;
    width: 0.6em;
    height: 1.1em;
    background: currentColor;
    margin-left: 2px;
    vertical-align: text-bottom;
    animation: blink 0.7s step-end infinite;
  }
  @keyframes blink { 50% { opacity: 0; } }
  
  /* Responsive */
  @media (max-width: 768px) {
    header nav { display: none !important; }
    header button[aria-label="Toggle menu"] { display: flex !important; }
    
    .terminal-list-item {
      grid-template-columns: 35px 1fr !important;
      gap: 0.4rem 0.75rem !important;
    }
    .terminal-list-item > span:nth-child(n+4) { display: none; }
    
    section > div[style*="grid-template-columns: 1fr 1fr"] {
      grid-template-columns: 1fr !important;
    }
    
    footer > div:first-child {
      grid-template-columns: 1fr !important;
    }
    footer > div:first-child > div:last-child {
      grid-template-columns: repeat(2, 1fr) !important;
    }
  }
  
  a:hover { opacity: 1 !important; }
`;export{K as TerminalTextHover,K as default};
