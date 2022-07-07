import { useParams } from 'react-router-dom'
import { Link } from '../../styles/typography'
import { Settings } from '@mui/icons-material'
import { Stack } from '@mui/material'
import { styled } from '@mui/system'
import { toast } from 'react-toastify'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

import { ItemSubTitle, ItemTitle } from '../../styles/typography'
import { ContentWrapper, TitleAndActionContainer } from '../../styles/containers'
import { TableAlertnatingRows } from '../../styles/table'
import AddMonitoringSectionMenu from './AddMonitoringSectionMenu'
import ItemDoesntExist from '../../components/ItemDoesntExist'
import language from '../../language'
import LoadingIndicator from '../../components/LoadingIndicator'
import { ButtonSecondary } from '../../styles/buttons'

const pageLanguage = language.pages.siteQuestionsOverview

const WideTh = styled('th')`
  width: 100%;
`
const StyledSectionHeader = styled('h3')`
  text-transform: uppercase;
  font-weight: 100;
`

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
          <ButtonSecondary component={Link} to={`/site/${siteId}/edit`}>
            <Settings /> Settings
          </ButtonSecondary>
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
