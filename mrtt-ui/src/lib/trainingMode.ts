'use client'

import { useSyncExternalStore } from 'react'

import { env } from '@/lib/env'
import { getQueryClient } from '@/lib/queryClient'

// Training mode sends MRTT API requests to the staging API instead of the real one, so users
// can practise without touching real sites. It is remembered per browser.
export const TRAINING_API_URL = 'https://mangrove-atlas-api-staging.herokuapp.com/api/v2'

const STORAGE_KEY = 'mrtt-training-mode'

type Listener = () => void
const listeners = new Set<Listener>()

const readStored = () => {
  try {
    return typeof window !== 'undefined' && window.localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

let enabled = readStored()

/** Whether requests currently go to the training environment. */
export const isTrainingMode = () => enabled

export function setTrainingMode(next: boolean) {
  if (next === enabled) return
  enabled = next
  try {
    window.localStorage.setItem(STORAGE_KEY, String(next))
  } catch {
    // Private mode or blocked storage: the choice lasts until reload.
  }
  // Cached sites, landscapes and organizations belong to the other environment.
  getQueryClient().clear()
  listeners.forEach((listener) => listener())
}

const subscribe = (listener: Listener) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** Training mode, re-rendering when it changes. Off during server rendering. */
export const useTrainingMode = () => useSyncExternalStore(subscribe, isTrainingMode, () => false)

/** The MRTT API base URL for the current mode. */
export const getApiUrl = () => (enabled ? TRAINING_API_URL : env.NEXT_PUBLIC_API_URL)
