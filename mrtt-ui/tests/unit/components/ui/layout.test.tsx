import { render, screen } from '@testing-library/react'

import { Card, ContentWrapper, LinkCard, UlAlternating } from '@/components/ui/layout'
import { ItemTitle } from '@/components/ui/typography'

describe('ui/layout and ui/typography', () => {
  it('Card renders a div, or the element passed to render', () => {
    render(
      <ul>
        <Card render={<li />}>As list item</Card>
      </ul>
    )
    expect(screen.getByRole('listitem')).toHaveTextContent('As list item')

    render(<Card data-testid='card'>Plain</Card>)
    expect(screen.getByTestId('card').tagName).toBe('DIV')
  })

  it('ItemTitle renders an h3 unless told otherwise', () => {
    render(
      <>
        <ItemTitle>Default</ItemTitle>
        <ItemTitle render={<h2 />}>Site name</ItemTitle>
      </>
    )
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Default')
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Site name')
  })

  it('merges className and forwards props', () => {
    render(
      <ContentWrapper className='extra' aria-label='content'>
        x
      </ContentWrapper>
    )
    const wrapper = screen.getByLabelText('content')
    expect(wrapper).toHaveClass('max-w-content', 'extra')
  })

  it('LinkCard is a link and UlAlternating a list', () => {
    render(
      <UlAlternating>
        <li>
          <LinkCard href='/sites/1/overview'>Site 1</LinkCard>
        </li>
      </UlAlternating>
    )
    expect(screen.getByRole('link', { name: 'Site 1' })).toHaveAttribute(
      'href',
      '/sites/1/overview'
    )
    expect(screen.getByRole('list')).toHaveClass('list-none')
  })
})
