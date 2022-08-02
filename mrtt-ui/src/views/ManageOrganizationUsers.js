import { GroupRemove } from '@mui/icons-material'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

import { ButtonPrimary, ButtonSecondary } from '../styles/buttons'
import { ContentWrapper, TitleAndActionContainer } from '../styles/containers'
import { PageSubtitle, PageTitle } from '../styles/typography'
import { TableAlertnatingRows, TdCenter, ThCenter } from '../styles/table'
import language from '../language'
import USER_ROLES from '../constants/userRoles'

const pageLanguage = language.pages.manageOrganizationUsers

const ManageOrganizationUsers = () => {
  const [organizationName, setOrganizationName] = useState()
  const [organizationUsers, setOrganizationUsers] = useState([])
  const { organizationId } = useParams()
  const organizationUrl = `${process.env.REACT_APP_API_URL}/organizations/${organizationId}`
  const organizationUsersUrl = `${organizationUrl}/users`

  useEffect(
    function loadApiData() {
      Promise.all([axios.get(organizationUrl), axios.get(organizationUsersUrl)]).then(
        ([
          {
            data: { organization_name }
          },
          { data: organizationUsers }
        ]) => {
          setOrganizationName(organization_name)
          setOrganizationUsers(organizationUsers)
        }
      )
    },
    [organizationUrl, organizationUsersUrl]
  )
  return (
    <>
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
            {organizationUsers.map(({ id, name, role }) => (
              <tr key={id}>
                <td>{name}</td>
                <TdCenter>
                  <input
                    type='radio'
                    id={`${id}-${name}-role-admin`}
                    name={`${id}-${name}-role`}
                    value={USER_ROLES.orgAdmin}
                    checked={role === USER_ROLES.orgAdmin}
                  />
                </TdCenter>
                <TdCenter>
                  <input
                    type='radio'
                    id={`${id}-${name}-role-user`}
                    name={`${id}-${name}-role`}
                    value={USER_ROLES.orgUser}
                    checked={role === USER_ROLES.orgUser}
                  />
                </TdCenter>
                <TdCenter>
                  <ButtonSecondary>
                    <GroupRemove />
                  </ButtonSecondary>
                </TdCenter>
              </tr>
            ))}
          </tbody>
        </TableAlertnatingRows>
      </ContentWrapper>
    </>
  )
}

export default ManageOrganizationUsers
