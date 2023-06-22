import { Link } from 'react-router-dom'
import { Menu, MenuItem, Stack } from '@mui/material'
import { toast } from 'react-toastify'
import axios from 'axios'
import LoadingIndicator from '../components/LoadingIndicator'
import React, { useEffect, useState } from 'react'

import { ButtonPrimary, ButtonSecondary } from '../styles/buttons'
import {
  LinkCard,
  ContentWrapper,
  TitleAndActionContainer,
  ButtonContainer
} from '../styles/containers'
import { ItemTitle, ItemSubTitle, PageTitle } from '../styles/typography'
import language from '../language'

const sitesUrl = `${process.env.REACT_APP_API_URL}/sites/`

function Sites() {
  const [isLoading, setIsLoading] = useState(true)
  const [sites, setSites] = useState([])
  const [downloadOptionsAnchorEl, setDownloadOptionsAnchorEl] = React.useState(null)

  useEffect(function loadSitesData() {
    axios
      .get(sitesUrl)
      .then(({ data }) => {
        setIsLoading(false)
        setSites(data)
      })
      .catch(() => toast.error(language.error.apiLoad))
  }, [])

  const handleDownloadButtonClick = (event) => {
    setDownloadOptionsAnchorEl(event.currentTarget)
  }

  const handleDownloadMenuClose = () => {
    setDownloadOptionsAnchorEl(null)
  }

  const handleDownloadOptionSelect = ({ publicOnly }) => {
    setDownloadOptionsAnchorEl(null)
    axios({
      url: `${process.env.REACT_APP_API_URL}/report/answers_as_xlsx?&public_only=${publicOnly}`,
      method: 'GET',
      responseType: 'blob'
    }).then((response) => {
      const href = URL.createObjectURL(response.data)

      const link = document.createElement('a')
      link.href = href
      link.setAttribute('download', 'organization-data.xlsx')
      document.body.appendChild(link)
      link.click()

      document.body.removeChild(link)
      URL.revokeObjectURL(href)
    })
  }

  const open = Boolean(downloadOptionsAnchorEl)

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
        <ButtonContainer>
          <ButtonSecondary
            type='button'
            id='download-options'
            aria-controls={open ? 'download-options-menu' : undefined}
            aria-haspopup='true'
            aria-expanded={open ? 'true' : undefined}
            onClick={handleDownloadButtonClick}>
            {language.pages.sites.downloadSites}
          </ButtonSecondary>
          <Menu
            id='download-options-menu'
            open={open}
            anchorEl={downloadOptionsAnchorEl}
            onClose={handleDownloadMenuClose}
            MenuListProps={{
              'aria-labelledby': 'download-options'
            }}>
            <MenuItem
              onClick={() =>
                handleDownloadOptionSelect({
                  publicOnly: false
                })
              }>
              {language.pages.sites.allData}
            </MenuItem>
            <MenuItem
              onClick={() =>
                handleDownloadOptionSelect({
                  publicOnly: true
                })
              }>
              {language.pages.sites.publicData}
            </MenuItem>
          </Menu>
          <ButtonPrimary component={Link} to='/sites/new'>
            {language.pages.sites.newSiteButton}
          </ButtonPrimary>
        </ButtonContainer>
      </TitleAndActionContainer>
      <Stack>{sitesList}</Stack>
    </ContentWrapper>
  )
}

export default Sites
