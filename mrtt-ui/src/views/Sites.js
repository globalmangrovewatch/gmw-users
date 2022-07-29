import { Link } from 'react-router-dom'
import { Stack } from '@mui/material'
import { toast } from 'react-toastify'
import axios from 'axios'
import LoadingIndicator from '../components/LoadingIndicator'
import React, { useEffect, useState } from 'react'

import { ButtonPrimary } from '../styles/buttons'
import { LinkCard, ContentWrapper, TitleAndActionContainer } from '../styles/containers'
import { ItemTitle, ItemSubTitle, PageTitle } from '../styles/typography'
import language from '../language'

const sitesUrl = `${process.env.REACT_APP_API_URL}/sites/`

function Sites() {
  const [isLoading, setIsLoading] = useState(true)
  const [sites, setSites] = useState([])

  useEffect(function loadSitesData() {
    axios
      .get(sitesUrl)
      .then(({ data }) => {
        setIsLoading(false)
        setSites(data)
      })
      .catch(() => toast.error(language.error.apiLoad))
  }, [])

  const sitesList = sites
    .sort((siteA, siteB) => {
      const siteALastUpdatedDate = siteA.section_last_updated
      const siteBLastUpdatedDate = siteB.section_last_updated

      if (siteALastUpdatedDate > siteBLastUpdatedDate || !siteALastUpdatedDate) {
        return -1
      }
      if (siteALastUpdatedDate < siteBLastUpdatedDate) {
        return 1
      }
      return 0
    })
    .map(({ site_name, landscape_name, id, section_last_updated }) => {
      const anySectionLastEditedString = new Date(section_last_updated).toLocaleDateString(
        undefined,
        {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        }
      )

      return (
        <LinkCard key={id} to={`/sites/${id}/overview`}>
          <ItemTitle>{site_name}</ItemTitle>
          <ItemSubTitle>{landscape_name}</ItemSubTitle>
          {section_last_updated ? (
            <p>
              {language.pages.sites.lastUpdated}: {anySectionLastEditedString}
            </p>
          ) : null}
        </LinkCard>
      )
    })

  return isLoading ? (
    <LoadingIndicator />
  ) : (
    <ContentWrapper>
      <TitleAndActionContainer>
        <PageTitle>{language.pages.sites.title}</PageTitle>
        <ButtonPrimary component={Link} to='/sites/new'>
          {language.pages.sites.newSiteButton}
        </ButtonPrimary>
      </TitleAndActionContainer>
      <Stack>{sitesList}</Stack>
    </ContentWrapper>
  )
}

export default Sites
