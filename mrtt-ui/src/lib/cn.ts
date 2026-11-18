import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// Custom --text-* sizes from styles/globals.css. Without this, tailwind-merge reads `text-md`
// as a colour and drops it next to `text-error`.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ['2xs', 'md']
    }
  }
})

/** Join class names and let the last conflicting Tailwind utility win. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
