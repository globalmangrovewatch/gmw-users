import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { Id, OrganizationRole, User } from '@/types/api'
import { organizationKeys } from './organizations'

type OrganizationId = Id | string

// Under the organization's key, so invalidating an organization refetches its users.
export const organizationUserKeys = {
  all: (organizationId: OrganizationId) =>
    [...organizationKeys.detail(organizationId), 'users'] as const
}

export const organizationUserQueries = {
  list: (organizationId: OrganizationId) =>
    queryOptions({
      queryKey: organizationUserKeys.all(organizationId),
      queryFn: ({ signal }) => api.get<User[]>(`/organizations/${organizationId}/users`, { signal })
    })
}

const usersPath = (organizationId: OrganizationId) => `/organizations/${organizationId}/users`

const useInvalidateUsers = (organizationId: OrganizationId) => {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: organizationUserKeys.all(organizationId) })
}

export function useAddOrganizationUser(organizationId: OrganizationId) {
  const invalidate = useInvalidateUsers(organizationId)
  return useMutation({
    mutationFn: (user: { email: string; role: string }) =>
      api.post(usersPath(organizationId), user),
    onSuccess: invalidate
  })
}

export function useUpdateOrganizationUserRole(organizationId: OrganizationId) {
  const invalidate = useInvalidateUsers(organizationId)
  return useMutation({
    mutationFn: ({ email, role }: { email: string; role: OrganizationRole }) =>
      api.patch<User>(`${usersPath(organizationId)}/${email}`, { role }),
    onSuccess: invalidate
  })
}

export function useRemoveOrganizationUser(organizationId: OrganizationId) {
  const invalidate = useInvalidateUsers(organizationId)
  return useMutation({
    mutationFn: (email: string) => api.delete(`${usersPath(organizationId)}/${email}`),
    onSuccess: invalidate
  })
}
