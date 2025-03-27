import { Link } from 'react-router-dom'
import { Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

export const H1 = styled('h1')(({ theme }) => ({
  fontSize: '40px',
  fontStyle: 'normal',
  fontWeight: 300,
  lineHeight: '50px',
  color: theme.palette.primary.main
}))

export const StyledLink = styled(({ ...props }) => (
  <Link {...props}>
    <Typography variant='text-sm-semibold' component='span'>
      {props.children}
    </Typography>
  </Link>
))(({ theme }) => ({
  color: theme.palette.primary.main,
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline'
  }
}))

export const Paragraph = styled(Typography)(() => ({
  color: '#0F2B3B'
}))

Paragraph.defaultProps = {
  component: 'p',
  variant: 'text-sm'
}
