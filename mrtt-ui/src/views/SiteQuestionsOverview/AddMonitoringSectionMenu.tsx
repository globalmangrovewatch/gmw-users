'use client'

import Link from 'next/link'
import { LuChevronDown } from 'react-icons/lu'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown'
import language from '@/language'

const pageLanguage = language.pages.siteQuestionsOverview

const monitoringSections = [
  {
    path: 'management-status-and-effectiveness',
    label: pageLanguage.formName.managementStatusAndEffectiveness
  },
  {
    path: 'socioeconomic-and-governance-status',
    label: pageLanguage.formName.socioeconomicGovernanceStatusOutcomes
  },
  {
    path: 'ecological-status-and-outcomes',
    label: pageLanguage.formName.ecologicalStatusOutcomes
  }
]

type AddMonitoringSectionMenuProps = { siteId: string }

/** "Add monitoring section" button, opening a menu of the three monitoring forms. */
function AddMonitoringSectionMenu({ siteId }: AddMonitoringSectionMenuProps) {
  return (
    <div className='mb-4'>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button />}>
          {pageLanguage.addMonitoringSectionButton}
          <LuChevronDown className='size-5' aria-hidden='true' />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {monitoringSections.map(({ path, label }) => (
            <DropdownMenuItem key={path} render={<Link href={`/sites/${siteId}/form/${path}`} />}>
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default AddMonitoringSectionMenu
export type { AddMonitoringSectionMenuProps }
