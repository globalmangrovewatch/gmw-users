import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { Id, Organization } from '@/types/api'
import { landscapeKeys } from './landscapes'

type OrganizationId = Id | string

export const organizationKeys = {
  all: ['organizations'] as const,
  detail: (organizationId: OrganizationId) => ['organizations', String(organizationId)] as const
}

export const organizationQueries = {
  list: () =>
    queryOptions({
      queryKey: organizationKeys.all,
      queryFn: ({ signal }) => api.get<Organization[]>('/organizations', { signal })
    }),
  detail: (organizationId: OrganizationId) =>
    queryOptions({
      queryKey: organizationKeys.detail(organizationId),
      queryFn: ({ signal }) => api.get<Organization>(`/organizations/${organizationId}`, { signal })
    })
}

export type OrganizationInput = { organization_name: string }

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
