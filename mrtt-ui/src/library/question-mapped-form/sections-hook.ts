import { useMemo } from 'react'
import { sectionsRegistry, SectionKey } from './sections'
import {
  SECTION_NAMES_DICTIONARY_INTERVENTIONS,
  SECTION_REGISTRY
} from '../../constants/sectionNames'

type SectionTarget = 'interventions' | 'monitors'

export function useSectionQuestions(section: SectionKey) {
  return useMemo(() => {
    const config =
      sectionsRegistry[section] || sectionsRegistry[SECTION_NAMES_DICTIONARY_INTERVENTIONS[section]]

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

export function useGetSectionTarget(
  sectionFromUrl: string | undefined,
  monitorId?: string | null
): SectionTarget {
  if (monitorId) return 'monitors'

  return (SECTION_REGISTRY as any)[sectionFromUrl ?? '']?.target ?? null
}
