'use client'

import { ThemeProvider } from '@mui/material/styles'
import { QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'

import { CustomToastContainer } from '@/components/CustomToastContainer'
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
            <CustomToastContainer />
            {children}
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </EmotionRegistry>
  )
}
