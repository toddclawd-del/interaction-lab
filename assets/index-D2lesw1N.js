import{j as t}from"./three-vendor-CgYOwSjb.js";import{r as a,L as x}from"./react-vendor-DtyY8K5c.js";import{g as c}from"./gsap-vendor-C8pce-KX.js";import{F as l}from"./Flip-CnrKMpgG.js";c.registerPlugin(l.Flip);const b=Array.from({length:30},(n,i)=>({id:i+1,aspectRatio:["1/1","4/5","16/9","3/4","5/4","9/16"][i%6],image:`https://picsum.photos/seed/grid${i+1}/400/500`})),y=["50%","75%","100%","125%","150%"];function w(){const[n,i]=a.useState("75%"),[g,m]=a.useState(!1),d=a.useRef(null),u=a.useRef([]),o=a.useRef(!1),f=r=>{if(o.current||r===n||!d.current)return;o.current=!0;const p=u.current.filter(Boolean),s=l.Flip.getState(p);i(r),requestAnimationFrame(()=>{g?(l.Flip.from(s,{absolute:!0,duration:1,ease:"expo.inOut",stagger:{amount:.3,from:"random"},onComplete:()=>{o.current=!1}}),c.fromTo(d.current,{filter:"blur(0px) brightness(100%)"},{duration:1+.3,keyframes:[{filter:"blur(10px) brightness(150%)",duration:(1+.3)*.5,ease:"power2.in"},{filter:"blur(0px) brightness(100%)",duration:(1+.3)*.5,ease:"power2.out"}]})):l.Flip.from(s,{duration:.8,ease:"expo.inOut",onComplete:()=>{o.current=!1}})})};return t.jsxs("div",{style:e.container,children:[t.jsx(x,{to:"/",style:e.backButton,children:"← Back"}),t.jsxs("nav",{style:e.nav,children:[t.jsxs("div",{style:e.modeToggle,children:[t.jsx("button",{style:{...e.modeButton,...g?{}:e.modeButtonActive},onClick:()=>m(!1),children:"Default"}),t.jsx("button",{style:{...e.modeButton,...g?e.modeButtonActive:{}},onClick:()=>m(!0),children:"Filter + Stagger"})]}),t.jsx("div",{style:e.sizeButtons,children:y.map(r=>t.jsx("button",{style:{...e.sizeButton,...n===r?e.sizeButtonActive:{}},onClick:()=>f(r),children:r},r))})]}),t.jsx("div",{ref:d,className:`grid-gallery size-${n.replace("%","")}`,style:e.grid,children:b.map((r,p)=>t.jsxs("div",{ref:s=>{u.current[p]=s},style:e.gridItem,children:[t.jsx("div",{style:{...e.image,backgroundImage:`url(${r.image})`,aspectRatio:r.aspectRatio}}),t.jsx("p",{style:e.itemNumber,children:String(r.id).padStart(2,"0")})]},r.id))}),t.jsx("div",{style:e.branding,children:"GRID FLIP"}),t.jsx("style",{children:`
        .grid-gallery {
          grid-template-columns: repeat(10, 1fr);
        }
        .grid-gallery.size-50 { grid-template-columns: repeat(16, 1fr); }
        .grid-gallery.size-75 { grid-template-columns: repeat(10, 1fr); }
        .grid-gallery.size-100 { grid-template-columns: repeat(8, 1fr); }
        .grid-gallery.size-125 { grid-template-columns: repeat(6, 1fr); }
        .grid-gallery.size-150 { grid-template-columns: repeat(4, 1fr); }
        
        @media (max-width: 768px) {
          .grid-gallery.size-50 { grid-template-columns: repeat(6, 1fr) !important; }
          .grid-gallery.size-75 { grid-template-columns: repeat(5, 1fr) !important; }
          .grid-gallery.size-100 { grid-template-columns: repeat(4, 1fr) !important; }
          .grid-gallery.size-125 { grid-template-columns: repeat(3, 1fr) !important; }
          .grid-gallery.size-150 { grid-template-columns: repeat(2, 1fr) !important; }
        }
        
        @media (min-width: 769px) and (max-width: 1024px) {
          .grid-gallery.size-50 { grid-template-columns: repeat(8, 1fr) !important; }
          .grid-gallery.size-75 { grid-template-columns: repeat(6, 1fr) !important; }
          .grid-gallery.size-100 { grid-template-columns: repeat(5, 1fr) !important; }
          .grid-gallery.size-125 { grid-template-columns: repeat(4, 1fr) !important; }
          .grid-gallery.size-150 { grid-template-columns: repeat(3, 1fr) !important; }
        }
        
        @media (max-width: 768px) {
          nav {
            padding-left: 1rem !important;
            flex-wrap: nowrap !important;
            -webkit-overflow-scrolling: touch;
          }
          nav > div {
            flex-shrink: 0;
          }
        }
      `})]})}const e={container:{minHeight:"100vh",background:"#0a0a0a",fontFamily:"Inter, system-ui, sans-serif",padding:"1rem",paddingTop:"120px"},backButton:{position:"fixed",top:24,left:24,color:"rgba(255, 255, 255, 0.5)",textDecoration:"none",fontSize:14,fontWeight:500,zIndex:100},nav:{position:"fixed",top:0,left:0,right:0,display:"flex",justifyContent:"space-between",alignItems:"center",padding:"1rem 2rem",paddingLeft:"100px",background:"rgba(10, 10, 10, 0.9)",backdropFilter:"blur(10px)",zIndex:50,overflowX:"auto",gap:"1rem"},modeToggle:{display:"flex",gap:"0.5rem",flexShrink:0},modeButton:{padding:"0.4rem 0.6rem",fontSize:"0.65rem",fontWeight:500,textTransform:"uppercase",letterSpacing:"0.05em",color:"rgba(255, 255, 255, 0.5)",background:"transparent",border:"1px solid rgba(255, 255, 255, 0.2)",borderRadius:"4px",cursor:"pointer",transition:"all 0.2s ease",whiteSpace:"nowrap"},modeButtonActive:{color:"#fff",background:"rgba(255, 255, 255, 0.1)",borderColor:"rgba(255, 255, 255, 0.4)"},sizeButtons:{display:"flex",gap:"0.25rem",flexShrink:0},sizeButton:{padding:"0.5rem 0.75rem",fontSize:"0.75rem",fontWeight:500,color:"rgba(255, 255, 255, 0.5)",background:"rgba(255, 255, 255, 0.05)",border:"none",borderRadius:"4px",cursor:"pointer",transition:"all 0.2s ease",whiteSpace:"nowrap"},sizeButtonActive:{color:"#fff",background:"rgba(255, 255, 255, 0.15)"},grid:{display:"grid",gap:"1.5rem",width:"100%",maxWidth:"1400px",margin:"0 auto"},gridItem:{display:"flex",flexDirection:"column"},image:{width:"100%",backgroundSize:"cover",backgroundPosition:"center",filter:"brightness(0.8)",transition:"filter 0.3s ease",borderRadius:"2px"},itemNumber:{fontSize:"0.675rem",color:"rgba(255, 255, 255, 0.4)",marginTop:"0.5rem",fontFamily:"monospace"},branding:{position:"fixed",top:24,right:24,color:"rgba(255, 255, 255, 0.3)",fontFamily:"monospace",fontSize:10,letterSpacing:"0.1em",pointerEvents:"none",userSelect:"none"}};export{w as GridFlip,w as default};
