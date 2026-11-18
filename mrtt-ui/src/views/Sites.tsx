'use client'

import { useQuery } from '@tanstack/react-query'

import DownloadDataMenu from '@/components/DownloadDataMenu'
import LoadingIndicator from '@/components/LoadingIndicator'
import {
  ButtonContainer,
  ContentWrapper,
  LinkCard,
  TitleAndActionContainer
} from '@/components/ui/layout'
import { toast } from '@/components/ui/toast'
import {
  ItemSubTitle,
  ItemTitle,
  LinkLooksLikeButtonPrimary,
  PageTitle
} from '@/components/ui/typography'
import { useLoadErrorToast } from '@/hooks/useLoadErrorToast'
import language from '@/language'
import { saveBlob } from '@/lib/download'
import { downloadAllSitesReport, siteQueries } from '@/queries/sites'
import type { Site } from '@/types/api'

const pageLanguage = language.pages.sites

// Most recently updated first; never-updated sites on top; ties by name, Z to A.
const sortSites = (sites: Site[]) =>
  [...sites]
    .sort((a, b) => b.site_name.localeCompare(a.site_name))
    .sort((a, b) => {
      const aUpdated = a.section_last_updated ?? ''
      const bUpdated = b.section_last_updated ?? ''
      if (aUpdated === bUpdated) return 0
      if (!aUpdated) return -1
      if (!bUpdated) return 1
      return aUpdated > bUpdated ? -1 : 1
    })

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })

function Sites() {
  const { data: sites = [], isPending, error } = useQuery(siteQueries.list())
  useLoadErrorToast(error)

  const handleDownload = (publicOnly: boolean) => {
    downloadAllSitesReport(publicOnly)
      .then((blob) => saveBlob(blob, 'organization-data.xlsx'))
      .catch(() => toast.error(language.error.apiLoad))
  }

  if (isPending) return <LoadingIndicator />

  return (
    <ContentWrapper>
      <TitleAndActionContainer>
        <PageTitle>{pageLanguage.title}</PageTitle>
        <ButtonContainer>
          <DownloadDataMenu label={pageLanguage.downloadSites} onSelect={handleDownload} />
          <LinkLooksLikeButtonPrimary href='/sites/new'>
            {pageLanguage.newSiteButton}
          </LinkLooksLikeButtonPrimary>
        </ButtonContainer>
      </TitleAndActionContainer>
      <div className='flex flex-col'>
        {sortSites(sites).map(({ site_name, landscape_name, id, section_last_updated }) => (
          <LinkCard key={id} href={`/sites/${id}/overview`}>
            <ItemTitle>{site_name}</ItemTitle>
            <ItemSubTitle>{landscape_name}</ItemSubTitle>
            {section_last_updated ? (
              <p>
                {pageLanguage.lastUpdated}: {formatDate(section_last_updated)}
              </p>
            ) : null}
          </LinkCard>
        ))}
      </div>
    </ContentWrapper>
  )
}

export default Sites
