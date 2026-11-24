import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { Country, Id, Organization, Page } from '@/types/api'
import { landscapeKeys } from './landscapes'

type OrganizationId = Id | string

/**
 * Filters /organizations accepts. All are case-insensitive; results are always A to Z.
 * `q` matches part of the name, `region` is an M49 region name (see /regions) and
 * `country` a country's ISO3 code.
 */
export type OrganizationFilters = { q?: string; region?: string; country?: string }

const FILTER_KEYS = ['q', 'region', 'country'] as const satisfies (keyof OrganizationFilters)[]

// Trimmed, without empty values, so '' and '  ' share the unfiltered cache entry.
export const cleanOrganizationFilters = (filters: OrganizationFilters = {}): OrganizationFilters =>
  Object.fromEntries(
    FILTER_KEYS.map((key) => [key, filters[key]?.trim()]).filter(([, value]) => value)
  )

export const organizationKeys = {
  all: ['organizations'] as const,
  list: (filters: OrganizationFilters = {}) =>
    ['organizations', 'list', cleanOrganizationFilters(filters)] as const,
  detail: (organizationId: OrganizationId) => ['organizations', String(organizationId)] as const
}

// /organizations is paginated; the app shows every matching organization at once, so it reads
// all pages.
const ORGANIZATIONS_PER_PAGE = 100

export const organizationsPath = (filters: OrganizationFilters, page: number) =>
  `/organizations?${new URLSearchParams({
    page: String(page),
    per_page: String(ORGANIZATIONS_PER_PAGE),
    ...cleanOrganizationFilters(filters)
  })}`

const getAllOrganizations = async (filters: OrganizationFilters, signal: AbortSignal) => {
  const organizations: Organization[] = []
  for (let page = 1; ; page++) {
    const { data, meta } = await api.get<Page<Organization>>(organizationsPath(filters, page), {
      signal
    })
    organizations.push(...data)
    if (!data.length || organizations.length >= meta.total) return organizations
  }
}

export const organizationQueries = {
  list: (filters: OrganizationFilters = {}) =>
    queryOptions({
      queryKey: organizationKeys.list(filters),
      queryFn: ({ signal }) => getAllOrganizations(filters, signal)
    }),
  detail: (organizationId: OrganizationId) =>
    queryOptions({
      queryKey: organizationKeys.detail(organizationId),
      queryFn: ({ signal }) => api.get<Organization>(`/organizations/${organizationId}`, { signal })
    })
}

// The countries an organization can work in. They rarely change, so they're kept for the session.
export const countryQueries = {
  list: () =>
    queryOptions({
      queryKey: ['countries'] as const,
      queryFn: ({ signal }) => api.get<Country[]>('/countries', { signal }),
      staleTime: Infinity
    })
}

// The M49 regions organizations can be filtered by, e.g. 'Africa'.
export const regionQueries = {
  list: () =>
    queryOptions({
      queryKey: ['regions'] as const,
      queryFn: ({ signal }) => api.get<string[]>('/regions', { signal }),
      staleTime: Infinity
    })
}

export type OrganizationInput = { organization_name: string; country_location_ids: string[] }

// Landscapes list their organizations by name, so organization changes refetch them too.
const useInvalidateOrganizations = () => {
  const queryClient = useQueryClient()
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: organizationKeys.all }),
      queryClient.invalidateQueries({ queryKey: landscapeKeys.all })
    ])
}

export function useCreateOrganization() {
  const invalidate = useInvalidateOrganizations()
  return useMutation({
    mutationFn: (organization: OrganizationInput) =>
      api.post<Organization>('/organizations', organization),
    onSuccess: invalidate
  })
}

export function useUpdateOrganization(organizationId: OrganizationId) {
  const invalidate = useInvalidateOrganizations()
  return useMutation({
    mutationFn: (organization: OrganizationInput) =>
      api.patch<Organization>(`/organizations/${organizationId}`, organization),
    onSuccess: invalidate
  })
}

export const downloadOrganizationReport = (organizationId: OrganizationId, publicOnly: boolean) =>
  api.blob(`/report/answers_as_xlsx?organization_id=${organizationId}&public_only=${publicOnly}`)
