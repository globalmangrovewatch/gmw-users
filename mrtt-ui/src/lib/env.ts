import { z } from 'zod'

// Validated once, when the app loads: a missing or malformed variable fails fast with the
// variable's name instead of surfacing later as a request to `undefined/sites`.
const schema = z.object({
  REACT_APP_API_URL: z.url(),
  REACT_APP_AUTH_URL: z.url(),
  REACT_APP_MAPBOX_ACCESS_TOKEN: z.string().min(1),
  // Optional: without it the silent GMW SSO check is skipped and users sign in with the form.
  REACT_APP_GMW_URL: z.url().optional()
})

// Each variable is read by its full name because the bundler only inlines literal
// `process.env.REACT_APP_*` references. Empty strings count as unset.
const parsed = schema.safeParse({
  REACT_APP_API_URL: process.env.REACT_APP_API_URL,
  REACT_APP_AUTH_URL: process.env.REACT_APP_AUTH_URL,
  REACT_APP_MAPBOX_ACCESS_TOKEN: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN,
  REACT_APP_GMW_URL: process.env.REACT_APP_GMW_URL || undefined
})

if (!parsed.success) {
  throw new Error(`Invalid environment variables:\n${z.prettifyError(parsed.error)}`)
}

export const env = {
  API_URL: parsed.data.REACT_APP_API_URL,
  AUTH_URL: parsed.data.REACT_APP_AUTH_URL,
  MAPBOX_ACCESS_TOKEN: parsed.data.REACT_APP_MAPBOX_ACCESS_TOKEN,
  GMW_URL: parsed.data.REACT_APP_GMW_URL
} as const
