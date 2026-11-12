'use client'

import { useQuery } from '@tanstack/react-query'

import DownloadDataMenu from '@/components/DownloadDataMenu'
import LoadingIndicator from '@/components/LoadingIndicator'
import {
  ButtonContainer,
  Card,
  ContentWrapper,
  PaddedSection,
  RowSpaceBetween,
  TitleAndActionContainer,
  UlAlternating,
  UlUndecorated
} from '@/components/ui/layout'
import { toast } from '@/components/ui/toast'
import {
  H2,
  LinkLooksLikeButtonPrimary,
  LinkLooksLikeButtonSecondary,
  PageTitle
} from '@/components/ui/typography'
import USER_ROLES from '@/constants/userRoles'
import { useLoadErrorToast } from '@/hooks/useLoadErrorToast'
import language from '@/language'
import { saveBlob } from '@/lib/download'
import { downloadOrganizationReport, organizationQueries } from '@/queries/organizations'
import type { Id } from '@/types/api'

const pageLanguage = language.pages.organizations

const handleDownload = (organizationId: Id) => (publicOnly: boolean) => {
  downloadOrganizationReport(organizationId, publicOnly)
    .then((blob) => saveBlob(blob, 'organization-data.xlsx'))
    .catch(() => toast.error(language.error.apiLoad))
}

function Organizations() {
  const { data: organizations = [], isPending, error } = useQuery(organizationQueries.list())
  useLoadErrorToast(error)
  const yourOrganizations = organizations.filter((organization) => organization.role)
  const otherOrganizations = organizations.filter((organization) => !organization.role)

  if (isPending) return <LoadingIndicator />

  return (
    <ContentWrapper>
      <TitleAndActionContainer>
        <PageTitle>{pageLanguage.title}</PageTitle>
        <LinkLooksLikeButtonPrimary href='/organizations/new'>
          {pageLanguage.newOrganizationButton}
        </LinkLooksLikeButtonPrimary>
      </TitleAndActionContainer>
      <PaddedSection>
        <H2>{pageLanguage.titleYourOrganizations}</H2>
        {yourOrganizations.length ? (
          <UlUndecorated>
            {yourOrganizations.map(({ id, organization_name, role }) => (
              <Card render={<li />} key={id}>
                <RowSpaceBetween className='items-center gap-2.5'>
                  {organization_name}
                  <ButtonContainer>
                    <DownloadDataMenu
                      label={pageLanguage.downloadOrganizationSites}
                      onSelect={handleDownload(id)}
                    />
                    {role === USER_ROLES.orgAdmin ? (
                      <LinkLooksLikeButtonSecondary href={`/organizations/${id}/users`}>
                        {pageLanguage.manageUsers}
                      </LinkLooksLikeButtonSecondary>
                    ) : null}
                  </ButtonContainer>
                </RowSpaceBetween>
              </Card>
            ))}
          </UlUndecorated>
        ) : (
          pageLanguage.noYourOrganizations
        )}

        <H2>{pageLanguage.titleOtherOrganizations}</H2>
        {otherOrganizations.length ? (
          <UlAlternating>
            {otherOrganizations.map(({ id, organization_name }) => (
              <li key={id}>{organization_name}</li>
            ))}
          </UlAlternating>
        ) : (
          pageLanguage.noOtherOrganizations
        )}
      </PaddedSection>
    </ContentWrapper>
  )
}

export default Organizations
