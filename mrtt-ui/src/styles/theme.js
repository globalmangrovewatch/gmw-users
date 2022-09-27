import { css } from '@emotion/react'
const color = {
  bodyBackground: '#fafafa',
  primary: '#009b93',
  primaryHover: '#00c6bd',
  rowEven: '#e6e6e6',
  rowOdd: '#f2f2f2',
  secondary: '#02b1a8',
  secondaryHover: '#02b1a8',
  lightGrey: '#AFC4C3',
  darkGrey: '#2E3333',
  slub: '#333333D9',
  text: '#000000D9',
  white: '#ffffff',
  red: '#B20000',
  lightRed: '#D00000'
}

const form = {
  requiredIndicatorColor: `${color.red}`
}
const typography = {
  fontStack: ['Open Sans', 'sans-serif'],
  xsmallFontSize: '1rem',
  smallFontSize: '1.5rem',
  fontSize: '2rem',
  largeFontSize: '2.5rem',
  xlargeFontSize: '3rem'
}
const border = {
  primary: `solid thin ${color.primary}`,
  primaryStyle: 'solid',
  primaryWidth: 'thin'
}
const layout = {
  headerHeight: '7rem',
  footerHeight: '6rem',
  navWidth: '18rem',
  mediaQueryDesktop: '599px',
  maxContentWidth: '96rem',
  sectionNavHeight: '5.65rem'
}

const hoverState = (content) => css`
  @media (hover: hover) {
    &:hover:not([disabled]) {
      ${content};
    }
  }
`
export default { hoverState, color, border, layout, typography, form }
