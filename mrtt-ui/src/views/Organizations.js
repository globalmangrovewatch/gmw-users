import React, { useEffect, useState } from 'react'

import { H4, H5 } from '../styles/typography'
import { PaddedPageSection, PaddedPageTopSection } from '../styles/containers'
import { toast } from 'react-toastify'
import { UlAlternating } from '../styles/lists'
import axios from 'axios'
import language from '../language'
import LoadingIndicator from '../components/LoadingIndicator'

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
      <PaddedPageTopSection>
        <H4>{language.pages.organizations.title}</H4>
      </PaddedPageTopSection>
      <PaddedPageSection>
        <H5>{language.pages.organizations.titleYourOrganizations}</H5>
        {yourOrganizations.length
          ? yourOrganizationsList
          : language.pages.organizations.noYourOrganizations}

        <H5>{language.pages.organizations.titleOtherOrganizations}</H5>
        {otherOrganizations.length
          ? otherOrganizationsList
          : language.pages.organizations.noOtherOrganizations}
      </PaddedPageSection>
    </>
  )
}

export default Organizations
