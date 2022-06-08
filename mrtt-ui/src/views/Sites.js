import { Link } from 'react-router-dom'
import { Stack } from '@mui/material'
import { toast } from 'react-toastify'
import axios from 'axios'
import LoadingIndicator from '../components/LoadingIndicator'
import React, { useEffect, useState } from 'react'

import { ButtonPrimary } from '../styles/buttons'
import { H4 } from '../styles/typography'
import { LinkCard, PagePadding, RowSpaceBetween } from '../styles/containers'
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

  const sitesList = sites.map(({ site_name, id }) => (
    <LinkCard key={id} to={`/site/${id}`}>
      {site_name}
    </LinkCard>
  ))

  return isLoading ? (
    <LoadingIndicator />
  ) : (
    <PagePadding>
      <RowSpaceBetween>
        <H4>{language.pages.sites.title}</H4>
        <ButtonPrimary component={Link} to='#'>
          {language.pages.sites.newSiteButton}
        </ButtonPrimary>
      </RowSpaceBetween>
      <Stack>{sitesList}</Stack>
    </PagePadding>
  )
}

export default Sites
