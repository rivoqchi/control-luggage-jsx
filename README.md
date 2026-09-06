# Control Luggage — Frontend

Vite + React + TypeScript + Ant Design. Backend URL va WebSocket manzili `.env` da.

```bash
cd Frontend.react
cp .env.example .env
npm install
npm run dev
```

App: http://localhost:5173  
API: `VITE_API_BASE_URL` (default `http://localhost:8081`)

Images upload via `POST /api/v1/upload/presign` then direct `PUT` to Cloudflare R2. The UI displays `photo.url` from the API (R2 public/CDN URL). Backend must have `R2_*` env vars set, including `R2_PUBLIC_URL`.
