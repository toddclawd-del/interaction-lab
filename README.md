# 🧪 Interaction Lab

A personal library of recreated web interactions, animations, and UI components. Each interaction is self-contained and easy to port to other projects.

## Structure

```
interaction-lab/
├── src/
│   └── interactions/
│       ├── infinite-canvas/     # Pannable infinite image grid
│       ├── wavy-carousel/       # Coming soon
│       └── ...
├── public/
│   └── samples/                 # Sample images for demos
└── package.json
```

## Running Locally

```bash
npm install
npm run dev
```

## Interactions

| Name | Tech | Status | Source |
|------|------|--------|--------|
| Layered Zoom Scroll | GSAP ScrollTrigger | ✅ Ready | [Codrops](https://tympanus.net/codrops/2025/10/29/building-a-layered-zoom-scroll-effect-with-gsap-scrollsmoother-and-scrolltrigger/) |
| Terminal Text Hover | GSAP + SplitType | ✅ Ready | [Codrops](https://tympanus.net/codrops/2024/06/19/hover-animations-for-terminal-like-typography/) |
| Wavy Carousel | R3F + GLSL Shaders | ✅ Ready | [Codrops](https://tympanus.net/codrops/2025/11/26/creating-wavy-infinite-carousels-in-react-three-fiber-with-glsl-shaders/) |
| Grid Flip | GSAP Flip Plugin | ✅ Ready | [Codrops](https://tympanus.net/codrops/2026/01/20/animating-responsive-grid-layout-transitions-with-gsap-flip/) |
| Cylinder Text | CSS 3D Transforms | ✅ Ready | — |
| Dual Wave Text | GSAP + Lenis | ✅ Ready | [Codrops](https://tympanus.net/codrops/2026/01/15/building-a-scroll-driven-dual-wave-text-animation-with-gsap/) |
| Infinite Canvas | React Three Fiber | ✅ Ready | [Codrops](https://tympanus.net/codrops/2026/01/07/infinite-canvas-building-a-seamless-pan-anywhere-image-space/) |
| Curved Path | GSAP MotionPath | ✅ Ready | [Codrops](https://tympanus.net/codrops/2025/12/17/building-responsive-scroll-triggered-curved-path-animations-with-gsap/) |
| Gradient Carousel | CSS 3D + Canvas | ✅ Ready | [Codrops](https://tympanus.net/codrops/2025/11/11/building-a-3d-infinite-carousel-with-reactive-background-gradients/) |
| Shader Reveal Gallery | R3F + GSAP + Shaders | ✅ Ready | [Codrops](https://tympanus.net/codrops/2026/02/02/building-a-scroll-revealed-webgl-gallery-with-gsap-three-js-astro-and-barba-js/) |

## Adding to Your Project

Each interaction is in its own folder with:
- `index.tsx` - Main component
- `README.md` - Usage instructions
- Any supporting files (shaders, hooks, etc.)

Copy the folder into your project and import the component.

---

*Curated by Todd 🤙*
