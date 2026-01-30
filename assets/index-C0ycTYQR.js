var Te=Object.defineProperty;var je=(e,t,r)=>t in e?Te(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var L=(e,t,r)=>je(e,typeof t!="symbol"?t+"":t,r);import{r as w,j as c,L as Ee}from"./index-DDsJlWGK.js";import{g as h}from"./index-C8pce-KX.js";(function(){function e(){for(var n=arguments.length,i=0;i<n;i++){var a=i<0||arguments.length<=i?void 0:arguments[i];a.nodeType===1||a.nodeType===11?this.appendChild(a):this.appendChild(document.createTextNode(String(a)))}}function t(){for(;this.lastChild;)this.removeChild(this.lastChild);arguments.length&&this.append.apply(this,arguments)}function r(){for(var n=this.parentNode,i=arguments.length,a=new Array(i),s=0;s<i;s++)a[s]=arguments[s];var o=a.length;if(n)for(o||n.removeChild(this);o--;){var l=a[o];typeof l!="object"?l=this.ownerDocument.createTextNode(l):l.parentNode&&l.parentNode.removeChild(l),o?n.insertBefore(this.previousSibling,l):n.replaceChild(l,this)}}typeof Element<"u"&&(Element.prototype.append||(Element.prototype.append=e,DocumentFragment.prototype.append=e),Element.prototype.replaceChildren||(Element.prototype.replaceChildren=t,DocumentFragment.prototype.replaceChildren=t),Element.prototype.replaceWith||(Element.prototype.replaceWith=r,DocumentFragment.prototype.replaceWith=r))})();function Ae(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function Z(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function Q(e,t,r){return t&&Z(e.prototype,t),r&&Z(e,r),e}function Oe(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function ee(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(i){return Object.getOwnPropertyDescriptor(e,i).enumerable})),r.push.apply(r,n)}return r}function te(e){for(var t=1;t<arguments.length;t++){var r=arguments[t]!=null?arguments[t]:{};t%2?ee(Object(r),!0).forEach(function(n){Oe(e,n,r[n])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):ee(Object(r)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))})}return e}function oe(e,t){return Me(e)||We(e,t)||se(e,t)||Ie()}function y(e){return Le(e)||Be(e)||se(e)||Ne()}function Le(e){if(Array.isArray(e))return $(e)}function Me(e){if(Array.isArray(e))return e}function Be(e){if(typeof Symbol<"u"&&Symbol.iterator in Object(e))return Array.from(e)}function We(e,t){if(!(typeof Symbol>"u"||!(Symbol.iterator in Object(e)))){var r=[],n=!0,i=!1,a=void 0;try{for(var s=e[Symbol.iterator](),o;!(n=(o=s.next()).done)&&(r.push(o.value),!(t&&r.length===t));n=!0);}catch(l){i=!0,a=l}finally{try{!n&&s.return!=null&&s.return()}finally{if(i)throw a}}return r}}function se(e,t){if(e){if(typeof e=="string")return $(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);if(r==="Object"&&e.constructor&&(r=e.constructor.name),r==="Map"||r==="Set")return Array.from(e);if(r==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return $(e,t)}}function $(e,t){(t==null||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function Ne(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function Ie(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function M(e,t){return Object.getOwnPropertyNames(Object(e)).reduce(function(r,n){var i=Object.getOwnPropertyDescriptor(Object(e),n),a=Object.getOwnPropertyDescriptor(Object(t),n);return Object.defineProperty(r,n,a||i)},{})}function _(e){return typeof e=="string"}function J(e){return Array.isArray(e)}function H(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},t=M(e),r;return t.types!==void 0?r=t.types:t.split!==void 0&&(r=t.split),r!==void 0&&(t.types=(_(r)||J(r)?String(r):"").split(",").map(function(n){return String(n).trim()}).filter(function(n){return/((line)|(word)|(char))/i.test(n)})),(t.absolute||t.position)&&(t.absolute=t.absolute||/absolute/.test(e.position)),t}function K(e){var t=_(e)||J(e)?String(e):"";return{none:!t,lines:/line/i.test(t),words:/word/i.test(t),chars:/char/i.test(t)}}function F(e){return e!==null&&typeof e=="object"}function _e(e){return F(e)&&/^(1|3|11)$/.test(e.nodeType)}function De(e){return typeof e=="number"&&e>-1&&e%1===0}function Pe(e){return F(e)&&De(e.length)}function W(e){return J(e)?e:e==null?[]:Pe(e)?Array.prototype.slice.call(e):[e]}function re(e){var t=e;return _(e)&&(/^(#[a-z]\w+)$/.test(e.trim())?t=document.getElementById(e.trim().slice(1)):t=document.querySelectorAll(e)),W(t).reduce(function(r,n){return[].concat(y(r),y(W(n).filter(_e)))},[])}var Re=Object.entries,z="_splittype",C={},He=0;function k(e,t,r){if(!F(e))return console.warn("[data.set] owner is not an object"),null;var n=e[z]||(e[z]=++He),i=C[n]||(C[n]={});return r===void 0?t&&Object.getPrototypeOf(t)===Object.prototype&&(C[n]=te(te({},i),t)):t!==void 0&&(i[t]=r),r}function B(e,t){var r=F(e)?e[z]:null,n=r&&C[r]||{};return n}function le(e){var t=e&&e[z];t&&(delete e[t],delete C[t])}function ze(){Object.keys(C).forEach(function(e){delete C[e]})}function Fe(){Re(C).forEach(function(e){var t=oe(e,2),r=t[0],n=t[1],i=n.isRoot,a=n.isSplit;(!i||!a)&&(C[r]=null,delete C[r])})}function Ve(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:" ",r=e?String(e):"";return r.trim().replace(/\s+/g," ").split(t)}var q="\\ud800-\\udfff",ce="\\u0300-\\u036f\\ufe20-\\ufe23",fe="\\u20d0-\\u20f0",ue="\\ufe0e\\ufe0f",$e="[".concat(q,"]"),X="[".concat(ce).concat(fe,"]"),Y="\\ud83c[\\udffb-\\udfff]",Xe="(?:".concat(X,"|").concat(Y,")"),de="[^".concat(q,"]"),he="(?:\\ud83c[\\udde6-\\uddff]){2}",pe="[\\ud800-\\udbff][\\udc00-\\udfff]",ge="\\u200d",me="".concat(Xe,"?"),ve="[".concat(ue,"]?"),Ye="(?:"+ge+"(?:"+[de,he,pe].join("|")+")"+ve+me+")*",Ge=ve+me+Ye,Je="(?:".concat(["".concat(de).concat(X,"?"),X,he,pe,$e].join("|"),`
)`),Ke=RegExp("".concat(Y,"(?=").concat(Y,")|").concat(Je).concat(Ge),"g"),qe=[ge,q,ce,fe,ue],Ue=RegExp("[".concat(qe.join(""),"]"));function Ze(e){return e.split("")}function ye(e){return Ue.test(e)}function Qe(e){return e.match(Ke)||[]}function et(e){return ye(e)?Qe(e):Ze(e)}function tt(e){return e==null?"":String(e)}function rt(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:"";return e=tt(e),e&&_(e)&&!t&&ye(e)?et(e):e.split(t)}function G(e,t){var r=document.createElement(e);return t&&Object.keys(t).forEach(function(n){var i=t[n],a=_(i)?i.trim():i;a===null||a===""||(n==="children"?r.append.apply(r,y(W(a))):r.setAttribute(n,a))}),r}var U={splitClass:"",lineClass:"line",wordClass:"word",charClass:"char",types:["lines","words","chars"],absolute:!1,tagName:"div"};function nt(e,t){t=M(U,t);var r=K(t.types),n=t.tagName,i=e.nodeValue,a=document.createDocumentFragment(),s=[],o=[];return/^\s/.test(i)&&a.append(" "),s=Ve(i).reduce(function(l,u,d,p){var b,x;return r.chars&&(x=rt(u).map(function(S){var T=G(n,{class:"".concat(t.splitClass," ").concat(t.charClass),style:"display: inline-block;",children:S});return k(T,"isChar",!0),o=[].concat(y(o),[T]),T})),r.words||r.lines?(b=G(n,{class:"".concat(t.wordClass," ").concat(t.splitClass),style:"display: inline-block; ".concat(r.words&&t.absolute?"position: relative;":""),children:r.chars?x:u}),k(b,{isWord:!0,isWordStart:!0,isWordEnd:!0}),a.appendChild(b)):x.forEach(function(S){a.appendChild(S)}),d<p.length-1&&a.append(" "),r.words?l.concat(b):l},[]),/\s$/.test(i)&&a.append(" "),e.replaceWith(a),{words:s,chars:o}}function be(e,t){var r=e.nodeType,n={words:[],chars:[]};if(!/(1|3|11)/.test(r))return n;if(r===3&&/\S/.test(e.nodeValue))return nt(e,t);var i=W(e.childNodes);if(i.length&&(k(e,"isSplit",!0),!B(e).isRoot)){e.style.display="inline-block",e.style.position="relative";var a=e.nextSibling,s=e.previousSibling,o=e.textContent||"",l=a?a.textContent:" ",u=s?s.textContent:" ";k(e,{isWordEnd:/\s$/.test(o)||/^\s/.test(l),isWordStart:/^\s/.test(o)||/\s$/.test(u)})}return i.reduce(function(d,p){var b=be(p,t),x=b.words,S=b.chars;return{words:[].concat(y(d.words),y(x)),chars:[].concat(y(d.chars),y(S))}},n)}function it(e,t,r,n){if(!r.absolute)return{top:t?e.offsetTop:null};var i=e.offsetParent,a=oe(n,2),s=a[0],o=a[1],l=0,u=0;if(i&&i!==document.body){var d=i.getBoundingClientRect();l=d.x+s,u=d.y+o}var p=e.getBoundingClientRect(),b=p.width,x=p.height,S=p.x,T=p.y,D=T+o-u,V=S+s-l;return{width:b,height:x,top:D,left:V}}function xe(e){B(e).isWord?(le(e),e.replaceWith.apply(e,y(e.childNodes))):W(e.children).forEach(function(t){return xe(t)})}var at=function(){return document.createDocumentFragment()};function ot(e,t,r){var n=K(t.types),i=t.tagName,a=e.getElementsByTagName("*"),s=[],o=[],l=null,u,d,p,b=[],x=e.parentElement,S=e.nextElementSibling,T=at(),D=window.getComputedStyle(e),V=D.textAlign,we=parseFloat(D.fontSize),Ce=we*.2;return t.absolute&&(p={left:e.offsetLeft,top:e.offsetTop,width:e.offsetWidth},d=e.offsetWidth,u=e.offsetHeight,k(e,{cssWidth:e.style.width,cssHeight:e.style.height})),W(a).forEach(function(g){var m=g.parentElement===e,v=it(g,m,t,r),E=v.width,I=v.height,A=v.top,O=v.left;/^br$/i.test(g.nodeName)||(n.lines&&m&&((l===null||A-l>=Ce)&&(l=A,s.push(o=[])),o.push(g)),t.absolute&&k(g,{top:A,left:O,width:E,height:I}))}),x&&x.removeChild(e),n.lines&&(b=s.map(function(g){var m=G(i,{class:"".concat(t.splitClass," ").concat(t.lineClass),style:"display: block; text-align: ".concat(V,"; width: 100%;")});k(m,"isLine",!0);var v={height:0,top:1e4};return T.appendChild(m),g.forEach(function(E,I,A){var O=B(E),P=O.isWordEnd,R=O.top,Se=O.height,ke=A[I+1];v.height=Math.max(v.height,Se),v.top=Math.min(v.top,R),m.appendChild(E),P&&B(ke).isWordStart&&m.append(" ")}),t.absolute&&k(m,{height:v.height,top:v.top}),m}),n.words||xe(T),e.replaceChildren(T)),t.absolute&&(e.style.width="".concat(e.style.width||d,"px"),e.style.height="".concat(u,"px"),W(a).forEach(function(g){var m=B(g),v=m.isLine,E=m.top,I=m.left,A=m.width,O=m.height,P=B(g.parentElement),R=!v&&P.isLine;g.style.top="".concat(R?E-P.top:E,"px"),g.style.left=v?"".concat(p.left,"px"):"".concat(I-(R?p.left:0),"px"),g.style.height="".concat(O,"px"),g.style.width=v?"".concat(p.width,"px"):"".concat(A,"px"),g.style.position="absolute"})),x&&(S?x.insertBefore(e,S):x.appendChild(e)),b}var N=M(U,{}),st=function(){Q(e,null,[{key:"clearData",value:function(){ze()}},{key:"setDefaults",value:function(r){return N=M(N,H(r)),U}},{key:"revert",value:function(r){re(r).forEach(function(n){var i=B(n),a=i.isSplit,s=i.html,o=i.cssWidth,l=i.cssHeight;a&&(n.innerHTML=s,n.style.width=o||"",n.style.height=l||"",le(n))})}},{key:"create",value:function(r,n){return new e(r,n)}},{key:"data",get:function(){return C}},{key:"defaults",get:function(){return N},set:function(r){N=M(N,H(r))}}]);function e(t,r){Ae(this,e),this.isSplit=!1,this.settings=M(N,H(r)),this.elements=re(t),this.split()}return Q(e,[{key:"split",value:function(r){var n=this;this.revert(),this.elements.forEach(function(s){k(s,"html",s.innerHTML)}),this.lines=[],this.words=[],this.chars=[];var i=[window.pageXOffset,window.pageYOffset];r!==void 0&&(this.settings=M(this.settings,H(r)));var a=K(this.settings.types);a.none||(this.elements.forEach(function(s){k(s,"isRoot",!0);var o=be(s,n.settings),l=o.words,u=o.chars;n.words=[].concat(y(n.words),y(l)),n.chars=[].concat(y(n.chars),y(u))}),this.elements.forEach(function(s){if(a.lines||n.settings.absolute){var o=ot(s,n.settings,i);n.lines=[].concat(y(n.lines),y(o))}}),this.isSplit=!0,window.scrollTo(i[0],i[1]),Fe())}},{key:"revert",value:function(){this.isSplit&&(this.lines=null,this.words=null,this.chars=null,this.isSplit=!1),e.revert(this.elements)}}]),e}();const ne=["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","!","@","#","$","%","^","&","*","-","_","+","=",";",":","<",">",",","/","\\","|","~","`"],ie=["#22a3a9","#4ca922","#a99222","#ff6b6b","#6366f1","#ec4899"];class lt{constructor(t,r={}){L(this,"element");L(this,"splitter",null);L(this,"originalChars",[]);L(this,"originalColors",[]);L(this,"variant");L(this,"options");this.element=t,this.variant=r.variant||"cursor",this.options={scrambleSpeed:r.scrambleSpeed||.03,scrambleCount:r.scrambleCount||3,staggerDelay:r.staggerDelay||.07,repeatDelay:r.repeatDelay||.04},this.init()}init(){this.splitter=new st(this.element,{types:"words,chars",tagName:"span"});const t=this.getChars();this.originalChars=t.map(r=>r.innerHTML),this.originalColors=t.map(r=>getComputedStyle(r).color),this.element.classList.add("hover-effect"),this.variant==="cursor"?this.element.classList.add("hover-effect--cursor"):this.variant==="background"?this.element.classList.add("hover-effect--bg"):this.variant==="blur"?this.element.classList.add("hover-effect--blur"):this.variant==="glitch"&&this.element.classList.add("hover-effect--glitch")}getChars(){var t;return((t=this.splitter)==null?void 0:t.chars)||[]}animate(){this.reset();const t=this.getChars(),{scrambleSpeed:r,scrambleCount:n,staggerDelay:i,repeatDelay:a}=this.options;t.forEach((s,o)=>{const l=s.innerHTML,u=this.originalColors[o];let d=0;h.fromTo(s,{opacity:0},{duration:r,opacity:1,delay:(o+1)*i,repeat:n,repeatDelay:a,repeatRefresh:!0,onStart:()=>{this.variant==="cursor"&&h.set(s,{"--cursor-opacity":1})},onRepeat:()=>{d++,this.variant==="cursor"&&d===1&&h.set(s,{"--cursor-opacity":0})},onComplete:()=>{h.set(s,{innerHTML:l,color:u,delay:r})},innerHTML:()=>{const p=ne[Math.floor(Math.random()*ne.length)];if(this.variant==="color"){const b=ie[Math.floor(Math.random()*ie.length)];h.set(s,{color:b})}return p}})}),(this.variant==="background"||this.variant==="blur")&&h.fromTo(this.element,{"--bg-scale":0},{duration:1,ease:"expo.out","--bg-scale":1}),this.variant==="glitch"&&(h.to(this.element,{duration:.1,"--glitch-intensity":1,ease:"power2.out"}),h.timeline({repeat:3}).to(this.element,{duration:.05,"--glitch-x":()=>(Math.random()-.5)*8,"--glitch-skew":()=>(Math.random()-.5)*5,ease:"none"}).to(this.element,{duration:.05,"--glitch-x":0,"--glitch-skew":0,ease:"none"}),h.to(this.element,{duration:.3,delay:.4,"--glitch-intensity":0,ease:"power2.out"}))}animateOut(){(this.variant==="background"||this.variant==="blur")&&(h.killTweensOf(this.element),h.to(this.element,{duration:.6,ease:"power4.out","--bg-scale":0})),this.variant==="glitch"&&(h.killTweensOf(this.element),h.to(this.element,{duration:.2,"--glitch-intensity":0,"--glitch-x":0,"--glitch-skew":0}))}reset(){this.getChars().forEach((r,n)=>{h.killTweensOf(r),r.innerHTML=this.originalChars[n],r.style.color=this.originalColors[n]}),h.killTweensOf(this.element),h.set(this.element,{"--bg-scale":0})}destroy(){var t;this.reset(),(t=this.splitter)==null||t.revert(),this.element.classList.remove("hover-effect","hover-effect--cursor","hover-effect--bg","hover-effect--blur","hover-effect--glitch")}}const ct=[{id:1,name:"Mount Vespera",location:"Planet Thalassa",date:"2157-03-14",code:"V6"},{id:2,name:"Kraxion",location:"Exo-Planet Zyra",date:"2243-11-09",code:"K7"},{id:3,name:"Helion Peak",location:"Planet Elara",date:"2180-05-18",code:"H5"},{id:4,name:"Pyrosphere",location:"Moon Xanthe",date:"2291-06-15",code:"P6"},{id:5,name:"Vulcanus",location:"Asteroid B-612",date:"2312-08-22",code:"V5"},{id:6,name:"Tarkon Fury",location:"Planet Drakonis",date:"2455-12-01",code:"T8"},{id:7,name:"Aether Plume",location:"Planet Ganymede",date:"2379-04-10",code:"A4"},{id:8,name:"Mount Zenith",location:"Planet Lumina",date:"2392-09-21",code:"Z6"}],ft=[{key:"cursor",label:"Cursor"},{key:"background",label:"Background"},{key:"color",label:"Color"},{key:"blur",label:"Blur"},{key:"glitch",label:"Glitch"}];function j({children:e,variant:t,className:r=""}){const n=w.useRef(null),i=w.useRef(null);w.useEffect(()=>{if(n.current)return i.current=new lt(n.current,{variant:t}),()=>{var o;(o=i.current)==null||o.destroy()}},[t]);const a=w.useCallback(()=>{var o;(o=i.current)==null||o.animate()},[]),s=w.useCallback(()=>{var o;(o=i.current)==null||o.animateOut()},[]);return c.jsx("span",{ref:n,className:r,onMouseEnter:a,onMouseLeave:s,style:f.hoverText,"data-text":e,children:e})}function ut({data:e,variant:t,index:r}){return c.jsxs("li",{style:f.listItem,className:"terminal-list-item",children:[c.jsx("span",{style:f.listNumber,children:String(r+1).padStart(2,"0")}),c.jsx(j,{variant:t,children:e.name}),c.jsx(j,{variant:t,children:e.location}),c.jsx(j,{variant:t,children:e.date}),c.jsx(j,{variant:t,children:e.code})]})}const ae=["SYSTEM INIT...","LOADING KERNEL v3.14.159","MEMORY CHECK: 640K OK","VOLCANIC DATABASE ONLINE","READY_"];function dt({onComplete:e}){const[t,r]=w.useState([]),[n,i]=w.useState(0),[a,s]=w.useState(0);return w.useEffect(()=>{if(n>=ae.length){const l=setTimeout(e,800);return()=>clearTimeout(l)}const o=ae[n];if(a<o.length){const l=setTimeout(()=>{r(u=>{const d=[...u];return d[n]=o.slice(0,a+1),d}),s(u=>u+1)},30+Math.random()*40);return()=>clearTimeout(l)}else{const l=setTimeout(()=>{i(u=>u+1),s(0)},200+Math.random()*300);return()=>clearTimeout(l)}},[n,a,e]),c.jsx("div",{style:{position:"fixed",inset:0,background:"#0a0a0a",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1e3,fontFamily:'"JetBrains Mono", monospace',color:"#00ff41"},children:c.jsx("div",{style:{maxWidth:500,padding:"2rem"},children:t.map((o,l)=>c.jsxs("div",{className:"boot-line",style:{marginBottom:"0.5rem",fontSize:14},children:[c.jsxs("span",{style:{color:"#666",marginRight:"1rem"},children:["[",String(l).padStart(2,"0"),"]"]}),o,l===n&&c.jsx("span",{className:"boot-cursor"})]},l))})})}function mt(){const[e,t]=w.useState("cursor"),[r,n]=w.useState(!1),[i,a]=w.useState(!0);w.useEffect(()=>{sessionStorage.getItem("terminal-booted")&&a(!1)},[]);const s=()=>{a(!1),sessionStorage.setItem("terminal-booted","true")};return i?c.jsx(dt,{onComplete:s}):c.jsxs("div",{style:f.container,className:`demo-${e} ${r?"crt-mode":""}`,children:[c.jsx("div",{style:f.scanlines,className:"scanlines"}),c.jsx(Ee,{to:"/",style:f.backButton,children:"← Back"}),c.jsxs("nav",{style:f.nav,children:[c.jsx("span",{style:f.navLabel,children:"Variant:"}),c.jsx("div",{style:f.variantButtons,children:ft.map(o=>c.jsx("button",{onClick:()=>t(o.key),style:{...f.variantButton,...e===o.key?f.variantButtonActive:{}},children:o.label},o.key))}),c.jsxs("div",{style:{marginLeft:"auto",display:"flex",alignItems:"center",gap:"0.5rem"},children:[c.jsx("span",{style:f.navLabel,children:"CRT:"}),c.jsx("button",{onClick:()=>n(!r),style:{...f.variantButton,...r?f.variantButtonActive:{},minWidth:50},children:r?"ON":"OFF"})]})]}),c.jsxs("main",{style:f.content,children:[c.jsx("h2",{style:f.sectionTitle,children:"Volcanic Eruptions Database"}),c.jsx("ul",{style:f.list,children:ct.map((o,l)=>c.jsx(ut,{data:o,variant:e,index:l},o.id))}),c.jsxs("div",{style:f.linksSection,children:[c.jsx("h3",{style:f.linksTitle,children:"Navigation Links"}),c.jsxs("div",{style:f.links,children:[c.jsx(j,{variant:e,children:"Projects"}),c.jsx(j,{variant:e,children:"About"}),c.jsx(j,{variant:e,children:"Contact"}),c.jsx(j,{variant:e,children:"Archive"})]})]})]}),c.jsx("div",{style:f.branding,children:"TERMINAL_V1.0"}),c.jsx("style",{children:`
        /* Base hover effect styles */
        .hover-effect {
          font-kerning: none;
          position: relative;
          white-space: nowrap;
          display: inline-block;
        }
        
        .hover-effect .word {
          white-space: nowrap;
        }
        
        .hover-effect .char {
          position: relative;
          display: inline-block;
        }
        
        /* Cursor variant - blinking cursor indicator */
        .hover-effect--cursor .char {
          --cursor-opacity: 0;
        }
        
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
        
        /* Background variant - sliding bg reveal */
        .hover-effect--bg {
          --bg-scale: 0;
        }
        
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
        
        /* Blur variant - frosted glass background */
        .hover-effect--blur {
          --bg-scale: 0;
        }
        
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
        
        /* Demo-specific color schemes */
        .demo-cursor {
          --bg-color: #fff;
          --text-color: #000;
          --accent-color: #000;
        }
        
        .demo-background {
          --bg-color: #252a33;
          --text-color: #c7c0b3;
          --accent-color: #5b6b85;
        }
        
        .demo-color {
          --bg-color: #1d2619;
          --text-color: #c5c5c5;
          --accent-color: #41483e;
        }
        
        .demo-blur {
          --bg-color: #0a0a0a;
          --text-color: rgba(255, 255, 255, 0.9);
          --accent-color: #2d2d2d;
        }
        
        .demo-glitch {
          --bg-color: #0d0d0d;
          --text-color: #00ff41;
          --accent-color: #003d0f;
        }
        
        /* Glitch effect styles */
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
        
        /* CRT mode */
        .crt-mode {
          border-radius: 20px;
          overflow: hidden;
        }
        
        .crt-mode::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
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
        .boot-line {
          overflow: hidden;
          white-space: nowrap;
        }
        
        .boot-cursor {
          display: inline-block;
          width: 0.6em;
          height: 1.1em;
          background: currentColor;
          margin-left: 2px;
          vertical-align: text-bottom;
          animation: blink 0.7s step-end infinite;
        }
        
        @keyframes blink {
          50% { opacity: 0; }
        }
        
        /* Responsive list */
        @media (max-width: 768px) {
          .terminal-list-item {
            grid-template-columns: 40px 1fr !important;
            gap: 0.5rem 1rem !important;
          }
          .terminal-list-item > span:nth-child(n+4) {
            display: none;
          }
        }
        
        @media (min-width: 769px) and (max-width: 1024px) {
          .terminal-list-item {
            grid-template-columns: 50px 1fr 1fr auto !important;
          }
          .terminal-list-item > span:nth-child(5) {
            display: none;
          }
        }
      `})]})}const f={container:{minHeight:"100vh",backgroundColor:"var(--bg-color, #0a0a0a)",color:"var(--text-color, #fff)",fontFamily:'"JetBrains Mono", "SF Mono", "Fira Code", monospace',textTransform:"uppercase",padding:"2rem",paddingTop:"100px",position:"relative",transition:"background-color 0.4s ease, color 0.4s ease"},scanlines:{position:"fixed",top:0,left:0,width:"100%",height:"100%",backgroundImage:"repeating-linear-gradient(transparent, transparent 4px, rgba(0,0,0,0.1) 5px)",backgroundSize:"auto 100%",pointerEvents:"none",zIndex:100},backButton:{position:"fixed",top:24,left:24,color:"var(--text-color)",opacity:.5,textDecoration:"none",fontSize:12,fontWeight:500,letterSpacing:"0.05em",zIndex:101,fontFamily:'"JetBrains Mono", monospace',textTransform:"uppercase"},nav:{position:"fixed",top:0,left:0,right:0,display:"flex",alignItems:"center",gap:"1rem",padding:"1rem 2rem",paddingLeft:"100px",background:"var(--bg-color)",borderBottom:"1px solid rgba(128, 128, 128, 0.2)",zIndex:50},navLabel:{fontSize:11,fontWeight:500,letterSpacing:"0.1em",opacity:.5},variantButtons:{display:"flex",gap:"0.5rem"},variantButton:{padding:"0.4rem 0.75rem",fontSize:11,fontWeight:500,letterSpacing:"0.05em",textTransform:"uppercase",color:"var(--text-color)",opacity:.5,background:"transparent",border:"1px solid rgba(128, 128, 128, 0.3)",cursor:"pointer",transition:"all 0.2s ease",fontFamily:'"JetBrains Mono", monospace'},variantButtonActive:{opacity:1,background:"rgba(128, 128, 128, 0.2)",borderColor:"rgba(128, 128, 128, 0.5)"},content:{maxWidth:"1000px",margin:"0 auto"},sectionTitle:{fontSize:11,fontWeight:500,letterSpacing:"0.15em",color:"var(--accent-color, rgba(255,255,255,0.4))",marginBottom:"1.5rem"},list:{listStyle:"none",padding:0,margin:0,display:"flex",flexDirection:"column"},listItem:{display:"grid",gridTemplateColumns:"50px 1fr 1fr 120px 60px",gap:"1rem 2rem",alignItems:"baseline",padding:"0.75rem 0",borderBottom:"1px solid rgba(128, 128, 128, 0.1)",fontSize:14},listNumber:{fontSize:12,fontWeight:600,opacity:.4},hoverText:{cursor:"pointer",lineHeight:1.4},linksSection:{marginTop:"4rem"},linksTitle:{fontSize:11,fontWeight:500,letterSpacing:"0.15em",color:"var(--accent-color, rgba(255,255,255,0.4))",marginBottom:"1.5rem"},links:{display:"flex",flexWrap:"wrap",gap:"2rem",fontSize:18},branding:{position:"fixed",bottom:24,right:24,fontSize:10,letterSpacing:"0.15em",opacity:.25,fontFamily:'"JetBrains Mono", monospace',zIndex:101}};export{mt as TerminalTextHover,mt as default};
