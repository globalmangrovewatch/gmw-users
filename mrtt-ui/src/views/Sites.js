import { Link } from 'react-router-dom'
import { Menu, MenuItem, Stack } from '@mui/material'
import { toast } from 'react-toastify'
import LoadingIndicator from '@/components/LoadingIndicator'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

import { ButtonPrimary, ButtonSecondary } from '@/styles/buttons'
import {
  LinkCard,
  ContentWrapper,
  TitleAndActionContainer,
  ButtonContainer
} from '@/styles/containers'
import { ItemTitle, ItemSubTitle, PageTitle } from '@/styles/typography'
import language from '@/language'
import { saveBlob } from '@/lib/download'
import { useLoadErrorToast } from '@/hooks/useLoadErrorToast'
import { downloadAllSitesReport, siteQueries } from '@/queries/sites'

function Sites() {
  const { data: sites = [], isPending, error } = useQuery(siteQueries.list())
  const [downloadOptionsAnchorEl, setDownloadOptionsAnchorEl] = React.useState(null)

  useLoadErrorToast(error)

  const handleDownloadButtonClick = (event) => {
    setDownloadOptionsAnchorEl(event.currentTarget)
  }

  const handleDownloadMenuClose = () => {
    setDownloadOptionsAnchorEl(null)
  }

  const handleDownloadOptionSelect = ({ publicOnly }) => {
    setDownloadOptionsAnchorEl(null)
    downloadAllSitesReport(publicOnly)
      .then((blob) => saveBlob(blob, 'organization-data.xlsx'))
      .catch(() => toast.error(language.error.apiLoad))
  }

  const open = Boolean(downloadOptionsAnchorEl)

  const orderedSitesTesting = [...sites]
    .sort((a, b) => a.site_name.localeCompare(b.site_name))
    .reverse()

  const sitesList = orderedSitesTesting
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

  return isPending ? (
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
