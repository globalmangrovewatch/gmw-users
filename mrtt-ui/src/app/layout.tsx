import '@/styles/globals.css'

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

const GOOGLE_FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Open+Sans:wdth,wght@75..100,300..800&family=Source+Code+Pro:wght@200..900&display=swap'

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
      <head>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='' />
        {/* Literal family names, not next/font: emotion and MUI reference 'Open Sans' by name. */}
        <link rel='stylesheet' href={GOOGLE_FONTS_URL} />
      </head>
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
