import { useEffect, useState } from 'react'
import axios from 'axios'
import { UseFormReturn } from 'react-hook-form'

type Options = {
  enabled?: boolean
}

export function useRegistrationAnswers(
  form: UseFormReturn<any>,
  apiUrl: string,
  options: Options = {}
) {
  const { reset } = form
  const { enabled = true } = options

  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    if (!enabled) return

    let cancelled = false

    const fetchAnswers = async () => {
      setIsLoading(true)
      setIsError(false)

      try {
        const { data } = await axios.get(apiUrl)
        if (cancelled) return

        reset(data)
      } catch (e) {
        if (!cancelled) setIsError(true)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    fetchAnswers()

    return () => {
      cancelled = true
    }
  }, [apiUrl, enabled, reset])

  return { isLoading, isError }
}
