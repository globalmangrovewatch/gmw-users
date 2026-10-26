import { ValidationError } from 'yup'

import { validationSchema } from '@/components/FormWrapper/FormSchemaValidation'

import { validationCases } from 'fixtures/validationCases'

// Mirrors how the forms validate: the resolver checks the whole form, and saving a section
// only looks at the errors of that section's fields. A field's error is the first message
// reported anywhere under it (e.g. `countries` or `causesOfDecline[0].…`).
const errorsByField = async (values: Record<string, unknown>) => {
  try {
    await validationSchema.validate(values, { abortEarly: false })
    return {}
  } catch (error) {
    if (!(error instanceof ValidationError)) throw error
    const errors: Record<string, string> = {}
    for (const inner of error.inner) {
      const field = inner.path?.split(/[.[]/)[0] ?? ''
      errors[field] ??= inner.message
    }
    return errors
  }
}

describe('form validation schema', () => {
  it.each(validationCases)('$name', async ({ values, expected }) => {
    const errors = await errorsByField(values)
    const actual = Object.fromEntries(
      Object.keys(expected).map((field) => [field, errors[field] ?? null])
    )

    expect(actual).toEqual(expected)
  })
})
