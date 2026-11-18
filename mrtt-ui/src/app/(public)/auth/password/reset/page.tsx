import { Suspense } from 'react'

import ResetPasswordForm from '@/views/Auth/ResetPasswordForm'

// ResetPasswordForm reads the query string, which is only known in the browser.
export default function Page() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  )
}
