'use client'

import { ThemeProvider } from '@mui/material/styles'
import { QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'

import { Toaster } from '@/components/ui/toast'
import { AuthProvider } from '@/hooks/useAuth'
import EmotionRegistry from '@/lib/EmotionRegistry'
import { getQueryClient } from '@/lib/queryClient'
import themeMui from '@/styles/themeMui'

export default function Providers({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient()

  return (
    <EmotionRegistry>
      <ThemeProvider theme={themeMui}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            {/* Same placement and timing as the react-toastify container it replaced. */}
            <Toaster position='top-center' duration={5000} closeButton />
            {children}
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </EmotionRegistry>
  )
}
