import type { ReactNode } from 'react'

import GlobalLayout from '@/components/GlobalLayout'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return <GlobalLayout>{children}</GlobalLayout>
}
