# Automotive Expert

The first working version of the Automotive Expert landing page is built with Vite and React. It is intentionally dependency-light and uses the supplied workshop images from `public/assets`.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. To verify a production build:

```bash
npm run build
npm run preview
```

## File structure

```text
.
├── public/assets/       # supplied brand and workshop imagery
├── src/
│   ├── App.jsx          # page sections and health tracker interaction
│   ├── main.jsx         # React entry point
│   └── styles.css       # design tokens, responsive layout, components
├── DESIGN.md            # visual system and interaction decisions
├── PRODUCT.md           # durable product context
├── index.html
└── package.json
```

The health tracker stores the last submitted vehicle details in the browser's local storage under `automotive-expert-health-check`. Its WhatsApp action opens a prefilled booking message to +256 780 963 633.
