'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown'
import language from '@/language'

type DownloadDataMenuProps = {
  /** The button text, e.g. "Download sites". */
  label: string
  /** Called with `true` for public data only, `false` for all data. */
  onSelect: (publicOnly: boolean) => void
}

/** A button opening "All data" / "Public data" download options. */
function DownloadDataMenu({ label, onSelect }: DownloadDataMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button type='button' variant='outline' />}>
        {label}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => onSelect(false)}>
          {language.pages.sites.allData}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSelect(true)}>
          {language.pages.sites.publicData}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default DownloadDataMenu
export type { DownloadDataMenuProps }
