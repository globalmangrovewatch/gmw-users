import { ButtonPrimary, ButtonSecondary } from '../styles/buttons'
import React, { useEffect, useState } from 'react'
import { Menu, MenuItem } from '@mui/material'

import {
  ButtonContainer,
  Card,
  ContentWrapper,
  PaddedSection,
  RowSpaceBetween,
  TitleAndActionContainer
} from '../styles/containers'
import { H2, LinkLooksLikeButtonSecondary, PageTitle } from '../styles/typography'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { UlAlternating, UlUndecorated } from '../styles/lists'
import axios from 'axios'
import language from '../language'
import LoadingIndicator from '../components/LoadingIndicator'
import USER_ROLES from '../constants/userRoles'

const organizationsUrl = `${process.env.REACT_APP_API_URL}/organizations`

function Organizations() {
  const [yourOrganizations, setYourOrganizations] = useState([])
  const [otherOrganizations, setOtherOrganizations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [downloadOptionsAnchorEl, setDownloadOptionsAnchorEl] = useState(null)
  const [targetOrganization, setTargetOrganization] = useState(null)

  useEffect(function loadOrganizations() {
    axios
      .get(organizationsUrl)
      .then(({ data }) => {
        setIsLoading(false)
        setYourOrganizations(data.filter((organization) => organization.role))
        setOtherOrganizations(data.filter((organization) => !organization.role))
      })
      .catch(() => {
        toast.error(language.error.apiLoad)
      })
  }, [])

  const handleDownloadButtonClick = (event, organizationId) => {
    setDownloadOptionsAnchorEl(event.currentTarget)
    setTargetOrganization(organizationId)
  }

  const handleDownloadMenuClose = () => {
    setDownloadOptionsAnchorEl(null)
  }

  const handleDownloadOptionSelect = ({ publicOnly }) => {
    setDownloadOptionsAnchorEl(null)
    axios({
      url: `${process.env.REACT_APP_API_URL}/report/answers_as_xlsx?organization_id=${targetOrganization}&public_only=${publicOnly}`,
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

  const yourOrganizationsList = (
    <UlUndecorated>
      {yourOrganizations.map(({ id: organizationId, organization_name, role }) => {
        const canManageUsers = role === USER_ROLES.orgAdmin
        return (
          <Card as='li' key={organizationId}>
            <RowSpaceBetween>
              {organization_name}
              <ButtonContainer>
                <ButtonSecondary
                  type='button'
                  id='download-options'
                  aria-controls={open ? 'download-options-menu' : undefined}
                  aria-haspopup='true'
                  aria-expanded={open ? 'true' : undefined}
                  onClick={(event) => handleDownloadButtonClick(event, organizationId)}>
                  {language.pages.organizations.downloadOrganizationSites}
                </ButtonSecondary>
                {canManageUsers ? (
                  <LinkLooksLikeButtonSecondary to={`/organizations/${organizationId}/users`}>
                    {language.pages.organizations.manageUsers}
                  </LinkLooksLikeButtonSecondary>
                ) : null}
              </ButtonContainer>
            </RowSpaceBetween>
          </Card>
        )
      })}
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
          {language.pages.organizations.allData}
        </MenuItem>
        <MenuItem
          onClick={() =>
            handleDownloadOptionSelect({
              publicOnly: true
            })
          }>
          {language.pages.organizations.publicData}
        </MenuItem>
      </Menu>
    </UlUndecorated>
  )

  const otherOrganizationsList = (
    <UlAlternating>
      {otherOrganizations.map((organization) => (
        <li key={organization.id}>{organization.organization_name}</li>
      ))}
    </UlAlternating>
  )
  return isLoading ? (
    <LoadingIndicator />
  ) : (
    <>
      <ContentWrapper>
        <TitleAndActionContainer>
          <PageTitle>{language.pages.organizations.title}</PageTitle>
          <ButtonPrimary component={Link} to='/organizations/new'>
            {language.pages.organizations.newOrganizationButton}
          </ButtonPrimary>
        </TitleAndActionContainer>
        <PaddedSection>
          <H2>{language.pages.organizations.titleYourOrganizations}</H2>
          {yourOrganizations.length
            ? yourOrganizationsList
            : language.pages.organizations.noYourOrganizations}

          <H2>{language.pages.organizations.titleOtherOrganizations}</H2>
          {otherOrganizations.length
            ? otherOrganizationsList
            : language.pages.organizations.noOtherOrganizations}
        </PaddedSection>
      </ContentWrapper>
    </>
  )
}

export default Organizations
