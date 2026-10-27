import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

// Validated once, when the app loads: a missing or malformed variable fails fast with the
// variable's name instead of surfacing later as a request to `undefined/sites`.
export const env = createEnv({
  client: {
    NEXT_PUBLIC_API_URL: z.url(),
    NEXT_PUBLIC_AUTH_URL: z.url(),
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: z.string().min(1),
    // Optional: without it the silent GMW SSO check is skipped and users sign in with the form.
    NEXT_PUBLIC_GMW_URL: z.url().optional(),
    // Optional: without it Transifex Live is not loaded and the app stays in English.
    NEXT_PUBLIC_TRANSIFEX_API_KEY: z.string().optional()
  },
  // Each variable is read by its full name because Next.js only inlines literal
  // `process.env.NEXT_PUBLIC_*` references into the client bundle.
  runtimeEnv: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_AUTH_URL: process.env.NEXT_PUBLIC_AUTH_URL,
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
    NEXT_PUBLIC_GMW_URL: process.env.NEXT_PUBLIC_GMW_URL,
    NEXT_PUBLIC_TRANSIFEX_API_KEY: process.env.NEXT_PUBLIC_TRANSIFEX_API_KEY
  },
  // Empty strings (e.g. `NEXT_PUBLIC_GMW_URL=` in a .env file) count as unset.
  emptyStringAsUndefined: true,
  // CI builds and lints without the deployment's variables; Heroku and Vercel do set them.
  skipValidation: process.env.SKIP_ENV_VALIDATION === 'true'
})
