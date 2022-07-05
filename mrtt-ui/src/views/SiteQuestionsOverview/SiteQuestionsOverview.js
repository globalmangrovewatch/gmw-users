import { Link, useParams } from 'react-router-dom'
import { Settings } from '@mui/icons-material'
import { Stack } from '@mui/material'
import { styled } from '@mui/system'
import { toast } from 'react-toastify'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

import { ItemSubTitle, ItemTitle, XSmallUpperCase } from '../../styles/typography'
import { ContentWrapper, TitleAndActionContainer } from '../../styles/containers'
import { TableAlertnatingRows } from '../../styles/table'
import AddMonitoringSectionMenu from './AddMonitoringSectionMenu'
import ItemDoesntExist from '../../components/ItemDoesntExist'
import language from '../../language'
import LoadingIndicator from '../../components/LoadingIndicator'
import theme from '../../styles/theme'

const pageLanguage = language.pages.siteQuestionsOverview

const SettingsLinkWrapper = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-decoration: none;
  color: ${theme.color.text};
`
const WideTh = styled('th')`
  width: 100%;
`
const StyledSectionHeader = styled('h3')`
  text-transform: uppercase;
  font-weight: 100;
`
const SettingsLink = (props) => (
  <SettingsLinkWrapper {...props}>
    <Settings />
    <XSmallUpperCase>{pageLanguage.settings}</XSmallUpperCase>
  </SettingsLinkWrapper>
)

const SiteOverview = () => {
  const [doesSiteExist, setDoesSiteExist] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [site, setSite] = useState()
  const [landscape, setLandscape] = useState()
  const { siteId } = useParams()

  useEffect(
    function loadDataFromServer() {
      if (siteId) {
        const sitesDataUrl = `${process.env.REACT_APP_API_URL}/sites/${siteId}`
        const landscapesUrl = `${process.env.REACT_APP_API_URL}/landscapes`

        Promise.all([axios.get(sitesDataUrl), axios.get(landscapesUrl)])
          .then(([{ data: siteData }, { data: landscapesData }]) => {
            setIsLoading(false)
            setSite(siteData)
            setLandscape(landscapesData.find((landscape) => landscape.id === siteData.landscape_id))
          })
          .catch((err) => {
            setIsLoading(false)
            if (err?.response?.status === 404) {
              setDoesSiteExist(false)
            } else {
              toast.error(language.error.apiLoad)
            }
          })
      }
    },
    [siteId]
  )

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
          <SettingsLink to={`/site/${siteId}/edit`} />
        </TitleAndActionContainer>
        <StyledSectionHeader>{pageLanguage.formGroupTitle.registration}</StyledSectionHeader>
        {/* this is a table instead of a ul to leave room for a cell that shows
         how many questions are filled out. Feature cut for now
         to manage timeline risk. */}
        <TableAlertnatingRows>
          <tbody>
            <tr>
              <WideTh>
                <Link to={`/site/${siteId}/form/project-details`}>
                  {pageLanguage.formName.siteDetails}
                </Link>
              </WideTh>
            </tr>
            <tr>
              <WideTh>
                <Link to={`/site/${siteId}/form/site-background`}>
                  {pageLanguage.formName.siteBackground}
                </Link>
              </WideTh>
            </tr>
            <tr>
              <WideTh>
                <Link to={`/site/${siteId}/form/restoration-aims`}>
                  {pageLanguage.formName.restorationAims}
                </Link>
              </WideTh>
            </tr>
            <tr>
              <WideTh>
                <Link to={`/site/${siteId}/form/causes-of-decline`}>
                  {pageLanguage.formName.causesOfDeclin}
                </Link>
              </WideTh>
            </tr>
            <tr>
              <WideTh>{pageLanguage.formName.preRestorationAssessment}</WideTh>
            </tr>
          </tbody>
        </TableAlertnatingRows>
        <StyledSectionHeader>{pageLanguage.formGroupTitle.intervention}</StyledSectionHeader>
        <TableAlertnatingRows>
          <tbody>
            <tr>
              <WideTh>{pageLanguage.formName.siteInterventions}</WideTh>
            </tr>
            <tr>
              <WideTh>{pageLanguage.formName.costs}</WideTh>
            </tr>
          </tbody>
        </TableAlertnatingRows>
        <StyledSectionHeader>{pageLanguage.formGroupTitle.monitoring}</StyledSectionHeader>
        <AddMonitoringSectionMenu />
      </ContentWrapper>
    </>
  )

  return isLoading ? <LoadingIndicator /> : siteOverview
}

export default SiteOverview
