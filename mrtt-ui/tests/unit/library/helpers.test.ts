import { mangroveSpeciesPerCountryList } from 'data/mangroveSpeciesPerCountry'
import { findMonitoringDataItem, findRegistationDataItem } from 'library/findDataItems'
import getOptionsValuesAndLabels from 'library/getOptionsValuesAndLabels'
import organizeMangroveSpeciesList from 'library/organizeMangroveSpeciesList'

describe('findRegistationDataItem', () => {
  const response = {
    data: [
      { question_id: '1.2', answer_value: ['Angola'] },
      { question_id: '2.1', answer_value: [] }
    ]
  }

  it('returns the answer for the question', () => {
    expect(findRegistationDataItem(response, '1.2')).toEqual(['Angola'])
  })

  it('returns falsy answers as they are', () => {
    expect(findRegistationDataItem(response, '2.1')).toEqual([])
  })

  it('returns undefined for an unanswered question', () => {
    expect(findRegistationDataItem(response, '9.9')).toBeUndefined()
  })

  it('returns undefined before the response has loaded', () => {
    expect(findRegistationDataItem(undefined, '1.2')).toBeUndefined()
  })
})

describe('findMonitoringDataItem', () => {
  const response = {
    data: {
      form_type: 'ecologicalStatusAndOutcomes',
      answers: [{ question_id: '10.6', answer_value: 80 }]
    }
  }

  it('returns the answer from the monitoring form answers', () => {
    expect(findMonitoringDataItem(response, '10.6')).toBe(80)
  })

  it('returns undefined for an unanswered question', () => {
    expect(findMonitoringDataItem(response, '10.7')).toBeUndefined()
  })

  it.each([
    ['no response', undefined],
    ['no data', {}],
    ['no answers', { data: {} }]
  ])('returns undefined with %s', (_label, value) => {
    expect(findMonitoringDataItem(value, '10.6')).toBeUndefined()
  })
})

describe('getOptionsValuesAndLabels', () => {
  it('uses each answer as both label and value', () => {
    expect(getOptionsValuesAndLabels(['Yes', 'No'])).toEqual([
      { label: 'Yes', value: 'Yes' },
      { label: 'No', value: 'No' }
    ])
  })

  it('returns an empty list for no answers', () => {
    expect(getOptionsValuesAndLabels([])).toEqual([])
  })
})

describe('organizeMangroveSpeciesList', () => {
  const site = (...countries: string[]) => countries.map((country) => ({ properties: { country } }))
  const speciesOf = (name: string) =>
    mangroveSpeciesPerCountryList.find((item) => item.country.name === name)!.species
  const allSpecies = [
    ...new Set(mangroveSpeciesPerCountryList.flatMap((item) => item.species))
  ].sort()

  it('lists the site country species first, sorted, then every other species, sorted', () => {
    const result = organizeMangroveSpeciesList(site('American Samoa'))
    const local = [...speciesOf('American Samoa')].sort()

    expect(result.slice(0, local.length)).toEqual(local)
    expect(result.slice(local.length)).toEqual(allSpecies.filter((s) => !local.includes(s)))
  })

  it('merges the species of several countries without duplicates', () => {
    const result = organizeMangroveSpeciesList(site('American Samoa', 'Angola'))
    const local = [...new Set([...speciesOf('American Samoa'), ...speciesOf('Angola')])].sort()

    expect(result.slice(0, local.length)).toEqual(local)
    expect(new Set(result).size).toBe(result.length)
    expect(result).toHaveLength(allSpecies.length)
  })

  it('lists every species, sorted, for a country with no species data', () => {
    expect(organizeMangroveSpeciesList(site('Atlantis'))).toEqual(allSpecies)
  })

  it('returns an empty list when the site has no countries', () => {
    // Current behaviour: "all species" is only collected while looping over the site countries.
    expect(organizeMangroveSpeciesList([])).toEqual([])
  })
})
