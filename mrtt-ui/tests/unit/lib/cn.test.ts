import { cn } from '@/lib/cn'

describe('cn', () => {
  it('joins truthy classes and skips falsy ones', () => {
    expect(cn('a', false, null, undefined, { b: true, c: false }, ['d'])).toBe('a b d')
  })

  it('keeps the last conflicting Tailwind utility', () => {
    expect(cn('px-4 py-2', 'px-6')).toBe('py-2 px-6')
    expect(cn('bg-brand-800', 'bg-white')).toBe('bg-white')
  })

  it('treats the custom text sizes as font sizes, not colours', () => {
    expect(cn('text-md', 'text-error')).toBe('text-md text-error')
    expect(cn('text-2xs', 'text-[#333333D9]')).toBe('text-2xs text-[#333333D9]')
    expect(cn('text-md', 'text-sm')).toBe('text-sm')
  })
})
