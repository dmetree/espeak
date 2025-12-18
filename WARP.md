# Easy speak installation

Package manager: Yarn (yarn.lock present). Node 20 for Cloud Functions.

Essential commands

* Install deps

```sh
yarn install
```

* Run Next.js app (dev/build/start)

```sh
yarn dev
# build then run
yarn build && yarn start
```

* Lint

```sh
yarn lint
```

* Unit tests (Vitest, blockchain contracts)

```sh
# run all once
yarn test:unit
# watch
yarn watch:unit
# watch without recompiling contracts (uses cached address)
BUILD=false yarn watch:unit
# run a single file
yarn test:unit blockchain/ergo/contracts/v1Contracts.spec.ts
# filter a single test by name
yarn test:unit blockchain/ergo/contracts/v1Contracts.spec.ts -t "should create and accept a new session"
```

* Tailwind and utilities

```sh
# rebuild Tailwind CSS to public/styles.css
yarn build:tailwind
# find unused exports/files
yarn knip
# optimize SVGs (manual)
npx svgo ./components/shared/assets/psy_icons_svg --recursive
```

* Firebase Functions (in functions/)

```sh
# build TS -> lib/
(cd functions && npm run build)
# emulate functions locally
(cd functions && npm run serve)
# deploy only functions (uses .firebaserc project)
(cd functions && npm run deploy)
# view logs
(cd functions && npm run logs)
```

Environment

* Next.js client uses Firebase web config from .env.local:
  * NEXT\_PUBLIC\_FIREBASE\_API\_KEY
  * NEXT\_PUBLIC\_FIREBASE\_AUTH\_DOMAIN
  * NEXT\_PUBLIC\_FIREBASE\_PROJECT\_ID
  * NEXT\_PUBLIC\_FIREBASE\_STORAGE\_BUCKET
  * NEXT\_PUBLIC\_FIREBASE\_MESSAGING\_SENDER\_ID
  * NEXT\_PUBLIC\_FIREBASE\_APP\_ID
* Contract tests: set BUILD=false to skip recompilation and use the cached address (see blockchain/ergo/contracts/v1Contracts.spec.ts).

Architecture overview

* Web app: Next.js (pages router in pages/), React 18, Tailwind (tailwind.config.js) + CSS Modules. Global styles in styles/globals.css.
* State: Redux Toolkit/react-redux; actions and reducers under store/actions and store/reducers.
* Firebase (client): components/shared/utils/firebase/init.ts initializes Auth, Firestore, Storage using NEXT\_PUBLIC\_\* vars; additional Firestore helpers in components/shared/utils/firebase/fs-collection/.
* Cloud Functions: separate package in functions/ compiled with tsc and deployed via firebase.json. Triggers in functions/src/index.ts:
  * onDocumentCreated(requests/{requestId}): remove scheduledUnixtime from users/{specUid}.freeTimestamps when a request is created.
  * onDocumentDeleted(requests/{requestId}): restore scheduledUnixtime back into users/{specUid}.freeTimestamps when a request is deleted.
  * onDocumentUpdated(requests/{requestId}): when status changes 0→1, append a notification object to users/{clientUid}.notifications.
* Blockchain (Ergo): contract logic and tests under blockchain/ergo; Vitest with @fleet-sdk mock chain/compiler validates session lifecycle (create, accept, cancel, end) and token/accounting rules.

Notes

* See README.md for quickstart and project layout snapshots.
