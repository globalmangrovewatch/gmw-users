import { ButtonPrimary } from '../styles/buttons'
import { H4 } from '../styles/typography'
import { Link } from 'react-router-dom'
import { LinkCard, PagePadding, RowSpaceBetween } from '../styles/containers'
import { Stack } from '@mui/material'
import { toast } from 'react-toastify'
import axios from 'axios'
import EditLink from '../components/EditLink'
import language from '../language'
import { ButtonPrimary } from '../styles/buttons'
import { LinkCard, ContentWrapper, TitleAndActionContainer } from '../styles/containers'
import { CardTitle, PageTitle } from '../styles/typography'
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
        <CardTitle>{landscape_name}</CardTitle>
        <EditLink to={`/landscapes/${id}/edit`} />
      </LinkCard>
    ))

  return isLoading ? (
    <LoadingIndicator />
  ) : (
    <ContentWrapper>
      <TitleAndActionContainer>
        <PageTitle>{language.pages.landscapes.title}</PageTitle>
        <ButtonPrimary component={Link} to='/landscapes/new'>
          {language.pages.landscapes.newLandscapeButton}
        </ButtonPrimary>
      </TitleAndActionContainer>
      <Stack>{landscapesList}</Stack>
    </ContentWrapper>
  )
}

export default Landscapes
