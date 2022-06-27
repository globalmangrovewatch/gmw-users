import { ButtonPrimary } from '../styles/buttons'
import { H4 } from '../styles/typography'
import { Link } from 'react-router-dom'
import { LinkCard, PagePadding, RowSpaceBetween } from '../styles/containers'
import { Stack } from '@mui/material'
import { toast } from 'react-toastify'
import axios from 'axios'
import EditLink from '../components/EditLink'
import language from '../language'
import LoadingIndicator from '../components/LoadingIndicator'
import React, { useEffect, useState } from 'react'

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
        <RowSpaceBetween>
          <>{landscape_name}</>
          <EditLink to={`/landscapes/${id}/edit`} />
        </RowSpaceBetween>
      </LinkCard>
    ))

  return isLoading ? (
    <LoadingIndicator />
  ) : (
    <PagePadding>
      <RowSpaceBetween>
        <H4>{language.pages.landscapes.title}</H4>
        <ButtonPrimary component={Link} to='/landscapes/new'>
          {language.pages.landscapes.newLandscapeButton}
        </ButtonPrimary>
      </RowSpaceBetween>
      <Stack>{landscapesList}</Stack>
    </PagePadding>
  )
}

export default Landscapes
