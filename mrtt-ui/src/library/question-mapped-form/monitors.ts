import { useQuery } from '@tanstack/react-query'

import { siteQueries } from '@/queries/sites'

// The site's monitoring forms (id, type and date of each).
export function useGetMonitorsForms({
  siteId,
  enabled = true
}: {
  siteId?: string
  enabled?: boolean
}) {
  return useQuery({ ...siteQueries.monitors(siteId ?? ''), enabled: enabled && !!siteId })
}
