'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { FormInput, FormSelect, FormTextarea } from '@/components/form/FormInput'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'

const CONTACT_API_URL = 'https://www.globalmangrovewatch.org/api/send'

const TOPICS = [
  { label: 'General', value: 'general' },
  { label: 'Datasets', value: 'datasets' },
  { label: 'GMW Platform', value: 'gmw-platform' },
  { label: 'Mangrove Restoration Tracker Tool', value: 'mrtt' },
  { label: 'Global Mangrove Alliance', value: 'gma' }
]

const TOPIC_VALUES = TOPICS.map((topic) => topic.value)

const validationSchema = z.object({
  name: z
    .string({ error: 'Name is required' })
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters'),
  organization: z.string().optional(),
  email: z.email({ error: (issue) => (issue.input ? 'Invalid email' : 'Email is required') }),
  // '' until a topic is picked, which reads as "required", not as an unknown topic.
  topic: z.string().refine((topic) => TOPIC_VALUES.includes(topic), {
    error: (issue) =>
      issue.input
        ? `Topic must be one of the following values: ${TOPIC_VALUES.join(', ')}`
        : 'Topic is required'
  }),
  message: z
    .string({ error: 'Message is required' })
    .min(1, 'Message is required')
    .min(2, 'Message must be at least 2 characters'),
  privacyPolicy: z.boolean().refine((accepted) => accepted, 'You must accept the Privacy Notice')
})

type ContactFormValues = z.infer<typeof validationSchema>

const defaultValues: ContactFormValues = {
  name: '',
  organization: '',
  email: '',
  topic: '',
  message: '',
  privacyPolicy: false
}

type Status = 'idle' | 'success' | 'error'

type ContactFormProps = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

/** Sends a message to the GMW team through the GMW site's email endpoint. */
function ContactForm({ isOpen, setIsOpen }: ContactFormProps) {
  const [status, setStatus] = useState<Status>('idle')
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(validationSchema, undefined, { raw: true }),
    defaultValues
  })
  const { isSubmitting } = form.formState

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      form.reset()
      setStatus('idle')
    }
  }

  const handleSubmit = async (values: ContactFormValues) => {
    try {
      const response = await fetch(CONTACT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      })
      if (!response.ok) throw new Error(`Failed to send email: ${response.statusText}`)
      setStatus('success')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className='max-w-100'>
        <DialogHeader>
          <DialogTitle>Contact Us</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            noValidate
            className='flex flex-col gap-4'>
            <FormInput<ContactFormValues, 'name'> name='name' label='Name' required />
            <FormInput<ContactFormValues, 'organization'>
              name='organization'
              label='Organization'
            />
            <FormInput<ContactFormValues, 'email'>
              name='email'
              type='email'
              label='Email'
              autoComplete='email'
              required
            />
            <FormSelect<ContactFormValues, 'topic'>
              name='topic'
              label='Topic'
              placeholder='Select a topic'
              options={TOPICS}
              required
            />
            <FormTextarea<ContactFormValues, 'message'>
              name='message'
              label='Message'
              rows={4}
              required
            />
            <FormField
              control={form.control}
              name='privacyPolicy'
              render={({ field }) => (
                <FormItem>
                  <div className='flex items-center gap-3'>
                    <FormControl>
                      <Checkbox
                        ref={field.ref}
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked)}
                        onBlur={field.onBlur}
                      />
                    </FormControl>
                    <FormLabel required className='font-normal'>
                      I agree with the{' '}
                      <a
                        href='/privacy-notice.pdf'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-brand-800 underline hover:text-brand-hover'>
                        Privacy Notice
                      </a>
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            {status === 'success' ? (
              <p role='status' className='text-green-700'>
                Email sent successfully!
              </p>
            ) : null}
            {status === 'error' ? (
              <p role='alert' className='text-error'>
                Failed to send email. Please try again.
              </p>
            ) : null}
            <div className='mt-2 flex justify-end gap-4'>
              <Button type='button' variant='outline' onClick={() => handleOpenChange(false)}>
                Cancel
              </Button>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default ContactForm
