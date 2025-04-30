import { useWatch } from 'react-hook-form'
import PropTypes from 'prop-types'
import React from 'react'

import { FormLabel, MenuItem, Stack, TextField } from '@mui/material'
import { makeValidClassName } from '../../library/strings/makeValidClassName'
import { NestedQuestion } from '../../styles/forms'
import { restorationAims as questions } from '../../data/questions'
import language from '../../language'
const stakeholdersPropType = PropTypes.arrayOf(
  PropTypes.shape({ stakeholderType: PropTypes.string, stakeholderName: PropTypes.string })
)
const StakeholderBenefitsInputs = ({
  optionId,
  parentQuestionFieldName,
  form,
  stakeholders,
  optionValue
}) => {
  const { setValue: setFormValue, getValues: getFormValues, control: formControl } = form
  const parentFormValues = useWatch({ control: formControl, name: parentQuestionFieldName })
  const questionLabelId = `${optionId}-question-label`
  const stakeholdersToUse = stakeholders ?? []
  const areThereStakeholders = stakeholders.length

  const handleOnChange = ({ event, optionValue, stakeholderType }) => {
    const previousParentValue = getFormValues(parentQuestionFieldName)
    const previousAimStakeholdersBenefits = previousParentValue?.aimStakeholderBenefits

    const newAimStakeholderBenefits = {
      ...previousAimStakeholdersBenefits,

      [optionValue]: {
        ...previousAimStakeholdersBenefits?.[optionValue],
        [stakeholderType]: event.target.value
      }
    }

    setFormValue(parentQuestionFieldName, {
      ...previousParentValue,
      aimStakeholderBenefits: newAimStakeholderBenefits
    })
  }
  const selectItems = questions.nestedStakeholderBenefitsRanking.options.map((item) => (
    <MenuItem key={item} value={item}>
      {item}
    </MenuItem>
  ))

  const stakeholderInputs = stakeholdersToUse.map(({ stakeholderType, stakeholderName }) => {
    const selectInputId = makeValidClassName(`${optionId}${stakeholderType}-input`)
    const value = parentFormValues?.aimStakeholderBenefits?.[optionValue]?.[stakeholderType] ?? ''

    return (
      <Stack key={stakeholderType}>
        <FormLabel htmlFor={selectInputId}>
          {stakeholderType}
          {stakeholderName ? <> ({stakeholderName})</> : null}
        </FormLabel>
        <TextField
          select
          label={language.form.selectLabel}
          id={selectInputId}
          value={value}
          onChange={(event) => handleOnChange({ event, optionValue, stakeholderType })}>
          {selectItems}
        </TextField>
      </Stack>
    )
  })

  return areThereStakeholders ? (
    <NestedQuestion>
      <FormLabel id={questionLabelId}>
        {questions.nestedStakeholderBenefitsRanking.question}
      </FormLabel>
      <div aria-labelledby={questionLabelId}>{stakeholderInputs}</div>
    </NestedQuestion>
  ) : null
}

StakeholderBenefitsInputs.propTypes = {
  form: PropTypes.any.isRequired,
  optionId: PropTypes.string.isRequired,
  optionValue: PropTypes.string.isRequired,
  parentQuestionFieldName: PropTypes.string.isRequired,
  stakeholders: stakeholdersPropType.isRequired
}

export default StakeholderBenefitsInputs
export { stakeholdersPropType }
