import { Controller } from 'react-hook-form'
import { FormLabel } from '@mui/material'
import { styled } from '@mui/system'
import PropTypes from 'prop-types'
import { Input } from '../../styles/v2/ui/input'

const RequiredIndicator = styled('span')`
  color: red;
  margin-left: 4px;
`

const ErrorText = styled('span')`
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: 18px;
  font-style: italic;
  margin-top: 4px;
  color: ${({ theme }) => theme.palette.error.main};
`

const StyledLabel = styled(FormLabel)`
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: 18px;
  margin-bottom: 6px;
`

function FormInput({ name, label, placeholder, control, type = 'text', required = false, error }) {
  return (
    <div>
      <StyledLabel htmlFor={name}>
        {label}
        {required && <RequiredIndicator>*</RequiredIndicator>}
      </StyledLabel>
      <Controller
        name={name}
        control={control}
        render={({ field }) => <Input {...field} id={name} type={type} placeholder={placeholder} />}
      />
      {error ? <ErrorText>{error}</ErrorText> : null}
    </div>
  )
}

FormInput.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  type: PropTypes.string,
  required: PropTypes.bool
}

export { FormInput }
