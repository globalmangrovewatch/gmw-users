import { RowSpaceBetween, TableAlertnatingRows, WideTh } from '@/components/ui/layout'
import { Link, SmallUpperCase } from '@/components/ui/typography'
import MONITORING_FORM_CONSTANTS from '@/constants/monitoringFormConstants'
import type { MonitoringForm } from '@/types/api'

type MonitoringFormsListProps = {
  monitoringFormsSortedByDate: Pick<MonitoringForm, 'id' | 'form_type' | 'monitoring_date'>[]
  siteId: string
}

/** The site's saved monitoring forms, each linking to its edit page, with its date. */
function MonitoringFormsList({ monitoringFormsSortedByDate, siteId }: MonitoringFormsListProps) {
  return (
    <TableAlertnatingRows>
      <tbody>
        {monitoringFormsSortedByDate.map(({ id, form_type, monitoring_date }) => {
          const { label, urlSegment } = MONITORING_FORM_CONSTANTS[form_type] ?? {}
          return (
            <tr key={id}>
              <WideTh>
                <RowSpaceBetween>
                  <Link href={`/sites/${siteId}/form/${urlSegment}/${id}`}>{label}</Link>
                  <SmallUpperCase>{monitoring_date}</SmallUpperCase>
                </RowSpaceBetween>
              </WideTh>
            </tr>
          )
        })}
      </tbody>
    </TableAlertnatingRows>
  )
}

export default MonitoringFormsList
export type { MonitoringFormsListProps }
