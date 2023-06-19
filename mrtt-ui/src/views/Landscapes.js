import { Stack } from '@mui/material'
import { toast } from 'react-toastify'
import axios from 'axios'

import {
  RowCenterCenter,
  Card,
  ContentWrapper,
  PaddedSection,
  RowSpaceBetween,
  TitleAndActionContainer
} from '../styles/containers'
import {
  H4,
  ItemTitle,
  Link,
  LinkLooksLikeButtonPrimary,
  PageTitle,
  SmallUpperCase
} from '../styles/typography'
import { UlUndecorated } from '../styles/lists'
import EditLink from '../components/EditLink'
import language from '../language'
import LoadingIndicator from '../components/LoadingIndicator'
import React, { useEffect, useState } from 'react'

const landscapesUrl = `${process.env.REACT_APP_API_URL}/landscapes/`
function Landscapes() {
  const [isLoading, setIsLoading] = useState(true)
  const [landscapes, setLandscapes] = useState([])

  useEffect(function loadApiData() {
    axios
      .get(landscapesUrl)
      .then(({ data }) => {
        setIsLoading(false)
        setLandscapes(data)
      })
      .catch(() => toast.error(language.error.apiLoad))
  }, [])

  const landscapesList = landscapes
    .sort((landscapeA, landscapeB) => {
      const landscapeAName = landscapeA.landscape_name?.toLowerCase()
      const landscapeBName = landscapeB.landscape_name?.toLowerCase()

      if (landscapeAName < landscapeBName) {
        return -1
      }
      if (landscapeAName < landscapeBName) {
        return 1
      }
      return 0
    })
    .map(({ landscape_name, id, organizations, sites }) => {
      const landscapeAssociatedSites = !sites.length ? (
        <SmallUpperCase>{language.pages.landscapes.noSites}</SmallUpperCase>
      ) : (
        <UlUndecorated>
          {sites.map(({ site_name, site_id }) => (
            <li key={site_id}>
              <Link to={`/sites/${site_id}/overview`}>{site_name}</Link>
            </li>
          ))}
        </UlUndecorated>
      )

      const landscapeAssociatedOrganizations = (
        <UlUndecorated>
          {organizations.map(({ organization_name, id }) => (
            <li key={id}>{organization_name}</li>
          ))}
        </UlUndecorated>
      )

      return (
        <Card key={id}>
          <RowSpaceBetween>
            <ItemTitle>{landscape_name}</ItemTitle>
            <RowCenterCenter>
              <EditLink to={`/landscapes/${id}/edit`} />
            </RowCenterCenter>
          </RowSpaceBetween>
          <H4>{language.pages.landscapes.sites}</H4>
          <PaddedSection>{landscapeAssociatedSites}</PaddedSection>

          <H4>{language.pages.landscapes.organizations}</H4>
          <PaddedSection>{landscapeAssociatedOrganizations}</PaddedSection>
        </Card>
      )
    })

  return isLoading ? (
    <LoadingIndicator />
  ) : (
    <ContentWrapper>
      <TitleAndActionContainer>
        <PageTitle>{language.pages.landscapes.title}</PageTitle>
        <LinkLooksLikeButtonPrimary to='/landscapes/new'>
          {language.pages.landscapes.newLandscapeButton}
        </LinkLooksLikeButtonPrimary>
      </TitleAndActionContainer>
      <Stack>{landscapesList}</Stack>
    </ContentWrapper>
  )
}

export default Landscapes
