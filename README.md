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

The health tracker stores the last submitted vehicle details in the browser's local storage under `automotive-expert-health-check`. Its WhatsApp action opens a prefilled booking message to +256 752 561 372.

## Authorized reference material

Two workshop photographs are included as authorized source material from [Wamuco Motors](https://www.wamuco.co.ug/):

- `public/assets/wamuco-workshop-bg1.jpg` — sourced from `/images/demo/slider/bg1.jpg`
- `public/assets/wamuco-service-bg2.jpg` — sourced from `/images/demo/slider/bg2.jpg`
- `public/assets/wamuco-tyre-guide.png` — sourced from `/images/demo/news/tyrews.png`

They are used only as supporting workshop imagery within Automotive Expert's own branded experience. The Automotive Expert copy, contacts, logo, and service flow remain distinct; Wamuco-specific history, claims, branding, and contact details are not presented as Automotive Expert facts.

The vehicle-coverage section also includes selected make marks from [Simple Icons](https://simpleicons.org/) for Toyota, BMW, Honda, Volvo, Nissan, Jeep, and Audi. The remaining listed makes are rendered as text labels so the site does not imply an official dealership relationship.

The public visual system uses a red-and-white palette with dark contrast sections for readability and a more direct workshop feel.

## Booking and health-check notes

The booking form now captures the customer's vehicle year, registration, preferred time, and concern. It creates a local `AE-YYYY-XXXX` booking reference and offers a WhatsApp follow-up after submission. The concern is treated as customer-reported information only; the site does not claim to diagnose a mechanical fault.

The health tracker also records the odometer at the last service. Its estimate uses the earlier of 10,000 km from that service reading or 180 days from the last service date, with current mileage and average daily kilometres used to estimate status.

## Local admin workspace

Open `/admin` (for example `http://localhost:5173/admin`) for the service desk. It includes:

- a clearly labeled demo/local sign-in gate;
- appointment pipeline statuses: New, Confirmed, In service, Ready, and Completed;
- local customer and vehicle records created by public booking submissions;
- an Upload Center for customer/vehicle documents, invoices/service reports, and inventory/parts sheets;
- quick actions, empty states, and inventory/reminder placeholders ready for a backend;
- status updates persisted in `automotive-expert-bookings`.

The Upload Center validates category-specific file extensions/MIME types and size limits, shows explicit errors and progress, and supports local download/remove actions. Files are stored as browser-local data under `automotive-expert-local-uploads`; they are never executed or sent to cloud storage. This is intentionally **not authentication** and is not connected to a server. Any email enters the demo workspace, all records and uploads stay on the current device/browser, and the data should not be treated as live customer information. Connect a proper identity layer, malware scanning, object storage, and database before production use.
