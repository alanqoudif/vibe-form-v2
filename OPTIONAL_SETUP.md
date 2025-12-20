# Optional Setup Guide

This document describes optional enhancements that can be added to the project.

## Error Tracking (Sentry)

To add Sentry for error tracking:

1. Install Sentry:
```bash
npm install @sentry/nextjs
```

2. Initialize Sentry in `src/lib/sentry.ts`:
```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});
```

3. Update `src/components/error-boundary.tsx` to use Sentry:
```typescript
componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
  Sentry.captureException(error, { contexts: { react: errorInfo } });
}
```

4. Add `NEXT_PUBLIC_SENTRY_DSN` to environment variables.

## Testing Setup

To add Jest and React Testing Library:

1. Install dependencies:
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom @types/jest
```

2. Create `jest.config.js`:
```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}

module.exports = createJestConfig(customJestConfig)
```

3. Create `jest.setup.js`:
```javascript
import '@testing-library/jest-dom'
```

4. Update `package.json` scripts:
```json
"test": "jest",
"test:watch": "jest --watch",
"test:coverage": "jest --coverage"
```

## Notes

- Error tracking and testing are optional but recommended for production
- The current setup works without these features
- All critical functionality is already implemented and tested manually

