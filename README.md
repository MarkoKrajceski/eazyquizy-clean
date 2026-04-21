# EazyQuizy

A mobile quiz app that generates quiz cards on any topic in any language, powered by Claude AI.

## Features

- Pick any language from 29 supported options
- Choose a topic (Math, History, Science, etc.)
- Select a quiz mode:
  - **True / False** — swipe right for Yes, left for No
  - **Flashcards** — flip cards to reveal answers
  - **Swipe Deck** — swipe through cards at your own pace
- AI generates 10 unique questions every time

## Stack

- [Expo](https://expo.dev) SDK 54 / React Native 0.81
- [expo-router](https://expo.github.io/router) for file-based navigation
- [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/) for card animations
- [eazyquizy-worker](https://github.com/MarkoKrajceski/eazyquizy-worker) — Cloudflare Worker backend that calls the Anthropic API

## Setup

```bash
npm install
```

Create a `.env` file in the root:

```
EXPO_PUBLIC_WORKER_URL=https://your-worker.your-subdomain.workers.dev
```

Then run:

```bash
npx expo run:android
# or
npx expo run:ios
```

## Backend

The app does not call the Anthropic API directly. All AI requests go through a Cloudflare Worker that keeps the API key server-side. See [eazyquizy-worker](https://github.com/MarkoKrajceski/eazyquizy-worker).
