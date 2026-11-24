import {
  cleanOrganizationFilters,
  organizationKeys,
  organizationsPath
} from '@/queries/organizations'

describe('organization filters', () => {
  it('keeps the unfiltered path as page and per_page only', () => {
    expect(organizationsPath({}, 1)).toBe('/organizations?page=1&per_page=100')
  })

  it('adds trimmed name, region and country filters', () => {
    expect(organizationsPath({ q: ' mang ', region: 'Africa', country: 'KEN' }, 2)).toBe(
      '/organizations?page=2&per_page=100&q=mang&region=Africa&country=KEN'
    )
  })

  it('encodes special characters in the search', () => {
    expect(organizationsPath({ q: 'A&B %' }, 1)).toBe(
      '/organizations?page=1&per_page=100&q=A%26B+%25'
    )
  })

  it('drops empty and blank filters', () => {
    expect(cleanOrganizationFilters({ q: '  ', region: '', country: undefined })).toEqual({})
  })

  it('gives blank and missing filters the same cache key', () => {
    expect(organizationKeys.list({ q: ' ' })).toEqual(organizationKeys.list())
    expect(organizationKeys.list().slice(0, 1)).toEqual(organizationKeys.all)
  })
})
