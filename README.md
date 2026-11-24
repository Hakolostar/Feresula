# Feresula Coffee

A responsive React landing page for Feresula Coffee in Addis Ababa, served by an Express API.

## Requirements

- Node.js 18 or newer
- npm

## Development

```sh
npm install
npm run dev
```

Open the Vite URL shown in the terminal (usually [http://localhost:5173](http://localhost:5173)). Vite proxies `/api` requests to the Express server on port 3000.

## Production

```sh
npm run build
npm start
```

The Express server serves the production React build at [http://localhost:3000](http://localhost:3000). Set `PORT` to use a different port.

## Project structure

- `src/App.jsx` — React page sections and interactions
- `src/styles.css` — responsive page styling
- `src/main.jsx` — React entry point
- `server.js` — Express API and production static server
- `assets/` — public photos and hero video

## API

- `GET /api/menu` — menu items with estimated ETB prices and business details.
- `GET /api/locations` — Bole, Saris and Ministry of Mines branch details.
- `GET /api/info` — business location, contact, hours and price range.
- `POST /api/inquiry` — accepts JSON with `name` and `phone` (required), plus optional `date`, `guests` (1–6) and `note` (up to 500 characters). A valid request returns `201 Created`.

The inquiry endpoint validates and acknowledges submitted inquiries. It does not persist or send them; connect it to a chosen inbox or booking system before relying on it for follow-up. Menu prices are estimates and may change.
