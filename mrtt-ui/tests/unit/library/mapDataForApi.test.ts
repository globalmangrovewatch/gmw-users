import { defaultValues } from '@/components/FormWrapper/FormSchemaValidation'
import { questionMapping } from '@/data/questionMapping'
import { formatApiAnswersForFormByKey } from '@/library/formatApiAnswersForForm'
import { mapDataForApi } from '@/library/mapDataForApi'

import {
  monitoringSections,
  registrationSections,
  sectionAnswers,
  type SectionKey
} from 'fixtures/sectionAnswers'

const sections = Object.keys(questionMapping) as SectionKey[]

type ApiAnswer = { question_id: string; answer_value: unknown }

// Registration sections map to a plain answer list.
const toApi = (section: SectionKey, data: Record<string, unknown>) =>
  mapDataForApi(section, data) as ApiAnswer[]

const formatSection = (section: SectionKey, apiAnswers: ApiAnswer[]) =>
  formatApiAnswersForFormByKey({ apiAnswers, questionMapping })[section]

describe('section fixtures', () => {
  it('cover every section and every field in questionMapping', () => {
    expect(Object.keys(sectionAnswers).sort()).toEqual([...sections].sort())
    for (const section of sections) {
      expect(Object.keys(sectionAnswers[section]).sort()).toEqual(
        Object.keys(questionMapping[section]).sort()
      )
    }
  })
})

describe('mapDataForApi → formatApiAnswersForFormByKey round trip', () => {
  it.each(sections)('%s comes back unchanged', (section) => {
    const fixture = sectionAnswers[section]
    const apiAnswers = toApi(section, fixture)

    expect(formatSection(section, apiAnswers)).toEqual(fixture)
  })
})

describe('mapDataForApi', () => {
  it('maps each field to its question_id and keeps the value as is', () => {
    expect(mapDataForApi('causesOfDecline', sectionAnswers.causesOfDecline)).toEqual([
      { question_id: '4.1', answer_value: 'Yes' },
      { question_id: '4.2', answer_value: sectionAnswers.causesOfDecline.causesOfDecline }
    ])
  })

  it('drops fields that are not in the section mapping', () => {
    expect(mapDataForApi('causesOfDecline', { lossKnown: 'No', notAQuestion: 'x' })).toEqual([
      { question_id: '4.1', answer_value: 'No' }
    ])
  })

  it('returns no answers for an unknown section', () => {
    expect(mapDataForApi('notASection', { lossKnown: 'No' })).toEqual([])
  })

  it.each(registrationSections)(
    'returns a plain answer list for registration section %s',
    (section) => {
      expect(Array.isArray(mapDataForApi(section, sectionAnswers[section]))).toBe(true)
    }
  )

  it.each(monitoringSections)(
    'wraps monitoring section %s as { form_type, answers }',
    (section) => {
      const result = mapDataForApi(section, sectionAnswers[section], 'monitors')

      expect(result).toEqual({
        form_type: section,
        answers: mapDataForApi(section, sectionAnswers[section])
      })
    }
  )
})

describe('formatApiAnswersForFormByKey', () => {
  it("casts 'true' and 'false' strings to booleans", () => {
    const apiAnswers = [
      { question_id: '1.1b', answer_value: 'true' },
      { question_id: '4.1', answer_value: 'false' }
    ]
    const result = formatApiAnswersForFormByKey({ apiAnswers, questionMapping })

    expect(result.projectDetails.hasProjectEndDate).toBe(true)
    expect(result.causesOfDecline.lossKnown).toBe(false)
  })

  it.each([
    ['an empty string', ''],
    ['a blank string', '   '],
    ['null', null]
  ])('falls back to the default value for %s', (_label, answerValue) => {
    const apiAnswers = [{ question_id: '2.5', answer_value: answerValue }]
    const result = formatApiAnswersForFormByKey({ apiAnswers, questionMapping })

    expect(result.siteBackground.protectionStatus).toEqual(defaultValues.protectionStatus)
  })

  it('falls back to the default value for unanswered questions', () => {
    const result = formatApiAnswersForFormByKey({ apiAnswers: [], questionMapping })

    expect(result.projectDetails.hasProjectEndDate).toBe(false)
    expect(result.projectDetails.siteArea).toEqual(defaultValues.siteArea)
    // Fields without a default come back undefined.
    expect(result.siteBackground.managementStatus).toBeUndefined()
  })

  it('keeps falsy answers that are not blank, such as 0', () => {
    const apiAnswers = [{ question_id: '10.6', answer_value: 0 }]
    const result = formatApiAnswersForFormByKey({ apiAnswers, questionMapping })

    expect(result.ecologicalStatusAndOutcomes.percentageSurvival).toBe(0)
  })
})
