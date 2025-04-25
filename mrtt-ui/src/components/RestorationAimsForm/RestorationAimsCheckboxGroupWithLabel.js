import { Controller } from 'react-hook-form'
import { StickyFormLabel } from '../../styles/forms'
import PropTypes from 'prop-types'
import React from 'react'

import CheckboxGroup from '../CheckboxGroup/CheckboxGroup'
import getOptionsValuesAndLabels from '../../library/getOptionsValuesAndLabels'
import StakeholderBenefitsInputs, { stakeholdersPropType } from './StakeholderBenefitsInputs'
import RequiredIndicator from '../RequiredIndicator'

const RestorationAimsCheckboxGroupWithLabel = ({
  fieldName,
  options,
  question,
  form,
  showAsterisk,
  stakeholders
}) => {
  const { control: formControl, getValues: getFormValues, setValue: setFormValue } = form
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
      <StickyFormLabel id={id}>
        {question}
        {showAsterisk ? <RequiredIndicator /> : null}
      </StickyFormLabel>
      <Controller
        name={fieldName}
        control={formControl}
        render={({ field }) => {
          return (
            <CheckboxGroup
              {...field}
              onChange={handleAimChangeAndResetStakeholdersIfAppropriate}
              options={optionsValueLabels}
              optionsExcludedFromShowingSelectedMarkup={['Unknown', 'None']}
              aria-labelledby={id}
              shouldAddOtherOptionWithClarification={true}
              shouldReturnEvent={true}
              id={fieldName}
              SelectedMarkup={({ optionId, optionValue }) => (
                <StakeholderBenefitsInputs
                  stakeholders={stakeholders}
                  form={form}
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
  form: PropTypes.any.isRequired,
  showAsterisk: PropTypes.bool,
  stakeholders: stakeholdersPropType.isRequired
}
RestorationAimsCheckboxGroupWithLabel.defaultProps = { showAsterisk: false }

export default RestorationAimsCheckboxGroupWithLabel
