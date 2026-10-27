import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { Id, Landscape } from '@/types/api'
import { siteKeys } from './sites'

type LandscapeId = Id | string

export const landscapeKeys = {
  all: ['landscapes'] as const,
  detail: (landscapeId: LandscapeId) => ['landscapes', String(landscapeId)] as const
}

export const landscapeQueries = {
  list: () =>
    queryOptions({
      queryKey: landscapeKeys.all,
      queryFn: ({ signal }) => api.get<Landscape[]>('/landscapes', { signal })
    }),
  detail: (landscapeId: LandscapeId) =>
    queryOptions({
      queryKey: landscapeKeys.detail(landscapeId),
      queryFn: ({ signal }) => api.get<Landscape>(`/landscapes/${landscapeId}`, { signal })
    })
}

export type LandscapeInput = { landscape_name: string; organizations: Id[] }

// Sites show their landscape's name, so landscape changes refetch the site list too (exactly,
// so open site forms keep their answers).
const useInvalidateLandscapes = () => {
  const queryClient = useQueryClient()
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: landscapeKeys.all }),
      queryClient.invalidateQueries({ queryKey: siteKeys.all, exact: true })
    ])
}

export function useCreateLandscape() {
  const invalidate = useInvalidateLandscapes()
  return useMutation({
    mutationFn: (landscape: LandscapeInput) => api.post<Landscape>('/landscapes', landscape),
    onSuccess: invalidate
  })
}

export function useUpdateLandscape(landscapeId: LandscapeId) {
  const invalidate = useInvalidateLandscapes()
  return useMutation({
    mutationFn: (landscape: LandscapeInput) =>
      api.patch<Landscape>(`/landscapes/${landscapeId}`, landscape),
    onSuccess: invalidate
  })
}

export function useDeleteLandscape(landscapeId: LandscapeId) {
  const invalidate = useInvalidateLandscapes()
  return useMutation({
    mutationFn: () => api.delete(`/landscapes/${landscapeId}`),
    onSuccess: invalidate
  })
}
