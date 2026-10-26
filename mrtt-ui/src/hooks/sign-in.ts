import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { env } from '@/lib/env'

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
  const authUrl = `${env.AUTH_URL}/users/sign_in`

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
