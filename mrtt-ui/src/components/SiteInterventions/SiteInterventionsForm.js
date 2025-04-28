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
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { styled } from '@mui/material/styles'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import { useState, useCallback } from 'react'
import axios from 'axios'

import { ContentWrapper } from '../../styles/containers'
import { ErrorText, PageSubtitle, PageTitle } from '../../styles/typography'
import { findRegistationDataItem } from '../../library/findDataItems'
import {
  FormLayout,
  FormPageHeader,
  FormQuestionDiv,
  InnerFormDiv,
  StickyFormLabel
} from '../../styles/forms'
import { mapDataForApi } from '../../library/mapDataForApi'

import { propaguleOptions, seedlingOptions } from '../../data/siteInterventionOptions'
import { questionMapping } from '../../data/questionMapping'
import { siteInterventions as questions } from '../../data/questions'
import AddMangroveAssociatedSpeciesRow from './AddMangroveAssociatedSpeciesRow'
import CheckboxGroupWithLabelAndController from '../CheckboxGroupWithLabelAndController'
import FormValidationMessageIfErrors from '../FormValidationMessageIfErrors'
import language from '../../language'
import MangroveAssociatedSpeciesRow from './MangroveAssociatedSpeciesRow'
import QuestionNav from '../QuestionNav'
import { useInitializeQuestionMappedForm } from '../../library/question-mapped-form/useInitializeQuestionMappedForm'
import useSiteInfo from '../../library/useSiteInfo'
import organizeMangroveSpeciesList from '../../library/organizeMangroveSpeciesList'
import DatePickerUtcMui from '../DatePickerUtcMui'

const getWhichStakeholdersInvolved = (registrationAnswersFromServer) =>
  findRegistationDataItem(registrationAnswersFromServer, '6.1') ?? []

const getSiteCountries = (registrationAnswersFromServer) =>
  findRegistationDataItem(registrationAnswersFromServer, '1.2') ?? []

const getMangroveSpeciesUsed = (registrationAnswersFromServer) =>
  findRegistationDataItem(registrationAnswersFromServer, '6.2b') ?? []

