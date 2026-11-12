import { SECTION_REGISTRY, type SectionTarget } from '@/constants/sectionNames'

export function useGetSectionTarget(
  sectionFromUrl: string | undefined,
  monitorId?: string | null
): SectionTarget | null {
  if (monitorId) return 'monitors'

  return (
    (SECTION_REGISTRY as Record<string, { target: SectionTarget } | undefined>)[
      sectionFromUrl ?? ''
    ]?.target ?? null
  )
}
