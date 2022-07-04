import React, { useEffect, useState } from 'react'
import { ContentWrapper, PaddedPageSection, TitleAndActionContainer } from '../styles/containers'
import { ButtonPrimary } from '../styles/buttons'
import { H4, H5 } from '../styles/typography'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { UlAlternating } from '../styles/lists'
import axios from 'axios'
import language from '../language'
import LoadingIndicator from '../components/LoadingIndicator'
import { PageTitle } from '../styles/typography'

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
        setYourOrganizations(data.filter((organization) => organization.isCurrentUserMember))
        setOtherOrganizations(data.filter((organization) => !organization.isCurrentUserMember))
      })
      .catch(() => {
        toast.error(language.error.apiLoad)
      })
  }, [])

  const yourOrganizationsList = (
    <UlAlternating>
      {yourOrganizations.map((organization) => (
        <li key={organization.id}>{organization.organization_name}</li>
      ))}
    </UlAlternating>
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
        <PaddedPageSection>
          <h5>{language.pages.organizations.titleYourOrganizations}</h5>
          {yourOrganizations.length
            ? yourOrganizationsList
            : language.pages.organizations.noYourOrganizations}


          <h5>{language.pages.organizations.titleOtherOrganizations}</h5>
          {otherOrganizations.length
            ? otherOrganizationsList
            : language.pages.organizations.noOtherOrganizations}
        </PaddedPageSection>
      </ContentWrapper>
    </>
  )
}

export default Organizations
