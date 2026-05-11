# SoroProtocol Mobile

> The mobile application for SoroProtocol — real-time payment streaming on Stellar.

SoroProtocol Mobile is a React Native / Expo application that lets users manage token payment streams from their phone. It delivers push notifications for stream lifecycle events, renders a live balance counter that ticks as tokens accrue, and stores wallet credentials securely using Expo SecureStore.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Getting Started](#getting-started)
- [Screens](#screens)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Contributing](#contributing)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Expo](https://expo.dev) ~51 / React Native 0.74 |
| Navigation | [Expo Router](https://expo.github.io/router) ~3.5 (file-based routing) |
| Language | TypeScript 5 |
| Animations | React Native Reanimated ~3.10 |
| Notifications | Expo Notifications ~0.28 |
| Secure Storage | Expo SecureStore ~13.0 |
| Testing | Jest + jest-expo |

---

## Features

- **Stream management** — view active streams, create new streams, cancel existing ones
- **Live balance counter** — animated counter that updates in real time as tokens accrue
- **Push notifications** — receive alerts for `stream.created`, `stream.withdrawn`, and `stream.cancelled` events
- **Secure wallet storage** — private keys and credentials stored with Expo SecureStore
- **Vesting tracking** — browse and manage token vesting schedules
- **Typed API service** — all backend calls routed through a typed service layer

---

## Getting Started

**Prerequisites:** Node.js 20+, npm 9+, [Expo Go](https://expo.dev/go) installed on your device or an iOS/Android simulator.

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Open .env and fill in the API URL and contract IDs

# 3. Start the Expo development server
npx expo start
```

Scan the QR code in your terminal with the Expo Go app to run on a physical device, or press `i` / `a` to launch in an iOS or Android simulator.

---

## Screens

| Route | Description |
|-------|-------------|
| `/(tabs)/` | Home — list of active streams for the connected address |
| `/(tabs)/create` | Form to create a new payment stream |
| `/(tabs)/vesting` | Vesting schedule list and claim interface |
| `/(tabs)/settings` | Wallet and notification settings |
| `/stream/[id]` | Stream detail view with live balance and action buttons |

---

## Project Structure

```
app/
├── _layout.tsx           # Root navigation layout
├── (tabs)/               # Bottom tab screens
│   ├── index.tsx         # Home — stream list
│   ├── create.tsx        # Stream creation form
│   ├── vesting.tsx       # Vesting management
│   ├── settings.tsx      # App settings
│   └── _layout.tsx       # Tab bar layout
└── stream/[id].tsx       # Stream detail screen

src/
├── components/           # StreamCard, BalanceCounter
├── context/              # WalletContext
├── constants/            # Colors, Layout
├── hooks/                # useStreams, useNotifications
└── services/             # api.ts, notifications.ts
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `EXPO_PUBLIC_API_URL` | Yes | SoroProtocol backend API base URL |
| `EXPO_PUBLIC_NETWORK` | Yes | `testnet` or `mainnet` |
| `EXPO_PUBLIC_STREAM_CONTRACT_ID` | Yes | Deployed stream contract address |

See [`.env.example`](./.env.example) for the complete reference.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npx expo start` | Start the Expo development server |
| `npm run ios` | Launch in iOS simulator |
| `npm run android` | Launch in Android emulator |
| `npm run test` | Run tests with Jest in watch mode |
| `npm run lint` | Lint source files with ESLint |

---

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for branch conventions, commit message guidelines, and the pull request process.
