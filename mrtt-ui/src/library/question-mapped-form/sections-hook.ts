import { useMemo } from 'react'
import { sectionsRegistry, SectionKey } from './sections'
import { SECTION_NAMES_DICTIONARY } from '../../constants/sectionNames'

export function useSectionQuestions(section: SectionKey) {
  return useMemo(() => {
    const config = sectionsRegistry[section] || sectionsRegistry[SECTION_NAMES_DICTIONARY[section]]

    if (!config) {
      throw new Error(`Unknown section: ${section}`)
    }
    const { mapping, questions } = config

    const sectionKeys = Object.keys(mapping)

    const orderedQuestions = Object.entries(mapping).map(([fieldKey, questionId]) => ({
      fieldKey,
      questionId,
      ...questions[fieldKey]
    }))

    return {
      section,
      mapping,
      questions,
      sectionKeys,
      orderedQuestions
    }
  }, [section])
}
