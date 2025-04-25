import React from 'react'
import PropTypes from 'prop-types'
import { StickyFormLabel } from '../styles/forms'
import { Controller } from 'react-hook-form'
import CheckboxGroup from './CheckboxGroup/CheckboxGroup'
import RequiredIndicator from './RequiredIndicator'
import getOptionsValuesAndLabels from '../library/getOptionsValuesAndLabels'

const CheckboxGroupWithLabelAndController = ({
  fieldName,
  options,
  question,
  control,
  shouldAddOtherOptionWithClarification,
  required = false
}) => {
  const labelId = `${fieldName}-label`
  const optionsValueLabels = getOptionsValuesAndLabels(options)

  return (
    <>
      <StickyFormLabel id={labelId}>
        {question}
        {required && <RequiredIndicator />}
      </StickyFormLabel>
      <Controller
        name={fieldName}
        control={control}
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
  control: PropTypes.any.isRequired,
  shouldAddOtherOptionWithClarification: PropTypes.bool,
  required: PropTypes.bool
}
CheckboxGroup.defaultProps = { shouldAddOtherOptionWithClarification: false }

export default CheckboxGroupWithLabelAndController
