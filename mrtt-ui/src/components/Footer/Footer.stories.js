import React from 'react'
import { withRouter } from 'storybook-addon-react-router-v6'

import Footer from './Footer'

export default {
  title: 'Layouts/Footer',
  component: Footer,
  decorators: [withRouter]
}

const Template = (args) => <Footer {...args} />

export const Primary = Template.bind({})

Primary.args = {}
