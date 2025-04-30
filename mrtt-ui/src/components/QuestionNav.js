import { ArrowBack, ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material'
import { css, styled } from '@mui/system'
import { Stack } from '@mui/material'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'

import { ErrorText, LinkLooksLikeButtonSecondary } from '../styles/typography'
import ButtonSave from './ButtonSave'
import language from '../language'
import LoadingIndicatorOverlay from './LoadingIndicatorOverlay'
import SECTION_NAMES from '../constants/sectionNames'
import theme from '../styles/theme'
import themeMui from '../styles/themeMui'
import PRIVACY_VALUES from '../constants/privacyValues'

const componentLanguage = language.questionNav

const getMobileNavButtonSecondaryCss = (props) => css`
  align-items: center;
  background-color: ${theme.color.white};
  border: solid thin ${theme.color.primary};
  color: ${theme.color.primary};
  cursor: ${props.disabled ? 'auto' : 'pointer'};
  display: inline-flex;
  padding: ${themeMui.spacing(1)} ${themeMui.spacing(3)};
  width: 100%;
  ${props.disabled
    ? css`
        background-color: ${theme.color.bodyBackground};
        border: solid thin ${theme.color.lightGreen};
        color: ${theme.color.lightGreen};
      `
    : theme.hoverState(css`
        background-color: ${theme.color.primary};
        color: ${theme.color.white};
      `)};
`
const PrivacySelect = styled('select')`
  ${(props) => getMobileNavButtonSecondaryCss(props)}
  border-radius: 4px;
  height: 100%;
  text-transform: uppercase;
  width: inherit;
`

const NavButtonText = styled('span')`
  font-size: ${theme.typography.smallFontSize};
  white-space: nowrap;
  @media (max-width: 1080px) {
    display: none;
  }
`
const StickyStack = styled(Stack)`
  position: sticky;
  top: ${theme.layout.headerHeight};
  background: white;
  z-index: 3;
  @media (max-width: ${theme.layout.mediaQueryDesktop}) {
    position: sticky;
  }
`
const NavWrapper = styled('div')`
  display: flex;
  flex-wrap: no-wrap;
  justify-content: space-between;
  gap: ${themeMui.spacing(1)};
  font-size: ${theme.typography.smallFontSize};
  padding: ${themeMui.spacing(2)} 0;
  height: ${theme.layout.sectionNavHeight};
  @media (max-width: ${theme.layout.mediaQueryDesktop}) {
    flex-direction: column-reverse;
    height: auto;
  }
`
const NavSubWrapper = styled('div')`
  display: flex;
  gap: ${themeMui.spacing(2)};
`

const QuestionNav = ({ isFormSaving, isFormSaveError, onFormSave, currentSection }) => {
  const [isPrivacySaveError, setIsPrivacySaveError] = useState(false)
  const [isPrivacySaving, setIsPrivacySaving] = useState(false)
  const [sectionPrivacy, setSectionPrivacy] = useState()
  const [siteFromApi, setSiteFromApi] = useState()
  const { siteId } = useParams()
  const currentSectionNameIndex = SECTION_NAMES.indexOf(currentSection)
  const isFormPrivacyDisabled = currentSection === 'project-details'
  const nextSection = SECTION_NAMES[currentSectionNameIndex + 1]
  const previousSection = SECTION_NAMES[currentSectionNameIndex - 1]
  const sectionIdForApi = currentSectionNameIndex + 1
  const siteUrl = `${process.env.REACT_APP_API_URL}/sites/${siteId}`

  useEffect(
    function getSiteInfoToUseWithAPutRequestToUpdateSitePrivacySincePatchDoesntWork() {
      // A tech debt ticket has been created to have the api accept a patch for section privacy,
      // instead of the front end having to do a PUT with all the site info.
      // https://github.com/globalmangrovewatch/gmw-users/issues/260
      axios.get(siteUrl).then(({ data }) => {
        setSiteFromApi(data)
        setSectionPrivacy(data.section_data_visibility?.[sectionIdForApi])
      })
    },
    [siteUrl, sectionIdForApi]
  )

  const handleOnPrivacyChange = (event) => {
    setIsPrivacySaveError(false)
    setIsPrivacySaving(true)
    if (siteFromApi && !isFormPrivacyDisabled) {
      const siteWithUpdatedSectionPrivacy = {
        ...siteFromApi,
        section_data_visibility: {
          ...siteFromApi.section_data_visibility,
          [sectionIdForApi]: event.target.value
        }
      }
      axios
        .put(siteUrl, siteWithUpdatedSectionPrivacy)
        .then((response) => {
          setSectionPrivacy(response.data.section_data_visibility[sectionIdForApi])
          setIsPrivacySaving(false)
          toast.success(componentLanguage.privacySavingSuccess)
        })
        .catch(() => {
          setIsPrivacySaveError(true)
          setIsPrivacySaving(false)
          setSectionPrivacy(siteFromApi.section_data_visibility[sectionIdForApi])
        })
    } else {
      setIsPrivacySaveError(true)
      setIsPrivacySaving(false)
    }
  }

  return (
    <>
      <LoadingIndicatorOverlay isVisible={isPrivacySaving} />
      <StickyStack>
        <NavWrapper>
          <NavSubWrapper>
            <LinkLooksLikeButtonSecondary to={`/sites/${siteId}/overview`}>
              <ArrowBack /> <NavButtonText>{componentLanguage.returnToSite}</NavButtonText>
            </LinkLooksLikeButtonSecondary>
            <LinkLooksLikeButtonSecondary
              to={!previousSection ? '#' : `/sites/${siteId}/form/${previousSection}`}
              disabled={!previousSection}>
              <ArrowBackIosNew />
              <NavButtonText>{componentLanguage.previousSection}</NavButtonText>
            </LinkLooksLikeButtonSecondary>
            <LinkLooksLikeButtonSecondary
              to={!nextSection ? '#' : `/sites/${siteId}/form/${nextSection}`}
              disabled={!nextSection}>
              <NavButtonText>{componentLanguage.nextSection}</NavButtonText>
              <ArrowForwardIos />
            </LinkLooksLikeButtonSecondary>
          </NavSubWrapper>
          <NavSubWrapper>
            <PrivacySelect
              id='form-privacy'
              defaultValue={''}
              value={sectionPrivacy}
              onChange={handleOnPrivacyChange}
              disabled={isFormPrivacyDisabled}>
              <option value={''} disabled>
                {componentLanguage.privacySelectUndefined}
              </option>
              <option value={PRIVACY_VALUES.private}>{language.sectionPrivacy.private}</option>
              <option value={PRIVACY_VALUES.public}>{language.sectionPrivacy.public}</option>
            </PrivacySelect>
            <ButtonSave isSaving={isFormSaving} onClick={onFormSave} />
          </NavSubWrapper>
        </NavWrapper>
        {isFormSaveError ? <ErrorText>{language.error.submit}</ErrorText> : null}
        {isPrivacySaveError ? <ErrorText>{componentLanguage.privacySaveError}</ErrorText> : null}
      </StickyStack>
    </>
  )
}

QuestionNav.propTypes = {
  currentSection: PropTypes.string.isRequired,
  isFormSaving: PropTypes.bool.isRequired,
  isFormSaveError: PropTypes.bool.isRequired,
  onFormSave: PropTypes.func.isRequired
}

export default QuestionNav
