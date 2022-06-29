import { useState } from 'react'

export const useLocalStorage = (keyName, defaultValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    const value = window.localStorage.getItem(keyName)
    if (value) {
      return value
    } else {
      window.localStorage.setItem(keyName, defaultValue)
      return defaultValue
    }
  })

  const setValue = (newValue) => {
    try {
      window.localStorage.setItem(keyName, newValue)
    } catch (err) {
      console.warn(err)
    }
    setStoredValue(newValue)
  }

  return [storedValue, setValue]
}
