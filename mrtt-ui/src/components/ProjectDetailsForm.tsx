'use client'

import turfBbox from '@turf/bbox'
import turfBboxPolygon from '@turf/bbox-polygon'
import turfConvex from '@turf/convex'
import type { BBox, FeatureCollection, Geometry } from 'geojson'
import dynamic from 'next/dynamic'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'

import DatePickerUtc from '@/components/DatePickerUtc'
import {
  FormLayout,
  FormPageHeader,
  FormQuestionDiv,
  StickyFormLabel,
  stickyFormLabelClassName
} from '@/components/form/layout'
import FormValidationMessageIfErrors from '@/components/FormValidationMessageIfErrors'
import QuestionNav from '@/components/QuestionNav'
import RequiredIndicator from '@/components/RequiredIndicator'
import { MultiCombobox } from '@/components/ui/combobox'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { ContentWrapper } from '@/components/ui/layout'
import { RadioGroup } from '@/components/ui/radio-group'
import { ErrorText, PageSubtitle, PageTitle } from '@/components/ui/typography'
import mangroveCountries from '@/data/mangrove_countries.json'
import { projectDetails as questions } from '@/data/questions'
import type { RegistrationFormValues } from '@/forms/schemas'
import language from '@/language'
import { useInitializeQuestionMappedForm } from '@/library/question-mapped-form/useInitializeQuestionMappedForm'
import useSiteInfo from '@/library/useSiteInfo'

// mapbox-gl touches `window` on import, so the map only ever loads in the browser.
const ProjectAreaMap = dynamic(() => import('@/components/ProjectAreaMap'), { ssr: false })

type CountryFeature = (typeof mangroveCountries.features)[number]
type SiteAreaFeatureCollection = FeatureCollection<Geometry | null>

const countriesGeojson = [...mangroveCountries.features].sort((a, b) =>
  a.properties.country.localeCompare(b.properties.country, 'en', { sensitivity: 'base' })
)
const countryOptions = countriesGeojson.map(({ properties: { country } }) => ({
  label: country,
  value: country
}))
const countryByName = new Map(
  countriesGeojson.map((feature) => [feature.properties.country, feature])
)

const hasProjectEndDateOptions = [
  { label: 'Yes', value: 'true' },
  { label: 'No', value: 'false' }
]

function ProjectDetailsForm() {
  const form = useFormContext<RegistrationFormValues>()
  const errors = form.formState.errors
  const [mapExtent, setMapExtent] = useState<BBox | number[]>()
  const { site_name } = useSiteInfo()
  const { siteId } = useParams<{ siteId: string }>()

  // Saved answers may hold 'true' / 'false' strings; the radio group stores booleans.
  const hasProjectEndDate = useWatch({ control: form.control, name: 'hasProjectEndDate' })
  const showEndDateInput = hasProjectEndDate === true || hasProjectEndDate === 'true'

  useInitializeQuestionMappedForm({ siteId, key: 'projectDetails', form })

  const fitMapToCountries = (features: CountryFeature[]) => {
    if (!features.length) {
      setMapExtent(undefined)
      return
    }
    // Only the map framing can fail (a country without a usable bbox). The selection is
    // already saved, so keep the current map extent and report the problem.
    try {
      const bboxes: FeatureCollection = {
        type: 'FeatureCollection',
        features: features.map((feature) => turfBboxPolygon(feature.bbox.map(Number) as BBox))
      }
      const hull = turfConvex(bboxes)
      if (hull) setMapExtent(turfBbox(hull))
    } catch (error) {
      console.error('Could not fit the map to the selected countries', error)
    }
  }

  return (
    <ContentWrapper>
      <FormPageHeader>
        <PageTitle>{language.pages.siteQuestionsOverview.formName.siteDetails}</PageTitle>
        <PageSubtitle>{site_name}</PageSubtitle>
      </FormPageHeader>
      <QuestionNav isFormSaving={false} isFormSaveError={false} currentSection='project-details' />
      <FormValidationMessageIfErrors formErrors={errors} />
      <FormLayout>
        <FormQuestionDiv>
          <FormField
            control={form.control}
            name='projectStartDate'
            render={({ field }) => (
              <FormItem>
                <FormLabel className={stickyFormLabelClassName} required>
                  {questions.projectStartDate.question}
                </FormLabel>
                <FormControl>
                  <DatePickerUtc label='date' field={field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormQuestionDiv>

        <FormQuestionDiv>
          <FormField
            control={form.control}
            name='hasProjectEndDate'
            defaultValue={false}
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  id='has-project-end-date-label'
                  className={stickyFormLabelClassName}
                  required>
                  {questions.hasProjectEndDate.question}
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    aria-labelledby='has-project-end-date-label'
                    options={hasProjectEndDateOptions}
                    name={field.name}
                    inputRef={field.ref}
                    value={field.value === undefined ? null : String(field.value)}
                    onValueChange={(value) => field.onChange(value === 'true')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormQuestionDiv>

        {showEndDateInput && (
          <FormQuestionDiv>
            <FormField
              control={form.control}
              name='projectEndDate'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={stickyFormLabelClassName} required>
                    {questions.projectEndDate.question}
                  </FormLabel>
                  <FormControl>
                    <DatePickerUtc label='date' field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormQuestionDiv>
        )}

        <FormQuestionDiv>
          <FormField
            control={form.control}
            name='countries'
            render={({ field }) => (
              <FormItem>
                <FormLabel className={stickyFormLabelClassName} required>
                  {questions.countries.question}
                </FormLabel>
                <FormControl>
                  <MultiCombobox
                    options={countryOptions}
                    placeholder='Country'
                    inputRef={field.ref}
                    value={(field.value ?? []).flatMap((feature) =>
                      feature.properties?.country ? [feature.properties.country] : []
                    )}
                    onChange={(names) => {
                      const features = names.flatMap((name) => countryByName.get(name) ?? [])
                      field.onChange(features)
                      fitMapToCountries(features)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormQuestionDiv>

        <FormQuestionDiv>
          <StickyFormLabel>
            {questions.siteArea.question} <RequiredIndicator />
          </StickyFormLabel>
          <FormField
            control={form.control}
            name='siteArea'
            render={({ field }) => (
              <ProjectAreaMap
                extent={mapExtent}
                setExtent={setMapExtent}
                height='400px'
                siteAreaFeatureCollection={field.value as SiteAreaFeatureCollection | undefined}
                setSiteAreaFeatureCollection={(featureCollection) => {
                  field.onChange(featureCollection)
                  if (featureCollection.features.length) {
                    // Drawn and uploaded site areas only hold polygons, so every feature has a geometry.
                    setMapExtent(turfBbox(featureCollection as FeatureCollection))
                  }
                }}
              />
            )}
          />
          {/* The message sits on siteArea.features, which FormMessage (siteArea) doesn't read. */}
          <ErrorText>{errors.siteArea?.features?.message}</ErrorText>
        </FormQuestionDiv>
      </FormLayout>
    </ContentWrapper>
  )
}

export default ProjectDetailsForm
