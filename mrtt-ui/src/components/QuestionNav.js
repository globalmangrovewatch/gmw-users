import PropTypes from 'prop-types'
import React from 'react'

import { ArrowBack, ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material'
import { css, styled } from '@mui/system'
import { ErrorText, LinkLooksLikeButtonSecondary } from '../styles/typography'
import { Stack } from '@mui/material'
import { useParams } from 'react-router-dom'
import ButtonSave from './ButtonSave'
import language from '../language'
import SECTION_NAMES from '../constants/sectionNames'
import theme from '../styles/theme'
import themeMui from '../styles/themeMui'

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
        border: solid thin ${theme.color.lightGrey};
        color: ${theme.color.lightGrey};
      `
    : theme.hoverState(css`
        background-color: ${theme.color.primary};
        color: ${theme.color.white};
      `)};
`
const SelectDesktopNav = styled('select')`
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
    position: static;
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

const QuestionNav = ({ isSaving, isSaveError, onSave, currentSection }) => {
  const { siteId } = useParams()

  const currentSectionNameIndex = SECTION_NAMES.indexOf(currentSection)
  const previousSection = SECTION_NAMES[currentSectionNameIndex - 1]
  const nextSection = SECTION_NAMES[currentSectionNameIndex + 1]
  return (
    <StickyStack>
      <NavWrapper>
        <NavSubWrapper>
          <LinkLooksLikeButtonSecondary to={`/sites/${siteId}/overview`}>
            <ArrowBack /> <NavButtonText>{language.questionNav.returnToSite}</NavButtonText>
          </LinkLooksLikeButtonSecondary>
          <LinkLooksLikeButtonSecondary
            to={!previousSection ? '#' : `/sites/${siteId}/form/${previousSection}`}
            disabled={!previousSection}>
            <ArrowBackIosNew />
            <NavButtonText>{language.questionNav.previousSection}</NavButtonText>
          </LinkLooksLikeButtonSecondary>
          <LinkLooksLikeButtonSecondary
            to={!nextSection ? '#' : `/sites/${siteId}/form/${nextSection}`}
            disabled={!nextSection}>
            <NavButtonText>{language.questionNav.nextSection}</NavButtonText>
            <ArrowForwardIos />
          </LinkLooksLikeButtonSecondary>
        </NavSubWrapper>
        <NavSubWrapper>
          <SelectDesktopNav
            id='form-privacy'
            value={'Placeholder'}
            label='Placeholder (wip)'
            onChange={() => {}}>
            <option value={'Placeholder'}>WIP Value 1</option>
            <option value={20}>WIP Value 2</option>
          </SelectDesktopNav>
          <ButtonSave isSaving={isSaving} onClick={onSave} />
        </NavSubWrapper>
      </NavWrapper>
      {isSaveError && <ErrorText>{language.error.submit}</ErrorText>}
    </StickyStack>
  )
}

QuestionNav.propTypes = {
  currentSection: PropTypes.string.isRequired,
  isSaving: PropTypes.bool.isRequired,
  isSaveError: PropTypes.bool.isRequired,
  onSave: PropTypes.func.isRequired
}

export default QuestionNav
