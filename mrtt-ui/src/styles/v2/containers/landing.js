import { styled } from '@mui/system'
import { Typography } from '@mui/material'
import { H1 } from '../ui/typography'

export const Base = styled('div')(
  ({ theme }) => `
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding-bottom: 50px;
  overflow-y: auto;

  ${theme.breakpoints.up('lg')} {
    overflow: hidden;
    flex-direction: row;
    padding-bottom: 0;
    background-image: url('/images/landing/bg-shape-white.svg'),
      url('/images/landing/bg-shape-green.svg'), url('/images/landing/bg.webp');
    background-size: cover, cover, cover;
    background-position: center, left center, left center;
    background-repeat: no-repeat, no-repeat, no-repeat;
  }
`
)

export const Hero = styled('div')(
  ({ theme }) => `
  position: relative;
  display: flex;
  padding-top: 25vh;
  justify-content: center;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%),
    linear-gradient(
      180deg,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.56) 45.44%,
      rgba(0, 0, 0, 0.56) 62.93%,
      rgba(0, 0, 0, 0.16) 100%
    ),
    url('/images/landing/bg-small.webp') lightgray 50% / cover no-repeat;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.85;
    background: rgba(0, 133, 127, 0.62);
    mix-blend-mode: color;
  }

  ${theme.breakpoints.up('lg')} {
    padding-top: 0;
    justify-content: flex-start;
    align-items: center;
    flex: 2;
    background: none;

    &::before {
      display: none;
    }
  }
`
)

export const HeroContent = styled('section')(
  ({ theme }) => `
  padding: 24px;
  width: 410px;

  ${theme.breakpoints.up('lg')} {
    margin-left: 110px;
    padding: 0;
  }
`
)

export const HeroText = styled(Typography)(
  ({ theme }) => `
  color: ${theme.palette.common.white};
`
)

export const HeroHeadline = styled('h2')(
  ({ theme }) => `
  font-size: 40px;
  font-weight: 300;
  line-height: 50px;
  margin-bottom: 24px;
  color: ${theme.palette.common.white};
`
)

export const Main = styled('div')(
  ({ theme }) => `
  display: flex;
  align-items: center;
  flex: 1;
  background-image: url('/images/landing/bg-shape.svg');
  background-size: cover;
  background-position: left center;
  background-repeat: no-repeat;

  ${theme.breakpoints.up('lg')} {
    background-image: none;
  }
`
)

export const MainContent = styled('section')`
  padding: 24px;
  width: 100%;

  @media (min-width: 1024px) {
    padding: 0;
    width: 340px;
  }
`

export const MainTitle = styled(H1)`
  margin-bottom: 40px;
`

export const Form = styled('form')`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 24px;
`

export const FormFooter = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 24px;
  justify-content: center;
  align-items: center;
`
