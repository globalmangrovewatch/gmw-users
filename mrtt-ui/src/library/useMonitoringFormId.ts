import { useParams } from 'next/navigation'

/**
 * Monitoring form routes use an optional catch-all (`[[...monitoringFormId]]`),
 * so the param is an array, or undefined for a new form.
 */
const useMonitoringFormId = (): string | undefined => {
  const { monitoringFormId } = useParams<{ monitoringFormId?: string[] }>()
  return monitoringFormId?.[0]
}

export default useMonitoringFormId
