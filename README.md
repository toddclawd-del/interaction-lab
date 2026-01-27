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
| Infinite Canvas | React Three Fiber | ✅ Ready | [Codrops](https://tympanus.net/codrops/2026/01/07/infinite-canvas-building-a-seamless-pan-anywhere-image-space/) |

## Adding to Your Project

Each interaction is in its own folder with:
- `index.tsx` - Main component
- `README.md` - Usage instructions
- Any supporting files (shaders, hooks, etc.)

Copy the folder into your project and import the component.

---

*Curated by Todd 🤙*
