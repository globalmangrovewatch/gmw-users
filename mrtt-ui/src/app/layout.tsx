import '@/index.css'

import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import type { ReactNode } from 'react'

import { env } from '@/lib/env'
import Providers from './providers'

export const metadata: Metadata = {
  title: 'Global Mangrove Watch',
  description: 'Global Mangrove Watch',
  icons: { icon: '/favicon.ico', apple: '/favicon.ico' },
  manifest: '/manifest.json'
}

export const viewport: Viewport = {
  themeColor: '#009b93'
}

const transifexSettings = {
  api_key: env.NEXT_PUBLIC_TRANSIFEX_API_KEY,
  detectlang: true,
  autocollect: true,
  manual_init: false,
  dynamic: true
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en'>
      <body>
        {env.NEXT_PUBLIC_TRANSIFEX_API_KEY && (
          <>
            <Script id='transifex-live-settings' strategy='beforeInteractive'>
              {`window.liveSettings = ${JSON.stringify(transifexSettings)}`}
            </Script>
            <Script src='https://cdn.transifex.com/live.js' strategy='afterInteractive' />
          </>
        )}
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
