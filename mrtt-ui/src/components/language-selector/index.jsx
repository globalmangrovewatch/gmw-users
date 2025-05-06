import { useCallback, useState, useEffect } from 'react'
import { FormControl, MenuItem, Select } from '@mui/material'

import PropTypes from 'prop-types'

const LanguagePicker = (theme) => {
  const t = typeof window !== 'undefined' && window.Transifex

  const handleChange = useCallback((e) => {
    const Transifex = window.Transifex
    Transifex?.live.translateTo(e.target.value)
    setCurrentLanguage(e.target.value)
  }, [])

  const [languages, setLanguages] = useState([])
  const [currentLanguage, setCurrentLanguage] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Transifex) {
      const t = window.Transifex

      if (t?.live) {
        t.live?.init()
        const locale = t?.live.detectLanguage()
        const languages = t.live.getAllLanguages()
        const defaultLanguage = languages?.find((lang) => lang.code === locale)?.code
        setCurrentLanguage(defaultLanguage)
        setLanguages(languages)
      }
    }
  }, [t])

  return (
    <FormControl sx={{ minWidth: 160 }} size='small'>
      {currentLanguage && (
        <Select
          labelId='language-select-label'
          id='language-select'
          onChange={handleChange}
          value={currentLanguage}
          sx={theme === 'dark' ? { color: '#000' } : { color: `#009b93`, backgroundColor: '#fff' }}>
          {languages.map((lang) => (
            <MenuItem
              key={lang.code}
              value={lang.code}
              data-testid={`${lang.code}-option`}
              name={lang.name}
              id={lang.code}
              sx={
                theme === 'dark'
                  ? { color: '#000' }
                  : {
                      color: '#009b93',
                      backgroundColor: 'transparent',
                      '&:hover': {
                        backgroundColor: '#009b93',
                        color: '#fff'
                      },
                      '&:active': {
                        backgroundColor: '#009b93',
                        color: '#fff'
                      }
                    }
              }>
              {lang.name}
            </MenuItem>
          ))}
        </Select>
      )}
    </FormControl>
  )
}

PropTypes.LanguagePicker = {
  theme: PropTypes.string
}

export default LanguagePicker
