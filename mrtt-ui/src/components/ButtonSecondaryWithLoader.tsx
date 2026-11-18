import type { ReactNode } from 'react'

import { Button, type ButtonProps } from '@/components/ui/button'

type ButtonSecondaryWithLoaderProps = ButtonProps & {
  children: ReactNode
  /** Shows `holdingContent` and disables the button, e.g. while a request runs. */
  isHolding?: boolean
  holdingContent: ReactNode
}

function ButtonSecondaryWithLoader({
  children,
  isHolding = false,
  disabled = false,
  holdingContent,
  ...props
}: ButtonSecondaryWithLoaderProps) {
  return (
    <Button {...props} disabled={isHolding || disabled}>
      {isHolding ? holdingContent : children}
    </Button>
  )
}

export default ButtonSecondaryWithLoader
