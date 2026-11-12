import type { ComponentProps } from 'react'

import { Loading } from '@/components/ui/loading'
import { cn } from '@/lib/cn'

type LoadingIndicatorOverlayProps = Omit<ComponentProps<'div'>, 'children'> & {
  isVisible: boolean
}

/** Dims the page and shows a spinner while something blocking (e.g. a save) runs. */
function LoadingIndicatorOverlay({ isVisible, className, ...props }: LoadingIndicatorOverlayProps) {
  if (!isVisible) return null

  return (
    <div
      data-slot='loading-overlay'
      className={cn(
        'fixed inset-0 z-1201 grid place-items-center bg-black/50 animate-in fade-in-0',
        className
      )}
      {...props}>
      <Loading iconClassName='size-10 text-white' />
    </div>
  )
}

export default LoadingIndicatorOverlay
