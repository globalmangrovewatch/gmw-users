import { Controller } from 'react-hook-form'
import { FormLabel } from '@mui/material'
import { FormQuestionDiv } from '../../styles/forms'
import PropTypes from 'prop-types'
import React from 'react'

import CheckboxGroup from '../CheckboxGroup/CheckboxGroup'
import getOptionsValuesAndLabels from '../../library/getOptionsValuesAndLabels'
import StakeholderBenefitsInputs, { stakeholdersPropType } from './StakeholderBenefitsInputs'

const RestorationAimsCheckboxGroupWithLabel = ({
  fieldName,
  options,
  question,
  reactHookFormInstance,
  stakeholders
}) => {
  const {
    control: formControl,
    getValues: getFormValues,
    setValue: setFormValue
  } = reactHookFormInstance
  const optionsValueLabels = getOptionsValuesAndLabels(options)
  const id = `${fieldName}-label`

  const handleAimChangeAndResetStakeholdersIfAppropriate = ({
    event,
    isOtherChecked,
    otherValue,
    selectedValues
  }) => {
    const isAimChecked = event.target.checked
    const aimStakeholderBenefitsInForm = getFormValues(fieldName)?.aimStakeholderBenefits
    const aimStakeholderBenefitsReset = {
      ...aimStakeholderBenefitsInForm,
      [event.target.value]: undefined
    }

    setFormValue(fieldName, {
      selectedValues,
      otherValue,
      isOtherChecked,
      aimStakeholderBenefits: isAimChecked
        ? aimStakeholderBenefitsInForm
        : aimStakeholderBenefitsReset
    })
  }

  return (
    <>
      <FormQuestionDiv>
        <FormLabel id={id}>{question}</FormLabel>
      </FormQuestionDiv>
      <Controller
        name={fieldName}
        control={formControl}
        render={({ field }) => {
          return (
            <CheckboxGroup
              {...field}
              onChange={handleAimChangeAndResetStakeholdersIfAppropriate}
              options={optionsValueLabels}
              aria-labelledby={id}
              shouldAddOtherOptionWithClarification={true}
              shouldReturnEvent={true}
              id={fieldName}
              SelectedMarkup={({ optionId, optionValue }) => (
                <StakeholderBenefitsInputs
                  stakeholders={stakeholders}
                  reactHookFormInstance={reactHookFormInstance}
                  parentQuestionFieldName={fieldName}
                  optionId={optionId}
                  optionValue={optionValue}
                />
              )}
            />
          )
        }}
      />
    </>
  )
}

RestorationAimsCheckboxGroupWithLabel.propTypes = {
  fieldName: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  question: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
  reactHookFormInstance: PropTypes.any.isRequired,
  stakeholders: stakeholdersPropType.isRequired
}
CheckboxGroup.defaultProps = { shouldAddOtherOptionWithClarification: false }

export default RestorationAimsCheckboxGroupWithLabel
