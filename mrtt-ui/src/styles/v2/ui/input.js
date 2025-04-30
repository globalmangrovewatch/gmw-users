import { styled } from '@mui/material/styles'

const Input = styled('input')`
  display: flex;
  padding: 8px 56px 8px 12px;
  align-items: center;
  align-self: stretch;
  border-radius: 100px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  outline: none;
  font-size: 14px;
  font-style: normal;
  font-weight: 300;
  line-height: 20px;
  width: 100%;

  &:focus {
    outline: none;
  }
`

export { Input }
