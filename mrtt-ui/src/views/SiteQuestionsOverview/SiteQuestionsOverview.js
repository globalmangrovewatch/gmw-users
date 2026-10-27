import { Settings as SettingsIcon } from '@mui/icons-material'
import { Menu, MenuItem, Stack } from '@mui/material'
import { styled } from '@mui/system'
import { toast } from 'react-toastify'
import { useParams, Link as LinkReactRouter } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

import { ButtonSecondary } from '@/styles/buttons'
import {
  ButtonContainer,
  ContentWrapper,
  RowCenterCenter,
  TitleAndActionContainer
} from '@/styles/containers'
import { ItemSubTitle, ItemTitle, Link } from '@/styles/typography'
import { TableAlertnatingRows, WideTh } from '@/styles/table'
import AddMonitoringSectionMenu from './AddMonitoringSectionMenu'
import ItemDoesntExist from '@/components/ItemDoesntExist'
import language from '@/language'
import LoadingIndicator from '@/components/LoadingIndicator'
import MonitoringFormsList from './MonitoringFormsList'
import { saveBlob } from '@/lib/download'
import { isNotFound, useLoadErrorToast } from '@/hooks/useLoadErrorToast'
import { landscapeQueries } from '@/queries/landscapes'
import { downloadSiteReport, siteQueries } from '@/queries/sites'

const pageLanguage = language.pages.siteQuestionsOverview

const StyledSectionHeader = styled('h3')`
  text-transform: uppercase;
  font-weight: 100;
`

const SiteOverview = () => {
  const [downloadOptionsAnchorEl, setDownloadOptionsAnchorEl] = React.useState(null)
  const { siteId } = useParams()

  const siteQuery = useQuery(siteQueries.detail(siteId))
  const landscapesQuery = useQuery(landscapeQueries.list())
  const monitorsQuery = useQuery(siteQueries.monitors(siteId))
  const site = siteQuery.data
  const landscape = landscapesQuery.data?.find((landscape) => landscape.id === site?.landscape_id)
  const isLoading = siteQuery.isPending || landscapesQuery.isPending || monitorsQuery.isPending
  const doesSiteExist = !isNotFound(siteQuery.error)
  useLoadErrorToast(siteQuery.error, landscapesQuery.error, monitorsQuery.error)

  const monitoringFormsSortedByDate = [...(monitorsQuery.data ?? [])].sort((formA, formB) => {
    const formAMonitoringDate = formA.monitoring_date
    const formBMonitoringDate = formB.monitoring_date

    if (formAMonitoringDate > formBMonitoringDate || !formAMonitoringDate) {
      return -1
    }
    if (formAMonitoringDate < formBMonitoringDate) {
      return 1
    }
    return 0
  })

  const handleDownloadButtonClick = (event) => {
    setDownloadOptionsAnchorEl(event.currentTarget)
  }

  const handleDownloadMenuClose = () => {
    setDownloadOptionsAnchorEl(null)
  }

  const handleDownloadOptionSelect = ({ publicOnly }) => {
    setDownloadOptionsAnchorEl(null)
    downloadSiteReport(siteId, publicOnly)
      .then((blob) => saveBlob(blob, `${site.site_name}.pdf`))
      .catch(() => toast.error(language.error.apiLoad))
  }

  const open = Boolean(downloadOptionsAnchorEl)

  const siteOverview = !doesSiteExist ? (
    <ItemDoesntExist item='site' />
  ) : (
    <>
      <ContentWrapper>
        <TitleAndActionContainer>
          <Stack>
            <ItemTitle as='h2'>{site?.site_name}</ItemTitle>
            <ItemSubTitle>{landscape?.landscape_name}</ItemSubTitle>
          </Stack>
          <ButtonContainer>
            <ButtonSecondary
              type='button'
              id='download-options'
              aria-controls={open ? 'download-options-menu' : undefined}
              aria-haspopup='true'
              aria-expanded={open ? 'true' : undefined}
              onClick={handleDownloadButtonClick}>
              {pageLanguage.downloadSiteData}
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
            <ButtonSecondary component={LinkReactRouter} to={`/sites/${siteId}/edit`}>
              <SettingsIcon /> {pageLanguage.settings}
            </ButtonSecondary>
          </ButtonContainer>
        </TitleAndActionContainer>
        <StyledSectionHeader>{pageLanguage.formGroupTitle.registration}</StyledSectionHeader>
        {/* this is a table instead of a ul to leave room for a cell that shows
         how many questions are filled out. Feature cut for now
         to manage timeline risk. */}
        <TableAlertnatingRows>
          <tbody>
            <tr>
              <WideTh>
                <Link to={`/sites/${siteId}/form/project-details`}>
                  {pageLanguage.formName.siteDetails}
                </Link>
              </WideTh>
            </tr>
            <tr>
              <WideTh>
                <Link to={`/sites/${siteId}/form/site-background`}>
                  {pageLanguage.formName.siteBackground}
                </Link>
              </WideTh>
            </tr>
            <tr>
              <WideTh>
                <Link to={`/sites/${siteId}/form/restoration-aims`}>
                  {pageLanguage.formName.restorationAims}
                </Link>
              </WideTh>
            </tr>
            <tr>
              <WideTh>
                <Link to={`/sites/${siteId}/form/causes-of-decline`}>
                  {pageLanguage.formName.causesOfDecline}
                </Link>
              </WideTh>
            </tr>
            <tr>
              <WideTh>
                <Link to={`/sites/${siteId}/form/pre-restoration-assessment`}>
                  {pageLanguage.formName.preRestorationAssessment}
                </Link>
              </WideTh>
            </tr>
          </tbody>
        </TableAlertnatingRows>
        <StyledSectionHeader>{pageLanguage.formGroupTitle.intervention}</StyledSectionHeader>
        <TableAlertnatingRows>
          <tbody>
            <tr>
              <WideTh>
                <Link to={`/sites/${siteId}/form/site-interventions`}>
                  {pageLanguage.formName.siteInterventions}
                </Link>
              </WideTh>
            </tr>
            <tr>
              <WideTh>
                <Link to={`/sites/${siteId}/form/costs`}>{pageLanguage.formName.costs}</Link>
              </WideTh>
            </tr>
          </tbody>
        </TableAlertnatingRows>
        <StyledSectionHeader>{pageLanguage.formGroupTitle.monitoring}</StyledSectionHeader>
        <AddMonitoringSectionMenu siteId={siteId} />
        {monitoringFormsSortedByDate.length ? (
          <MonitoringFormsList
            monitoringFormsSortedByDate={monitoringFormsSortedByDate}
            siteId={siteId}
          />
        ) : (
          <RowCenterCenter>{pageLanguage.noMonitoringSections}</RowCenterCenter>
        )}
      </ContentWrapper>
    </>
  )

  return isLoading ? <LoadingIndicator /> : siteOverview
}

export default SiteOverview
