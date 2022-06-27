const color = {
  bodyBackground: '#fafafa',
  primary: '#009b93',
  primaryHover: '#00c6bd',
  rowEven: '#e6e6e6',
  rowOdd: '#f2f2f2',
  secondary: '#02b1a8',
  secondaryHover: '#02b1a8',
  slub: '#333333D9',
  text: '#000000D9',
  white: '#ffffff'
}

const typography = {
  fontStack: ['Open Sans', 'sans-serif']
}
const border = {
  primary: `solid thin ${color.primary}`,
  primaryStyle: 'solid',
  primaryWidth: 'thin'
}
const layout = {
  headerHeight: '5rem',
  navWidth: '18rem',
  mediaQueryDesktop: '599px',
  maxContentWidth: '96rem'
}

export default { color, border, layout, typography }
