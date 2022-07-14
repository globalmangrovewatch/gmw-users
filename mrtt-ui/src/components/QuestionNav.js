import { RowSpaceBetween } from '../styles/containers'
import PropTypes from 'prop-types'
import React from 'react'

import { ArrowBack, ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material'
import { css, styled } from '@mui/system'
import { ErrorText, LinkLooksLikeButtonSecondary } from '../styles/typography'
import { Link, useParams } from 'react-router-dom'
import { Stack } from '@mui/material'
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
const LinkMobileNav = styled(Link)`
  ${(props) => getMobileNavButtonSecondaryCss(props)}
`

const SelectMobileNav = styled('select')`
  ${(props) => getMobileNavButtonSecondaryCss(props)}
`

const ButtonMobileNav = styled('button')`
  ${(props) => getMobileNavButtonSecondaryCss(props)}
`

const SelectDesktopNav = styled('select')`
  ${(props) => getMobileNavButtonSecondaryCss(props)}
  border-radius: 4px;
  height: 100%;
  text-transform: uppercase;
  width: inherit;
`

const MobileQuestionNavWrapper = styled('div')`
  display: block;
  margin-bottom: ${themeMui.spacing(3)};
  @media (min-width: ${theme.layout.mediaQueryDesktop}) {
    display: none;
  }
`

const DesktopQuestionNavWrapper = styled('div')`
  align-items: stretch;
  display: flex;
  justify-content: space-between;
  margin-bottom: ${themeMui.spacing(5)};
  @media (max-width: ${theme.layout.mediaQueryDesktop}) {
    display: none;
  }
  & div > * {
    margin-right: ${themeMui.spacing(1)};
  }
`

const QuestionNav = ({ isSaving, isSaveError, onSave, currentSection }) => {
  const { siteId } = useParams()

  const currentSectionNameIndex = SECTION_NAMES.indexOf(currentSection)
  const previousSection = SECTION_NAMES[currentSectionNameIndex - 1]
  const nextSection = SECTION_NAMES[currentSectionNameIndex + 1]

  return (
    <Stack>
      <MobileQuestionNavWrapper>
        <RowSpaceBetween>
          <RowSpaceBetween>
            <LinkMobileNav to={`/sites/${siteId}/overview`}>
              <Stack>
                <ArrowBack />
              </Stack>
            </LinkMobileNav>
            <LinkMobileNav
              to={!previousSection ? '#' : `/sites/${siteId}/form/${previousSection}`}
              disabled={!previousSection}>
              <ArrowBackIosNew />
            </LinkMobileNav>
            <LinkMobileNav
              to={!nextSection ? '#' : `/sites/${siteId}/form/${nextSection}`}
              disabled={!nextSection}>
              <ArrowForwardIos />
            </LinkMobileNav>
          </RowSpaceBetween>
          <SelectMobileNav
            id='form-privacy'
            value={'Placeholder'}
            label='Placeholder (wip)'
            onChange={() => {}}>
            <option value={'Placeholder'}>Placeholder</option>
            <option value={20}>Other Placeholder</option>
          </SelectMobileNav>
          <ButtonSave isSaving={isSaving} onClick={onSave} component={ButtonMobileNav} />
        </RowSpaceBetween>
      </MobileQuestionNavWrapper>
      <DesktopQuestionNavWrapper>
        <div>
          <LinkLooksLikeButtonSecondary to={`/sites/${siteId}/overview`}>
            <ArrowBack /> {language.questionNav.returnToSite}
          </LinkLooksLikeButtonSecondary>
          <LinkLooksLikeButtonSecondary
            to={!previousSection ? '#' : `/sites/${siteId}/form/${previousSection}`}
            disabled={!previousSection}>
            <ArrowBackIosNew />
            {language.questionNav.previousSection}
          </LinkLooksLikeButtonSecondary>
          <LinkLooksLikeButtonSecondary
            to={!nextSection ? '#' : `/sites/${siteId}/form/${nextSection}`}
            disabled={!nextSection}>
            {language.questionNav.nextSection}
            <ArrowForwardIos />
          </LinkLooksLikeButtonSecondary>
          <SelectDesktopNav
            id='form-privacy'
            value={'Placeholder'}
            label='Placeholder (wip)'
            onChange={() => {}}>
            <option value={'Placeholder'}>WIP Value 1</option>
            <option value={20}>WIP Value 2</option>
          </SelectDesktopNav>
        </div>
        <ButtonSave isSaving={isSaving} onClick={onSave} />
      </DesktopQuestionNavWrapper>
      {isSaveError && <ErrorText>{language.error.submit}</ErrorText>}
    </Stack>
  )
}

QuestionNav.propTypes = {
  currentSection: PropTypes.string.isRequired,
  isSaving: PropTypes.bool.isRequired,
  isSaveError: PropTypes.bool.isRequired,
  onSave: PropTypes.func.isRequired
}

export default QuestionNav
