'use client'

import { useQuery } from '@tanstack/react-query'

import EditLink from '@/components/EditLink'
import LoadingIndicator from '@/components/LoadingIndicator'
import {
  Card,
  ContentWrapper,
  PaddedSection,
  RowCenterCenter,
  RowSpaceBetween,
  TitleAndActionContainer,
  UlUndecorated
} from '@/components/ui/layout'
import {
  H4,
  ItemTitle,
  Link,
  LinkLooksLikeButtonPrimary,
  PageTitle,
  SmallUpperCase
} from '@/components/ui/typography'
import { useLoadErrorToast } from '@/hooks/useLoadErrorToast'
import language from '@/language'
import { landscapeQueries } from '@/queries/landscapes'

const pageLanguage = language.pages.landscapes

function Landscapes() {
  const { data: landscapes = [], isPending, error } = useQuery(landscapeQueries.list())
  useLoadErrorToast(error)

  if (isPending) return <LoadingIndicator />

  const sortedLandscapes = [...landscapes].sort((a, b) =>
    (a.landscape_name ?? '').localeCompare(b.landscape_name ?? '', undefined, {
      sensitivity: 'base'
    })
  )

  return (
    <ContentWrapper>
      <TitleAndActionContainer>
        <PageTitle>{pageLanguage.title}</PageTitle>
        <LinkLooksLikeButtonPrimary href='/landscapes/new'>
          {pageLanguage.newLandscapeButton}
        </LinkLooksLikeButtonPrimary>
      </TitleAndActionContainer>
      <div className='flex flex-col'>
        {sortedLandscapes.map(({ landscape_name, id, organizations, sites }) => (
          <Card key={id}>
            <RowSpaceBetween>
              <ItemTitle>{landscape_name}</ItemTitle>
              <RowCenterCenter>
                <EditLink href={`/landscapes/${id}/edit`} />
              </RowCenterCenter>
            </RowSpaceBetween>
            <H4>{pageLanguage.sites}</H4>
            <PaddedSection>
              {sites.length ? (
                <UlUndecorated>
                  {sites.map(({ site_name, site_id }) => (
                    <li key={site_id}>
                      <Link href={`/sites/${site_id}/overview`}>{site_name}</Link>
                    </li>
                  ))}
                </UlUndecorated>
              ) : (
                <SmallUpperCase>{pageLanguage.noSites}</SmallUpperCase>
              )}
            </PaddedSection>
            <H4>{pageLanguage.organizations}</H4>
            <PaddedSection>
              <UlUndecorated>
                {organizations.map(({ organization_name, id: organizationId }) => (
                  <li key={organizationId}>{organization_name}</li>
                ))}
              </UlUndecorated>
            </PaddedSection>
          </Card>
        ))}
      </div>
    </ContentWrapper>
  )
}

export default Landscapes
