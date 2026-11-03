import type { ReactNode } from 'react'

import GlobalLayout from '@/components/GlobalLayout'

// The login pages use the new landing design.
export default function LandingLayout({ children }: { children: ReactNode }) {
  return <GlobalLayout isLanding>{children}</GlobalLayout>
}
