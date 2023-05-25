import { ButtonPrimary, ButtonSecondary } from '../styles/buttons'
import React, { useEffect, useState } from 'react'

import {
  ButtonContainer,
  Card,
  ContentWrapper,
  PaddedSection,
  RowSpaceBetween,
  TitleAndActionContainer
} from '../styles/containers'
import { H2, LinkLooksLikeButtonSecondary, PageTitle } from '../styles/typography'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { UlAlternating, UlUndecorated } from '../styles/lists'
import axios from 'axios'
import language from '../language'
import LoadingIndicator from '../components/LoadingIndicator'
import USER_ROLES from '../constants/userRoles'

const organizationsUrl = `${process.env.REACT_APP_API_URL}/organizations`

function Organizations() {
  const [yourOrganizations, setYourOrganizations] = useState([])
  const [otherOrganizations, setOtherOrganizations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  useEffect(function loadOrganizations() {
    axios
      .get(organizationsUrl)
      .then(({ data }) => {
        setIsLoading(false)
        setYourOrganizations(data.filter((organization) => organization.role))
        setOtherOrganizations(data.filter((organization) => !organization.role))
      })
      .catch(() => {
        toast.error(language.error.apiLoad)
      })
  }, [])

  const yourOrganizationsList = (
    <UlUndecorated>
      {yourOrganizations.map(({ id: organizationId, organization_name, role }) => {
        const canManageUsers = role === USER_ROLES.orgAdmin
        return (
          <Card as='li' key={organizationId}>
            <RowSpaceBetween>
              {organization_name}
              <ButtonContainer>
                <ButtonSecondary type='button'>
                  {language.pages.landscapes.downloadLandscapeSites}
                </ButtonSecondary>
                {canManageUsers ? (
                  <LinkLooksLikeButtonSecondary to={`/organizations/${organizationId}/users`}>
                    {language.pages.organizations.manageUsers}
                  </LinkLooksLikeButtonSecondary>
                ) : null}
              </ButtonContainer>
            </RowSpaceBetween>
          </Card>
        )
      })}
    </UlUndecorated>
  )

  const otherOrganizationsList = (
    <UlAlternating>
      {otherOrganizations.map((organization) => (
        <li key={organization.id}>{organization.organization_name}</li>
      ))}
    </UlAlternating>
  )
  return isLoading ? (
    <LoadingIndicator />
  ) : (
    <>
      <ContentWrapper>
        <TitleAndActionContainer>
          <PageTitle>{language.pages.organizations.title}</PageTitle>
          <ButtonPrimary component={Link} to='/organizations/new'>
            {language.pages.organizations.newOrganizationButton}
          </ButtonPrimary>
        </TitleAndActionContainer>
        <PaddedSection>
          <H2>{language.pages.organizations.titleYourOrganizations}</H2>
          {yourOrganizations.length
            ? yourOrganizationsList
            : language.pages.organizations.noYourOrganizations}

          <H2>{language.pages.organizations.titleOtherOrganizations}</H2>
          {otherOrganizations.length
            ? otherOrganizationsList
            : language.pages.organizations.noOtherOrganizations}
        </PaddedSection>
      </ContentWrapper>
    </>
  )
}

export default Organizations
