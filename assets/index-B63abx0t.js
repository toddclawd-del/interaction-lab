import{r as f,j as e}from"./index-Bl0IhF4C.js";import{R as j,u as A}from"./ResponsiveShader-6WKbKc2T.js";import{s as C,v as R,k as w,I as P,C as g,V as k}from"./react-three-fiber.esm-Bcdnw6si.js";class I extends w{constructor(){super({uniforms:{uTime:{value:0},uMouse:{value:new k(.5,.5)},uMouseStrength:{value:.5},uMouseRadius:{value:.2},uAttractionMode:{value:0},uColor1:{value:new g("#667eea")},uColor2:{value:new g("#764ba2")},uSize:{value:2},uSpeed:{value:.1}},vertexShader:`
        attribute vec3 velocity;
        attribute float size;
        attribute float seed;
        
        uniform float uTime;
        uniform vec2 uMouse;
        uniform float uMouseStrength;
        uniform float uMouseRadius;
        uniform float uAttractionMode;
        uniform float uSize;
        uniform float uSpeed;
        
        varying float vAlpha;
        varying vec3 vColor;
        varying float vSeed;
        
        // Noise for organic movement
        float hash(float n) {
          return fract(sin(n) * 43758.5453);
        }
        
        void main() {
          vSeed = seed;
          
          // Current position
          vec3 pos = position;
          
          // Time-based movement
          float t = uTime * uSpeed;
          
          // Add organic noise movement
          pos.x += sin(t + seed * 10.0) * 0.05;
          pos.y += cos(t * 0.7 + seed * 7.0) * 0.05;
          pos.z += sin(t * 0.5 + seed * 5.0) * 0.02;
          
          // Mouse interaction
          vec2 toMouse = uMouse - pos.xy;
          float mouseDist = length(toMouse);
          float mouseInfluence = smoothstep(uMouseRadius, 0.0, mouseDist) * uMouseStrength;
          
          // Attract or repel based on mode
          vec2 mouseDir = normalize(toMouse + 0.001);
          if (uAttractionMode < 0.5) {
            // Attract
            pos.xy += mouseDir * mouseInfluence * 0.1;
          } else {
            // Repel
            pos.xy -= mouseDir * mouseInfluence * 0.15;
          }
          
          // Project to clip space
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          
          // Size attenuation
          gl_PointSize = size * uSize * (1.0 / -mvPosition.z) * 100.0;
          
          // Depth-based alpha
          vAlpha = smoothstep(-1.0, 0.0, pos.z);
          
          // Color variation
          vColor = vec3(hash(seed), hash(seed + 1.0), hash(seed + 2.0));
        }
      `,fragmentShader:`
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        
        varying float vAlpha;
        varying vec3 vColor;
        varying float vSeed;
        
        void main() {
          // Circular particle
          vec2 center = gl_PointCoord - 0.5;
          float dist = length(center);
          if (dist > 0.5) discard;
          
          // Soft edges
          float alpha = smoothstep(0.5, 0.2, dist) * vAlpha;
          
          // Mix colors based on seed
          vec3 color = mix(uColor1, uColor2, vSeed);
          
          // Add slight glow
          color += (1.0 - dist * 2.0) * 0.2;
          
          gl_FragColor = vec4(color, alpha * 0.8);
        }
      `,transparent:!0,depthWrite:!1,blending:P})}}R({ParticleMaterial:I});function D({count:t,colors:i,size:s,speed:u,mouseStrength:r,mouseRadius:c,attractMode:n}){const p=f.useRef(null),o=f.useRef(null),{mouse:m}=A(),{positions:b,velocities:S,sizes:y,seeds:z}=f.useMemo(()=>{const d=new Float32Array(t*3),l=new Float32Array(t*3),h=new Float32Array(t),x=new Float32Array(t);for(let a=0;a<t;a++)d[a*3]=(Math.random()-.5)*2,d[a*3+1]=(Math.random()-.5)*2,d[a*3+2]=(Math.random()-.5)*.5,l[a*3]=(Math.random()-.5)*.01,l[a*3+1]=(Math.random()-.5)*.01,l[a*3+2]=(Math.random()-.5)*.005,h[a]=.5+Math.random()*1.5,x[a]=Math.random();return{positions:d,velocities:l,sizes:h,seeds:x}},[t]);return C(({clock:d})=>{if(!o.current)return;const l=o.current.uniforms;l.uTime.value=d.getElapsedTime(),l.uMouse.value.set(m.x*2-1,m.y*2-1),l.uAttractionMode.value=n?0:1}),f.useEffect(()=>{o.current&&(o.current.uniforms.uColor1.value.set(i[0]),o.current.uniforms.uColor2.value.set(i[1]),o.current.uniforms.uSize.value=s,o.current.uniforms.uSpeed.value=u,o.current.uniforms.uMouseStrength.value=r,o.current.uniforms.uMouseRadius.value=c)},[i,s,u,r,c]),e.jsxs("points",{ref:p,children:[e.jsxs("bufferGeometry",{children:[e.jsx("bufferAttribute",{attach:"attributes-position",count:t,array:b,itemSize:3}),e.jsx("bufferAttribute",{attach:"attributes-velocity",count:t,array:S,itemSize:3}),e.jsx("bufferAttribute",{attach:"attributes-size",count:t,array:y,itemSize:1}),e.jsx("bufferAttribute",{attach:"attributes-seed",count:t,array:z,itemSize:1})]}),e.jsx("particleMaterial",{ref:o})]})}function M({count:t=1e3,colors:i=["#667eea","#764ba2"],size:s=2,speed:u=.1,mouseStrength:r=.5,mouseRadius:c=.3,attractMode:n=!0,className:p="",style:o,children:m}){return e.jsxs("div",{className:p,style:{position:"relative",width:"100%",height:"100%",minHeight:"400px",background:"#0a0a0f",...o},children:[e.jsx("div",{style:{position:"absolute",inset:0},children:e.jsx(j,{trackMouse:!0,mobileInteraction:"touch",pauseWhenHidden:!0,children:e.jsx(D,{count:t,colors:i,size:s,speed:u,mouseStrength:r,mouseRadius:c,attractMode:n})})}),m&&e.jsx("div",{style:{position:"relative",zIndex:1,height:"100%",display:"flex",alignItems:"center",justifyContent:"center",color:"white"},children:m})]})}const v={stars:{count:2e3,colors:["#ffffff","#aaaaff"],size:1.5,speed:.02,mouseStrength:.2,mouseRadius:.4,attractMode:!1},fireflies:{count:200,colors:["#f7d794","#f19066"],size:4,speed:.15,mouseStrength:.8,mouseRadius:.3,attractMode:!0},snow:{count:500,colors:["#ffffff","#e0e0e0"],size:2,speed:.05,mouseStrength:.3,mouseRadius:.2,attractMode:!1},magic:{count:800,colors:["#f72585","#4cc9f0"],size:2.5,speed:.08,mouseStrength:.6,mouseRadius:.35,attractMode:!0},ocean:{count:1500,colors:["#00b4d8","#90e0ef"],size:2,speed:.03,mouseStrength:.4,mouseRadius:.4,attractMode:!1}};function _({preset:t,className:i,style:s,children:u}){const r=v[t];return e.jsx(M,{...r,className:i,style:s,children:u})}function V({className:t=""}){const i=Object.keys(v),[s,u]=f.useState("magic"),[r,c]=f.useState(!0);return e.jsxs("div",{className:t,children:[e.jsxs("div",{style:{display:"flex",gap:"0.5rem",marginBottom:"1rem",flexWrap:"wrap",alignItems:"center"},children:[i.map(n=>e.jsx("button",{onClick:()=>u(n),style:{padding:"0.5rem 1rem",borderRadius:"4px",border:"none",background:s===n?"#667eea":"#e0e0e0",color:s===n?"white":"black",cursor:"pointer",textTransform:"capitalize"},children:n},n)),e.jsx("button",{onClick:()=>c(!r),style:{padding:"0.5rem 1rem",borderRadius:"4px",border:"none",background:r?"#10b981":"#ef4444",color:"white",cursor:"pointer",marginLeft:"1rem"},children:r?"Attract":"Repel"})]}),e.jsx(M,{...v[s],attractMode:r,style:{height:"500px",borderRadius:"8px"},children:e.jsx("h2",{style:{textShadow:"0 2px 10px rgba(0,0,0,0.5)"},children:"Move your mouse"})})]})}export{V as ParticleDemo,_ as PresetParticles,M as ShaderParticles,M as default,v as particlePresets};
