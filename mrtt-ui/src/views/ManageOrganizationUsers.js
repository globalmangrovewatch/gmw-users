import { GroupRemove } from '@mui/icons-material'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'

import { ButtonSecondary } from '@/styles/buttons'
import { ContentWrapper, TitleAndActionContainer } from '@/styles/containers'
import { LinkLooksLikeButtonPrimary, PageSubtitle, PageTitle } from '@/styles/typography'
import { TableAlertnatingRows, TdCenter, ThCenter } from '@/styles/table'
import { toast } from 'react-toastify'
import { useAuth } from '@/hooks/useAuth'
import ConfirmPrompt from '@/components/ConfirmPrompt/ConfirmPrompt'
import language from '@/language'
import LoadingIndicator from '@/components/LoadingIndicator'
import LoadingIndicatorOverlay from '@/components/LoadingIndicatorOverlay'
import USER_ROLES from '@/constants/userRoles'
import { useLoadErrorToast } from '@/hooks/useLoadErrorToast'
import { organizationQueries } from '@/queries/organizations'
import {
  organizationUserQueries,
  useRemoveOrganizationUser,
  useUpdateOrganizationUserRole
} from '@/queries/users'

const pageLanguage = language.pages.manageOrganizationUsers

const ManageOrganizationUsers = () => {
  const [userToDelete, setUserToDelete] = useState()
  const { currentUser } = useAuth()
  const { organizationId } = useParams()
  const isDeleteConfirmPromptOpen = !!userToDelete

  const organizationQuery = useQuery(organizationQueries.detail(organizationId))
  const usersQuery = useQuery(organizationUserQueries.list(organizationId))
  const updateUserRole = useUpdateOrganizationUserRole(organizationId)
  const removeUser = useRemoveOrganizationUser(organizationId)
  const organizationName = organizationQuery.data?.organization_name
  const organizationUsers = usersQuery.data ?? []
  const isLoading = organizationQuery.isPending || usersQuery.isPending
  const isSubmitting = updateUserRole.isPending || removeUser.isPending
  useLoadErrorToast(organizationQuery.error, usersQuery.error)

  const clearUserToDelete = () => setUserToDelete(null)

  const handleUserRoleChange = ({
    event: {
      target: { value: newRole }
    },
    userEmail
  }) => {
    updateUserRole.mutate(
      { email: userEmail, role: newRole },
      { onError: () => toast.error(language.error.submit) }
    )
  }
  const handleDeleteClick = (user) => {
    setUserToDelete(user)
  }

  const handleDeleteConfirm = () => {
    removeUser.mutate(userToDelete.email, {
      onSuccess: () => {
        toast.success(language.success.getDeleteThingSuccessMessage(userToDelete.name))
        clearUserToDelete()
      },
      onError: () => {
        toast.error(language.error.delete)
        clearUserToDelete()
      }
    })
  }

  return isLoading ? (
    <LoadingIndicator />
  ) : (
    <>
      <LoadingIndicatorOverlay isVisible={isSubmitting} />
      <ContentWrapper>
        <TitleAndActionContainer>
          <PageTitle>{pageLanguage.title}</PageTitle>
          <LinkLooksLikeButtonPrimary to={'new'}>{pageLanguage.newUser}</LinkLooksLikeButtonPrimary>
        </TitleAndActionContainer>

        <PageSubtitle>{organizationName}</PageSubtitle>
        <TableAlertnatingRows>
          <tbody>
            <tr>
              <th>{pageLanguage.usersTable.name}</th>
              <th>{pageLanguage.usersTable.email}</th>
              <ThCenter>{pageLanguage.usersTable.admin}</ThCenter>
              <ThCenter>{pageLanguage.usersTable.user}</ThCenter>
              <ThCenter>{pageLanguage.usersTable.remove}</ThCenter>
            </tr>
            {organizationUsers.map((user) => {
              const { id, name, role, email } = user
              const isOrgUserLoggedIn = id === currentUser?.id

              return (
                <tr key={id}>
                  <td>{name}</td>
                  <td>{email}</td>
                  <TdCenter>
                    <input
                      type='radio'
                      id={`${id}-${name}-role-admin`}
                      name={`${id}-${name}-role`}
                      value={USER_ROLES.orgAdmin}
                      checked={role === USER_ROLES.orgAdmin}
                      onChange={(event) => handleUserRoleChange({ event, userEmail: email })}
                      disabled={isOrgUserLoggedIn}
                    />
                  </TdCenter>
                  <TdCenter>
                    <input
                      type='radio'
                      id={`${id}-${name}-role-user`}
                      name={`${id}-${name}-role`}
                      value={USER_ROLES.orgUser}
                      checked={role === USER_ROLES.orgUser}
                      onChange={(event) => handleUserRoleChange({ event, userEmail: email })}
                      disabled={isOrgUserLoggedIn}
                    />
                  </TdCenter>
                  <TdCenter>
                    <ButtonSecondary
                      disabled={isOrgUserLoggedIn}
                      onClick={() => handleDeleteClick(user)}>
                      <GroupRemove />
                    </ButtonSecondary>
                  </TdCenter>
                </tr>
              )
            })}
          </tbody>
        </TableAlertnatingRows>
      </ContentWrapper>
      <ConfirmPrompt
        isOpen={isDeleteConfirmPromptOpen}
        setIsOpen={clearUserToDelete}
        title={pageLanguage.deletePrompt.title}
        promptText={pageLanguage.deletePrompt.getPromptText({
          userName: userToDelete,
          organizationName
        })}
        confirmButtonText={pageLanguage.deletePrompt.buttonText}
        onConfirm={handleDeleteConfirm}
      />
    </>
  )
}

export default ManageOrganizationUsers
