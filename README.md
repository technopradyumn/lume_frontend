# Lume Frontend

The React web client for Lume, a video discovery, creator, and community platform. It provides public browsing, demo access, protected account experiences, video playback, creator tools, community interaction, and personal video libraries.

## Stack

| Area | Technology |
| --- | --- |
| UI | React 18, JSX, CSS design tokens |
| Build tooling | Vite 5 |
| Routing | React Router 6 |
| API client | Axios with bearer-token interceptor and cookie credentials |
| Interaction | Framer Motion, Lucide React |

## Features

- Public landing page and controlled demo mode
- Login, registration, logout, and authenticated route handling
- Video discovery, search, playback, likes, comments, history, and Watch Later
- Creator dashboard, uploads, settings, and channel pages
- Community posts, replies, likes, subscriptions, and notifications
- Responsive sidebar/bottom navigation and light/dark themes

## Architecture

```text
src/
|-- features/       # Product-specific pages and components
|-- shared/         # Layout, contexts, hooks, shared services, utilities
|-- services/       # API integration layer
|-- styles/         # Tokens, reset, layouts, components, animations
|-- App.jsx         # Route and application composition
`-- main.jsx        # React entry point
```

The authentication context verifies the current user before protected routes render. Axios attaches the saved access token to authenticated requests, while Vite forwards `/api` calls to the Lume backend during local development.

## Run locally

### Prerequisites

- Node.js 18 or later
- npm 9 or later
- The [Lume backend](https://github.com/technopradyumn/lume_backend) running locally

### Installation

```bash
git clone https://github.com/technopradyumn/lume_frontend.git
cd lume_frontend
npm install
npm run dev
```

Open the address printed by Vite. The default API proxy target is configured in `vite.config.js`; update it if your backend uses a different local address.

## Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create an optimized production build |
| `npm run preview` | Preview the production build locally |

## Production notes

Run `npm run build` before deployment. Configure the deployed web client to reach the deployed backend API, use HTTPS, and ensure the backend CORS policy allows the frontend origin.

## Related repositories

- [Lume backend](https://github.com/technopradyumn/lume_backend)
- [Lume Flutter app](https://github.com/technopradyumn/lume_app)

## License

ISC
