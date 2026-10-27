import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

import type { Site } from '@/types/api'
import { siteQueries } from '@/queries/sites'

const emptySite: Partial<Site> = {}

const useSiteInfo = (): Partial<Site> => {
  const { siteId } = useParams<{ siteId: string }>()
  const { data } = useQuery({ ...siteQueries.detail(siteId ?? ''), enabled: !!siteId })
  return data ?? emptySite
}

export default useSiteInfo
