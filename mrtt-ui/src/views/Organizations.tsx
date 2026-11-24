'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import DownloadDataMenu from '@/components/DownloadDataMenu'
import LoadingIndicator from '@/components/LoadingIndicator'
import { Combobox } from '@/components/ui/combobox'
import { Input } from '@/components/ui/input'
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
import {
  countryQueries,
  downloadOrganizationReport,
  organizationQueries,
  regionQueries
} from '@/queries/organizations'
import type { Id } from '@/types/api'

const pageLanguage = language.pages.organizations

const handleDownload = (organizationId: Id) => (publicOnly: boolean) => {
  downloadOrganizationReport(organizationId, publicOnly)
    .then((blob) => saveBlob(blob, 'organization-data.xlsx'))
    .catch(() => toast.error(language.error.apiLoad))
}

// Wait for a pause in typing before searching, so each keystroke doesn't send a request.
const SEARCH_DELAY_MS = 300

const useDebouncedValue = <T,>(value: T, delay: number) => {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timeout)
  }, [value, delay])
  return debounced
}

function Organizations() {
  const [search, setSearch] = useState('')
  const [region, setRegion] = useState<string | null>(null)
  const [country, setCountry] = useState<string | null>(null)
  const q = useDebouncedValue(search, SEARCH_DELAY_MS)
  const isFiltered = Boolean(q.trim() || region || country)

  const {
    data: organizations = [],
    isPending,
    error
  } = useQuery({
    ...organizationQueries.list({ q, region: region ?? undefined, country: country ?? undefined }),
    // Keep showing the last results while the next filter loads, instead of a blank page.
    placeholderData: keepPreviousData
  })
  useLoadErrorToast(error)
  const { data: regions = [] } = useQuery(regionQueries.list())
  const { data: countries = [] } = useQuery(countryQueries.list())
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
        <div className='grid gap-4 sm:grid-cols-3'>
          <Input
            type='search'
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={pageLanguage.searchPlaceholder}
            aria-label={pageLanguage.searchPlaceholder}
          />
          <Combobox
            options={regions.map((name) => ({ label: name, value: name }))}
            value={region}
            onChange={setRegion}
            placeholder={pageLanguage.filterRegion}
            aria-label={pageLanguage.filterRegion}
          />
          <Combobox
            options={countries.map(({ name, iso }) => ({ label: name, value: iso }))}
            value={country}
            onChange={setCountry}
            placeholder={pageLanguage.filterCountry}
            aria-label={pageLanguage.filterCountry}
          />
        </div>

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
          <p>{isFiltered ? pageLanguage.noMatches : pageLanguage.noYourOrganizations}</p>
        )}

        <H2>{pageLanguage.titleOtherOrganizations}</H2>
        {otherOrganizations.length ? (
          <UlAlternating>
            {otherOrganizations.map(({ id, organization_name }) => (
              <li key={id}>{organization_name}</li>
            ))}
          </UlAlternating>
        ) : (
          <p>{isFiltered ? pageLanguage.noMatches : pageLanguage.noOtherOrganizations}</p>
        )}
      </PaddedSection>
    </ContentWrapper>
  )
}

export default Organizations
