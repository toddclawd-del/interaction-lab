precision highp float;

varying vec2 vUv;

uniform sampler2D uTexture;
uniform vec2 uResolution;       // Natural image resolution
uniform vec2 uContainerRes;     // Container/mesh dimensions
uniform float uProgress;        // 0 = hidden, 1 = fully revealed
uniform float uGridSize;        // Number of grid cells
uniform vec3 uColor;            // Background color for unrevealed areas

// Object-fit cover calculation
vec2 getCoverUv(vec2 uv, vec2 textureRes, vec2 containerRes) {
  vec2 textureAspect = textureRes / max(textureRes.x, textureRes.y);
  vec2 containerAspect = containerRes / max(containerRes.x, containerRes.y);
  
  vec2 scale = textureAspect / containerAspect;
  
  if (scale.x < scale.y) {
    scale = vec2(scale.x / scale.y, 1.0);
  } else {
    scale = vec2(1.0, scale.y / scale.x);
  }
  
  return (uv - 0.5) * scale + 0.5;
}

// Simple pseudo-random
float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
  // Calculate cover UVs for proper aspect ratio
  vec2 coverUv = getCoverUv(vUv, uResolution, uContainerRes);
  
  // Sample texture
  vec4 texColor = texture2D(uTexture, coverUv);
  
  // Grid-based reveal
  vec2 gridPos = floor(vUv * uGridSize);
  float cellRandom = random(gridPos);
  
  // Each cell reveals at a different progress threshold
  // Earlier cells (lower random value) reveal first
  float revealThreshold = cellRandom;
  
  // Smooth transition with slight overlap
  float reveal = smoothstep(
    revealThreshold - 0.1,
    revealThreshold + 0.1,
    uProgress
  );
  
  // Mix between background color and texture
  vec3 bgColor = uColor;
  vec3 finalColor = mix(bgColor, texColor.rgb, reveal);
  float finalAlpha = mix(0.0, texColor.a, reveal);
  
  // Also fade in opacity for unrevealed cells
  float cellOpacity = smoothstep(0.0, 0.05, uProgress);
  
  gl_FragColor = vec4(finalColor, finalAlpha * cellOpacity + (1.0 - cellOpacity) * 0.0);
}
