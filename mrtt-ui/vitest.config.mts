import { fileURLToPath } from 'node:url'

import react from '@vitejs/plugin-react'
import { transformWithOxc, type Plugin } from 'vite'
import { defineConfig } from 'vitest/config'

const srcDir = fileURLToPath(new URL('./src', import.meta.url))

// Mirrors `paths` in tsconfig.json and tests/tsconfig.json.
const aliases = [
  { find: /^@\//, replacement: `${srcDir}/` },
  {
    find: /^fixtures(?=\/|$)/,
    replacement: fileURLToPath(new URL('./tests/fixtures', import.meta.url))
  }
]

// Next.js allows JSX in `.js` files; Vite's Oxc transform only parses JSX in `.jsx`/`.tsx`.
// Compile `src/**/*.js` as JSX first so the rest of the pipeline sees plain JS.
const jsxInJs = (): Plugin => ({
  name: 'mrtt:jsx-in-js',
  enforce: 'pre',
  async transform(code, id) {
    if (!id.startsWith(srcDir) || !id.endsWith('.js')) return null
    const result = await transformWithOxc(code, id, {
      lang: 'jsx',
      jsx: { runtime: 'automatic' },
      sourcemap: true
    })
    return { code: result.code, map: result.map }
  }
})

export default defineConfig({
  plugins: [jsxInJs(), react()],
  resolve: { alias: aliases },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    // src/lib/env.ts validates these at import time.
    env: {
      NEXT_PUBLIC_API_URL: 'http://api.test',
      NEXT_PUBLIC_AUTH_URL: 'http://auth.test',
      NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: 'test-mapbox-token',
      NEXT_PUBLIC_GMW_URL: 'https://gmw.test'
    },
    include: [
      'src/**/*.{test,spec}.{js,jsx,ts,tsx}',
      'tests/unit/**/*.{test,spec}.{js,jsx,ts,tsx}'
    ],
    coverage: {
      provider: 'v8',
      reportsDirectory: 'coverage',
      reporter: ['text', 'text-summary', 'html'],
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      exclude: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}', 'src/app/**', 'src/**/*.d.ts']
    }
  }
})
