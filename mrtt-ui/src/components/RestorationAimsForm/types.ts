import type { CheckboxGroupValue } from '@/components/CheckboxGroup/CheckboxGroup'

export type AimFieldName = 'ecologicalAims' | 'socioEconomicAims' | 'otherAims'

export type Stakeholder = { stakeholderType?: string; stakeholderName?: string }

/** Ranking per stakeholder type, per checked aim: { [aim]: { [stakeholderType]: ranking } }. */
export type AimStakeholderBenefits = Record<string, Record<string, string | undefined> | undefined>

/** A restoration aims answer: the checked aims plus how they benefit each stakeholder. */
export type AimValue = CheckboxGroupValue & { aimStakeholderBenefits?: AimStakeholderBenefits }
