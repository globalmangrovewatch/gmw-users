import { Settings as SettingsIcon } from '@mui/icons-material'
import { Stack } from '@mui/material'
import { styled } from '@mui/system'
import { toast } from 'react-toastify'
import { useParams, Link as LinkReactRouter } from 'react-router-dom'
import axios from 'axios'
import fileDownload from 'js-file-download'
import React, { useEffect, useState } from 'react'

import { ButtonSecondary } from '../../styles/buttons'
import {
  ButtonContainer,
  ContentWrapper,
  RowCenterCenter,
  TitleAndActionContainer
} from '../../styles/containers'
import { ItemSubTitle, ItemTitle, Link } from '../../styles/typography'
import { TableAlertnatingRows, WideTh } from '../../styles/table'
import AddMonitoringSectionMenu from './AddMonitoringSectionMenu'
import ItemDoesntExist from '../../components/ItemDoesntExist'
import language from '../../language'
import LoadingIndicator from '../../components/LoadingIndicator'
import MonitoringFormsList from './MonitoringFormsList'

const pageLanguage = language.pages.siteQuestionsOverview

const StyledSectionHeader = styled('h3')`
  text-transform: uppercase;
  font-weight: 100;
`

const SiteOverview = () => {
  const [doesSiteExist, setDoesSiteExist] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [landscape, setLandscape] = useState()
  const [monitoringForms, setMonitoringForms] = useState([])
  const [site, setSite] = useState()
  const { siteId } = useParams()

  const monitoringFormsSortedByDate = monitoringForms.sort((formA, formB) => {
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

  useEffect(
    function loadDataFromServer() {
      if (siteId) {
        const sitesDataUrl = `${process.env.REACT_APP_API_URL}/sites/${siteId}`
        const landscapesUrl = `${process.env.REACT_APP_API_URL}/landscapes`
        const monitoringUrl = `${sitesDataUrl}/monitoring_answers`

        Promise.all([axios.get(sitesDataUrl), axios.get(landscapesUrl), axios.get(monitoringUrl)])
          .then(([{ data: siteData }, { data: landscapesData }, { data: monitoringFormsData }]) => {
            setIsLoading(false)
            setSite(siteData)
            setLandscape(landscapesData.find((landscape) => landscape.id === siteData.landscape_id))
            setMonitoringForms(monitoringFormsData)
          })
          .catch((error) => {
            setIsLoading(false)
            if (error?.response?.status === 404) {
              setDoesSiteExist(false)
            } else {
              toast.error(language.error.apiLoad)
            }
          })
      }
    },
    [siteId]
  )

  const handleDownload = () => {
    const siteDownloadUrl = `${process.env.REACT_APP_API_URL}/report/answers_as_pdf/${siteId}`
    axios.get(siteDownloadUrl, { responseType: 'blob' }).then((response) => {
      fileDownload(response.data, `${site.site_name}.pdf`)
    })
  }

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
            <ButtonSecondary type='button' onClick={handleDownload}>
              {pageLanguage.downloadSiteData}
            </ButtonSecondary>
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
