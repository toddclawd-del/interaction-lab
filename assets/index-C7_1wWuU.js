import{j as r}from"./three-vendor-CgYOwSjb.js";import{r as a,L as B}from"./react-vendor-DtyY8K5c.js";import{g as T}from"./gsap-vendor-C8pce-KX.js";import{F as g}from"./Flip-CnrKMpgG.js";T.registerPlugin(g.Flip);const R={50:{desktop:16,tablet:10,mobile:3},75:{desktop:10,tablet:8,mobile:3},100:{desktop:8,tablet:6,mobile:3},125:{desktop:6,tablet:5,mobile:3},150:{desktop:4,tablet:3,mobile:3}},D=[50,75,100,125,150],N=({item:i,index:t})=>r.jsxs("div",{className:"morphing-grid-item-inner",style:{position:"relative",width:"100%",height:"100%",borderRadius:"8px",overflow:"hidden",backgroundColor:"#1a1a1a"},children:[r.jsx("img",{src:i.image,alt:i.label||`Item ${t+1}`,loading:"lazy",style:{width:"100%",height:"100%",objectFit:"cover",display:"block"}}),i.label&&r.jsx("span",{style:{position:"absolute",bottom:"0.5rem",left:"0.5rem",background:"rgba(0,0,0,0.7)",color:"#fff",padding:"0.25rem 0.5rem",borderRadius:"4px",fontSize:"0.75rem",fontFamily:"system-ui, sans-serif"},children:i.label})]});function v({items:i,densityLevels:t=D,defaultDensity:A=75,enhancedTransition:x=!0,renderItem:y,onDensityChange:s,gap:F="1.5rem",className:j="",gridClassName:$=""}){const[m,k]=a.useState(A),u=a.useRef(null),w=a.useRef([]),l=a.useRef(!1),f=a.useId(),G=a.useId(),h=a.useRef(null),C=a.useRef(typeof window<"u"?window.matchMedia("(prefers-reduced-motion: reduce)").matches:!1),E=a.useCallback(e=>R[e]||R[100],[]),c=a.useCallback(e=>{h.current&&(h.current.textContent=e)},[]),b=a.useCallback(e=>{if(l.current||e===m||!u.current||!i.length)return;l.current=!0;const n=w.current.filter(Boolean);if(C.current){k(e),l.current=!1,c(`Gallery updated to ${e}% density`),s==null||s(e);return}const o=g.Flip.getState(n);k(e),requestAnimationFrame(()=>{x?(g.Flip.from(o,{absolute:!0,duration:1,ease:"expo.inOut",stagger:{amount:.3,from:"random"},onComplete:()=>{l.current=!1,c(`Gallery updated to ${e}% density`)}}),T.fromTo(u.current,{filter:"blur(0px) brightness(100%)"},{duration:1+.3,keyframes:[{filter:"blur(10px) brightness(200%)",duration:(1+.3)*.5,ease:"power2.in"},{filter:"blur(0px) brightness(100%)",duration:(1+.3)*.5,ease:"power2.out"}]})):g.Flip.from(o,{absolute:!0,duration:.8,ease:"expo.inOut",onComplete:()=>{l.current=!1,c(`Gallery updated to ${e}% density`)}}),s==null||s(e)})},[m,i.length,x,s,c]),M=a.useCallback((e,n)=>{const o=t.indexOf(n);let d=o;switch(e.key){case"ArrowLeft":case"ArrowUp":e.preventDefault(),d=o>0?o-1:t.length-1;break;case"ArrowRight":case"ArrowDown":e.preventDefault(),d=o<t.length-1?o+1:0;break;case"Home":e.preventDefault(),d=0;break;case"End":e.preventDefault(),d=t.length-1;break;default:return}const S=document.querySelectorAll(`[data-density-control="${f}"]`)[d];S&&(S.focus(),b(t[d]))},[t,f,b]);if(!i.length)return r.jsx("div",{className:`morphing-grid-empty ${j}`,style:{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"300px",color:"#666",fontFamily:"system-ui, sans-serif"},children:"No items to display"});const p=E(m);return r.jsxs("div",{className:`morphing-grid-container ${j}`,children:[r.jsx("div",{ref:h,role:"status","aria-live":"polite","aria-atomic":"true",className:"sr-only",style:{position:"absolute",width:"1px",height:"1px",padding:0,margin:"-1px",overflow:"hidden",clip:"rect(0, 0, 0, 0)",whiteSpace:"nowrap",border:0}}),i.length>=4&&r.jsx("div",{role:"group","aria-label":"Gallery density controls",style:{display:"flex",gap:"0.5rem",marginBottom:"1.5rem",flexWrap:"wrap"},children:t.map(e=>{const n=e===m;return r.jsxs("button",{"data-density-control":f,onClick:()=>b(e),onKeyDown:o=>M(o,e),disabled:l.current,"aria-pressed":n,"aria-label":`Set gallery density to ${e}%`,tabIndex:n?0:-1,style:{padding:"0.5rem 1rem",border:"none",borderRadius:"6px",background:n?"#fff":"rgba(255,255,255,0.1)",color:n?"#000":"#888",cursor:l.current?"not-allowed":"pointer",fontFamily:"system-ui, sans-serif",fontSize:"0.875rem",fontWeight:n?600:400,transition:"all 0.2s ease",outline:"none"},onFocus:o=>{o.currentTarget.style.boxShadow="0 0 0 2px rgba(255,255,255,0.5)"},onBlur:o=>{o.currentTarget.style.boxShadow="none"},children:[e,"%"]},e)})}),r.jsx("div",{ref:u,id:G,role:"grid","aria-label":`Gallery at ${m}% density`,"data-density":m,className:`morphing-grid ${$}`,style:{display:"grid",gap:F,gridTemplateColumns:`repeat(var(--grid-cols, ${p.desktop}), 1fr)`,"--grid-cols":p.desktop,"--grid-cols-tablet":p.tablet,"--grid-cols-mobile":p.mobile},children:i.map((e,n)=>r.jsx("div",{ref:o=>{w.current[n]=o},role:"gridcell",className:"morphing-grid-item","data-flip-id":`item-${e.id}`,style:{aspectRatio:e.aspectRatio||"1/1"},children:y?y(e,n):r.jsx(N,{item:e,index:n})},e.id))}),r.jsx("style",{children:`
        .morphing-grid {
          grid-template-columns: repeat(var(--grid-cols), 1fr) !important;
        }
        
        @media (max-width: 1024px) {
          .morphing-grid {
            --grid-cols: var(--grid-cols-tablet) !important;
          }
        }
        
        @media (max-width: 640px) {
          .morphing-grid {
            --grid-cols: var(--grid-cols-mobile) !important;
          }
        }
        
        .morphing-grid-item {
          will-change: transform;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .morphing-grid,
          .morphing-grid-item {
            transition: none !important;
            animation: none !important;
          }
        }
      `})]})}const I=Array.from({length:24},(i,t)=>({id:`img-${t+1}`,image:`https://picsum.photos/seed/morph${t+1}/600/600`,aspectRatio:["1/1","4/5","1/1","5/4"][t%4],label:String(t+1).padStart(2,"0")}));function H(){return r.jsxs("div",{style:{minHeight:"100vh",background:"#0a0a0a",color:"#fff",fontFamily:"system-ui, -apple-system, sans-serif"},children:[r.jsxs("header",{style:{padding:"2rem",borderBottom:"1px solid rgba(255,255,255,0.1)"},children:[r.jsx(B,{to:"/",style:{color:"#666",textDecoration:"none",fontSize:"0.875rem",display:"inline-flex",alignItems:"center",gap:"0.5rem",marginBottom:"1rem"},children:"← Back to Lab"}),r.jsx("h1",{style:{fontSize:"2.5rem",fontWeight:700,margin:0},children:"Morphing Grid"}),r.jsx("p",{style:{color:"#888",margin:"0.5rem 0 0",maxWidth:"600px"},children:"Click the density controls and watch items flow to their new positions. Uses GSAP Flip plugin for layout animations."})]}),r.jsx("main",{style:{padding:"2rem"},children:r.jsx(v,{items:I,defaultDensity:75,enhancedTransition:!0,gap:"1rem",onDensityChange:i=>console.log(`Density: ${i}%`)})}),r.jsxs("section",{style:{padding:"2rem",marginTop:"4rem",borderTop:"1px solid rgba(255,255,255,0.1)"},children:[r.jsx("h2",{style:{fontSize:"1.5rem",fontWeight:600,marginBottom:"1rem"},children:"Custom Renderer Example"}),r.jsxs("p",{style:{color:"#888",marginBottom:"1.5rem"},children:["Using the ",r.jsx("code",{style:{background:"#222",padding:"0.25rem 0.5rem",borderRadius:"4px"},children:"renderItem"})," prop for custom item styling:"]}),r.jsx(v,{items:I.slice(0,12),defaultDensity:100,enhancedTransition:!1,gap:"0.5rem",renderItem:(i,t)=>r.jsx("div",{style:{width:"100%",height:"100%",position:"relative",background:`hsl(${t*30}, 60%, 20%)`,borderRadius:"12px",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center"},children:r.jsx("span",{style:{fontSize:"2rem",fontWeight:700,color:"rgba(255,255,255,0.3)"},children:String(t+1).padStart(2,"0")})})})]}),r.jsxs("section",{style:{padding:"2rem",marginTop:"4rem",borderTop:"1px solid rgba(255,255,255,0.1)"},children:[r.jsx("h2",{style:{fontSize:"1.5rem",fontWeight:600,marginBottom:"1rem"},children:"Usage"}),r.jsx("pre",{style:{background:"#111",padding:"1.5rem",borderRadius:"8px",overflow:"auto",fontSize:"0.875rem",lineHeight:1.6},children:`import { MorphingGrid } from './interactions/morphing-grid/MorphingGrid'

const items = [
  { id: '1', image: '/img1.jpg', aspectRatio: '4/5' },
  { id: '2', image: '/img2.jpg', aspectRatio: '1/1' },
  // ...
]

<MorphingGrid
  items={items}
  defaultDensity={75}
  enhancedTransition={true}
  onDensityChange={(d) => console.log(d)}
  renderItem={(item, i) => (
    <img src={item.image} alt="" />
  )}
/>`})]}),r.jsxs("footer",{style:{padding:"2rem",borderTop:"1px solid rgba(255,255,255,0.1)",marginTop:"4rem",color:"#666",fontSize:"0.875rem"},children:["Interaction Lab • Reference:"," ",r.jsx("a",{href:"https://tympanus.net/Tutorials/GridLayoutTransitions/",target:"_blank",rel:"noopener noreferrer",style:{color:"#888"},children:"Codrops Grid Layout Transitions"})]})]})}export{v as MorphingGrid,H as default};
