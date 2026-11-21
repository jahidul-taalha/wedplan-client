# WedPlan

WedPlan is a wedding planning marketplace client where couples discover and book wedding vendors, vendors manage their services and booking requests, and administrators moderate the platform. This repository contains the Next.js frontend; the backend lives in a separate repository linked below.

## Live Website
https://wedplan-client-omega.vercel.app

## Repositories
- Client: https://github.com/jahidul-taalha/wedplan-client
- Server: https://github.com/jahidul-taalha/wedplan-server

## Live API (Server)
https://wedplan-server-hofg.onrender.com

## Features

### Customer

- Email/password and Google sign-in, with role-based redirects
- Browse services with search, category and location filters, price sorting, and pagination
- Service detail pages with image gallery, vendor information, and Premium vendor badge
- Send booking requests with event date, location, and a message (authentication required)
- Dashboard with booking statistics, request history with details, and cancellation of pending requests
- Profile settings (name and profile image)
- Stripe payment success/cancel pages that verify the checkout session and refresh the plan

### Vendor

- Vendor registration, dashboard statistics, and subscription plan display
- Create services with multiple images uploaded through ImgBB
- Manage listings: availability toggle, edit dialog, delete confirmation, and approval status
- Review booking requests and accept or reject them with confirmation
- Free/Premium plan comparison and Stripe checkout upgrade flow
- Profile settings including business name

### Admin

- Platform statistics (users, vendors, customers, services, pending services, transactions)
- Manage users: search, role filter, pagination, detail view, and block/unblock
- Manage services: search, status and category filters, approve/reject, status change, and delete
- Read-only transaction history

## Technology Stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS 4 with a soft rose/gold theme
- ShadCN-style UI components built on Base UI (dialog, sheet, dropdown menu, select, table, avatar, and others)
- Better Auth (React client, JWT plugin, inferred user fields)
- Framer Motion for section animations
- Sonner for toast notifications
- Lucide React icons
- Stripe Checkout redirect flow (client hands off to the server-created session)
- ImgBB image uploads
- ESLint

## Installation

```bash
git clone https://github.com/jahidul-taalha/wedplan-client.git
cd wedplan-client
npm install
cp .env.local.example .env.local
```

Fill in the values in `.env.local`. The API must be running; see the server repository for its setup.

## Running Locally

```bash
npm run dev
```

Open http://localhost:3000 in your browser. Useful checks:

```bash
npm run lint
npm run build
```

## Required Environment Variables

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_IMGBB_API_KEY`

Only the variable names are listed here. Put values in `.env.local`, which is not committed.

## Repositories

- Client: https://github.com/jahidul-taalha/wedplan-client
- Server: https://github.com/jahidul-taalha/wedplan-server
