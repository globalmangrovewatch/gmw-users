import { ButtonPrimary, ButtonSecondary } from '@/styles/buttons'
import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Menu, MenuItem } from '@mui/material'

import {
  ButtonContainer,
  Card,
  ContentWrapper,
  PaddedSection,
  RowSpaceBetween,
  TitleAndActionContainer
} from '@/styles/containers'
import { H2, LinkLooksLikeButtonSecondary, PageTitle } from '@/styles/typography'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { UlAlternating, UlUndecorated } from '@/styles/lists'
import language from '@/language'
import LoadingIndicator from '@/components/LoadingIndicator'
import USER_ROLES from '@/constants/userRoles'
import { saveBlob } from '@/lib/download'
import { useLoadErrorToast } from '@/hooks/useLoadErrorToast'
import { downloadOrganizationReport, organizationQueries } from '@/queries/organizations'

function Organizations() {
  const { data: organizations = [], isPending, error } = useQuery(organizationQueries.list())
  const yourOrganizations = organizations.filter((organization) => organization.role)
  const otherOrganizations = organizations.filter((organization) => !organization.role)
  const [downloadOptionsAnchorEl, setDownloadOptionsAnchorEl] = useState(null)
  const [targetOrganization, setTargetOrganization] = useState(null)

  useLoadErrorToast(error)

  const handleDownloadButtonClick = (event, organizationId) => {
    setDownloadOptionsAnchorEl(event.currentTarget)
    setTargetOrganization(organizationId)
  }

  const handleDownloadMenuClose = () => {
    setDownloadOptionsAnchorEl(null)
  }

  const handleDownloadOptionSelect = ({ publicOnly }) => {
    setDownloadOptionsAnchorEl(null)
    downloadOrganizationReport(targetOrganization, publicOnly)
      .then((blob) => saveBlob(blob, 'organization-data.xlsx'))
      .catch(() => toast.error(language.error.apiLoad))
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
  return isPending ? (
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
