import { mangroveSpeciesPerCountryList } from '../data/mangroveSpeciesPerCountry'

// mangroveSpeciesPresent list should display country specific species at the top, with all
// species below the country specific list, removing duplicates from the second list

const organizeMangroveSpeciesList = (siteCountriesResponse) => {
  const countriesList = siteCountriesResponse.map((countryItem) => countryItem.properties.country)
  const allSpecies = []
  const countrySelectedSpecies = []
  let countrySelectedSpeciesWithAllSpecies = []

  countriesList.forEach((countrySelected) => {
    mangroveSpeciesPerCountryList.forEach((countryItem) => {
      if (countryItem.country.name === countrySelected) {
        countrySelectedSpecies.push(...countryItem.species)
      }
      allSpecies.push(...countryItem.species)
    })
  })
  const uniqueCountrySelectedSpecies = [...new Set(countrySelectedSpecies)]
  uniqueCountrySelectedSpecies.sort()
  const uniqueAllSpecies = [...new Set(allSpecies)]
  const filteredUniqueAllSpecies = uniqueAllSpecies.filter(
    (specie) => !uniqueCountrySelectedSpecies.includes(specie)
  )
  filteredUniqueAllSpecies.sort()

  countrySelectedSpeciesWithAllSpecies = [
    ...uniqueCountrySelectedSpecies,
    ...filteredUniqueAllSpecies
  ]

  return countrySelectedSpeciesWithAllSpecies
}

export default organizeMangroveSpeciesList
