import { styled } from '@mui/system'
import { Typography } from '@mui/material'
import { H1 } from '../ui/typography'

export const Base = styled('div')`
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: relative;
  padding-bottom: 50px;
  overflow-y: auto;

  @media (min-width: 1024px) {
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

export const Hero = styled('div')`
  position: relative;
  display: flex;
  padding-top: 300px;
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

  @media (min-width: 1024px) {
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

export const HeroContent = styled('section')`
  padding: 24px;
  width: 410px;

  @media (min-width: 1024px) {
    margin-left: 110px;
    padding: 0;
  }
`

export const HeroText = styled(Typography)`
  color: ${({ theme }) => theme.palette.common.white};
`

export const HeroHeadline = styled('h2')`
  font-size: 40px;
  font-weight: 300;
  line-height: 50px;
  margin-bottom: 24px;
  color: ${({ theme }) => theme.palette.common.white};
`

export const Main = styled('div')`
  display: flex;
  align-items: center;
  flex: 1;
  background-image: url('/images/landing/bg-shape.svg');
  background-size: cover;
  background-position: left center;
  background-repeat: no-repeat;
`

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
