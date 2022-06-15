import React, { useEffect, useState } from 'react'

import { H4, H5 } from '../styles/typography'
import { UlAlternating } from '../styles/lists'
import language from '../language'
import mockOrganizations from '../data/mockOrganizations'
import { PaddedPageSection, PaddedPageTopSection } from '../styles/containers'

function Organizations() {
  const [yourOrganizations, setYourOrganizations] = useState([])
  const [otherOrganizations, setOtherOrganizations] = useState([])
  useEffect(function formatOrganizations() {
    setYourOrganizations(
      mockOrganizations.filter((organization) => organization.isCurrentUserMember)
    )
    setOtherOrganizations(
      mockOrganizations.filter((organization) => !organization.isCurrentUserMember)
    )
  }, [])

  const yourOrganizationsList = (
    <UlAlternating>
      {yourOrganizations.map((organization) => (
        <li key={organization.id}>{organization.name}</li>
      ))}
    </UlAlternating>
  )

  const otherOrganizationsList = (
    <UlAlternating>
      {otherOrganizations.map((organization) => (
        <li key={organization.id}>{organization.name}</li>
      ))}
    </UlAlternating>
  )
  return (
    <>
      <PaddedPageTopSection>
        <H4>{language.pages.organizations.title}</H4>
      </PaddedPageTopSection>
      <PaddedPageSection>
        <H5>{language.pages.organizations.titleYourOrganizations}</H5>
        {yourOrganizationsList}

        <H5>{language.pages.organizations.titleOtherOrganizations}</H5>
        {otherOrganizationsList}
      </PaddedPageSection>
    </>
  )
}

export default Organizations
