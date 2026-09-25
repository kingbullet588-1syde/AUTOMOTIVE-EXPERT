# Automotive Expert

The Automotive Expert customer site and local service-desk prototype are built with Vite and React. It is intentionally dependency-light and uses the supplied workshop images from `public/assets`. Notebook requirement photos are kept as internal references and are not rendered customer-facing.

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

## Local admin workspace

Open `/admin` (for example `http://localhost:5173/admin`) for the service desk. It includes:

- a clearly labeled demo/local sign-in gate;
- appointment pipeline statuses: New, Confirmed, In service, Ready, and Completed;
- local customer and vehicle records created by public booking submissions;
- an Upload Center for customer/vehicle documents, invoices/service reports, and inventory/parts sheets;
- quick actions, empty states, and inventory/reminder placeholders ready for a backend;
- status updates persisted in `automotive-expert-bookings`.

The Upload Center validates category-specific file extensions/MIME types and size limits, shows explicit errors and progress, and supports local download/remove actions. Files are stored as browser-local data under `automotive-expert-local-uploads`; they are never executed or sent to cloud storage. This is intentionally **not authentication** and is not connected to a server. Any email enters the demo workspace, all records and uploads stay on the current device/browser, and the data should not be treated as live customer information. Connect a proper identity layer, malware scanning, object storage, and database before production use.
