import { Link, useParams } from 'react-router-dom'
import { Settings } from '@mui/icons-material'
import { Stack } from '@mui/material'
import { styled } from '@mui/system'
import { toast } from 'react-toastify'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

import { H4, H5Uppercase, SmallUpperCase, XSmallUpperCase } from '../styles/typography'
import { PaddedPageSection, PaddedPageTopSection, RowSpaceBetween } from '../styles/containers'
import { TableAlertnatingRows } from '../styles/table'
import ItemDoesntExist from '../components/ItemDoesntExist'
import language from '../language'
import LoadingIndicator from '../components/LoadingIndicator'
import theme from '../styles/theme'

const pageLanguage = language.pages.siteQuestionsOverview

const SettingsLinkWrapper = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-decoration: none;
  color: ${theme.color.text};
`
const TinyTd = styled('td')`
  text-align: center;
`
const WideTh = styled('th')`
  width: 100%;
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
  const { siteId } = useParams()

  useEffect(
    function loadDataFromServer() {
      if (siteId) {
        const sitesDataUrl = `${process.env.REACT_APP_API_URL}/sites/${siteId}`

        Promise.all([axios.get(sitesDataUrl)])
          .then(([{ data: siteData }]) => {
            setIsLoading(false)
            setSite(siteData)
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
      <PaddedPageTopSection>
        <RowSpaceBetween>
          <Stack>
            <H4>{site?.site_name}</H4>
            <SmallUpperCase>Landscape Placeholder</SmallUpperCase>
          </Stack>
          <SettingsLink to={`/site/${siteId}/edit`} />
        </RowSpaceBetween>
      </PaddedPageTopSection>
      <PaddedPageSection>
        <H5Uppercase>{pageLanguage.formGroupTitle.registration}</H5Uppercase>
        <TableAlertnatingRows>
          <tbody>
            <tr>
              <WideTh>
                <Link to={`/site/${siteId}/form/project-details`}>
                  {pageLanguage.formName.siteDetails}
                </Link>
              </WideTh>
              <TinyTd>x/5</TinyTd>
            </tr>
            <tr>
              <WideTh>
                <Link to={`/site/${siteId}/form/site-background`}>
                  {pageLanguage.formName.siteBackground}
                </Link>
              </WideTh>
              <TinyTd>x/7</TinyTd>
            </tr>
            <tr>
              <WideTh>
                <Link to={`/site/${siteId}/form/restoration-aims`}>
                  {pageLanguage.formName.restorationAims}
                </Link>
              </WideTh>
              <TinyTd>x/4</TinyTd>
            </tr>
            <tr>
              <WideTh>
                <Link to={`/site/${siteId}/form/causes-of-decline`}>
                  {pageLanguage.formName.causesOfDeclin}
                </Link>
              </WideTh>
              <TinyTd>x/4</TinyTd>
            </tr>
            <tr>
              <WideTh>{pageLanguage.formName.preRestorationAssessment}</WideTh>
              <TinyTd>x/4</TinyTd>
            </tr>
          </tbody>
        </TableAlertnatingRows>
        <H5Uppercase>{pageLanguage.formGroupTitle.intervention}</H5Uppercase>
        <TableAlertnatingRows>
          <tbody>
            <tr>
              <WideTh>{pageLanguage.formName.siteInterventions}</WideTh>
              <TinyTd>x/4</TinyTd>
            </tr>
            <tr>
              <WideTh>{pageLanguage.formName.costs}</WideTh>
              <TinyTd>x/6</TinyTd>
            </tr>
          </tbody>
        </TableAlertnatingRows>
        <H5Uppercase>{pageLanguage.formGroupTitle.monitoring}</H5Uppercase>
      </PaddedPageSection>
    </>
  )

  return isLoading ? <LoadingIndicator /> : siteOverview
}

export default SiteOverview
