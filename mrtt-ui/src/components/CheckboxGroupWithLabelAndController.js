import React from 'react'
import PropTypes from 'prop-types'
import { StickyFormLabel } from '../styles/forms'
import { Controller } from 'react-hook-form'
import CheckboxGroup from './CheckboxGroup/CheckboxGroup'
import getOptionsValuesAndLabels from '../library/getOptionsValuesAndLabels'

const CheckboxGroupWithLabelAndController = ({
  fieldName,
  options,
  question,
  reactHookFormInstance,
  shouldAddOtherOptionWithClarification
}) => {
  const { control: formControl } = reactHookFormInstance
  const labelId = `${fieldName}-label`
  const optionsValueLabels = getOptionsValuesAndLabels(options)

  return (
    <>
      <StickyFormLabel id={labelId}>{question}</StickyFormLabel>
      <Controller
        name={fieldName}
        control={formControl}
        render={({ field }) => {
          return (
            <CheckboxGroup
              {...field}
              options={optionsValueLabels}
              aria-labelledby={labelId}
              shouldAddOtherOptionWithClarification={shouldAddOtherOptionWithClarification}
              id={fieldName}
            />
          )
        }}
      />
    </>
  )
}

CheckboxGroupWithLabelAndController.propTypes = {
  fieldName: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  question: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
  reactHookFormInstance: PropTypes.any.isRequired,
  shouldAddOtherOptionWithClarification: PropTypes.bool
}
CheckboxGroup.defaultProps = { shouldAddOtherOptionWithClarification: false }

export default CheckboxGroupWithLabelAndController
