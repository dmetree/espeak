# Easy Speak

**Easy Speak** is an open source web-based marketplace for live lessons that combines a familiar Web2 user experience with Web3 guarantees on Cardano. Students and teachers interact through a simple interface, while payments, refunds, and penalties are enforced by smart contracts.

Users can register with email, Google, or Twitter and connect a Cardano wallet for payment. Students browse teachers, request lessons, and pay in ADA or other supported native tokens. Teachers see incoming requests, accept or decline them, and manage their schedule from a dedicated dashboard.

## Purpose

The platform encodes its economic logic in Cardano smart contracts. When a student requests a lesson, funds are locked on-chain. If the teacher accepts, the lesson moves into an accepted state with clear rules for refunds, cancellations, lateness, and payouts. An off-chain service monitors the blockchain and lesson timeline, exposing endpoints to list and request lessons, accept or cancel them, trigger refunds, and settle lessons after they end. The result is a transparent, rules-based lesson platform where all participants know in advance how funds move in every situation.

## Repository structure

| Folder / file       | Description |
|---------------------|-------------|
| `blockchain/`       | Cardano and Ergo smart contract logic, SDK usage, and contract tests. `blockchain/Cardano` and `blockchain/ergo` contain chain-specific code. |
| `components/`       | React UI components: `features/`, `Layout/`, `lib/`, `MetaTags/`, `pages/`, `PrivateRoute/`, `providers/`, `shared/`. |
| `context/`          | React Context providers for app-wide state and cross-cutting concerns. |
| `functions/`        | Firebase Cloud Functions (TypeScript); server-side logic for Firestore, auth, and notifications. |
| `hooks/`             | Custom React hooks. |
| `pages/`             | Next.js routes and page components (e.g. `dashboard`, `admin/`, `api/`, `specialist-profile/`, `event_details/`, `post/`). |
| `public/`            | Static assets (images, fonts, built CSS). |
| `server/`            | Off-chain backend logic (e.g. building and submitting Cardano transactions). |
| `store/`             | Redux Toolkit slices, actions, and reducers. |
| `styles/`            | Global and Tailwind CSS. |
| `types/`             | Shared TypeScript type definitions. |
| `service-flow.md`    | End-to-end lesson flow: request → accept/refuse → lesson → settlement. |
| `technical-explanation.md` | Technical stack (Next.js, Firebase, Cardano/Ergo, testing). |
| `WARP.md`            | Installation and setup (e.g. WARP / dev environment). |
| `SUMMARY.md`         | Documentation index. |

## Documentation

- [Easy Speak Overview](README.md) (this file)
- [Lesson service flow](service-flow.md)
- [Technical stack overview](technical-explanation.md)
- [Installation & setup](WARP.md)

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file in the root of the repository for details.
