import React from 'react'
import PropTypes from 'prop-types'

import MONITORING_FORM_CONSTANTS from '../../constants/monitoringFormConstants'
import { RowSpaceBetween } from '../../styles/containers'
import { TableAlertnatingRows, WideTh } from '../../styles/table'
import { Link, SmallUpperCase } from '../../styles/typography'

const MonitoringFormsList = ({ monitoringFormsSortedByDate, siteId }) => {
  return (
    <TableAlertnatingRows>
      <tbody>
        {monitoringFormsSortedByDate.map(({ id: formId, form_type, monitoring_date }) => {
          const formLabel = MONITORING_FORM_CONSTANTS[form_type].label
          const formUrl = `/sites/${siteId}/form/${MONITORING_FORM_CONSTANTS[form_type].urlSegment}/${formId}`
          return (
            <tr key={formId}>
              <WideTh>
                <RowSpaceBetween>
                  <Link to={formUrl}>{formLabel}</Link>
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

MonitoringFormsList.propTypes = {
  monitoringFormsSortedByDate: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      form_type: PropTypes.string,
      monitoring_date: PropTypes.string
    })
  ).isRequired,
  siteId: PropTypes.string.isRequired
}

export default MonitoringFormsList
