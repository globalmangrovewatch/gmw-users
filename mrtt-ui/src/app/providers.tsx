'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'

import { Toaster } from '@/components/ui/toast'
import { AuthProvider } from '@/hooks/useAuth'
import { getQueryClient } from '@/lib/queryClient'

export default function Providers({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster position='top-center' duration={5000} closeButton />
        {children}
      </AuthProvider>
    </QueryClientProvider>
  )
}
