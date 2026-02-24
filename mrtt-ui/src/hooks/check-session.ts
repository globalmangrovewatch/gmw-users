import { useEffect, useState } from 'react'
import axios from 'axios'

export function useCheckSession() {
  const [isChecking, setIsChecking] = useState(true)
  const [user, setUser] = useState<any | null>(null)

  useEffect(() => {
    let isMounted = true

    const checkSession = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_AUTH_URL}/users/current_user`, {
          withCredentials: true,
          headers: {
            Accept: 'application/json'
          }
        })
        if (isMounted) {
          setUser(data)
        }
      } catch (error: any) {
        if (error?.response?.status !== 401) {
          console.error('Session check error:', error)
        }
      } finally {
        if (isMounted) {
          setIsChecking(false)
        }
      }
    }

    checkSession()

    return () => {
      isMounted = false
    }
  }, [])

  return { isChecking, user }
}
