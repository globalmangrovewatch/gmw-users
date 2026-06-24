import 'react-toastify/dist/ReactToastify.css'
import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormProvider, useForm } from 'react-hook-form'
import { useLocation } from 'react-router-dom'

import { defaultValues, validationSchema } from './FormSchemaValidation'

function FormWrapperProvider({ children }) {
  // fetch api data, merge defaultValues
  // fix date
  // initialize form with data
  // remove save from steps use just navigation buttons
  // validate by step
  const form = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues
  })

  // The form instance is a singleton shared across all routes. Reset it to
  // defaults whenever the active site changes so one site's answers don't carry
  // over to the next. Provider sits outside <Routes>, so useParams() is empty
  // here — derive the site id from the pathname instead.
  const { pathname } = useLocation()
  const siteId = pathname.match(/\/sites\/([^/]+)/)?.[1]
  const prevSiteId = useRef(siteId)

  useEffect(() => {
    if (prevSiteId.current !== siteId) {
      form.reset(defaultValues)
      prevSiteId.current = siteId
    }
  }, [siteId]) // eslint-disable-line react-hooks/exhaustive-deps

  return <FormProvider {...form}>{children}</FormProvider>
}

FormWrapperProvider.propTypes = {
  children: PropTypes.node.isRequired
}

export default FormWrapperProvider
