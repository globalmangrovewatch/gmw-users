import { css } from '@emotion/react'
const color = {
  bodyBackground: '#fafafa',
  primary: '#009b93',
  primaryHover: '#00c6bd',
  rowEven: '#e6e6e6',
  rowOdd: '#f2f2f2',
  secondary: '#02b1a8',
  secondaryHover: '#02b1a8',
  lightGrey: '#939393',
  lightGreen: '#AFC4C3',
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
  // --font-open-sans is set by next/font on <html> (app/layout.tsx).
  fontStack: ['var(--font-open-sans)', "'Open Sans'", 'sans-serif'],
  xsmallFontSize: '10px',
  smallFontSize: '15px',
  fontSize: '20px',
  largeFontSize: '25px',
  xlargeFontSize: '30px'
}
const border = {
  primary: `solid thin ${color.primary}`,
  primaryStyle: 'solid',
  primaryWidth: 'thin'
}
const layout = {
  headerHeight: '70px',
  footerHeight: '60px',
  navWidth: '180px',
  mediaQueryDesktop: '599px',
  maxContentWidth: '960px',
  sectionNavHeight: '56.5px'
}

const hoverState = (content) => css`
  @media (hover: hover) {
    &:hover:not([disabled]) {
      ${content};
    }
  }
`
export default { hoverState, color, border, layout, typography, form }
