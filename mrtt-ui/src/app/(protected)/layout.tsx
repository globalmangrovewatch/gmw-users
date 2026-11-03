import type { ReactNode } from 'react'

import ProtectedRoutes from '@/components/Auth/ProtectedRoutes'
import GlobalLayout from '@/components/GlobalLayout'

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <GlobalLayout>
      <ProtectedRoutes>{children}</ProtectedRoutes>
    </GlobalLayout>
  )
}
