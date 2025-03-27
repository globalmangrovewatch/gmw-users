import { styled } from '@mui/system'
import { Typography } from '@mui/material'
import { H1 } from '../ui/typography'

export const Base = styled('div')`
  display: flex;
  height: 100vh;
  background-image: url('/images/landing/bg-shape-white.svg'),
    url('/images/landing/bg-shape-green.svg'), url('/images/landing/bg.webp');
  background-size: cover, cover, cover;
  background-position: center, left center, left center;
  background-repeat: no-repeat, no-repeat, no-repeat;
  overflow: hidden;
`

export const Aside = styled('div')`
  display: flex;
  align-items: center;
  flex: 2;
`

export const AsideContent = styled('section')`
  width: 410px;
  margin-left: 110px;
`

export const AsideText = styled(Typography)`
  color: ${({ theme }) => theme.palette.common.white};
`

export const AsideHeadline = styled('h2')`
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
  width: 340px;
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
