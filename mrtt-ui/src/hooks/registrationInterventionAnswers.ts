import axios from 'axios'

export function useRegistrationAnswers(apiUrl: string) {
  return axios
    .get(apiUrl)
    .then((data) => {
      console.info('Section saved successfully', data)
      return data.data
    })
    .catch(() => {
      console.error('Error fetching registration intervention answers')
    })
}
