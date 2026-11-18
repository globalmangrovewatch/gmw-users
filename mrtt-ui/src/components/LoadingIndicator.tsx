import type { ComponentProps } from 'react'

import { Loading } from '@/components/ui/loading'
import { cn } from '@/lib/cn'

/** Full-height spinner for a page or section that is still loading. */
function LoadingIndicator({ className, ...props }: Omit<ComponentProps<'div'>, 'children'>) {
  return (
    <div className={cn('grid h-screen place-items-center', className)} {...props}>
      <Loading iconClassName='size-10' />
    </div>
  )
}

export default LoadingIndicator
