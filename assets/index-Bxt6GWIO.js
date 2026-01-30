var je=Object.defineProperty;var Ee=(e,t,r)=>t in e?je(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var L=(e,t,r)=>Ee(e,typeof t!="symbol"?t+"":t,r);import{r as m,j as c,L as Ae}from"./index-CIYZOgZF.js";import{g}from"./index-C8pce-KX.js";(function(){function e(){for(var n=arguments.length,i=0;i<n;i++){var a=i<0||arguments.length<=i?void 0:arguments[i];a.nodeType===1||a.nodeType===11?this.appendChild(a):this.appendChild(document.createTextNode(String(a)))}}function t(){for(;this.lastChild;)this.removeChild(this.lastChild);arguments.length&&this.append.apply(this,arguments)}function r(){for(var n=this.parentNode,i=arguments.length,a=new Array(i),o=0;o<i;o++)a[o]=arguments[o];var s=a.length;if(n)for(s||n.removeChild(this);s--;){var f=a[s];typeof f!="object"?f=this.ownerDocument.createTextNode(f):f.parentNode&&f.parentNode.removeChild(f),s?n.insertBefore(this.previousSibling,f):n.replaceChild(f,this)}}typeof Element<"u"&&(Element.prototype.append||(Element.prototype.append=e,DocumentFragment.prototype.append=e),Element.prototype.replaceChildren||(Element.prototype.replaceChildren=t,DocumentFragment.prototype.replaceChildren=t),Element.prototype.replaceWith||(Element.prototype.replaceWith=r,DocumentFragment.prototype.replaceWith=r))})();function Oe(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function Q(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function ee(e,t,r){return t&&Q(e.prototype,t),r&&Q(e,r),e}function Le(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function te(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(i){return Object.getOwnPropertyDescriptor(e,i).enumerable})),r.push.apply(r,n)}return r}function re(e){for(var t=1;t<arguments.length;t++){var r=arguments[t]!=null?arguments[t]:{};t%2?te(Object(r),!0).forEach(function(n){Le(e,n,r[n])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):te(Object(r)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))})}return e}function se(e,t){return Be(e)||Ne(e,t)||le(e,t)||De()}function x(e){return Me(e)||We(e)||le(e)||Ie()}function Me(e){if(Array.isArray(e))return X(e)}function Be(e){if(Array.isArray(e))return e}function We(e){if(typeof Symbol<"u"&&Symbol.iterator in Object(e))return Array.from(e)}function Ne(e,t){if(!(typeof Symbol>"u"||!(Symbol.iterator in Object(e)))){var r=[],n=!0,i=!1,a=void 0;try{for(var o=e[Symbol.iterator](),s;!(n=(s=o.next()).done)&&(r.push(s.value),!(t&&r.length===t));n=!0);}catch(f){i=!0,a=f}finally{try{!n&&o.return!=null&&o.return()}finally{if(i)throw a}}return r}}function le(e,t){if(e){if(typeof e=="string")return X(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);if(r==="Object"&&e.constructor&&(r=e.constructor.name),r==="Map"||r==="Set")return Array.from(e);if(r==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return X(e,t)}}function X(e,t){(t==null||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function Ie(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function De(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function M(e,t){return Object.getOwnPropertyNames(Object(e)).reduce(function(r,n){var i=Object.getOwnPropertyDescriptor(Object(e),n),a=Object.getOwnPropertyDescriptor(Object(t),n);return Object.defineProperty(r,n,a||i)},{})}function D(e){return typeof e=="string"}function K(e){return Array.isArray(e)}function H(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},t=M(e),r;return t.types!==void 0?r=t.types:t.split!==void 0&&(r=t.split),r!==void 0&&(t.types=(D(r)||K(r)?String(r):"").split(",").map(function(n){return String(n).trim()}).filter(function(n){return/((line)|(word)|(char))/i.test(n)})),(t.absolute||t.position)&&(t.absolute=t.absolute||/absolute/.test(e.position)),t}function q(e){var t=D(e)||K(e)?String(e):"";return{none:!t,lines:/line/i.test(t),words:/word/i.test(t),chars:/char/i.test(t)}}function V(e){return e!==null&&typeof e=="object"}function Re(e){return V(e)&&/^(1|3|11)$/.test(e.nodeType)}function _e(e){return typeof e=="number"&&e>-1&&e%1===0}function Pe(e){return V(e)&&_e(e.length)}function W(e){return K(e)?e:e==null?[]:Pe(e)?Array.prototype.slice.call(e):[e]}function ne(e){var t=e;return D(e)&&(/^(#[a-z]\w+)$/.test(e.trim())?t=document.getElementById(e.trim().slice(1)):t=document.querySelectorAll(e)),W(t).reduce(function(r,n){return[].concat(x(r),x(W(n).filter(Re)))},[])}var He=Object.entries,F="_splittype",C={},ze=0;function T(e,t,r){if(!V(e))return console.warn("[data.set] owner is not an object"),null;var n=e[F]||(e[F]=++ze),i=C[n]||(C[n]={});return r===void 0?t&&Object.getPrototypeOf(t)===Object.prototype&&(C[n]=re(re({},i),t)):t!==void 0&&(i[t]=r),r}function B(e,t){var r=V(e)?e[F]:null,n=r&&C[r]||{};return n}function ce(e){var t=e&&e[F];t&&(delete e[t],delete C[t])}function Fe(){Object.keys(C).forEach(function(e){delete C[e]})}function Ve(){He(C).forEach(function(e){var t=se(e,2),r=t[0],n=t[1],i=n.isRoot,a=n.isSplit;(!i||!a)&&(C[r]=null,delete C[r])})}function $e(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:" ",r=e?String(e):"";return r.trim().replace(/\s+/g," ").split(t)}var U="\\ud800-\\udfff",fe="\\u0300-\\u036f\\ufe20-\\ufe23",ue="\\u20d0-\\u20f0",de="\\ufe0e\\ufe0f",Xe="[".concat(U,"]"),Y="[".concat(fe).concat(ue,"]"),G="\\ud83c[\\udffb-\\udfff]",Ye="(?:".concat(Y,"|").concat(G,")"),he="[^".concat(U,"]"),pe="(?:\\ud83c[\\udde6-\\uddff]){2}",me="[\\ud800-\\udbff][\\udc00-\\udfff]",ge="\\u200d",ve="".concat(Ye,"?"),ye="[".concat(de,"]?"),Ge="(?:"+ge+"(?:"+[he,pe,me].join("|")+")"+ye+ve+")*",Je=ye+ve+Ge,Ke="(?:".concat(["".concat(he).concat(Y,"?"),Y,pe,me,Xe].join("|"),`
)`),qe=RegExp("".concat(G,"(?=").concat(G,")|").concat(Ke).concat(Je),"g"),Ue=[ge,U,fe,ue,de],Ze=RegExp("[".concat(Ue.join(""),"]"));function Qe(e){return e.split("")}function be(e){return Ze.test(e)}function et(e){return e.match(qe)||[]}function tt(e){return be(e)?et(e):Qe(e)}function rt(e){return e==null?"":String(e)}function nt(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:"";return e=rt(e),e&&D(e)&&!t&&be(e)?tt(e):e.split(t)}function J(e,t){var r=document.createElement(e);return t&&Object.keys(t).forEach(function(n){var i=t[n],a=D(i)?i.trim():i;a===null||a===""||(n==="children"?r.append.apply(r,x(W(a))):r.setAttribute(n,a))}),r}var Z={splitClass:"",lineClass:"line",wordClass:"word",charClass:"char",types:["lines","words","chars"],absolute:!1,tagName:"div"};function it(e,t){t=M(Z,t);var r=q(t.types),n=t.tagName,i=e.nodeValue,a=document.createDocumentFragment(),o=[],s=[];return/^\s/.test(i)&&a.append(" "),o=$e(i).reduce(function(f,l,u,d){var p,w;return r.chars&&(w=nt(l).map(function(S){var k=J(n,{class:"".concat(t.splitClass," ").concat(t.charClass),style:"display: inline-block;",children:S});return T(k,"isChar",!0),s=[].concat(x(s),[k]),k})),r.words||r.lines?(p=J(n,{class:"".concat(t.wordClass," ").concat(t.splitClass),style:"display: inline-block; ".concat(r.words&&t.absolute?"position: relative;":""),children:r.chars?w:l}),T(p,{isWord:!0,isWordStart:!0,isWordEnd:!0}),a.appendChild(p)):w.forEach(function(S){a.appendChild(S)}),u<d.length-1&&a.append(" "),r.words?f.concat(p):f},[]),/\s$/.test(i)&&a.append(" "),e.replaceWith(a),{words:o,chars:s}}function xe(e,t){var r=e.nodeType,n={words:[],chars:[]};if(!/(1|3|11)/.test(r))return n;if(r===3&&/\S/.test(e.nodeValue))return it(e,t);var i=W(e.childNodes);if(i.length&&(T(e,"isSplit",!0),!B(e).isRoot)){e.style.display="inline-block",e.style.position="relative";var a=e.nextSibling,o=e.previousSibling,s=e.textContent||"",f=a?a.textContent:" ",l=o?o.textContent:" ";T(e,{isWordEnd:/\s$/.test(s)||/^\s/.test(f),isWordStart:/^\s/.test(s)||/\s$/.test(l)})}return i.reduce(function(u,d){var p=xe(d,t),w=p.words,S=p.chars;return{words:[].concat(x(u.words),x(w)),chars:[].concat(x(u.chars),x(S))}},n)}function at(e,t,r,n){if(!r.absolute)return{top:t?e.offsetTop:null};var i=e.offsetParent,a=se(n,2),o=a[0],s=a[1],f=0,l=0;if(i&&i!==document.body){var u=i.getBoundingClientRect();f=u.x+o,l=u.y+s}var d=e.getBoundingClientRect(),p=d.width,w=d.height,S=d.x,k=d.y,R=k+s-l,$=S+o-f;return{width:p,height:w,top:R,left:$}}function we(e){B(e).isWord?(ce(e),e.replaceWith.apply(e,x(e.childNodes))):W(e.children).forEach(function(t){return we(t)})}var ot=function(){return document.createDocumentFragment()};function st(e,t,r){var n=q(t.types),i=t.tagName,a=e.getElementsByTagName("*"),o=[],s=[],f=null,l,u,d,p=[],w=e.parentElement,S=e.nextElementSibling,k=ot(),R=window.getComputedStyle(e),$=R.textAlign,Ce=parseFloat(R.fontSize),Se=Ce*.2;return t.absolute&&(d={left:e.offsetLeft,top:e.offsetTop,width:e.offsetWidth},u=e.offsetWidth,l=e.offsetHeight,T(e,{cssWidth:e.style.width,cssHeight:e.style.height})),W(a).forEach(function(v){var y=v.parentElement===e,b=at(v,y,t,r),E=b.width,I=b.height,A=b.top,O=b.left;/^br$/i.test(v.nodeName)||(n.lines&&y&&((f===null||A-f>=Se)&&(f=A,o.push(s=[])),s.push(v)),t.absolute&&T(v,{top:A,left:O,width:E,height:I}))}),w&&w.removeChild(e),n.lines&&(p=o.map(function(v){var y=J(i,{class:"".concat(t.splitClass," ").concat(t.lineClass),style:"display: block; text-align: ".concat($,"; width: 100%;")});T(y,"isLine",!0);var b={height:0,top:1e4};return k.appendChild(y),v.forEach(function(E,I,A){var O=B(E),_=O.isWordEnd,P=O.top,Te=O.height,ke=A[I+1];b.height=Math.max(b.height,Te),b.top=Math.min(b.top,P),y.appendChild(E),_&&B(ke).isWordStart&&y.append(" ")}),t.absolute&&T(y,{height:b.height,top:b.top}),y}),n.words||we(k),e.replaceChildren(k)),t.absolute&&(e.style.width="".concat(e.style.width||u,"px"),e.style.height="".concat(l,"px"),W(a).forEach(function(v){var y=B(v),b=y.isLine,E=y.top,I=y.left,A=y.width,O=y.height,_=B(v.parentElement),P=!b&&_.isLine;v.style.top="".concat(P?E-_.top:E,"px"),v.style.left=b?"".concat(d.left,"px"):"".concat(I-(P?d.left:0),"px"),v.style.height="".concat(O,"px"),v.style.width=b?"".concat(d.width,"px"):"".concat(A,"px"),v.style.position="absolute"})),w&&(S?w.insertBefore(e,S):w.appendChild(e)),p}var N=M(Z,{}),lt=function(){ee(e,null,[{key:"clearData",value:function(){Fe()}},{key:"setDefaults",value:function(r){return N=M(N,H(r)),Z}},{key:"revert",value:function(r){ne(r).forEach(function(n){var i=B(n),a=i.isSplit,o=i.html,s=i.cssWidth,f=i.cssHeight;a&&(n.innerHTML=o,n.style.width=s||"",n.style.height=f||"",ce(n))})}},{key:"create",value:function(r,n){return new e(r,n)}},{key:"data",get:function(){return C}},{key:"defaults",get:function(){return N},set:function(r){N=M(N,H(r))}}]);function e(t,r){Oe(this,e),this.isSplit=!1,this.settings=M(N,H(r)),this.elements=ne(t),this.split()}return ee(e,[{key:"split",value:function(r){var n=this;this.revert(),this.elements.forEach(function(o){T(o,"html",o.innerHTML)}),this.lines=[],this.words=[],this.chars=[];var i=[window.pageXOffset,window.pageYOffset];r!==void 0&&(this.settings=M(this.settings,H(r)));var a=q(this.settings.types);a.none||(this.elements.forEach(function(o){T(o,"isRoot",!0);var s=xe(o,n.settings),f=s.words,l=s.chars;n.words=[].concat(x(n.words),x(f)),n.chars=[].concat(x(n.chars),x(l))}),this.elements.forEach(function(o){if(a.lines||n.settings.absolute){var s=st(o,n.settings,i);n.lines=[].concat(x(n.lines),x(s))}}),this.isSplit=!0,window.scrollTo(i[0],i[1]),Ve())}},{key:"revert",value:function(){this.isSplit&&(this.lines=null,this.words=null,this.chars=null,this.isSplit=!1),e.revert(this.elements)}}]),e}();const ie=["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","!","@","#","$","%","^","&","*","-","_","+","=",";",":","<",">",",","/","\\","|","~","`"],ae=["#22a3a9","#4ca922","#a99222","#ff6b6b","#6366f1","#ec4899"];class ct{constructor(t,r={}){L(this,"element");L(this,"splitter",null);L(this,"originalChars",[]);L(this,"originalColors",[]);L(this,"variant");L(this,"options");this.element=t,this.variant=r.variant||"cursor",this.options={scrambleSpeed:r.scrambleSpeed||.03,scrambleCount:r.scrambleCount||3,staggerDelay:r.staggerDelay||.07,repeatDelay:r.repeatDelay||.04},this.init()}init(){this.splitter=new lt(this.element,{types:"words,chars",tagName:"span"});const t=this.getChars();this.originalChars=t.map(r=>r.innerHTML),this.originalColors=t.map(r=>getComputedStyle(r).color),this.element.classList.add("hover-effect"),this.variant==="cursor"?this.element.classList.add("hover-effect--cursor"):this.variant==="background"?this.element.classList.add("hover-effect--bg"):this.variant==="blur"?this.element.classList.add("hover-effect--blur"):this.variant==="glitch"&&this.element.classList.add("hover-effect--glitch")}getChars(){var t;return((t=this.splitter)==null?void 0:t.chars)||[]}animate(){this.reset();const t=this.getChars(),{scrambleSpeed:r,scrambleCount:n,staggerDelay:i,repeatDelay:a}=this.options;t.forEach((o,s)=>{const f=o.innerHTML,l=this.originalColors[s];let u=0;g.fromTo(o,{opacity:0},{duration:r,opacity:1,delay:(s+1)*i,repeat:n,repeatDelay:a,repeatRefresh:!0,onStart:()=>{this.variant==="cursor"&&g.set(o,{"--cursor-opacity":1})},onRepeat:()=>{u++,this.variant==="cursor"&&u===1&&g.set(o,{"--cursor-opacity":0})},onComplete:()=>{g.set(o,{innerHTML:f,color:l,delay:r})},innerHTML:()=>{const d=ie[Math.floor(Math.random()*ie.length)];if(this.variant==="color"){const p=ae[Math.floor(Math.random()*ae.length)];g.set(o,{color:p})}return d}})}),(this.variant==="background"||this.variant==="blur")&&g.fromTo(this.element,{"--bg-scale":0},{duration:1,ease:"expo.out","--bg-scale":1}),this.variant==="glitch"&&(g.to(this.element,{duration:.1,"--glitch-intensity":1,ease:"power2.out"}),g.timeline({repeat:3}).to(this.element,{duration:.05,"--glitch-x":()=>(Math.random()-.5)*8,"--glitch-skew":()=>(Math.random()-.5)*5,ease:"none"}).to(this.element,{duration:.05,"--glitch-x":0,"--glitch-skew":0,ease:"none"}),g.to(this.element,{duration:.3,delay:.4,"--glitch-intensity":0,ease:"power2.out"}))}animateOut(){(this.variant==="background"||this.variant==="blur")&&(g.killTweensOf(this.element),g.to(this.element,{duration:.6,ease:"power4.out","--bg-scale":0})),this.variant==="glitch"&&(g.killTweensOf(this.element),g.to(this.element,{duration:.2,"--glitch-intensity":0,"--glitch-x":0,"--glitch-skew":0}))}reset(){this.getChars().forEach((r,n)=>{g.killTweensOf(r),r.innerHTML=this.originalChars[n],r.style.color=this.originalColors[n]}),g.killTweensOf(this.element),g.set(this.element,{"--bg-scale":0})}destroy(){var t;this.reset(),(t=this.splitter)==null||t.revert(),this.element.classList.remove("hover-effect","hover-effect--cursor","hover-effect--bg","hover-effect--blur","hover-effect--glitch")}}const ft=[{id:1,name:"Mount Vespera",location:"Planet Thalassa",date:"2157-03-14",code:"V6"},{id:2,name:"Kraxion",location:"Exo-Planet Zyra",date:"2243-11-09",code:"K7"},{id:3,name:"Helion Peak",location:"Planet Elara",date:"2180-05-18",code:"H5"},{id:4,name:"Pyrosphere",location:"Moon Xanthe",date:"2291-06-15",code:"P6"},{id:5,name:"Vulcanus",location:"Asteroid B-612",date:"2312-08-22",code:"V5"},{id:6,name:"Tarkon Fury",location:"Planet Drakonis",date:"2455-12-01",code:"T8"},{id:7,name:"Aether Plume",location:"Planet Ganymede",date:"2379-04-10",code:"A4"},{id:8,name:"Mount Zenith",location:"Planet Lumina",date:"2392-09-21",code:"Z6"}],ut=[{key:"cursor",label:"Cursor"},{key:"background",label:"Background"},{key:"color",label:"Color"},{key:"blur",label:"Blur"},{key:"glitch",label:"Glitch"}],z=typeof window<"u"&&window.matchMedia("(hover: hover)").matches;function j({children:e,variant:t,className:r=""}){const n=m.useRef(null),i=m.useRef(null),a=m.useRef(!1);m.useEffect(()=>{if(n.current){if(i.current=new ct(n.current,{variant:t}),!z){const l=new IntersectionObserver(u=>{u.forEach(d=>{d.isIntersecting&&!a.current&&(a.current=!0,setTimeout(()=>{var p;(p=i.current)==null||p.animate()},Math.random()*300))})},{threshold:.5,rootMargin:"-50px"});return l.observe(n.current),()=>{var u;l.disconnect(),(u=i.current)==null||u.destroy()}}return()=>{var l;(l=i.current)==null||l.destroy()}}},[t]);const o=m.useCallback(()=>{var l;z&&((l=i.current)==null||l.animate())},[]),s=m.useCallback(()=>{var l;z&&((l=i.current)==null||l.animateOut())},[]),f=m.useCallback(()=>{var l;z||(l=i.current)==null||l.animate()},[]);return c.jsx("span",{ref:n,className:r,onMouseEnter:o,onMouseLeave:s,onClick:f,style:h.hoverText,"data-text":e,children:e})}function dt({data:e,variant:t,index:r}){return c.jsxs("li",{style:h.listItem,className:"terminal-list-item",children:[c.jsx("span",{style:h.listNumber,children:String(r+1).padStart(2,"0")}),c.jsx(j,{variant:t,children:e.name}),c.jsx(j,{variant:t,children:e.location}),c.jsx(j,{variant:t,children:e.date}),c.jsx(j,{variant:t,children:e.code})]})}const oe=["SYSTEM INIT...","LOADING KERNEL v3.14.159","MEMORY CHECK: 640K OK","VOLCANIC DATABASE ONLINE","READY_"];function ht({onComplete:e}){const[t,r]=m.useState([""]),[n,i]=m.useState(0),[a,o]=m.useState(0),[s,f]=m.useState(!1);return m.useEffect(()=>{const l=setTimeout(()=>f(!0),100);return()=>clearTimeout(l)},[]),m.useEffect(()=>{if(!s)return;if(n>=oe.length){const u=setTimeout(e,800);return()=>clearTimeout(u)}const l=oe[n];if(a<l.length){const u=setTimeout(()=>{r(d=>{const p=[...d];return p[n]=l.slice(0,a+1),p}),o(d=>d+1)},30+Math.random()*40);return()=>clearTimeout(u)}else{const u=setTimeout(()=>{r(d=>[...d,""]),i(d=>d+1),o(0)},200+Math.random()*300);return()=>clearTimeout(u)}},[s,n,a,e]),c.jsx("div",{style:{position:"fixed",inset:0,background:"#0a0a0a",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1e3,fontFamily:'"JetBrains Mono", monospace',color:"#00ff41"},children:c.jsx("div",{style:{maxWidth:500,padding:"2rem"},children:t.map((l,u)=>c.jsxs("div",{className:"boot-line",style:{marginBottom:"0.5rem",fontSize:14},children:[c.jsxs("span",{style:{color:"#666",marginRight:"1rem"},children:["[",String(u).padStart(2,"0"),"]"]}),l,u===n&&c.jsx("span",{className:"boot-cursor"})]},u))})})}function vt(){const[e,t]=m.useState("cursor"),[r,n]=m.useState(!1),[i,a]=m.useState(!0);m.useEffect(()=>{sessionStorage.getItem("terminal-booted")&&a(!1)},[]);const o=()=>{a(!1),sessionStorage.setItem("terminal-booted","true")};return i?c.jsx(ht,{onComplete:o}):c.jsxs("div",{style:h.container,className:`demo-${e} ${r?"crt-mode":""}`,children:[c.jsx("div",{style:h.scanlines,className:"scanlines"}),c.jsx(Ae,{to:"/",style:h.backButton,children:"← Back"}),c.jsxs("nav",{style:h.nav,children:[c.jsx("span",{style:h.navLabel,children:"Variant:"}),c.jsx("div",{style:h.variantButtons,children:ut.map(s=>c.jsx("button",{onClick:()=>t(s.key),style:{...h.variantButton,...e===s.key?h.variantButtonActive:{}},children:s.label},s.key))}),c.jsxs("div",{style:{marginLeft:"auto",display:"flex",alignItems:"center",gap:"0.5rem"},children:[c.jsx("span",{style:h.navLabel,children:"CRT:"}),c.jsx("button",{onClick:()=>n(!r),style:{...h.variantButton,...r?h.variantButtonActive:{},minWidth:50},children:r?"ON":"OFF"})]})]}),c.jsxs("main",{style:h.content,children:[c.jsx("h2",{style:h.sectionTitle,children:"Volcanic Eruptions Database"}),c.jsx("ul",{style:h.list,children:ft.map((s,f)=>c.jsx(dt,{data:s,variant:e,index:f},s.id))}),c.jsxs("div",{style:h.linksSection,children:[c.jsx("h3",{style:h.linksTitle,children:"Navigation Links"}),c.jsxs("div",{style:h.links,children:[c.jsx(j,{variant:e,children:"Projects"}),c.jsx(j,{variant:e,children:"About"}),c.jsx(j,{variant:e,children:"Contact"}),c.jsx(j,{variant:e,children:"Archive"})]})]})]}),c.jsx("div",{style:h.branding,children:"TERMINAL_V1.0"}),c.jsx("style",{children:`
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
      `})]})}const h={container:{minHeight:"100vh",backgroundColor:"var(--bg-color, #0a0a0a)",color:"var(--text-color, #fff)",fontFamily:'"JetBrains Mono", "SF Mono", "Fira Code", monospace',textTransform:"uppercase",padding:"2rem",paddingTop:"100px",position:"relative",transition:"background-color 0.4s ease, color 0.4s ease"},scanlines:{position:"fixed",top:0,left:0,width:"100%",height:"100%",backgroundImage:"repeating-linear-gradient(transparent, transparent 4px, rgba(0,0,0,0.1) 5px)",backgroundSize:"auto 100%",pointerEvents:"none",zIndex:100},backButton:{position:"fixed",top:24,left:24,color:"var(--text-color)",opacity:.5,textDecoration:"none",fontSize:12,fontWeight:500,letterSpacing:"0.05em",zIndex:101,fontFamily:'"JetBrains Mono", monospace',textTransform:"uppercase"},nav:{position:"fixed",top:0,left:0,right:0,display:"flex",alignItems:"center",gap:"1rem",padding:"1rem 2rem",paddingLeft:"100px",background:"var(--bg-color)",borderBottom:"1px solid rgba(128, 128, 128, 0.2)",zIndex:50},navLabel:{fontSize:11,fontWeight:500,letterSpacing:"0.1em",opacity:.5},variantButtons:{display:"flex",gap:"0.5rem"},variantButton:{padding:"0.4rem 0.75rem",fontSize:11,fontWeight:500,letterSpacing:"0.05em",textTransform:"uppercase",color:"var(--text-color)",opacity:.5,background:"transparent",border:"1px solid rgba(128, 128, 128, 0.3)",cursor:"pointer",transition:"all 0.2s ease",fontFamily:'"JetBrains Mono", monospace'},variantButtonActive:{opacity:1,background:"rgba(128, 128, 128, 0.2)",borderColor:"rgba(128, 128, 128, 0.5)"},content:{maxWidth:"1000px",margin:"0 auto"},sectionTitle:{fontSize:11,fontWeight:500,letterSpacing:"0.15em",color:"var(--accent-color, rgba(255,255,255,0.4))",marginBottom:"1.5rem"},list:{listStyle:"none",padding:0,margin:0,display:"flex",flexDirection:"column"},listItem:{display:"grid",gridTemplateColumns:"50px 1fr 1fr 120px 60px",gap:"1rem 2rem",alignItems:"baseline",padding:"0.75rem 0",borderBottom:"1px solid rgba(128, 128, 128, 0.1)",fontSize:14},listNumber:{fontSize:12,fontWeight:600,opacity:.4},hoverText:{cursor:"pointer",lineHeight:1.4},linksSection:{marginTop:"4rem"},linksTitle:{fontSize:11,fontWeight:500,letterSpacing:"0.15em",color:"var(--accent-color, rgba(255,255,255,0.4))",marginBottom:"1.5rem"},links:{display:"flex",flexWrap:"wrap",gap:"2rem",fontSize:18},branding:{position:"fixed",bottom:24,right:24,fontSize:10,letterSpacing:"0.15em",opacity:.25,fontFamily:'"JetBrains Mono", monospace',zIndex:101}};export{vt as TerminalTextHover,vt as default};
