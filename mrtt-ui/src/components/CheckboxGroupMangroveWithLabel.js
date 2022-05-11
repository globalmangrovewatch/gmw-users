import React from 'react'
import PropTypes from 'prop-types'
import { FormQuestionDiv } from '../styles/forms'
import { FormLabel } from '@mui/material'
import { Controller } from 'react-hook-form'
import CheckboxGroup from './CheckboxGroup'

const CheckboxGroupMangroveWithLabel = ({
  reactHookFormInstance,
  options,
  question,
  fieldName
}) => {
  const { control: formControl, setValue: setFormValue } = reactHookFormInstance
  const labelId = `${fieldName}-label`

  return (
    <>
      <FormQuestionDiv>
        <FormLabel id={labelId}>{question}</FormLabel>
      </FormQuestionDiv>
      <Controller
        name={fieldName}
        control={formControl}
        defaultValue={[]}
        render={({ field }) => {
          return (
            <CheckboxGroup
              {...field}
              onChange={({ selectedItems }) => {
                setFormValue(fieldName, selectedItems)
              }}
              options={options}
              aria-labelledby={labelId}
            />
          )
        }}
      />
    </>
  )
}

CheckboxGroupMangroveWithLabel.propTypes = {
  reactHookFormInstance: PropTypes.any.isRequired,
  question: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })
  ).isRequired,
  fieldName: PropTypes.string.isRequired
}

export default CheckboxGroupMangroveWithLabel
