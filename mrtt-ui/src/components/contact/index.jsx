import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Dialog,
  TextField,
  Select,
  MenuItem,
  FormControl,
  FormLabel,
  FormHelperText,
  Checkbox,
  Button,
  Box,
  Typography
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

const isDev = process.env.NODE_ENV === 'development'

const TOPICS = [
  { label: 'General', value: 'general' },
  { label: 'Datasets', value: 'datasets' },
  { label: 'GMW Platform', value: 'gmw-platform' },
  { label: 'Mangrove Restoration Tracker Tool', value: 'mrtt' },
  { label: 'Global Mangrove Alliance', value: 'gma' }
]

const schema = yup.object().shape({
  name: yup.string().min(2).required('Name is required'),
  organization: yup.string(),
  email: yup.string().email('Invalid email').required('Email is required'),
  topic: yup
    .string()
    .oneOf(TOPICS.map((t) => t.value))
    .required('Topic is required'),
  message: yup.string().min(2).required('Message is required'),
  privacyPolicy: isDev
    ? yup.boolean().oneOf([true], 'You must accept the Privacy Policy')
    : yup.boolean().optional()
})

const defaultValues = {
  name: '',
  organization: '',
  email: '',
  topic: '',
  message: '',
  privacyPolicy: true
}

const ContactForm = ({ isOpen, setIsOpen, onSuccess }) => {
  const [status, setStatus] = useState('idle')
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues
  })

  const onClose = () => {
    setIsOpen(false)
    reset()
    setStatus('idle')
  }

  const onSubmit = async (data) => {
    setStatus('loading')
    try {
      const res = await fetch('https://www.globalmangrovewatch.org/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!res.ok) throw new Error('Failed to send')

      setStatus('success')
      onSuccess?.()
      reset()
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <Box p={4} width={400}>
        <Typography variant='h6' gutterBottom>
          Contact Us
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Box display='flex' flexDirection='column' gap={2}>
            <Controller
              name='name'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label='Name'
                  error={!!errors.name}
                  helperText={
                    errors.name?.message
                      ? errors.name.message.charAt(0).toUpperCase() + errors.name.message.slice(1)
                      : ''
                  }
                  required
                />
              )}
            />

            <Controller
              name='organization'
              control={control}
              render={({ field }) => <TextField {...field} label='Organization' />}
            />

            <Controller
              name='email'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label='Email'
                  type='email'
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  required
                />
              )}
            />

            <Controller
              name='topic'
              control={control}
              render={({ field }) => (
                <FormControl error={!!errors.topic}>
                  <FormLabel>Topic</FormLabel>
                  <Select {...field} displayEmpty>
                    <MenuItem value='' disabled>
                      Select a topic
                    </MenuItem>
                    {TOPICS.map(({ label, value }) => (
                      <MenuItem key={value} value={value}>
                        {label}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors.topic?.message}</FormHelperText>
                </FormControl>
              )}
            />

            <Controller
              name='message'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label='Message'
                  multiline
                  minRows={4}
                  error={!!errors.message}
                  helperText={
                    errors.message?.message
                      ? errors.message.message.charAt(0).toUpperCase() +
                        errors.message.message.slice(1)
                      : ''
                  }
                  required
                />
              )}
            />

            {isDev && (
              <Controller
                name='privacyPolicy'
                control={control}
                render={({ field }) => (
                  <FormControl error={!!errors.privacyPolicy}>
                    <Box display='flex' alignItems='center' gap={1}>
                      <Checkbox {...field} checked={field.value} />
                      <FormLabel sx={{ margin: 0 }}>
                        I agree with the{' '}
                        <a href='/' target='_blank' rel='noopener noreferrer'>
                          Privacy Policy
                        </a>
                      </FormLabel>
                    </Box>
                    <FormHelperText>{errors.privacyPolicy?.message}</FormHelperText>
                  </FormControl>
                )}
              />
            )}

            {status === 'success' && (
              <Typography color='success.main'>Email sent successfully!</Typography>
            )}
            {status === 'error' && (
              <Typography color='error.main'>Failed to send email. Please try again.</Typography>
            )}

            <Box display='flex' justifyContent='flex-end' gap={2} mt={2}>
              <Button variant='outlined' onClick={onClose}>
                Cancel
              </Button>
              <Button variant='contained' type='submit' disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send'}
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </Dialog>
  )
}

export default ContactForm
ContactForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  onSuccess: PropTypes.func
}
