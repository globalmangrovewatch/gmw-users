import { registrationSchema } from '@/forms/schemas'

import { validationCases } from 'fixtures/validationCases'

// Mirrors how the forms validate: the resolver checks the whole form, and saving a section
// only looks at the errors of that section's fields. A field's error is the first message
// reported anywhere under it (e.g. `countries` or `causesOfDecline[0].…`).
const errorsByField = (values: Record<string, unknown>) => {
  const result = registrationSchema.safeParse(values)
  const errors: Record<string, string> = {}
  for (const issue of result.error?.issues ?? []) {
    errors[String(issue.path[0] ?? '')] ??= issue.message
  }
  return errors
}

describe('form validation schema', () => {
  it.each(validationCases)('$name', ({ values, expected }) => {
    const errors = errorsByField(values)
    const actual = Object.fromEntries(
      Object.keys(expected).map((field) => [field, errors[field] ?? null])
    )

    expect(actual).toEqual(expected)
  })
})
