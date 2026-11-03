import { useMutation } from '@tanstack/react-query'
import { authApi, type ApiError } from '@/lib/api'

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
  return useMutation<SignInResponse, ApiError<SignInError>, SignInInput>({
    mutationFn: (input) => authApi.post<SignInResponse>('/users/sign_in', { user: input })
  })
}
