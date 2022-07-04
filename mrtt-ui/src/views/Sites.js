import { Link } from 'react-router-dom'
import { Stack } from '@mui/material'
import { toast } from 'react-toastify'
import axios from 'axios'
import LoadingIndicator from '../components/LoadingIndicator'
import React, { useEffect, useState } from 'react'

import { ButtonPrimary } from '../styles/buttons'
import { LinkCard, ContentWrapper, TitleAndActionContainer } from '../styles/containers'
import { CardTitle, CardSubTitle, PageTitle } from '../styles/typography'
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
      const siteAName = siteA.site_name?.toLowerCase()
      const siteBName = siteB.site_name?.toLowerCase()

      if (siteAName < siteBName) {
        return -1
      }
      if (siteAName < siteBName) {
        return 1
      }
      return 0
    })
    .map(({ site_name, landscape_name, id }) => (
      <LinkCard key={id} to={`/site/${id}/overview`}>
        <CardTitle>{site_name}</CardTitle>
        <CardSubTitle>{landscape_name}</CardSubTitle>
      </LinkCard>
    ))

  return isLoading ? (
    <LoadingIndicator />
  ) : (
    <ContentWrapper>
      <TitleAndActionContainer>
        <PageTitle>{language.pages.sites.title}</PageTitle>
        <ButtonPrimary component={Link} to='/site/new'>
          {language.pages.sites.newSiteButton}
        </ButtonPrimary>
      </TitleAndActionContainer>
      <Stack>{sitesList}</Stack>
    </ContentWrapper>
  )
}

export default Sites
