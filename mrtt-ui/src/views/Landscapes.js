import { Stack } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import LoadingIndicator from '../components/LoadingIndicator'
import language from '../language'
import { ButtonPrimary } from '../styles/buttons'
import { LinkCard, PagePadding, RowSpaceBetween } from '../styles/containers'
import { H4 } from '../styles/typography'

const landscapesUrl = `${process.env.REACT_APP_API_URL}/landscapes/`
function Landscapes() {
  const [isLoading, setIsLoading] = useState(true)
  const [landscapes, setLandscapes] = useState([])

  useEffect(function loadSitesData() {
    axios
      .get(landscapesUrl)
      .then(({ data }) => {
        setIsLoading(false)
        setLandscapes(data)
      })
      .catch(() => toast.error(language.error.apiLoad))
  }, [])

  const landscapesList = landscapes
    .sort((landscapeA, landscapeB) => {
      const landscapeAName = landscapeA.landscape_name?.toLowerCase()
      const landscapeBName = landscapeB.landscape_name?.toLowerCase()

      if (landscapeAName < landscapeBName) {
        return -1
      }
      if (landscapeAName < landscapeBName) {
        return 1
      }
      return 0
    })
    .map(({ landscape_name, id }) => (
      <LinkCard key={id} to='#'>
        {landscape_name}
      </LinkCard>
    ))

  return isLoading ? (
    <LoadingIndicator />
  ) : (
    <PagePadding>
      <RowSpaceBetween>
        <H4>{language.pages.landscapes.title}</H4>
        <ButtonPrimary component={Link} to='#'>
          {language.pages.landscapes.newLandscapeButton}
        </ButtonPrimary>
      </RowSpaceBetween>
      <Stack>{landscapesList}</Stack>
    </PagePadding>
  )
}

export default Landscapes
