# MINDHEALER

## How to launch?

Download or clone the repo

```bash
git clone https://github.com/Pakistanka/mhdev-next.git
```

Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

Start development server with

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Launch the smart-contract tests

```bash
yarn run test:unit
```

SVG optimization (manual)

```bash
npx svgo ./components/shared/assets/psy_icons_svg --recursive
```

Check unused exports, functions, components etc

```bash
yarn knip
```

## Do you need any .env.local?

Yes, you do. But you will be able to get variables even from one of the team member.

## Project structure

project/
│
├── .next/ # Build output (auto-generated)
├── .vscode/ # VS Code settings
│
├── blockchain/ # Blockchain logic
│ ├── Cardano/ # Cardano-specific utilities
│ └── ergo/ # Ergo-specific logic (Fleet SDK, smart contracts, etc.)
│
├── components/ # Reusable UI components
│ ├── features/ # Feature-specific components
│ ├── Layout/ # Layout and wrapper components
│ ├── MetaTags/ # SEO-related meta tag components
│
├── pages/ # Next.js pages (includes route components)
│
├── PrivateRoute/ # Authentication wrappers or guards
│
├── providers/ # Context providers (auth, theme, etc.)
│
├── shared/ # Shared utilities, constants, or components
│
├── context/ # React Context logic
│
├── functions/ # Serverless functions (if using Vercel or Firebase functions)
│
├── node_modules/ # Installed dependencies
│
├── public/ # Static assets (images, fonts, etc.)
│
├── store/ # State management logic (Redux, Zustand, etc.)
│
├── styles/ # Tailwind and global styles
│
├── types/ # TypeScript type definitions
│
├── .env.local # Environment variables (local)
├── .eslintrc.json # ESLint configuration
├── .firebaserc # Firebase project configuration
├── .gitignore # Git ignore rules
├── firebase.json # Firebase deployment config
├── global.d.ts # Global TypeScript declarations
├── next-env.d.ts # Next.js TS environment file
├── next.config.js # Next.js configuration
├── package.json # Project metadata and dependencies
├── postcss.config.js # PostCSS config (used with Tailwind)
├── README.md # Project documentation
├── svgo.config.js # Svgo config
├── tailwind.config.js # Tailwind CSS configuration
├── tsconfig.json # TypeScript configuration
├── yarn.lock # Yarn lockfile (dependency versions)
├── yarn-error.log # Yarn error log (if present)
