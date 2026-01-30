var je=Object.defineProperty;var Te=(e,t,r)=>t in e?je(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var O=(e,t,r)=>Te(e,typeof t!="symbol"?t+"":t,r);import{r as P,j as c,L as ke}from"./index-BgZr9toE.js";import{g as x}from"./index-C8pce-KX.js";(function(){function e(){for(var n=arguments.length,i=0;i<n;i++){var a=i<0||arguments.length<=i?void 0:arguments[i];a.nodeType===1||a.nodeType===11?this.appendChild(a):this.appendChild(document.createTextNode(String(a)))}}function t(){for(;this.lastChild;)this.removeChild(this.lastChild);arguments.length&&this.append.apply(this,arguments)}function r(){for(var n=this.parentNode,i=arguments.length,a=new Array(i),o=0;o<i;o++)a[o]=arguments[o];var s=a.length;if(n)for(s||n.removeChild(this);s--;){var l=a[s];typeof l!="object"?l=this.ownerDocument.createTextNode(l):l.parentNode&&l.parentNode.removeChild(l),s?n.insertBefore(this.previousSibling,l):n.replaceChild(l,this)}}typeof Element<"u"&&(Element.prototype.append||(Element.prototype.append=e,DocumentFragment.prototype.append=e),Element.prototype.replaceChildren||(Element.prototype.replaceChildren=t,DocumentFragment.prototype.replaceChildren=t),Element.prototype.replaceWith||(Element.prototype.replaceWith=r,DocumentFragment.prototype.replaceWith=r))})();function Ee(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function K(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function Q(e,t,r){return t&&K(e.prototype,t),r&&K(e,r),e}function Ae(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function ee(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(i){return Object.getOwnPropertyDescriptor(e,i).enumerable})),r.push.apply(r,n)}return r}function te(e){for(var t=1;t<arguments.length;t++){var r=arguments[t]!=null?arguments[t]:{};t%2?ee(Object(r),!0).forEach(function(n){Ae(e,n,r[n])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):ee(Object(r)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))})}return e}function ae(e,t){return Le(e)||Me(e,t)||oe(e,t)||Pe()}function m(e){return Oe(e)||We(e)||oe(e)||Be()}function Oe(e){if(Array.isArray(e))return $(e)}function Le(e){if(Array.isArray(e))return e}function We(e){if(typeof Symbol<"u"&&Symbol.iterator in Object(e))return Array.from(e)}function Me(e,t){if(!(typeof Symbol>"u"||!(Symbol.iterator in Object(e)))){var r=[],n=!0,i=!1,a=void 0;try{for(var o=e[Symbol.iterator](),s;!(n=(s=o.next()).done)&&(r.push(s.value),!(t&&r.length===t));n=!0);}catch(l){i=!0,a=l}finally{try{!n&&o.return!=null&&o.return()}finally{if(i)throw a}}return r}}function oe(e,t){if(e){if(typeof e=="string")return $(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);if(r==="Object"&&e.constructor&&(r=e.constructor.name),r==="Map"||r==="Set")return Array.from(e);if(r==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return $(e,t)}}function $(e,t){(t==null||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function Be(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function Pe(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function L(e,t){return Object.getOwnPropertyNames(Object(e)).reduce(function(r,n){var i=Object.getOwnPropertyDescriptor(Object(e),n),a=Object.getOwnPropertyDescriptor(Object(t),n);return Object.defineProperty(r,n,a||i)},{})}function D(e){return typeof e=="string"}function Y(e){return Array.isArray(e)}function I(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},t=L(e),r;return t.types!==void 0?r=t.types:t.split!==void 0&&(r=t.split),r!==void 0&&(t.types=(D(r)||Y(r)?String(r):"").split(",").map(function(n){return String(n).trim()}).filter(function(n){return/((line)|(word)|(char))/i.test(n)})),(t.absolute||t.position)&&(t.absolute=t.absolute||/absolute/.test(e.position)),t}function Z(e){var t=D(e)||Y(e)?String(e):"";return{none:!t,lines:/line/i.test(t),words:/word/i.test(t),chars:/char/i.test(t)}}function V(e){return e!==null&&typeof e=="object"}function _e(e){return V(e)&&/^(1|3|11)$/.test(e.nodeType)}function De(e){return typeof e=="number"&&e>-1&&e%1===0}function Ne(e){return V(e)&&De(e.length)}function M(e){return Y(e)?e:e==null?[]:Ne(e)?Array.prototype.slice.call(e):[e]}function re(e){var t=e;return D(e)&&(/^(#[a-z]\w+)$/.test(e.trim())?t=document.getElementById(e.trim().slice(1)):t=document.querySelectorAll(e)),M(t).reduce(function(r,n){return[].concat(m(r),m(M(n).filter(_e)))},[])}var Re=Object.entries,z="_splittype",w={},He=0;function S(e,t,r){if(!V(e))return console.warn("[data.set] owner is not an object"),null;var n=e[z]||(e[z]=++He),i=w[n]||(w[n]={});return r===void 0?t&&Object.getPrototypeOf(t)===Object.prototype&&(w[n]=te(te({},i),t)):t!==void 0&&(i[t]=r),r}function W(e,t){var r=V(e)?e[z]:null,n=r&&w[r]||{};return n}function se(e){var t=e&&e[z];t&&(delete e[t],delete w[t])}function Ie(){Object.keys(w).forEach(function(e){delete w[e]})}function ze(){Re(w).forEach(function(e){var t=ae(e,2),r=t[0],n=t[1],i=n.isRoot,a=n.isSplit;(!i||!a)&&(w[r]=null,delete w[r])})}function Ve(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:" ",r=e?String(e):"";return r.trim().replace(/\s+/g," ").split(t)}var q="\\ud800-\\udfff",le="\\u0300-\\u036f\\ufe20-\\ufe23",ce="\\u20d0-\\u20f0",ue="\\ufe0e\\ufe0f",Fe="[".concat(q,"]"),J="[".concat(le).concat(ce,"]"),U="\\ud83c[\\udffb-\\udfff]",$e="(?:".concat(J,"|").concat(U,")"),fe="[^".concat(q,"]"),de="(?:\\ud83c[\\udde6-\\uddff]){2}",pe="[\\ud800-\\udbff][\\udc00-\\udfff]",he="\\u200d",me="".concat($e,"?"),ge="[".concat(ue,"]?"),Je="(?:"+he+"(?:"+[fe,de,pe].join("|")+")"+ge+me+")*",Ue=ge+me+Je,Xe="(?:".concat(["".concat(fe).concat(J,"?"),J,de,pe,Fe].join("|"),`
)`),Ye=RegExp("".concat(U,"(?=").concat(U,")|").concat(Xe).concat(Ue),"g"),Ze=[he,q,le,ce,ue],qe=RegExp("[".concat(Ze.join(""),"]"));function Ge(e){return e.split("")}function ve(e){return qe.test(e)}function Ke(e){return e.match(Ye)||[]}function Qe(e){return ve(e)?Ke(e):Ge(e)}function et(e){return e==null?"":String(e)}function tt(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:"";return e=et(e),e&&D(e)&&!t&&ve(e)?Qe(e):e.split(t)}function X(e,t){var r=document.createElement(e);return t&&Object.keys(t).forEach(function(n){var i=t[n],a=D(i)?i.trim():i;a===null||a===""||(n==="children"?r.append.apply(r,m(M(a))):r.setAttribute(n,a))}),r}var G={splitClass:"",lineClass:"line",wordClass:"word",charClass:"char",types:["lines","words","chars"],absolute:!1,tagName:"div"};function rt(e,t){t=L(G,t);var r=Z(t.types),n=t.tagName,i=e.nodeValue,a=document.createDocumentFragment(),o=[],s=[];return/^\s/.test(i)&&a.append(" "),o=Ve(i).reduce(function(l,g,y,f){var v,b;return r.chars&&(b=tt(g).map(function(C){var j=X(n,{class:"".concat(t.splitClass," ").concat(t.charClass),style:"display: inline-block;",children:C});return S(j,"isChar",!0),s=[].concat(m(s),[j]),j})),r.words||r.lines?(v=X(n,{class:"".concat(t.wordClass," ").concat(t.splitClass),style:"display: inline-block; ".concat(r.words&&t.absolute?"position: relative;":""),children:r.chars?b:g}),S(v,{isWord:!0,isWordStart:!0,isWordEnd:!0}),a.appendChild(v)):b.forEach(function(C){a.appendChild(C)}),y<f.length-1&&a.append(" "),r.words?l.concat(v):l},[]),/\s$/.test(i)&&a.append(" "),e.replaceWith(a),{words:o,chars:s}}function ye(e,t){var r=e.nodeType,n={words:[],chars:[]};if(!/(1|3|11)/.test(r))return n;if(r===3&&/\S/.test(e.nodeValue))return rt(e,t);var i=M(e.childNodes);if(i.length&&(S(e,"isSplit",!0),!W(e).isRoot)){e.style.display="inline-block",e.style.position="relative";var a=e.nextSibling,o=e.previousSibling,s=e.textContent||"",l=a?a.textContent:" ",g=o?o.textContent:" ";S(e,{isWordEnd:/\s$/.test(s)||/^\s/.test(l),isWordStart:/^\s/.test(s)||/\s$/.test(g)})}return i.reduce(function(y,f){var v=ye(f,t),b=v.words,C=v.chars;return{words:[].concat(m(y.words),m(b)),chars:[].concat(m(y.chars),m(C))}},n)}function nt(e,t,r,n){if(!r.absolute)return{top:t?e.offsetTop:null};var i=e.offsetParent,a=ae(n,2),o=a[0],s=a[1],l=0,g=0;if(i&&i!==document.body){var y=i.getBoundingClientRect();l=y.x+o,g=y.y+s}var f=e.getBoundingClientRect(),v=f.width,b=f.height,C=f.x,j=f.y,N=j+s-g,F=C+o-l;return{width:v,height:b,top:N,left:F}}function be(e){W(e).isWord?(se(e),e.replaceWith.apply(e,m(e.childNodes))):M(e.children).forEach(function(t){return be(t)})}var it=function(){return document.createDocumentFragment()};function at(e,t,r){var n=Z(t.types),i=t.tagName,a=e.getElementsByTagName("*"),o=[],s=[],l=null,g,y,f,v=[],b=e.parentElement,C=e.nextElementSibling,j=it(),N=window.getComputedStyle(e),F=N.textAlign,xe=parseFloat(N.fontSize),we=xe*.2;return t.absolute&&(f={left:e.offsetLeft,top:e.offsetTop,width:e.offsetWidth},y=e.offsetWidth,g=e.offsetHeight,S(e,{cssWidth:e.style.width,cssHeight:e.style.height})),M(a).forEach(function(d){var p=d.parentElement===e,h=nt(d,p,t,r),k=h.width,_=h.height,E=h.top,A=h.left;/^br$/i.test(d.nodeName)||(n.lines&&p&&((l===null||E-l>=we)&&(l=E,o.push(s=[])),s.push(d)),t.absolute&&S(d,{top:E,left:A,width:k,height:_}))}),b&&b.removeChild(e),n.lines&&(v=o.map(function(d){var p=X(i,{class:"".concat(t.splitClass," ").concat(t.lineClass),style:"display: block; text-align: ".concat(F,"; width: 100%;")});S(p,"isLine",!0);var h={height:0,top:1e4};return j.appendChild(p),d.forEach(function(k,_,E){var A=W(k),R=A.isWordEnd,H=A.top,Ce=A.height,Se=E[_+1];h.height=Math.max(h.height,Ce),h.top=Math.min(h.top,H),p.appendChild(k),R&&W(Se).isWordStart&&p.append(" ")}),t.absolute&&S(p,{height:h.height,top:h.top}),p}),n.words||be(j),e.replaceChildren(j)),t.absolute&&(e.style.width="".concat(e.style.width||y,"px"),e.style.height="".concat(g,"px"),M(a).forEach(function(d){var p=W(d),h=p.isLine,k=p.top,_=p.left,E=p.width,A=p.height,R=W(d.parentElement),H=!h&&R.isLine;d.style.top="".concat(H?k-R.top:k,"px"),d.style.left=h?"".concat(f.left,"px"):"".concat(_-(H?f.left:0),"px"),d.style.height="".concat(A,"px"),d.style.width=h?"".concat(f.width,"px"):"".concat(E,"px"),d.style.position="absolute"})),b&&(C?b.insertBefore(e,C):b.appendChild(e)),v}var B=L(G,{}),ot=function(){Q(e,null,[{key:"clearData",value:function(){Ie()}},{key:"setDefaults",value:function(r){return B=L(B,I(r)),G}},{key:"revert",value:function(r){re(r).forEach(function(n){var i=W(n),a=i.isSplit,o=i.html,s=i.cssWidth,l=i.cssHeight;a&&(n.innerHTML=o,n.style.width=s||"",n.style.height=l||"",se(n))})}},{key:"create",value:function(r,n){return new e(r,n)}},{key:"data",get:function(){return w}},{key:"defaults",get:function(){return B},set:function(r){B=L(B,I(r))}}]);function e(t,r){Ee(this,e),this.isSplit=!1,this.settings=L(B,I(r)),this.elements=re(t),this.split()}return Q(e,[{key:"split",value:function(r){var n=this;this.revert(),this.elements.forEach(function(o){S(o,"html",o.innerHTML)}),this.lines=[],this.words=[],this.chars=[];var i=[window.pageXOffset,window.pageYOffset];r!==void 0&&(this.settings=L(this.settings,I(r)));var a=Z(this.settings.types);a.none||(this.elements.forEach(function(o){S(o,"isRoot",!0);var s=ye(o,n.settings),l=s.words,g=s.chars;n.words=[].concat(m(n.words),m(l)),n.chars=[].concat(m(n.chars),m(g))}),this.elements.forEach(function(o){if(a.lines||n.settings.absolute){var s=at(o,n.settings,i);n.lines=[].concat(m(n.lines),m(s))}}),this.isSplit=!0,window.scrollTo(i[0],i[1]),ze())}},{key:"revert",value:function(){this.isSplit&&(this.lines=null,this.words=null,this.chars=null,this.isSplit=!1),e.revert(this.elements)}}]),e}();const ne=["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","!","@","#","$","%","^","&","*","-","_","+","=",";",":","<",">",",","/","\\","|","~","`"],ie=["#22a3a9","#4ca922","#a99222","#ff6b6b","#6366f1","#ec4899"];class st{constructor(t,r={}){O(this,"element");O(this,"splitter",null);O(this,"originalChars",[]);O(this,"originalColors",[]);O(this,"variant");O(this,"options");this.element=t,this.variant=r.variant||"cursor",this.options={scrambleSpeed:r.scrambleSpeed||.03,scrambleCount:r.scrambleCount||3,staggerDelay:r.staggerDelay||.07,repeatDelay:r.repeatDelay||.04},this.init()}init(){this.splitter=new ot(this.element,{types:"words,chars",tagName:"span"});const t=this.getChars();this.originalChars=t.map(r=>r.innerHTML),this.originalColors=t.map(r=>getComputedStyle(r).color),this.element.classList.add("hover-effect"),this.variant==="cursor"?this.element.classList.add("hover-effect--cursor"):this.variant==="background"?this.element.classList.add("hover-effect--bg"):this.variant==="blur"&&this.element.classList.add("hover-effect--blur")}getChars(){var t;return((t=this.splitter)==null?void 0:t.chars)||[]}animate(){this.reset();const t=this.getChars(),{scrambleSpeed:r,scrambleCount:n,staggerDelay:i,repeatDelay:a}=this.options;t.forEach((o,s)=>{const l=o.innerHTML,g=this.originalColors[s];let y=0;x.fromTo(o,{opacity:0},{duration:r,opacity:1,delay:(s+1)*i,repeat:n,repeatDelay:a,repeatRefresh:!0,onStart:()=>{this.variant==="cursor"&&x.set(o,{"--cursor-opacity":1})},onRepeat:()=>{y++,this.variant==="cursor"&&y===1&&x.set(o,{"--cursor-opacity":0})},onComplete:()=>{x.set(o,{innerHTML:l,color:g,delay:r})},innerHTML:()=>{const f=ne[Math.floor(Math.random()*ne.length)];if(this.variant==="color"){const v=ie[Math.floor(Math.random()*ie.length)];x.set(o,{color:v})}return f}})}),(this.variant==="background"||this.variant==="blur")&&x.fromTo(this.element,{"--bg-scale":0},{duration:1,ease:"expo.out","--bg-scale":1})}animateOut(){(this.variant==="background"||this.variant==="blur")&&(x.killTweensOf(this.element),x.to(this.element,{duration:.6,ease:"power4.out","--bg-scale":0}))}reset(){this.getChars().forEach((r,n)=>{x.killTweensOf(r),r.innerHTML=this.originalChars[n],r.style.color=this.originalColors[n]}),x.killTweensOf(this.element),x.set(this.element,{"--bg-scale":0})}destroy(){var t;this.reset(),(t=this.splitter)==null||t.revert(),this.element.classList.remove("hover-effect","hover-effect--cursor","hover-effect--bg","hover-effect--blur")}}const lt=[{id:1,name:"Mount Vespera",location:"Planet Thalassa",date:"2157-03-14",code:"V6"},{id:2,name:"Kraxion",location:"Exo-Planet Zyra",date:"2243-11-09",code:"K7"},{id:3,name:"Helion Peak",location:"Planet Elara",date:"2180-05-18",code:"H5"},{id:4,name:"Pyrosphere",location:"Moon Xanthe",date:"2291-06-15",code:"P6"},{id:5,name:"Vulcanus",location:"Asteroid B-612",date:"2312-08-22",code:"V5"},{id:6,name:"Tarkon Fury",location:"Planet Drakonis",date:"2455-12-01",code:"T8"},{id:7,name:"Aether Plume",location:"Planet Ganymede",date:"2379-04-10",code:"A4"},{id:8,name:"Mount Zenith",location:"Planet Lumina",date:"2392-09-21",code:"Z6"}],ct=[{key:"cursor",label:"Cursor"},{key:"background",label:"Background"},{key:"color",label:"Color"},{key:"blur",label:"Blur"}];function T({children:e,variant:t,className:r=""}){const n=P.useRef(null),i=P.useRef(null);P.useEffect(()=>{if(n.current)return i.current=new st(n.current,{variant:t}),()=>{var s;(s=i.current)==null||s.destroy()}},[t]);const a=P.useCallback(()=>{var s;(s=i.current)==null||s.animate()},[]),o=P.useCallback(()=>{var s;(s=i.current)==null||s.animateOut()},[]);return c.jsx("span",{ref:n,className:r,onMouseEnter:a,onMouseLeave:o,style:u.hoverText,children:e})}function ut({data:e,variant:t,index:r}){return c.jsxs("li",{style:u.listItem,className:"terminal-list-item",children:[c.jsx("span",{style:u.listNumber,children:String(r+1).padStart(2,"0")}),c.jsx(T,{variant:t,children:e.name}),c.jsx(T,{variant:t,children:e.location}),c.jsx(T,{variant:t,children:e.date}),c.jsx(T,{variant:t,children:e.code})]})}function ht(){const[e,t]=P.useState("cursor");return c.jsxs("div",{style:u.container,className:`demo-${e}`,children:[c.jsx("div",{style:u.scanlines}),c.jsx(ke,{to:"/",style:u.backButton,children:"← Back"}),c.jsxs("nav",{style:u.nav,children:[c.jsx("span",{style:u.navLabel,children:"Variant:"}),c.jsx("div",{style:u.variantButtons,children:ct.map(r=>c.jsx("button",{onClick:()=>t(r.key),style:{...u.variantButton,...e===r.key?u.variantButtonActive:{}},children:r.label},r.key))})]}),c.jsxs("main",{style:u.content,children:[c.jsx("h2",{style:u.sectionTitle,children:"Volcanic Eruptions Database"}),c.jsx("ul",{style:u.list,children:lt.map((r,n)=>c.jsx(ut,{data:r,variant:e,index:n},r.id))}),c.jsxs("div",{style:u.linksSection,children:[c.jsx("h3",{style:u.linksTitle,children:"Navigation Links"}),c.jsxs("div",{style:u.links,children:[c.jsx(T,{variant:e,children:"Projects"}),c.jsx(T,{variant:e,children:"About"}),c.jsx(T,{variant:e,children:"Contact"}),c.jsx(T,{variant:e,children:"Archive"})]})]})]}),c.jsx("div",{style:u.branding,children:"TERMINAL_V1.0"}),c.jsx("style",{children:`
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
      `})]})}const u={container:{minHeight:"100vh",backgroundColor:"var(--bg-color, #0a0a0a)",color:"var(--text-color, #fff)",fontFamily:'"JetBrains Mono", "SF Mono", "Fira Code", monospace',textTransform:"uppercase",padding:"2rem",paddingTop:"100px",position:"relative",transition:"background-color 0.4s ease, color 0.4s ease"},scanlines:{position:"fixed",top:0,left:0,width:"100%",height:"100%",backgroundImage:"repeating-linear-gradient(transparent, transparent 2px, rgba(0,0,0,0.15) 3px)",backgroundSize:"auto 100%",pointerEvents:"none",zIndex:100},backButton:{position:"fixed",top:24,left:24,color:"var(--text-color)",opacity:.5,textDecoration:"none",fontSize:12,fontWeight:500,letterSpacing:"0.05em",zIndex:101,fontFamily:'"JetBrains Mono", monospace',textTransform:"uppercase"},nav:{position:"fixed",top:0,left:0,right:0,display:"flex",alignItems:"center",gap:"1rem",padding:"1rem 2rem",paddingLeft:"100px",background:"var(--bg-color)",borderBottom:"1px solid rgba(128, 128, 128, 0.2)",zIndex:50},navLabel:{fontSize:11,fontWeight:500,letterSpacing:"0.1em",opacity:.5},variantButtons:{display:"flex",gap:"0.5rem"},variantButton:{padding:"0.4rem 0.75rem",fontSize:11,fontWeight:500,letterSpacing:"0.05em",textTransform:"uppercase",color:"var(--text-color)",opacity:.5,background:"transparent",border:"1px solid rgba(128, 128, 128, 0.3)",cursor:"pointer",transition:"all 0.2s ease",fontFamily:'"JetBrains Mono", monospace'},variantButtonActive:{opacity:1,background:"rgba(128, 128, 128, 0.2)",borderColor:"rgba(128, 128, 128, 0.5)"},content:{maxWidth:"1000px",margin:"0 auto"},sectionTitle:{fontSize:11,fontWeight:500,letterSpacing:"0.15em",color:"var(--accent-color, rgba(255,255,255,0.4))",marginBottom:"1.5rem"},list:{listStyle:"none",padding:0,margin:0,display:"flex",flexDirection:"column"},listItem:{display:"grid",gridTemplateColumns:"50px 1fr 1fr 120px 60px",gap:"1rem 2rem",alignItems:"baseline",padding:"0.75rem 0",borderBottom:"1px solid rgba(128, 128, 128, 0.1)",fontSize:14},listNumber:{fontSize:12,fontWeight:600,opacity:.4},hoverText:{cursor:"pointer",lineHeight:1.4},linksSection:{marginTop:"4rem"},linksTitle:{fontSize:11,fontWeight:500,letterSpacing:"0.15em",color:"var(--accent-color, rgba(255,255,255,0.4))",marginBottom:"1.5rem"},links:{display:"flex",flexWrap:"wrap",gap:"2rem",fontSize:18},branding:{position:"fixed",bottom:24,right:24,fontSize:10,letterSpacing:"0.15em",opacity:.25,fontFamily:'"JetBrains Mono", monospace',zIndex:101}};export{ht as TerminalTextHover,ht as default};
