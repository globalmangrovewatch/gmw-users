import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'

type SignInInput = {
  email: string
  password: string
}

type SignInResponse = {
  token: string
  username?: string
  organization?: string
}

type SignInError = {
  error: string
}

export function useSignInMutation() {
  const authUrl = `${process.env.REACT_APP_AUTH_URL}/users/sign_in`

  return useMutation<SignInResponse, AxiosError<SignInError>, SignInInput>({
    mutationFn: async (input) => {
      const { data } = await axios.post<SignInResponse>(
        authUrl,
        { user: input },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          }
        }
      )

      return data
    }
  })
}
