# Calculator POC Monorepo

A multi-platform calculator POC demonstrating monorepo architecture with shared code across Web, Mobile (Expo), Desktop (Tauri), and Backend services.

## Architecture

```
packages/
├── apps/
│   ├── mobile/          # Expo (iOS/Android) app
│   ├── web/             # React web app (Vite)
│   └── desktop/         # Tauri desktop wrapper
├── backend/
│   ├── api/             # REST API server (Hono)
│   └── mcp/             # MCP server for AI tool integration
├── shared/
│   ├── calculator-engine/  # Core expression parser/evaluator
│   ├── contracts/          # Zod schemas and API types
│   ├── api-client/         # Typed HTTP client
│   └── ui/                 # Shared React hooks and types
└── config/
    ├── tsconfig/        # Shared TypeScript configs
    └── eslint-config/   # Shared ESLint config
```

## Getting Started

### Prerequisites

- Node.js >= 22
- [pnpm](https://pnpm.io/) >= 10.28
- [Trunk](https://trunk.io/) (for linting and formatting)
- For mobile: [Expo CLI](https://docs.expo.dev/get-started/installation/)
- For desktop: [Rust](https://rustup.rs/) and Tauri prerequisites

### Installation

```bash
pnpm install
```

### Development

```bash
# Start all services
pnpm dev

# Or start specific apps
pnpm dev:api    # Start API server on :3001
pnpm dev:web    # Start web app on :3000
pnpm dev:mobile # Start Expo dev server
```

### Build

```bash
pnpm build
```

### Testing

```bash
pnpm test        # Run tests once
pnpm test:watch  # Run tests in watch mode
```

## Project Features

### Shared Calculator Engine

Pure TypeScript expression parser and evaluator supporting:
- Basic arithmetic: `+`, `-`, `*`, `/`
- Parentheses for grouping
- Decimal numbers
- Unary operators
- Safe evaluation (no `eval()`)

### REST API

- `POST /v1/evaluate` - Evaluate an expression
- `GET /v1/health` - Health check

### MCP Server

Exposes a `calculator.evaluate` tool for AI assistants to perform calculations.

### Client Apps

All client apps share:
- Calculator business logic via `@calculator/engine`
- UI hooks and types via `@calculator/ui`
- API client via `@calculator/api-client`
- Type contracts via `@calculator/contracts`

## API Reference

### Evaluate Expression

```bash
curl -X POST http://localhost:3001/v1/evaluate \
  -H "Content-Type: application/json" \
  -d '{"expression": "(1 + 2) * 3"}'
```

Response:
```json
{
  "ok": true,
  "result": "9",
  "normalized": "(1+2)*3"
}
```

## Notes

### Mobile Type Checking

The mobile app uses React 18 (Expo SDK 52) while other packages use React 19. In a monorepo with pnpm, this can cause type conflicts due to hoisting. For strict type checking in the mobile app, run it in isolation:

```bash
cd packages/apps/mobile
pnpm install
pnpm typecheck
```

### Desktop Builds

Full Tauri builds require Rust. For the POC, the build script runs Vite build only. To create native desktop bundles:

```bash
cd packages/apps/desktop
pnpm build:tauri
```

## License

Apache-2.0
