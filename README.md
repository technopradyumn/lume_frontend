<div align="center">

# 🎬 Lume Frontend

**The web client for Lume — a modern video platform for creators, viewers, and communities.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=flat-square&logo=vercel)](https://vercel.com/)
[![Version](https://img.shields.io/badge/version-2.1.0-brightgreen?style=flat-square)](./CHANGELOG.md)

[Live Demo](#) · [Backend Repo](https://github.com/technopradyumn/lume_backend) · [Report Bug](https://github.com/technopradyumn/lume_frontend/issues)

</div>

---

## ✨ Overview

Lume Frontend is a full-featured Next.js 15 application that powers the Lume video platform. Built with the App Router, React Server Components, and a feature-driven architecture, it delivers a seamless experience for video discovery, creator tools, and community interaction — all wrapped in a responsive, theme-aware UI.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript 5.7 |
| **UI Library** | React 19 |
| **Animations** | Framer Motion 12 |
| **Icons** | Lucide React |
| **HTTP Client** | Axios (with JWT interceptor & cookie credentials) |
| **Styling** | Vanilla CSS with design tokens |
| **Deployment** | Vercel |

---

## 📦 Features

- 🏠 **Landing page** — public entry point with demo access
- 🔐 **Auth flows** — login, register, forgot password, and protected route guards
- 🎥 **Video platform** — browse, search, watch, like, comment, and manage watch history
- 💾 **Personal libraries** — saved videos, liked videos, and watch history
- 📺 **Creator tools** — dashboard analytics, video uploads, and channel management
- 🌐 **Community** — posts (tweets), replies, likes, and subscriptions
- 🔔 **Notifications** — real-time notification centre
- ⚙️ **Settings** — profile, avatar, and account management
- 📱 **Responsive** — sidebar navigation on desktop, bottom nav on mobile
- 🌙 **Themes** — light and dark mode with CSS tokens

---

## 🗂️ Project Structure

```
src/
├── app/                        # Next.js App Router
│   ├── (app)/                  # Protected authenticated routes
│   │   ├── channel/[username]/ # Public channel pages
│   │   ├── community/          # Community posts & post detail
│   │   ├── dashboard/          # Creator dashboard
│   │   ├── history/            # Watch history
│   │   ├── home/               # Main feed
│   │   ├── liked/              # Liked videos
│   │   ├── notifications/      # Notification centre
│   │   ├── saved/              # Saved videos
│   │   ├── search/             # Search results
│   │   ├── settings/           # Account settings
│   │   ├── subscriptions/      # Subscriptions feed
│   │   └── watch/[videoId]/    # Video player
│   ├── about/                  # About page (public)
│   ├── demo/                   # Demo mode (public)
│   ├── forgot-password/        # Password reset (public)
│   ├── login/                  # Login (public)
│   ├── privacy/                # Privacy policy (public)
│   ├── register/               # Registration (public)
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   └── providers.tsx           # Global context providers
├── features/                   # Feature-scoped pages & components
├── shared/                     # Layouts, contexts, hooks, utils
│   ├── components/             # Navbar, Sidebar, BottomNav, Skeleton…
│   ├── context/                # AuthContext, ThemeContext
│   ├── hooks/                  # useApi, useAnimatedToggle…
│   ├── services/               # Axios API client
│   └── utils/                  # Formatters, helpers
├── services/                   # Global API service layer
├── styles/                     # CSS tokens, reset, layouts, animations
└── data/                       # Static/seed data
```

---

## ⚙️ Getting Started

### Prerequisites

- **Node.js** 18 or later
- **npm** 9 or later
- **Lume Backend** running locally → [lume_backend](https://github.com/technopradyumn/lume_backend)

### Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/technopradyumn/lume_frontend.git
cd lume_frontend

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note:** In development, the Next.js dev server proxies `/api/*` requests to `http://localhost:8000` (configured in `next.config.ts`). Ensure the backend is running on that port.

---

## 🛠️ Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create an optimised production build |
| `npm run start` | Start the production server locally |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |

---

## 🌐 Deployment (Vercel)

The project is configured for one-click Vercel deployment.

### How to deploy

1. Push to the `main` branch of [lume_frontend](https://github.com/technopradyumn/lume_frontend)
2. Vercel auto-deploys on every push to `main`
3. Set the following **Environment Variables** in your Vercel project settings:

| Variable | Description |
|---|---|
| *(none required)* | All API calls are proxied via `vercel.json` rewrites |

### Vercel configuration (`vercel.json`)

```json
{
  "framework": "nextjs",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://lume-backend-cggh.onrender.com/api/:path*"
    }
  ]
}
```

> All `/api/*` requests are transparently forwarded to the Render-hosted backend — no environment variables needed on the frontend.

---

## 🔒 Authentication Flow

1. User logs in via `/login` → backend returns an **access token** (stored in memory) and a **refresh token** (HTTP-only cookie)
2. `AuthContext` stores the current user and exposes login/logout helpers
3. Axios interceptor attaches the access token as a `Bearer` header on every API request
4. Protected routes under `/(app)/` redirect to `/login` if unauthenticated

---

## 🔗 Related Repositories

| Repo | Description |
|---|---|
| [lume_backend](https://github.com/technopradyumn/lume_backend) | Node.js + Express REST API |
| [lume_app](https://github.com/technopradyumn/lume_app) | Flutter mobile app |

---

## 📄 License

ISC © [Pradyumn](https://github.com/technopradyumn)
