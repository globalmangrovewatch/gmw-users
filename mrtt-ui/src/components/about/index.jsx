import PropTypes from 'prop-types'
import { Dialog, Box, Typography } from '@mui/material'

import { AboutParagraph, ExternalLink, Highlight, List, ListItem } from './styles'

const AboutDialogContent = ({ isOpen, setIsOpen, onSuccess }) => {
  const onClose = () => {
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <Box p={4} width={400}>
        <Typography variant='h6' gutterBottom>
          About the Mangrove Restoration Tracker Tool (MRTT)
        </Typography>

        <Box>
          <AboutParagraph>
            The MRTT is an open-access resource to support restoration practitioners. It provides a
            secure location to hold information across restoration planning, intervention and
            monitoring.
          </AboutParagraph>
          <AboutParagraph>
            Users are guided into recording key variables and supported to use a common language and
            definitions, helping to improve data coverage and consistency in restoration work
            world-wide.
          </AboutParagraph>
          <AboutParagraph>
            Once you’ve registered and logged into the MRTT, the portal will provide a series of
            questions to record information through the lifetime of a mangrove restoration project,
            covering:
          </AboutParagraph>
          <List>
            <ListItem>Site background and pre-restoration baseline.</ListItem>
            <ListItem>The restoration interventions and project costs.</ListItem>
            <ListItem>
              Post-restoration monitoring that incorporates both socio-economic and ecological
              factors.
            </ListItem>
          </List>
          <AboutParagraph>
            The MRTT can record both historical and current restoration projects.
          </AboutParagraph>
          <AboutParagraph>
            For support on how to enter data into the MRTT please see the{' '}
            <ExternalLink
              to='https://www.mangrovealliance.org/wp-content/uploads/2023/07/MRTT-Guide-v15.pdf'
              rel='noreferrer'
              target='_blank'>
              user guide
            </ExternalLink>{' '}
            (also available in English, French, Spanish, Bahasa Indonesia, Portuguese, Swahili, and
            Arabic), which provides step-by-step instructions. The user guide also describes the
            different question types and provides an overview of each question.
          </AboutParagraph>
          <AboutParagraph>
            For questions and potential training opportunities please email:{' '}
            <Highlight>contact@globalmangrovewatch.org</Highlight>
          </AboutParagraph>
        </Box>
      </Box>
    </Dialog>
  )
}

export default AboutDialogContent
AboutDialogContent.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  onSuccess: PropTypes.func
}
