import { readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import react from '@vitejs/plugin-react'
import { transformWithOxc, type Plugin } from 'vite'
import { defineConfig } from 'vitest/config'

const srcDir = fileURLToPath(new URL('./src', import.meta.url))

// CRA resolves bare imports from `src` (tsconfig `baseUrl: "src"`), e.g. `hooks/sso` or
// `language`. Mirror that for every top-level entry in src.
const srcAliases = readdirSync(srcDir, { withFileTypes: true }).map((entry) => {
  const name = entry.isDirectory() ? entry.name : entry.name.replace(/\.[jt]sx?$/, '')
  return { find: new RegExp(`^${name}(?=/|$)`), replacement: resolve(srcDir, name) }
})

// CRA allows JSX in `.js` files; Vite's Oxc transform only parses JSX in `.jsx`/`.tsx`.
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
  resolve: { alias: srcAliases },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: [
      'src/**/*.{test,spec}.{js,jsx,ts,tsx}',
      'tests/unit/**/*.{test,spec}.{js,jsx,ts,tsx}'
    ],
    coverage: {
      provider: 'v8',
      reportsDirectory: 'coverage',
      reporter: ['text', 'text-summary', 'html'],
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      exclude: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}', 'src/index.js', 'src/**/*.d.ts']
    }
  }
})
