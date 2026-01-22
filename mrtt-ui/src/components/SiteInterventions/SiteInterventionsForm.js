import {
  Box,
  Button,
  Checkbox,
  Chip,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material'
import { Controller, useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { styled } from '@mui/material/styles'
import { useParams } from 'react-router-dom'
import { useState, useCallback, useMemo, useEffect } from 'react'

import { ContentWrapper } from '../../styles/containers'
import { ErrorText, PageSubtitle, PageTitle } from '../../styles/typography'
import {
  FormLayout,
  FormPageHeader,
  FormQuestionDiv,
  InnerFormDiv,
  StickyFormLabel
} from '../../styles/forms'

import { questionMapping } from '../../data/questionMapping'
import { propaguleOptions, seedlingOptions } from '../../data/siteInterventionOptions'
import { siteInterventions as questions } from '../../data/questions'
import language from '../../language'

import AddMangroveAssociatedSpeciesRow from './AddMangroveAssociatedSpeciesRow'
import MangroveAssociatedSpeciesRow from './MangroveAssociatedSpeciesRow'
import CheckboxGroupWithLabelAndController from '../CheckboxGroupWithLabelAndController'
import FormValidationMessageIfErrors from '../FormValidationMessageIfErrors'
import QuestionNav from '../QuestionNav'
import DatePickerUtcMui from '../DatePickerUtcMui'

import { useInitializeQuestionMappedForm } from '../../library/question-mapped-form/useInitializeQuestionMappedForm'
import useSiteInfo from '../../library/useSiteInfo'
import organizeMangroveSpeciesList from '../../library/organizeMangroveSpeciesList'

import LoadingIndicator from '../LoadingIndicator'

function SiteInterventionsForm() {
  const { site_name } = useSiteInfo()
  const form = useFormContext()
  const {
    formState: { errors },
    control
  } = form

  const { siteId } = useParams()
  const apiAnswersUrl = `${process.env.REACT_APP_API_URL}/sites/${siteId}/registration_intervention_answers`

  const [isSubmitting] = useState(false)
  const [isError] = useState(false)

  const [mangroveSpeciesForCountriesSelected, setMangroveSpeciesForCountriesSelected] = useState([])
  const [showAddTabularInputRow, setShowAddTabularInputRow] = useState(false)

  // ---------- Field arrays ----------
  const {
    fields: mangroveSpeciesUsedFields,
    append: mangroveSpeciesUsedAppend,
    remove: mangroveSpeciesUsedRemove,
    update: mangroveSpeciesUsedUpdate,
    replace: mangroveSpeciesUsedReplace
  } = useFieldArray({ name: 'mangroveSpeciesUsed', control })

  const {
    fields: mangroveAssociatedSpeciesFields,
    append: mangroveAssociatedSpeciesAppend,
    remove: mangroveAssociatedSpeciesRemove,
    update: mangroveAssociatedSpeciesUpdate,
    replace: mangroveAssociatedSpeciesReplace
  } = useFieldArray({ name: 'mangroveAssociatedSpecies', control })

  const {
    append: whichStakeholdersInvolvedAppend,
    remove: whichStakeholdersInvolvedRemove,
    replace: whichStakeholdersInvolvedReplace
  } = useFieldArray({ name: 'whichStakeholdersInvolved', control })

  // ---------- Read from form ----------
  const whichStakeholdersInvolvedWatch = useWatch({ control, name: 'whichStakeholdersInvolved' })
  const biophysicalInterventionsUsedWatch = useWatch({
    control,
    name: 'biophysicalInterventionsUsed'
  })
  const mangroveSpeciesUsedWatch = useWatch({ control, name: 'mangroveSpeciesUsed' })
  const localParticipantTraining = useWatch({ control, name: 'localParticipantTraining' })
  const countriesSelected = useWatch({ control, name: 'countries' })

  const whichStakeholdersInvolvedTypesChecked = useMemo(() => {
    const arr = whichStakeholdersInvolvedWatch ?? []
    return arr.map((s) => s?.stakeholder).filter(Boolean)
  }, [whichStakeholdersInvolvedWatch])

  const biophysicalSelected = useMemo(() => {
    return biophysicalInterventionsUsedWatch?.selectedValues ?? []
  }, [biophysicalInterventionsUsedWatch])

  const mangroveSpeciesUsedChecked = useMemo(() => {
    const arr = mangroveSpeciesUsedWatch ?? []
    return arr.map((s) => s?.type).filter(Boolean)
  }, [mangroveSpeciesUsedWatch])

  const getWhichStakeholderInvolved = useCallback(
    (stakeholder) =>
      (whichStakeholdersInvolvedWatch ?? []).find((i) => i?.stakeholder === stakeholder),
    [whichStakeholdersInvolvedWatch]
  )

  const getWhichStakeholdersIndex = useCallback(
    (stakeholder) =>
      (whichStakeholdersInvolvedWatch ?? []).findIndex((i) => i?.stakeholder === stakeholder),
    [whichStakeholdersInvolvedWatch]
  )

  const getMangroveSpeciesUsedIndex = useCallback(
    (specie) => (mangroveSpeciesUsedWatch ?? []).findIndex((i) => i?.type === specie),
    [mangroveSpeciesUsedWatch]
  )

  const isMangroveSpeciesUsedShowing = useCallback(() => {
    const optionsUsed = [
      'Planting',
      'Broadcast collected propagules onto an incoming tide',
      'Large scale broadcasting of propagules from the air or boats'
    ]
    return optionsUsed.some((item) => biophysicalSelected.includes(item))
  }, [biophysicalSelected])

  const updateTabularInputDisplay = (boolean) => setShowAddTabularInputRow(boolean)

  const onLoaded = useCallback(
    (_response, sectionValues) => {
      const v = sectionValues ?? {}

      queueMicrotask(() => {
        whichStakeholdersInvolvedReplace(v.whichStakeholdersInvolved ?? [])
        mangroveSpeciesUsedReplace(v.mangroveSpeciesUsed ?? [])
        mangroveAssociatedSpeciesReplace(v.mangroveAssociatedSpecies ?? [])
      })

      const countries = v.countries ?? []
      setMangroveSpeciesForCountriesSelected(
        countries.length ? organizeMangroveSpeciesList(countries) : []
      )
    },
    [whichStakeholdersInvolvedReplace, mangroveSpeciesUsedReplace, mangroveAssociatedSpeciesReplace]
  )

  const { isLoading } = useInitializeQuestionMappedForm({
    key: 'siteInterventions',
    apiUrl: apiAnswersUrl,
    resetForm: form.reset,
    questionMapping,
    successCallback: onLoaded,
    queryOptions: {
      refetchOnMount: 'always',
      staleTime: 0
    }
  })

  useEffect(() => {
    const countries = countriesSelected ?? []
    setMangroveSpeciesForCountriesSelected(
      countries.length ? organizeMangroveSpeciesList(countries) : []
    )
  }, [countriesSelected])

  // ---------- Handlers ----------
  const handleWhichStakeholdersInvolvedOnChange = (event, stakeholder) => {
    if (event.target.checked) {
      whichStakeholdersInvolvedAppend({ stakeholder, stakeholderType: '' })
    } else {
      const idx = getWhichStakeholdersIndex(stakeholder)
      if (idx >= 0) whichStakeholdersInvolvedRemove(idx)
    }
  }

  const handleMangroveSpeciesUsedOnChange = (event, specie) => {
    if (event.target.checked) {
      mangroveSpeciesUsedAppend({
        type: specie,
        seed: { checked: false, source: [], count: 0 },
        propagule: { checked: false, source: [], count: 0 }
      })
    } else {
      const idx = getMangroveSpeciesUsedIndex(specie)
      if (idx >= 0) mangroveSpeciesUsedRemove(idx)
    }
  }

  const handleSourceOfSeedlingsOnChange = (event, specie, seedlingType) => {
    const idx = getMangroveSpeciesUsedIndex(specie)
    if (idx < 0) return

    const current = mangroveSpeciesUsedWatch?.[idx]
    if (!current) return

    const item = { ...current }
    if (seedlingType === 'seedling') item.seed = { ...item.seed, checked: event.target.checked }
    if (seedlingType === 'propagule')
      item.propagule = { ...item.propagule, checked: event.target.checked }

    mangroveSpeciesUsedUpdate(idx, item)
  }

  const saveItem = ({ type, count, source, purpose }) =>
    mangroveAssociatedSpeciesAppend({ type, count, source, purpose })
  const deleteMeasurementItem = (measurementIndex) =>
    mangroveAssociatedSpeciesRemove(measurementIndex)

  const updateMeasurementItem = (measurementIndex, count, source, purpose, otherPurpose) => {
    const currentItem = { ...mangroveAssociatedSpeciesFields[measurementIndex] }
    if (count) currentItem.count = count
    if (source) currentItem.source = source
    if (purpose) currentItem.purpose = { ...currentItem.purpose, purpose }
    if (otherPurpose) currentItem.purpose = { ...currentItem.purpose, other: otherPurpose }
    mangroveAssociatedSpeciesUpdate(measurementIndex, currentItem)
  }

  const showDuration = !biophysicalSelected.includes('None')

  return isLoading ? (
    <LoadingIndicator />
  ) : (
    <ContentWrapper>
      <FormPageHeader>
        <PageTitle>{language.pages.siteQuestionsOverview.formName.siteInterventions}</PageTitle>
        <PageSubtitle>{site_name}</PageSubtitle>
      </FormPageHeader>

      <QuestionNav
        isFormSaving={isSubmitting}
        isFormSaveError={isError}
        currentSection='site-interventions'
      />

      <FormValidationMessageIfErrors formErrors={errors} />

      <FormLayout>
        {/* 6.1 Which stakeholders involved */}
        <FormQuestionDiv>
          <StickyFormLabel>{questions.whichStakeholdersInvolved.question}</StickyFormLabel>

          <List>
            {questions.whichStakeholdersInvolved.options.map((stakeholder, index) => {
              const idx = getWhichStakeholdersIndex(stakeholder)
              const showType = idx >= 0 && !!getWhichStakeholderInvolved(stakeholder)

              return (
                <ListItem key={index}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Checkbox
                        value={stakeholder}
                        checked={whichStakeholdersInvolvedTypesChecked.includes(stakeholder)}
                        onChange={(event) =>
                          handleWhichStakeholdersInvolvedOnChange(event, stakeholder)
                        }
                      />
                      <Typography variant='subtitle'>{stakeholder}</Typography>
                    </Box>

                    {showType ? (
                      <Box>
                        <InnerFormDiv>
                          <Controller
                            name={`whichStakeholdersInvolved.${idx}.stakeholderType`}
                            control={control}
                            defaultValue=''
                            render={({ field }) => (
                              <TextField
                                {...field}
                                select
                                value={field.value ?? ''}
                                label='select'
                                sx={{ width: '10em' }}>
                                {['Paid', 'Voluntary'].map((item, i) => (
                                  <MenuItem key={i} value={item}>
                                    {item}
                                  </MenuItem>
                                ))}
                              </TextField>
                            )}
                          />
                        </InnerFormDiv>
                      </Box>
                    ) : null}
                  </Box>
                </ListItem>
              )
            })}
          </List>

          <ErrorText>{errors.whichStakeholdersInvolved?.message}</ErrorText>
        </FormQuestionDiv>

        {/* 6.2 Biophysical interventions used */}
        <FormQuestionDiv>
          <CheckboxGroupWithLabelAndController
            fieldName='biophysicalInterventionsUsed'
            control={control}
            options={questions.biophysicalInterventionsUsed.options}
            question={questions.biophysicalInterventionsUsed.question}
            shouldAddOtherOptionWithClarification={true}
            required
          />
          <ErrorText>{errors.biophysicalInterventionsUsed?.selectedValues?.message}</ErrorText>
        </FormQuestionDiv>

        {/* 6.2a Duration */}
        {showDuration ? (
          <FormQuestionDiv>
            <StickyFormLabel>{questions.biophysicalInterventionDuration.question}</StickyFormLabel>
            <Box>
              <InnerFormDiv>
                <Controller
                  name='biophysicalInterventionDuration.startDate'
                  control={control}
                  render={({ field }) => (
                    <DatePickerUtcMui
                      id='biophysicalInterventionDuration.startDate'
                      label='Intervention start date'
                      field={field}
                    />
                  )}
                />
              </InnerFormDiv>

              <InnerFormDiv>
                <Controller
                  name='biophysicalInterventionDuration.endDate'
                  control={control}
                  render={({ field }) => (
                    <DatePickerUtcMui
                      id='biophysicalInterventionDuration.endDate'
                      label='Intervention end date'
                      field={field}
                    />
                  )}
                />
              </InnerFormDiv>

              <ErrorText>{errors.biophysicalInterventionDuration?.endDate?.message}</ErrorText>
            </Box>
          </FormQuestionDiv>
        ) : null}

        {/* Mangrove species used */}
        {isMangroveSpeciesUsedShowing() ? (
          <FormQuestionDiv>
            <StickyFormLabel>{questions.mangroveSpeciesUsed.question}</StickyFormLabel>

            <List>
              {mangroveSpeciesForCountriesSelected.length ? (
                mangroveSpeciesForCountriesSelected.map((specie, specieSelectedIndex) => {
                  const idx = getMangroveSpeciesUsedIndex(specie)
                  const selected = mangroveSpeciesUsedChecked.includes(specie)

                  const seedChecked =
                    idx >= 0 ? mangroveSpeciesUsedWatch?.[idx]?.seed?.checked : false
                  const propaguleChecked =
                    idx >= 0 ? mangroveSpeciesUsedWatch?.[idx]?.propagule?.checked : false

                  return (
                    <ListItem key={specieSelectedIndex}>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Checkbox
                            value={specie}
                            checked={selected}
                            onChange={(event) => handleMangroveSpeciesUsedOnChange(event, specie)}
                          />
                          <Typography variant='subtitle'>{specie}</Typography>
                        </Box>

                        {selected ? (
                          <SubgroupDiv>
                            <Typography>{questions.sourceOfMangroves.question}</Typography>

                            {/* Seedling */}
                            <Box>
                              <Checkbox
                                value={specie}
                                checked={!!seedChecked}
                                onChange={(event) =>
                                  handleSourceOfSeedlingsOnChange(event, specie, 'seedling')
                                }
                              />
                              <Typography variant='subtitle'>Seedling</Typography>

                              {/* ✅ no montes controllers con idx < 0 */}
                              {idx >= 0 ? (
                                <>
                                  <SubgroupDiv>
                                    <Controller
                                      name={`mangroveSpeciesUsed.${idx}.seed.source`}
                                      control={control}
                                      defaultValue={[]}
                                      render={({ field }) => (
                                        <Select
                                          {...field}
                                          multiple
                                          value={field.value ?? []}
                                          label='Source'
                                          renderValue={(selected) => (
                                            <Box
                                              sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                              {(selected ?? []).map((value) => (
                                                <Chip key={value} label={value} />
                                              ))}
                                            </Box>
                                          )}
                                          sx={{ minWidth: '10em' }}>
                                          {seedlingOptions.map((item, i) => (
                                            <MenuItem key={i} value={item}>
                                              {item}
                                            </MenuItem>
                                          ))}
                                        </Select>
                                      )}
                                    />
                                  </SubgroupDiv>

                                  <SubgroupDiv>
                                    <Controller
                                      name={`mangroveSpeciesUsed.${idx}.seed.count`}
                                      control={control}
                                      defaultValue=''
                                      render={({ field }) => (
                                        <TextField
                                          {...field}
                                          value={field.value ?? ''}
                                          label='Count'
                                          sx={{ width: '10em', marginTop: '1em' }}
                                        />
                                      )}
                                    />
                                  </SubgroupDiv>
                                </>
                              ) : null}
                            </Box>

                            {/* Propagule */}
                            <Box>
                              <Checkbox
                                value={specie}
                                checked={!!propaguleChecked}
                                onChange={(event) =>
                                  handleSourceOfSeedlingsOnChange(event, specie, 'propagule')
                                }
                              />
                              <Typography variant='subtitle'>Propagule</Typography>

                              {idx >= 0 ? (
                                <>
                                  <SubgroupDiv>
                                    <Controller
                                      name={`mangroveSpeciesUsed.${idx}.propagule.source`}
                                      control={control}
                                      defaultValue={[]}
                                      render={({ field }) => (
                                        <Select
                                          {...field}
                                          multiple
                                          value={field.value ?? []}
                                          label='Source'
                                          renderValue={(selected) => (
                                            <Box
                                              sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                              {(selected ?? []).map((value) => (
                                                <Chip key={value} label={value} />
                                              ))}
                                            </Box>
                                          )}
                                          sx={{ minWidth: '10em' }}>
                                          {propaguleOptions.map((item, i) => (
                                            <MenuItem key={i} value={item}>
                                              <ListItemText>{item}</ListItemText>
                                            </MenuItem>
                                          ))}
                                        </Select>
                                      )}
                                    />
                                  </SubgroupDiv>

                                  <SubgroupDiv>
                                    <Controller
                                      name={`mangroveSpeciesUsed.${idx}.propagule.count`}
                                      control={control}
                                      defaultValue=''
                                      render={({ field }) => (
                                        <TextField
                                          {...field}
                                          value={field.value ?? ''}
                                          label='Count'
                                          sx={{ width: '10em', marginTop: '1em' }}
                                        />
                                      )}
                                    />
                                  </SubgroupDiv>
                                </>
                              ) : null}
                            </Box>
                          </SubgroupDiv>
                        ) : null}
                      </Box>
                    </ListItem>
                  )
                })
              ) : (
                <ErrorText>
                  No items to display. Please select countries in Site Details and Location (1.2).
                </ErrorText>
              )}
            </List>

            <ErrorText>{errors.mangroveSpeciesUsed?.message}</ErrorText>
          </FormQuestionDiv>
        ) : null}

        {/* Mangrove associated species */}
        {isMangroveSpeciesUsedShowing() ? (
          <FormQuestionDiv>
            <StickyFormLabel>{questions.mangroveAssociatedSpecies.question}</StickyFormLabel>

            {mangroveAssociatedSpeciesFields.length > 0
              ? mangroveAssociatedSpeciesFields.map((item, itemIndex) => (
                  <MangroveAssociatedSpeciesRow
                    key={itemIndex}
                    type={item.type}
                    count={item.count}
                    source={item.source}
                    purpose={item.purpose?.purpose}
                    other={item.purpose?.other}
                    index={itemIndex}
                    deleteItem={deleteMeasurementItem}
                    updateItem={updateMeasurementItem}
                  />
                ))
              : null}

            <ErrorText>{errors.mangroveAssociatedSpecies?.message}</ErrorText>

            {showAddTabularInputRow ? (
              <AddMangroveAssociatedSpeciesRow
                saveItem={saveItem}
                updateTabularInputDisplay={updateTabularInputDisplay}
              />
            ) : null}

            {!showAddTabularInputRow ? (
              <Button sx={{ marginTop: '1.5em' }} onClick={() => setShowAddTabularInputRow(true)}>
                + Add measurement row
              </Button>
            ) : null}
          </FormQuestionDiv>
        ) : null}

        {/* Local participant training */}
        <FormQuestionDiv>
          <StickyFormLabel>{questions.localParticipantTraining.question}</StickyFormLabel>
          <Controller
            name='localParticipantTraining'
            control={control}
            render={({ field }) => (
              <TextField {...field} select value={field.value ?? ''} label='select'>
                {questions.localParticipantTraining.options.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <ErrorText>{errors.localParticipantTraining?.message}</ErrorText>
        </FormQuestionDiv>

        {/* Organizations providing training */}
        {localParticipantTraining === 'Yes' ? (
          <FormQuestionDiv>
            <CheckboxGroupWithLabelAndController
              fieldName='organizationsProvidingTraining'
              control={control}
              options={questions.organizationsProvidingTraining.options}
              question={questions.organizationsProvidingTraining.question}
              shouldAddOtherOptionWithClarification={true}
            />
            <ErrorText>{errors.organizationsProvidingTraining?.selectedValues?.message}</ErrorText>
          </FormQuestionDiv>
        ) : null}

        {/* Other activities implemented */}
        <FormQuestionDiv>
          <CheckboxGroupWithLabelAndController
            fieldName='otherActivitiesImplemented'
            control={control}
            options={questions.otherActivitiesImplemented.options}
            question={questions.otherActivitiesImplemented.question}
            shouldAddOtherOptionWithClarification={true}
            required
          />
          <ErrorText>{errors.otherActivitiesImplemented?.selectedValues?.message}</ErrorText>
        </FormQuestionDiv>
      </FormLayout>
    </ContentWrapper>
  )
}

export default SiteInterventionsForm

const SubgroupDiv = styled('div')`
  margin-left: 2.7em;
  margin-top: 0.5em;
`
