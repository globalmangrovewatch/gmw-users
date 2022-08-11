import { GroupRemove } from '@mui/icons-material'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

import { ButtonPrimary, ButtonSecondary } from '../styles/buttons'
import { ContentWrapper, TitleAndActionContainer } from '../styles/containers'
import { PageSubtitle, PageTitle } from '../styles/typography'
import { TableAlertnatingRows, TdCenter, ThCenter } from '../styles/table'
import { toast } from 'react-toastify'
import { useAuth } from '../hooks/useAuth'
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
  const { currentUser } = useAuth()
  const { organizationId } = useParams()
  const organizationUrl = `${process.env.REACT_APP_API_URL}/organizations/${organizationId}`
  const organizationUsersUrl = `${organizationUrl}/users`

  const updateOrganizationUser = (userWithUpdatedInfo) => {
    const organizationUsersWithUserRoleUpdated = organizationUsers.map((existingUserInfo) => {
      return existingUserInfo.id === userWithUpdatedInfo.id ? userWithUpdatedInfo : existingUserInfo
    })
    setOrganizationUsers(organizationUsersWithUserRoleUpdated)
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

  const handleUserRoleChange = ({
    event: {
      target: { value: newRole }
    },
    userEmail
  }) => {
    setIsSubmitting(true)
    const orgUserUrl = `${organizationUsersUrl}/${userEmail}`

    axios
      .patch(orgUserUrl, { role: newRole })
      .then(({ data: updatedUserInfo }) => {
        setIsSubmitting(false)
        updateOrganizationUser(updatedUserInfo)
      })
      .catch(() => {
        setIsSubmitting(false)
        toast.error(language.error.submit)
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
          <ButtonPrimary>{pageLanguage.newUser}</ButtonPrimary>
        </TitleAndActionContainer>

        <PageSubtitle>{organizationName}</PageSubtitle>
        <TableAlertnatingRows>
          <tbody>
            <tr>
              <th>{pageLanguage.usersTable.name}</th>
              <ThCenter>{pageLanguage.usersTable.admin}</ThCenter>
              <ThCenter>{pageLanguage.usersTable.user}</ThCenter>
              <ThCenter>{pageLanguage.usersTable.remove}</ThCenter>
            </tr>
            {organizationUsers.map(({ id, name, role, email }) => {
              const isOrgUserLoggedIn = id === currentUser.id

              return (
                <tr key={id}>
                  <td>{name}</td>
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
                    <ButtonSecondary>
                      <GroupRemove />
                    </ButtonSecondary>
                  </TdCenter>
                </tr>
              )
            })}
          </tbody>
        </TableAlertnatingRows>
      </ContentWrapper>
    </>
  )
}

export default ManageOrganizationUsers
