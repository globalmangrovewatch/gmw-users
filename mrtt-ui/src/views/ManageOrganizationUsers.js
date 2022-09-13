import { GroupRemove } from '@mui/icons-material'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

import { ButtonSecondary } from '../styles/buttons'
import { ContentWrapper, TitleAndActionContainer } from '../styles/containers'
import { LinkLooksLikeButtonPrimary, PageSubtitle, PageTitle } from '../styles/typography'
import { TableAlertnatingRows, TdCenter, ThCenter } from '../styles/table'
import { toast } from 'react-toastify'
import { useAuth } from '../hooks/useAuth'
import ConfirmPrompt from '../components/ConfirmPrompt/ConfirmPrompt'
import language from '../language'
import LoadingIndicator from '../components/LoadingIndicator'
import LoadingIndicatorOverlay from '../components/LoadingIndicatorOverlay'
import USER_ROLES from '../constants/userRoles'

const pageLanguage = language.pages.manageOrganizationUsers

const ManageOrganizationUsers = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [organizationName, setOrganizationName] = useState()
  const [organizationUsers, setOrganizationUsers] = useState([])
  const [userToDelete, setUserToDelete] = useState()
  const { currentUser } = useAuth()
  const { organizationId } = useParams()
  const isDeleteConfirmPromptOpen = !!userToDelete
  const organizationUrl = `${process.env.REACT_APP_API_URL}/organizations/${organizationId}`
  const organizationUsersUrl = `${organizationUrl}/users`

  const clearUserToDelete = () => setUserToDelete(null)

  const updateOrganizationUserUi = (userWithUpdatedInfo) => {
    const organizationUsersWithUserRoleUpdated = organizationUsers.map((existingUserInfo) => {
      return existingUserInfo.id === userWithUpdatedInfo.id ? userWithUpdatedInfo : existingUserInfo
    })
    setOrganizationUsers(organizationUsersWithUserRoleUpdated)
  }

  const deleteOrganizationUserUi = (userToDelete) => {
    setOrganizationUsers(organizationUsers.filter((user) => user.id !== userToDelete.id))
  }

  useEffect(
    function loadApiData() {
      Promise.all([axios.get(organizationUrl), axios.get(organizationUsersUrl)])
        .then(
          ([
            {
              data: { organization_name }
            },
            { data: organizationUsers }
          ]) => {
            setOrganizationName(organization_name)
            setOrganizationUsers(organizationUsers)
            setIsLoading(false)
          }
        )
        .catch(() => {
          setIsLoading(false)
          toast.error(language.error.apiLoad)
        })
    },
    [organizationUrl, organizationUsersUrl]
  )

  const getOrgUserUrl = (userEmail) => `${organizationUsersUrl}/${userEmail}`

  const handleUserRoleChange = ({
    event: {
      target: { value: newRole }
    },
    userEmail
  }) => {
    setIsSubmitting(true)
    const orgUserUrl = getOrgUserUrl(userEmail)

    axios
      .patch(orgUserUrl, { role: newRole })
      .then(({ data: updatedUserInfo }) => {
        setIsSubmitting(false)
        updateOrganizationUserUi(updatedUserInfo)
      })
      .catch(() => {
        setIsSubmitting(false)
        toast.error(language.error.submit)
      })
  }
  const handleDeleteClick = (user) => {
    setUserToDelete(user)
  }

  const handleDeleteConfirm = () => {
    setIsSubmitting(true)

    const orgUserUrl = getOrgUserUrl(userToDelete.email)
    axios
      .delete(orgUserUrl)
      .then(() => {
        setIsSubmitting(false)
        toast.success(language.success.getDeleteThingSuccessMessage(userToDelete.name))
        deleteOrganizationUserUi(userToDelete)
        clearUserToDelete()
      })
      .catch(() => {
        setIsSubmitting(false)
        toast.error(language.error.delete)
        clearUserToDelete()
      })
  }

  return isLoading ? (
    <LoadingIndicator />
  ) : (
    <>
      <LoadingIndicatorOverlay isVisible={isSubmitting} />
      <ContentWrapper>
        <TitleAndActionContainer>
          <PageTitle>{pageLanguage.title} (Work in Progress!)</PageTitle>
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
              const isOrgUserLoggedIn = id === currentUser.id

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
