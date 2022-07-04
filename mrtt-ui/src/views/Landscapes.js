import { Link } from 'react-router-dom'
import { Stack } from '@mui/material'
import { toast } from 'react-toastify'
import axios from 'axios'

import { ButtonPrimary } from '../styles/buttons'
import {
  Card,
  ContentWrapper,
  RowCenterCenter,
  RowSpaceBetween,
  TitleAndActionContainer
} from '../styles/containers'
import { ItemTitle, PageTitle } from '../styles/typography'
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
      <Card key={id}>
        <RowSpaceBetween>
          <ItemTitle>{landscape_name}</ItemTitle>
          <RowCenterCenter>
            <EditLink to={`/landscapes/${id}/edit`} />
          </RowCenterCenter>
        </RowSpaceBetween>
      </Card>
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
