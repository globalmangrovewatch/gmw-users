'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { LuSettings } from 'react-icons/lu'

import DownloadDataMenu from '@/components/DownloadDataMenu'
import ItemDoesntExist from '@/components/ItemDoesntExist'
import LoadingIndicator from '@/components/LoadingIndicator'
import {
  ButtonContainer,
  ContentWrapper,
  RowCenterCenter,
  TableAlertnatingRows,
  TitleAndActionContainer,
  WideTh
} from '@/components/ui/layout'
import { toast } from '@/components/ui/toast'
import {
  ItemSubTitle,
  ItemTitle,
  Link,
  LinkLooksLikeButtonSecondary
} from '@/components/ui/typography'
import { isNotFound, useLoadErrorToast } from '@/hooks/useLoadErrorToast'
import language from '@/language'
import { saveBlob } from '@/lib/download'
import { landscapeQueries } from '@/queries/landscapes'
import { downloadSiteReport, siteQueries } from '@/queries/sites'
import type { MonitoringForm } from '@/types/api'

import AddMonitoringSectionMenu from './AddMonitoringSectionMenu'
import MonitoringFormsList from './MonitoringFormsList'

const pageLanguage = language.pages.siteQuestionsOverview
const { formName } = pageLanguage

const registrationSections = [
  { path: 'project-details', label: formName.siteDetails },
  { path: 'site-background', label: formName.siteBackground },
  { path: 'restoration-aims', label: formName.restorationAims },
  { path: 'causes-of-decline', label: formName.causesOfDecline },
  { path: 'pre-restoration-assessment', label: formName.preRestorationAssessment }
]

const interventionSections = [
  { path: 'site-interventions', label: formName.siteInterventions },
  { path: 'costs', label: formName.costs }
]

const sectionHeaderClassName = 'font-thin uppercase'

// Most recent first; forms without a date on top.
const sortByMonitoringDate = (forms: MonitoringForm[]) =>
  [...forms].sort((a, b) => {
    if (a.monitoring_date === b.monitoring_date) return 0
    if (!a.monitoring_date) return -1
    if (!b.monitoring_date) return 1
    return a.monitoring_date > b.monitoring_date ? -1 : 1
  })

/** A site's overview: links to every registration, intervention and monitoring form. */
function SiteOverview() {
  const { siteId } = useParams<{ siteId: string }>()

  const siteQuery = useQuery(siteQueries.detail(siteId))
  const landscapesQuery = useQuery(landscapeQueries.list())
  const monitorsQuery = useQuery(siteQueries.monitors(siteId))
  useLoadErrorToast(siteQuery.error, landscapesQuery.error, monitorsQuery.error)

  const site = siteQuery.data
  const landscape = landscapesQuery.data?.find(({ id }) => id === site?.landscape_id)
  const monitoringForms = sortByMonitoringDate(monitorsQuery.data ?? [])

  const handleDownload = (publicOnly: boolean) => {
    downloadSiteReport(siteId, publicOnly)
      .then((blob) => saveBlob(blob, `${site?.site_name ?? 'site'}.pdf`))
      .catch(() => toast.error(language.error.apiLoad))
  }

  const sectionLinks = (sections: { path: string; label: string }[]) => (
    // A table rather than a list, to leave room for a "questions answered" cell later.
    <TableAlertnatingRows>
      <tbody>
        {sections.map(({ path, label }) => (
          <tr key={path}>
            <WideTh>
              <Link href={`/sites/${siteId}/form/${path}`}>{label}</Link>
            </WideTh>
          </tr>
        ))}
      </tbody>
    </TableAlertnatingRows>
  )

  if (siteQuery.isPending || landscapesQuery.isPending || monitorsQuery.isPending) {
    return <LoadingIndicator />
  }
  if (isNotFound(siteQuery.error)) return <ItemDoesntExist item='site' />

  return (
    <ContentWrapper>
      <TitleAndActionContainer>
        <div className='flex flex-col'>
          <ItemTitle render={<h2 />}>{site?.site_name}</ItemTitle>
          <ItemSubTitle>{landscape?.landscape_name}</ItemSubTitle>
        </div>
        <ButtonContainer>
          <DownloadDataMenu label={pageLanguage.downloadSiteData} onSelect={handleDownload} />
          <LinkLooksLikeButtonSecondary href={`/sites/${siteId}/edit`}>
            <LuSettings className='size-4' aria-hidden='true' /> {pageLanguage.settings}
          </LinkLooksLikeButtonSecondary>
        </ButtonContainer>
      </TitleAndActionContainer>
      <h3 className={sectionHeaderClassName}>{pageLanguage.formGroupTitle.registration}</h3>
      {sectionLinks(registrationSections)}
      <h3 className={sectionHeaderClassName}>{pageLanguage.formGroupTitle.intervention}</h3>
      {sectionLinks(interventionSections)}
      <h3 className={sectionHeaderClassName}>{pageLanguage.formGroupTitle.monitoring}</h3>
      <AddMonitoringSectionMenu siteId={siteId} />
      {monitoringForms.length ? (
        <MonitoringFormsList monitoringFormsSortedByDate={monitoringForms} siteId={siteId} />
      ) : (
        <RowCenterCenter>{pageLanguage.noMonitoringSections}</RowCenterCenter>
      )}
    </ContentWrapper>
  )
}

export default SiteOverview
