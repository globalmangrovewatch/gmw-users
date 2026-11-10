'use client'

import { useEffect, useState, type ComponentProps } from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { cn } from '@/lib/cn'

type TransifexLanguage = { code: string; name: string }

type TransifexLive = {
  init: () => void
  detectLanguage: () => string
  getAllLanguages: () => TransifexLanguage[] | undefined
  translateTo: (code: string) => void
}

declare global {
  interface Window {
    Transifex?: { live?: TransifexLive }
  }
}

/** Props go to the select's trigger button. */
type LanguagePickerProps = Omit<ComponentProps<typeof SelectTrigger>, 'children'>

/** Transifex Live language switcher. Renders nothing until Transifex has loaded its languages. */
function LanguagePicker({ className, ...triggerProps }: LanguagePickerProps) {
  const [languages, setLanguages] = useState<TransifexLanguage[]>([])
  const [currentLanguage, setCurrentLanguage] = useState<string | null>(null)

  // Transifex Live loads asynchronously, outside React. Read it on every render and sync its
  // languages in once it's there (re-runs when it appears between renders).
  const live = typeof window === 'undefined' ? undefined : window.Transifex?.live

  useEffect(() => {
    if (!live) return

    live.init()
    const locale = live.detectLanguage()
    const all = live.getAllLanguages() ?? []
    setLanguages(all)
    setCurrentLanguage(all.find((lang) => lang.code === locale)?.code ?? null)
  }, [live])

  if (!currentLanguage) return null

  const handleChange = (code: string | null) => {
    if (!code) return
    window.Transifex?.live?.translateTo(code)
    setCurrentLanguage(code)
  }

  return (
    <Select<string>
      items={languages.map((lang) => ({ label: lang.name, value: lang.code }))}
      value={currentLanguage}
      onValueChange={handleChange}>
      <SelectTrigger
        id='language-select'
        aria-label='Language'
        className={cn('min-w-40 rounded border-black/25 bg-white text-[#009b93]', className)}
        {...triggerProps}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem
            key={lang.code}
            value={lang.code}
            data-testid={`${lang.code}-option`}
            className='text-[#009b93] data-highlighted:bg-[#009b93] data-highlighted:text-white'>
            {lang.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default LanguagePicker
