// Hand-written shapes of the MRTT API responses, limited to the fields the app reads.
// The API publishes no schema, so check new fields against a real response before adding them.

import type { SectionKey } from '@/data/questionMapping'

export type Id = number

export type Privacy = 'public' | 'private'

export type OrganizationRole = 'org-admin' | 'org-user'

/** Section number (1–10, see SECTION_NAMES) to its visibility. */
export type SectionDataVisibility = Partial<Record<number, Privacy>>

export type Site = {
  id: Id
  site_name: string
  landscape_id?: Id
  landscape_name?: string
  section_last_updated?: string | null
  section_data_visibility?: SectionDataVisibility
}

export type Organization = {
  id: Id
  organization_name: string
  /** The current user's role; absent for organizations the user does not belong to. */
  role?: OrganizationRole | null
}

export type Landscape = {
  id: Id
  landscape_name: string
  organizations: Pick<Organization, 'id' | 'organization_name'>[]
  sites: { site_id: Id; site_name: string }[]
}

/** A member of an organization, as listed by /organizations/:id/users. */
export type User = {
  id: Id
  name: string
  email: string
  role: OrganizationRole
}

export type RegistrationAnswer = {
  question_id: string
  answer_value: unknown
}

export type MonitoringFormType = Extract<
  SectionKey,
  | 'managementStatusAndEffectiveness'
  | 'socioeconomicGovernanceStatusAndOutcomes'
  | 'ecologicalStatusAndOutcomes'
>

export type MonitoringAnswer = RegistrationAnswer & {
  monitoring_date?: string
}

export type MonitoringForm = {
  id: Id
  form_type: MonitoringFormType
  monitoring_date: string
  answers: MonitoringAnswer[]
}

/** Error body the API returns on 4xx responses. */
export type ApiErrorBody = {
  error: string
}
