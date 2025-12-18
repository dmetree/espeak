# Technical Stack Overview

This document describes the main technologies used in the project and how they fit together.

---

## 1. Application Architecture

The system is structured as a **Next.js monorepo-style app** with:

- A **web client** (Next.js + React + Tailwind CSS + Redux Toolkit).
- A **Firebase backend** (Firestore, Auth, Storage) plus **Firebase Cloud Functions** in the `functions/` folder.
- A **blockchain layer** for Cardano/Ergo smart contracts and tests in the `blockchain/` folder.

The web app communicates with:

- Firebase (for user data, auth, notifications).
- Off-chain backend logic that builds and submits Cardano transactions.
- Cardano/Ergo networks via client SDKs (Lucid, Fleet SDK, etc.).

---

## 2. Frontend Web Client

**Framework & Language**

- **Next.js 13** (pages router) – server-side and client-side rendering.
- **React 18** – component-based UI.
- **TypeScript** – static typing across the codebase.

**UI & Styling**

- **Tailwind CSS** – utility-first styling, configured in `tailwind.config.js`.
- **CSS Modules / global CSS** – global styles in `styles/globals.css`.
- **UI libraries**:
  - **DaisyUI** and **Flowbite / Flowbite React** – Tailwind-based UI kits.
  - **Heroicons**, **Lucide**, and **Font Awesome** – icon sets.

**State & Data**

- **Redux Toolkit** + **react-redux** – global app state in `store/`.
- **react-hook-form** + **@hookform/resolvers** – form management and validation.
- **zod** – schema validation for inputs and API payloads.
- **axios** + **axios-retry** – HTTP client for backend/API calls.
- **lodash**, **moment**, **rxjs**, **uuid** – utility libraries for data manipulation, dates, reactive streams, and IDs.

**Rich UX & Components**

- **LiveKit** (`livekit-client`, `@livekit/components-react`, `@livekit/components-styles`) – real-time audio/video for lessons.
- **peerjs** – WebRTC peer-to-peer abstraction (where used).
- **Quill / React-Quill, Slate / Slate-React** – rich text editors for content.
- **Chart.js + react-chartjs-2** – charts and analytics.
- **react-datepicker, react-select, carousels, tooltips, sliders, tags** – additional interaction components.
- **react-toastify, react-tooltip, react-loader-spinner, react-window** – notifications, loading, and virtualized lists.

---

## 3. Firebase & Backend

**Firebase Client**

- **firebase** – client SDK initialized in shared utilities.
- Used for:
  - **Authentication** (email/social where applicable).
  - **Firestore** – storing users, lesson requests, schedules, notifications.
  - **Storage** – file uploads if needed.

**Firebase Cloud Functions** (`functions/`)

- **firebase-functions**, **firebase-admin** – server-side logic running on Google Cloud.
- **TypeScript** compiled to `lib/` via `npm run build` in `functions/`.
- Functions include (conceptually):
  - Reacting to changes in **requests** collection (onCreate, onUpdate, onDelete).
  - Updating user free time slots (e.g. `freeTimestamps`).
  - Pushing notifications to user documents when events occur.

**Environment & Config**

- Client uses `.env.local` with `NEXT_PUBLIC_FIREBASE_*` variables for Firebase web config.
- Firebase deployment is driven by `firebase.json` and `.firebaserc`.

---

## 4. Blockchain Layer (Cardano & Ergo)

**Cardano Stack**

- **lucid-cardano** – primary SDK for building, signing, and submitting Cardano transactions.
- **@blockfrost/blockfrost-js** – interaction with Blockfrost APIs (network access and data).
- **@dcspark/adalib** and **web3-cardano-token** – additional Cardano tooling and token helpers.
- **@nautilus-js/eip12-types** – CIP-30 / wallet type definitions.
- **punycode-esm**, **json-bigint**, **cids**, **is-ipfs** – helpers for encoding, big integers, and IPFS-related identifiers.

These are used to:

- Build tx CBOR for lesson request, accept, cancel, and withdraw.
- Integrate with Cardano wallets (CIP-30) from the frontend.
- Support multi-asset payments (ADA, stablecoins, native tokens).

**Ergo Stack**

- **@fleet-sdk/core**, **@fleet-sdk/common**, **@fleet-sdk/crypto**, **@fleet-sdk/serializer** – Ergo blockchain primitives.
- **@fleet-sdk/compiler**, **@fleet-sdk/mock-chain** – contract compilation and local mock-chain for testing.
- **ergo-lib-wasm-browser** – wasm bindings for Ergo cryptography and contracts.

This stack backs the Ergo-based side of the project (contracts and tests) and is primarily exercised via the unit test suite.

---

## 5. Testing & Quality

- **Vitest** – primary test runner for unit tests, including blockchain contract tests.
  - `yarn test:unit` – run all tests.
  - `yarn watch:unit` – watch mode.
  - `BUILD=false yarn watch:unit` – reuse cached contract build for faster blockchain tests.
- **ESLint** (`eslint`, `eslint-config-next`, `eslint-plugin-next`) – linting for TypeScript/React/Next.
- **Prettier** – code formatting.
- **Knip** – static analysis tool to detect unused files, exports, and dependencies.

---

## 6. Styling, Assets, and Build

- **Tailwind CSS** – main styling engine, compiled via PostCSS.
  - Script: `yarn build:tailwind` builds from `styles/globals.css` to `public/styles.css`.
- **PostCSS** + **Autoprefixer** – CSS processing pipeline.
- **SVGO** – SVG optimization for icons and illustrations.
- **Sass** – optional SASS/SCSS support where needed.

---

## 7. Tooling, Scripts, and Runtime

**Package Manager & Scripts**

- **Yarn** (recommended; `yarn.lock` committed).
- Key scripts in `package.json`:
  - `yarn dev` – start Next.js dev server.
  - `yarn build` / `yarn start` – build and run the production server.
  - `yarn lint` – run ESLint.
  - `yarn test:unit`, `yarn watch:unit`, `yarn watch:unit:no-build` – Vitest test commands.
  - `yarn build:tailwind` – build Tailwind CSS.
  - `yarn knip` – find unused exports and modules.

**Runtime**

- Node.js for the main app and tools.
- Node 20 for Firebase Cloud Functions (per project configuration).

---

## 8. Directory Structure (Technical View)

- `pages/` – Next.js routes (React components for pages).
- `components/` – UI components, layouts, and feature modules.
- `store/` – Redux Toolkit slices, actions, and reducers.
- `context/` – React Contexts for cross-cutting concerns.
- `styles/` – Tailwind and global styles.
- `public/` – static assets (images, fonts, built CSS).
- `blockchain/` – Cardano/Ergo logic, SDK usage, and contract tests.
- `functions/` – Firebase Cloud Functions TypeScript sources.
- `types/` – shared TypeScript type definitions.

Together, these layers support a hybrid Web2/Web3 lesson platform with a modern React frontend, Firebase backend services, and Cardano/Ergo-based financial logic.
