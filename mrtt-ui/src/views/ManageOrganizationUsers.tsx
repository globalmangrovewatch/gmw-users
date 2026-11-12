'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { LuUserMinus } from 'react-icons/lu'

import ConfirmPrompt from '@/components/ConfirmPrompt/ConfirmPrompt'
import LoadingIndicator from '@/components/LoadingIndicator'
import LoadingIndicatorOverlay from '@/components/LoadingIndicatorOverlay'
import { Button } from '@/components/ui/button'
import {
  ContentWrapper,
  TableAlertnatingRows,
  TdCenter,
  ThCenter,
  TitleAndActionContainer
} from '@/components/ui/layout'
import { toast } from '@/components/ui/toast'
import { LinkLooksLikeButtonPrimary, PageSubtitle, PageTitle } from '@/components/ui/typography'
import USER_ROLES from '@/constants/userRoles'
import { useAuth } from '@/hooks/useAuth'
import { useLoadErrorToast } from '@/hooks/useLoadErrorToast'
import language from '@/language'
import { organizationQueries } from '@/queries/organizations'
import {
  organizationUserQueries,
  useRemoveOrganizationUser,
  useUpdateOrganizationUserRole
} from '@/queries/users'
import type { OrganizationRole, User } from '@/types/api'

const pageLanguage = language.pages.manageOrganizationUsers

const roleColumns: { role: OrganizationRole; label: string }[] = [
  { role: USER_ROLES.orgAdmin, label: pageLanguage.usersTable.admin },
  { role: USER_ROLES.orgUser, label: pageLanguage.usersTable.user }
]

/** An organization's users: change their role or remove them (`/organizations/:id/users`). */
function ManageOrganizationUsers() {
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const { currentUser } = useAuth()
  const { organizationId } = useParams<{ organizationId: string }>()

  const organizationQuery = useQuery(organizationQueries.detail(organizationId))
  const usersQuery = useQuery(organizationUserQueries.list(organizationId))
  const updateUserRole = useUpdateOrganizationUserRole(organizationId)
  const removeUser = useRemoveOrganizationUser(organizationId)
  const organizationName = organizationQuery.data?.organization_name ?? ''
  const isSubmitting = updateUserRole.isPending || removeUser.isPending
  useLoadErrorToast(organizationQuery.error, usersQuery.error)

  const changeRole = (email: string, role: OrganizationRole) => {
    updateUserRole.mutate({ email, role }, { onError: () => toast.error(language.error.submit) })
  }

  const handleDeleteConfirm = () => {
    if (!userToDelete) return
    removeUser.mutate(userToDelete.email, {
      onSuccess: () => {
        toast.success(language.success.getDeleteThingSuccessMessage(userToDelete.name))
        setUserToDelete(null)
      },
      onError: () => {
        toast.error(language.error.delete)
        setUserToDelete(null)
      }
    })
  }

  if (organizationQuery.isPending || usersQuery.isPending) return <LoadingIndicator />

  return (
    <>
      <LoadingIndicatorOverlay isVisible={isSubmitting} />
      <ContentWrapper>
        <TitleAndActionContainer>
          <PageTitle>{pageLanguage.title}</PageTitle>
          <LinkLooksLikeButtonPrimary href={`/organizations/${organizationId}/users/new`}>
            {pageLanguage.newUser}
          </LinkLooksLikeButtonPrimary>
        </TitleAndActionContainer>
        <PageSubtitle>{organizationName}</PageSubtitle>
        <TableAlertnatingRows>
          <tbody>
            <tr>
              <th>{pageLanguage.usersTable.name}</th>
              <th>{pageLanguage.usersTable.email}</th>
              {roleColumns.map(({ role, label }) => (
                <ThCenter key={role}>{label}</ThCenter>
              ))}
              <ThCenter>{pageLanguage.usersTable.remove}</ThCenter>
            </tr>
            {(usersQuery.data ?? []).map((user) => {
              const { id, name, role, email } = user
              // Users can't change their own role or remove themselves. The signed-in user
              // carries no id, so match on email.
              const isCurrentUser =
                !!currentUser?.email && email.toLowerCase() === currentUser.email.toLowerCase()
              return (
                <tr key={id}>
                  <td>{name}</td>
                  <td>{email}</td>
                  {roleColumns.map((column) => (
                    <TdCenter key={column.role}>
                      <input
                        type='radio'
                        className='size-4 accent-brand-800'
                        name={`${id}-role`}
                        aria-label={`${name}: ${column.label}`}
                        value={column.role}
                        checked={role === column.role}
                        onChange={() => changeRole(email, column.role)}
                        disabled={isCurrentUser}
                      />
                    </TdCenter>
                  ))}
                  <TdCenter>
                    <Button
                      type='button'
                      variant='outline'
                      size='icon'
                      aria-label={`${pageLanguage.delete}: ${name}`}
                      disabled={isCurrentUser}
                      onClick={() => setUserToDelete(user)}>
                      <LuUserMinus className='size-5' aria-hidden='true' />
                    </Button>
                  </TdCenter>
                </tr>
              )
            })}
          </tbody>
        </TableAlertnatingRows>
      </ContentWrapper>
      <ConfirmPrompt
        isOpen={!!userToDelete}
        setIsOpen={(isOpen) => {
          if (!isOpen) setUserToDelete(null)
        }}
        title={pageLanguage.deletePrompt.title}
        promptText={pageLanguage.deletePrompt.getPromptText({
          userName: userToDelete?.name ?? '',
          organizationName
        })}
        confirmButtonText={pageLanguage.deletePrompt.buttonText}
        onConfirm={handleDeleteConfirm}
      />
    </>
  )
}

export default ManageOrganizationUsers
