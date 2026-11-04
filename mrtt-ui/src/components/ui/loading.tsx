import { LuLoaderCircle } from 'react-icons/lu'

import { cn } from '@/lib/cn'

type LoadingProps = {
  visible?: boolean
  /** Wrapper classes. */
  className?: string
  /** Icon classes; a w-, h- or size- class replaces the default size-4. */
  iconClassName?: string
  label?: string
}

const hasSizeClass = (className?: string) =>
  !!className?.split(' ').some((c) => /^(w|h|size)-/.test(c))

function Loading({ visible = true, className, iconClassName, label = 'Loading' }: LoadingProps) {
  if (!visible) return null

  return (
    <span
      role='status'
      aria-live='polite'
      aria-busy='true'
      data-slot='loading'
      className={cn('inline-flex w-full flex-1 items-center justify-center', className)}>
      <span className='sr-only'>{label}</span>
      <LuLoaderCircle
        aria-hidden='true'
        className={cn(
          'animate-spin text-brand-800',
          !hasSizeClass(iconClassName) && 'size-4',
          iconClassName
        )}
      />
    </span>
  )
}

export { Loading }
