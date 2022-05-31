import React from 'react'
import { styled } from '@mui/system'
import { Link } from 'react-router-dom'

const StyledFooter = styled('footer')``

function Footer() {
  return (
    <StyledFooter>
      <div>StyledFooter</div>
      <Link to='/'>home</Link>
    </StyledFooter>
  )
}

export default Footer
