import { useLocation } from 'react-router-dom'

export const useFeatureFlags = () => {
  const { pathname } = useLocation()
  const showNewLandingPage = /^\/auth\/login(\/newUser)?$/.test(pathname)

  return { showNewLandingPage }
}
