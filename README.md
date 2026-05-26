# WoodworX Frontend

React single-page application for WoodworX — a woodworker's tool for managing furniture designs, projects, galleries, and customers.

Built with Vite, React, TypeScript, and Zustand.

## Local Development Setup

### Prerequisites

- Node.js 18+
- npm 9+
- The [WoodworX API](../woodworx-api) running locally (default: `http://localhost:5000`)

### Installation

```bash
cd woodworx-frontend
npm install
```

### Running the Dev Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173` by default.

### Building for Production

```bash
npm run build
```

Output is written to the `dist/` directory.

### Running Tests

```bash
npm test
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Base URL for the backend API | `http://localhost:5000/api` |

For local development, the default points to the local API server. No `.env` file is needed unless you want to override it.

For production (Heroku), set this to your deployed backend URL:

```
VITE_API_BASE_URL=https://your-woodworx-api.herokuapp.com/api
```

> **Note:** Vite embeds environment variables at build time. You must set `VITE_API_BASE_URL` as a Heroku config var *before* deploying (or trigger a rebuild after setting it).

## Deploying to Heroku

### 1. Create the Heroku App

```bash
heroku create your-woodworx-frontend
```

### 2. Set the Node.js Buildpack

Heroku auto-detects Node.js from `package.json`. The build script (`tsc -b && vite build`) runs automatically during deployment.

### 3. Set Environment Variables

```bash
heroku config:set VITE_API_BASE_URL=https://your-woodworx-api.herokuapp.com/api
```

### 4. Deploy

```bash
git push heroku main
```

### How It Works

- Heroku runs `npm install` and then `npm run build` during deployment
- The `Procfile` starts a static file server: `web: npx serve dist -s -l $PORT`
- The `-s` flag enables SPA (single-page application) mode — all routes serve `index.html`
- The `$PORT` variable is provided by Heroku

## SPA Routing Configuration

This app uses client-side routing via React Router. Two mechanisms ensure all routes resolve to `index.html`:

1. **Procfile** — Uses `serve` with the `-s` flag, which rewrites all non-file requests to `index.html`
2. **static.json** — Provides fallback routing configuration (`/** → index.html`) for compatibility with the Heroku static buildpack

```json
{
  "root": "dist",
  "routes": {
    "/**": "index.html"
  }
}
```

This means navigating directly to `/projects` or `/settings` in the browser will correctly load the React app and render the appropriate route.

## Project Structure

```
woodworx-frontend/
├── src/
│   ├── api/          # Axios client and API modules
│   ├── components/   # React components (auth, layout, entities, shared)
│   ├── hooks/        # Custom React hooks
│   ├── pages/        # Page-level components
│   ├── stores/       # Zustand state stores
│   ├── styles/       # CSS (variables, layout, nav, content, typography)
│   ├── types/        # TypeScript interfaces
│   └── App.tsx       # Root component with auth guard and routing
├── public/           # Static assets (favicon, icons)
├── index.html        # HTML entry point
├── Procfile          # Heroku process definition
├── static.json       # SPA routing for static buildpack
├── vite.config.ts    # Vite configuration
└── package.json
```
