import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { Id, MonitoringForm, RegistrationAnswer, Site } from '@/types/api'

type SiteId = Id | string

// Everything about a site sits under ['sites', id], so invalidating a site also refetches its
// registration answers and monitoring forms.
export const siteKeys = {
  all: ['sites'] as const,
  detail: (siteId: SiteId) => ['sites', String(siteId)] as const,
  registration: (siteId: SiteId) => ['sites', String(siteId), 'registration'] as const,
  monitors: (siteId: SiteId) => ['sites', String(siteId), 'monitors'] as const,
  monitor: (siteId: SiteId, monitorId: SiteId) =>
    ['sites', String(siteId), 'monitors', String(monitorId)] as const
}

// Answers fill the form once; a background refetch would overwrite what the user is editing.
// They are refetched only after a save (see `useSaveRegistrationSection`).
const answersOptions = { staleTime: Infinity, refetchOnMount: false } as const

export const siteQueries = {
  list: () =>
    queryOptions({
      queryKey: siteKeys.all,
      queryFn: ({ signal }) => api.get<Site[]>('/sites', { signal })
    }),
  detail: (siteId: SiteId) =>
    queryOptions({
      queryKey: siteKeys.detail(siteId),
      queryFn: ({ signal }) => api.get<Site>(`/sites/${siteId}`, { signal })
    }),
  registration: (siteId: SiteId) =>
    queryOptions({
      queryKey: siteKeys.registration(siteId),
      queryFn: ({ signal }) =>
        api.get<RegistrationAnswer[]>(`/sites/${siteId}/registration_intervention_answers`, {
          signal
        }),
      ...answersOptions
    }),
  monitors: (siteId: SiteId) =>
    queryOptions({
      queryKey: siteKeys.monitors(siteId),
      queryFn: ({ signal }) =>
        api.get<MonitoringForm[]>(`/sites/${siteId}/monitoring_answers`, { signal })
    }),
  monitor: (siteId: SiteId, monitorId: SiteId) =>
    queryOptions({
      queryKey: siteKeys.monitor(siteId, monitorId),
      queryFn: ({ signal }) =>
        api.get<MonitoringForm>(`/sites/${siteId}/monitoring_answers/${monitorId}`, { signal }),
      ...answersOptions
    })
}

export type SiteInput = Partial<Omit<Site, 'id'>>

// Refetches the site list and, if given, one site's details. Exact keys, so the site's
// registration answers are not refetched: that would overwrite unsaved edits in an open form.
const useInvalidateSites = () => {
  const queryClient = useQueryClient()
  return (siteId?: SiteId) =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: siteKeys.all, exact: true }),
      siteId !== undefined &&
        queryClient.invalidateQueries({ queryKey: siteKeys.detail(siteId), exact: true })
    ])
}

export function useCreateSite() {
  const invalidateSites = useInvalidateSites()
  return useMutation({
    mutationFn: (site: SiteInput) => api.post<Site>('/sites', site),
    onSuccess: () => invalidateSites()
  })
}

// PATCH changes the given fields. `replace` sends a PUT with the whole site, which the API needs
// for `section_data_visibility` (https://github.com/globalmangrovewatch/gmw-users/issues/260).
export function useUpdateSite(siteId: SiteId, { replace = false } = {}) {
  const invalidateSites = useInvalidateSites()
  return useMutation({
    mutationFn: (site: SiteInput) =>
      replace ? api.put<Site>(`/sites/${siteId}`, site) : api.patch<Site>(`/sites/${siteId}`, site),
    onSuccess: () => invalidateSites(siteId)
  })
}

export function useDeleteMonitor(siteId: SiteId) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (monitorId: SiteId) =>
      api.delete(`/sites/${siteId}/monitoring_answers/${monitorId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: siteKeys.monitors(siteId) })
  })
}

export const downloadAllSitesReport = (publicOnly: boolean) =>
  api.blob(`/report/answers_as_xlsx?public_only=${publicOnly}`)

export const downloadSiteReport = (siteId: SiteId, publicOnly: boolean) =>
  api.blob(`/report/answers_as_pdf/${siteId}?public_only=${publicOnly}`)
