# SoroProtocol Mobile

React Native / Expo mobile app for managing payment streams on Stellar.

## Features

- View and manage active payment streams
- Real-time animated balance counter
- Create new streams with form validation
- Vesting schedule tracking
- Push notifications for stream events
- Secure wallet storage via Expo SecureStore

## Getting Started

```bash
npm install
cp .env.example .env
npx expo start
```

Scan the QR code with [Expo Go](https://expo.dev/go) to run on your device.

## Environment Variables

| Variable | Description |
|---|---|
| `EXPO_PUBLIC_API_URL` | SoroProtocol API base URL |
| `EXPO_PUBLIC_NETWORK` | `testnet` or `mainnet` |
| `EXPO_PUBLIC_STREAM_CONTRACT_ID` | Stream contract address |

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).
