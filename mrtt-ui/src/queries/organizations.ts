import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { Country, Id, Organization, Page } from '@/types/api'
import { landscapeKeys } from './landscapes'

type OrganizationId = Id | string

export const organizationKeys = {
  all: ['organizations'] as const,
  detail: (organizationId: OrganizationId) => ['organizations', String(organizationId)] as const
}

// /organizations is paginated; the app shows every organization at once, so it reads all pages.
const ORGANIZATIONS_PER_PAGE = 100

const getAllOrganizations = async (signal: AbortSignal) => {
  const organizations: Organization[] = []
  for (let page = 1; ; page++) {
    const { data, meta } = await api.get<Page<Organization>>(
      `/organizations?page=${page}&per_page=${ORGANIZATIONS_PER_PAGE}`,
      { signal }
    )
    organizations.push(...data)
    if (!data.length || organizations.length >= meta.total) return organizations
  }
}

export const organizationQueries = {
  list: () =>
    queryOptions({
      queryKey: organizationKeys.all,
      queryFn: ({ signal }) => getAllOrganizations(signal)
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
