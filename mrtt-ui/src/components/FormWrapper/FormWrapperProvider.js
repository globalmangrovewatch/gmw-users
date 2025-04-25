import 'react-toastify/dist/ReactToastify.css'
import React from 'react'
import PropTypes from 'prop-types'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormProvider, useForm } from 'react-hook-form'

import { defaultValues, validationSchema } from './FormSchemaValidation'

function FormWrapperProvider({ children }) {
  const form = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues
  })

  return <FormProvider {...form}>{children}</FormProvider>
}

FormWrapperProvider.propTypes = {
  children: PropTypes.node.isRequired
}

export default FormWrapperProvider
