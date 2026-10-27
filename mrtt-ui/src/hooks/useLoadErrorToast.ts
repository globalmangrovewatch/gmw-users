import { useEffect } from 'react'
import { toast } from 'react-toastify'

import { isApiError } from '@/lib/api'
import language from '@/language'

export const isNotFound = (error: unknown) => isApiError(error) && error.status === 404

// Shows the generic "could not load" toast when any of the given query errors is set, except a
// 404, which views show as "this item doesn't exist".
export function useLoadErrorToast(...errors: unknown[]) {
  const failed = errors.some((error) => error && !isNotFound(error))
  useEffect(() => {
    if (failed) toast.error(language.error.apiLoad)
  }, [failed])
}
