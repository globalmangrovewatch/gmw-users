import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // The repo root has its own pnpm lockfile; the app is this directory.
  turbopack: { root: __dirname }
}

export default nextConfig