function SiteInterventionsForm() {
  const { site_name } = useSiteInfo()

  const form = useFormContext()

  const {
    handleSubmit: validateInputs,
    formState: { errors },
    watch: watchForm,
    control
  } = form

  const {
    fields: mangroveSpeciesUsedFields,
    append: mangroveSpeciesUsedAppend,
    remove: mangroveSpeciesUsedRemove,
    update: mangroveSpeciesUsedUpdate
  } = useFieldArray({ name: 'mangroveSpeciesUsed', control })

  const {
    fields: mangroveAssociatedSpeciesFields,
    append: mangroveAssociatedSpeciesAppend,
    remove: mangroveAssociatedSpeciesRemove,
    update: mangroveAssociatedSpeciesUpdate
  } = useFieldArray({ name: 'mangroveAssociatedSpecies', control })

  const {
    fields: whichStakeholdersInvolvedFields,
    append: whichStakeholdersInvolvedAppend,
    remove: whichStakeholdersInvolvedRemove
  } = useFieldArray({ name: 'whichStakeholdersInvolved', control })

  const { siteId } = useParams()
  const apiAnswersUrl = `${process.env.REACT_APP_API_URL}/sites/${siteId}/registration_intervention_answers`
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitError, setIsSubmitError] = useState(false)
  const [mangroveSpeciesForCountriesSelected, setMangroveSpeciesForCountriesSelected] = useState([])
  const [mangroveSpeciesUsedChecked, setMangroveSpeciesUsedChecked] = useState([])
  const [whichStakeholdersInvolvedTypesChecked, setWhichStakeholdersInvolvedTypesChecked] =
    useState([])
  const [showAddTabularInputRow, setShowAddTabularInputRow] = useState(false)
  const localParticipantTrainingWatcher = watchForm('localParticipantTraining')
  const biophysicalInterventionsUsedWatcher = watchForm('biophysicalInterventionsUsed')

  const loadServerData = useCallback((serverResponse) => {
    // set whichStakeholdersInvolved
    const whichStakeholdersInvolvedInitialVal = getWhichStakeholdersInvolved(serverResponse)

    const initialWhichStakeholdersInvolvedTypesChecked = whichStakeholdersInvolvedInitialVal?.map(
      (stakeholder) => stakeholder.stakeholder
    )
    setWhichStakeholdersInvolvedTypesChecked(initialWhichStakeholdersInvolvedTypesChecked)

    // set countries list for countries selected in 1.2
    const siteCountriesResponse = getSiteCountries(serverResponse)

    if (siteCountriesResponse.length) {
      const organizedSpecies = organizeMangroveSpeciesList(siteCountriesResponse)

      setMangroveSpeciesForCountriesSelected(organizedSpecies)
    }

    const getMangroveSpeciesUsedFrom6_2b = getMangroveSpeciesUsed(serverResponse)
    let mangroveSpeciesList = []
    if (getMangroveSpeciesUsedFrom6_2b.length) {
      mangroveSpeciesList = getMangroveSpeciesUsedFrom6_2b.map((specie) => specie.type)
    }
    setMangroveSpeciesUsedChecked(mangroveSpeciesList)
  }, [])

  useInitializeQuestionMappedForm({
    apiUrl: apiAnswersUrl,
    questionMapping: questionMapping.siteInterventions,
    successCallback: loadServerData
  })

  const handleSubmit = (formData) => {
    setIsSubmitting(true)
    setIsSubmitError(false)

    if (!formData) return

    axios
      .patch(apiAnswersUrl, mapDataForApi('siteInterventions', formData))
      .then(() => {
        setIsSubmitting(false)
        toast.success(language.success.submit)
      })
      .catch(() => {
        setIsSubmitting(false)
        setIsSubmitError(true)
        toast.error(language.error.submit)
      })
  }

  const handleWhichStakeholdersInvolvedOnChange = (event, stakeholder) => {
    const whichStakeholdersInvolvedTypesCheckedCopy = [...whichStakeholdersInvolvedTypesChecked]

    if (event.target.checked) {
      whichStakeholdersInvolvedAppend({
        stakeholder: stakeholder,
        stakeholderType: ''
      })
      whichStakeholdersInvolvedTypesCheckedCopy.push(stakeholder)
    } else {
      const fieldIndex = whichStakeholdersInvolvedFields.findIndex(
        (field) => field.stakeholder === stakeholder
      )
      const typeIndex = whichStakeholdersInvolvedTypesCheckedCopy.findIndex(
        (type) => type === stakeholder
      )
      whichStakeholdersInvolvedTypesCheckedCopy.splice(typeIndex, 1)
      whichStakeholdersInvolvedRemove(fieldIndex)
    }
    setWhichStakeholdersInvolvedTypesChecked(whichStakeholdersInvolvedTypesCheckedCopy)
  }

  const getWhichStakeholderInvolved = (stakeholder) =>
    whichStakeholdersInvolvedFields.find((field) => field.stakeholder === stakeholder)

  const handleMangroveSpeciesUsedOnChange = (event, specie) => {
    const mangroveSpeciesUsedCheckedCopy = [...mangroveSpeciesUsedChecked]

    if (event.target.checked) {
      mangroveSpeciesUsedAppend({
        type: specie,
        seed: { checked: false, source: [], count: 0 },
        propagule: { checked: false, source: [], count: 0 }
      })
      mangroveSpeciesUsedCheckedCopy.push(specie)
    } else {
      const fieldIndex = mangroveSpeciesUsedFields.findIndex((field) => field.type === specie)
      const typeIndex = mangroveSpeciesUsedCheckedCopy.findIndex((type) => type === specie)
      mangroveSpeciesUsedCheckedCopy.splice(typeIndex, 1)
      mangroveSpeciesUsedRemove(fieldIndex)
    }
    setMangroveSpeciesUsedChecked(mangroveSpeciesUsedCheckedCopy)
  }
  const getMangroveSpeciesUsedIndex = (specie) => {
    return mangroveSpeciesUsedFields.findIndex((item) => item.type === specie)
  }

  const handleSourceOfSeedlingsOnChange = (event, specie, seedlingType) => {
    const index = getMangroveSpeciesUsedIndex(specie)
    const item = mangroveSpeciesUsedFields[index]
    if (seedlingType === 'seedling') {
      event.target.checked ? (item.seed.checked = true) : (item.seed.checked = false)
    } else if (seedlingType === 'propagule') {
      event.target.checked ? (item.propagule.checked = true) : (item.propagule.checked = false)
    }
    mangroveSpeciesUsedUpdate(item)
  }

  const isMangroveSpeciesUsedShowing = () => {
    const optionsUsed = [
      'Planting',
      'Broadcast collected propagules onto an incoming tide',
      'Large scale broadcasting of propagules from the air or boats'
    ]

    const matchingItems = optionsUsed.filter((item) =>
      biophysicalInterventionsUsedWatcher?.selectedValues?.includes(item)
    )

    return matchingItems.length ? true : false
  }

  const updateTabularInputDisplay = (boolean) => {
    return setShowAddTabularInputRow(boolean)
  }

  const saveItem = ({ type, count, source, purpose }) => {
    mangroveAssociatedSpeciesAppend({
      type,
      count,
      source,
      purpose
    })
  }

  const deleteMeasurementItem = (measurementIndex) => {
    mangroveAssociatedSpeciesRemove(measurementIndex)
  }

  const updateMeasurementItem = (measurementIndex, count, source, purpose, otherPurpose) => {
    const currentItem = mangroveAssociatedSpeciesFields[measurementIndex]
    if (count) currentItem.count = count
    if (source) currentItem.source = source
    if (purpose) currentItem.purpose.purpose = purpose
    if (otherPurpose) currentItem.purpose.other = otherPurpose
    mangroveAssociatedSpeciesUpdate(measurementIndex, currentItem)
  }

  return (
    <ContentWrapper>
      <FormPageHeader>
        <PageTitle>{language.pages.siteQuestionsOverview.formName.siteInterventions}</PageTitle>
        <PageSubtitle>{site_name}</PageSubtitle>
      </FormPageHeader>
      <QuestionNav
        isFormSaving={isSubmitting}
        isFormSaveError={isSubmitError}
        onFormSave={validateInputs(handleSubmit)}
        currentSection='site-interventions'
      />
      <FormValidationMessageIfErrors formErrors={errors} />

      <FormLayout>
        <FormQuestionDiv>
          <StickyFormLabel>{questions.whichStakeholdersInvolved.question}</StickyFormLabel>
          <List>
            {questions.whichStakeholdersInvolved.options.map((stakeholder, index) => (
              <ListItem key={index}>
                <Box>
                  <Box>
                    <Checkbox
                      value={stakeholder}
                      checked={whichStakeholdersInvolvedTypesChecked.includes(stakeholder)}
                      onChange={(event) =>
                        handleWhichStakeholdersInvolvedOnChange(event, stakeholder)
                      }></Checkbox>
                    <Typography variant='subtitle'>{stakeholder}</Typography>
                  </Box>
                  <Box>
                    {getWhichStakeholderInvolved(stakeholder) && (
                      <Box>
                        <InnerFormDiv>
                          <Controller
                            name={`whichStakeholdersInvolved.${whichStakeholdersInvolvedFields.findIndex(
                              (field) => field.stakeholder === stakeholder
                            )}.stakeholderType`}
                            control={control}
                            defaultValue=''
                            render={({ field }) => (
                              <TextField
                                {...field}
                                select
                                value={field.value}
                                label='select'
                                sx={{ width: '10em' }}>
                                {['Paid', 'Voluntary'].map((item, index) => (
                                  <MenuItem key={index} value={item}>
                                    {item}
                                  </MenuItem>
                                ))}
                              </TextField>
                            )}
                          />
                        </InnerFormDiv>
                      </Box>
                    )}
                  </Box>
                </Box>
              </ListItem>
            ))}
          </List>
          <ErrorText>{errors.whichStakeholdersInvolved?.selectedValues?.message}</ErrorText>
        </FormQuestionDiv>
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
        {!biophysicalInterventionsUsedWatcher?.selectedValues?.includes('None') ? (
          <FormQuestionDiv>
            <StickyFormLabel>{questions.biophysicalInterventionDuration.question}</StickyFormLabel>
            <Box>
              <InnerFormDiv>
                <Controller
                  name={`biophysicalInterventionDuration.startDate`}
                  control={control}
                  defaultValue={null}
                  render={({ field }) => (
                    <DatePickerUtcMui
                      id='start-date'
                      label='Intervention start date'
                      field={field}
                    />
                  )}
                />
              </InnerFormDiv>
              <InnerFormDiv>
                <Controller
                  name={`biophysicalInterventionDuration.endDate`}
                  control={control}
                  defaultValue={null}
                  render={({ field }) => (
                    <DatePickerUtcMui id='end-date' label='Intervention end date' field={field} />
                  )}
                />
              </InnerFormDiv>
              <ErrorText>{errors.biophysicalInterventionDuration?.endDate.message}</ErrorText>
            </Box>
          </FormQuestionDiv>
        ) : null}

        {isMangroveSpeciesUsedShowing() ? (
          <FormQuestionDiv>
            <StickyFormLabel>{questions.mangroveSpeciesUsed.question}</StickyFormLabel>
            <List>
              {mangroveSpeciesForCountriesSelected.length ? (
                mangroveSpeciesForCountriesSelected.map((specie, specieSelectedIndex) => (
                  <ListItem key={specieSelectedIndex}>
                    <Box>
                      <Box>
                        <Checkbox
                          value={specie}
                          checked={mangroveSpeciesUsedChecked.includes(specie)}
                          onChange={(event) =>
                            handleMangroveSpeciesUsedOnChange(event, specie)
                          }></Checkbox>
                        <Typography variant='subtitle'>{specie}</Typography>
                      </Box>
                      {mangroveSpeciesUsedChecked.includes(specie) ? (
                        <SubgroupDiv>
                          <Typography>{questions.sourceOfMangroves.question}</Typography>
                          <Box>
                            <Checkbox
                              value={specie}
                              checked={
                                mangroveSpeciesUsedFields[getMangroveSpeciesUsedIndex(specie)].seed
                                  .checked
                              }
                              onChange={(event) =>
                                handleSourceOfSeedlingsOnChange(event, specie, 'seedling')
                              }></Checkbox>
                            <Typography variant='subtitle'>Seedling</Typography>
                            <SubgroupDiv>
                              <Controller
                                name={`mangroveSpeciesUsed.${getMangroveSpeciesUsedIndex(
                                  specie
                                )}.seed.source`}
                                control={control}
                                defaultValue={[]}
                                render={({ field }) => (
                                  <Select
                                    {...field}
                                    multiple
                                    value={field.value}
                                    label='Source'
                                    renderValue={(selected) => (
                                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value) => (
                                          <Chip key={value} label={value} />
                                        ))}
                                      </Box>
                                    )}
                                    sx={{ minWidth: '10em' }}>
                                    {seedlingOptions.map((item, index) => (
                                      <MenuItem key={index} value={item}>
                                        {item}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                )}
                              />
                            </SubgroupDiv>
                            <SubgroupDiv>
                              <Controller
                                name={`mangroveSpeciesUsed.${getMangroveSpeciesUsedIndex(
                                  specie
                                )}.seed.count`}
                                control={control}
                                defaultValue=''
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    value={field.value}
                                    label='Count'
                                    sx={{ width: '10em', marginTop: '1em' }}></TextField>
                                )}
                              />
                            </SubgroupDiv>
                          </Box>
                          <Box>
                            <Checkbox
                              value={specie}
                              checked={
                                mangroveSpeciesUsedFields[getMangroveSpeciesUsedIndex(specie)]
                                  .propagule.checked
                              }
                              onChange={(event) =>
                                handleSourceOfSeedlingsOnChange(event, specie, 'propagule')
                              }></Checkbox>
                            <Typography variant='subtitle'>Propagule</Typography>
                            <SubgroupDiv>
                              <Controller
                                name={`mangroveSpeciesUsed.${getMangroveSpeciesUsedIndex(
                                  specie
                                )}.propagule.source`}
                                control={control}
                                defaultValue={[]}
                                render={({ field }) => (
                                  <Select
                                    {...field}
                                    multiple
                                    value={field.value}
                                    label='Source'
                                    renderValue={(selected) => (
                                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value) => (
                                          <Chip key={value} label={value} />
                                        ))}
                                      </Box>
                                    )}
                                    sx={{ minWidth: '10em' }}>
                                    {propaguleOptions.map((item, index) => (
                                      <MenuItem key={index} value={item}>
                                        <ListItemText>{item}</ListItemText>
                                      </MenuItem>
                                    ))}
                                  </Select>
                                )}
                              />
                            </SubgroupDiv>
                            <SubgroupDiv>
                              <Controller
                                name={`mangroveSpeciesUsed.${getMangroveSpeciesUsedIndex(
                                  specie
                                )}.propagule.count`}
                                control={control}
                                defaultValue=''
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    value={field.value}
                                    label='Count'
                                    sx={{ width: '10em', marginTop: '1em' }}></TextField>
                                )}
                              />
                            </SubgroupDiv>
                          </Box>
                        </SubgroupDiv>
                      ) : null}
                    </Box>
                  </ListItem>
                ))
              ) : (
                <ErrorText>
                  No items to display. Please select countries in Site Details and Location (1.2).
                </ErrorText>
              )}
            </List>
            <ErrorText>{errors.mangroveSpeciesUsed?.message}</ErrorText>
          </FormQuestionDiv>
        ) : null}
        {isMangroveSpeciesUsedShowing ? (
          <FormQuestionDiv>
            <StickyFormLabel>{questions.mangroveAssociatedSpecies.question}</StickyFormLabel>
            {mangroveAssociatedSpeciesFields.length > 0
              ? mangroveAssociatedSpeciesFields.map((item, itemIndex) => (
                  <MangroveAssociatedSpeciesRow
                    key={itemIndex}
                    type={item.type}
                    count={item.count}
                    source={item.source}
                    purpose={item.purpose.purpose}
                    other={item.purpose.other}
                    index={itemIndex}
                    deleteItem={deleteMeasurementItem}
                    updateItem={updateMeasurementItem}></MangroveAssociatedSpeciesRow>
                ))
              : null}
            <ErrorText>{errors.mangroveAssociatedSpecies?.message}</ErrorText>
            {showAddTabularInputRow ? (
              <AddMangroveAssociatedSpeciesRow
                saveItem={saveItem}
                updateTabularInputDisplay={
                  updateTabularInputDisplay
                }></AddMangroveAssociatedSpeciesRow>
            ) : null}
            {!showAddTabularInputRow ? (
              <Button sx={{ marginTop: '1.5em' }} onClick={() => setShowAddTabularInputRow(true)}>
                + Add measurement row
              </Button>
            ) : null}
          </FormQuestionDiv>
        ) : null}
        <FormQuestionDiv>
          <StickyFormLabel>{questions.localParticipantTraining.question}</StickyFormLabel>
          <Controller
            name='localParticipantTraining'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField {...field} select value={field.value} label='select'>
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

        {localParticipantTrainingWatcher === 'Yes' ? (
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
