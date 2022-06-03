import React from 'react'
import MobileFooter from './MobileFooter'
import { withRouter } from 'storybook-addon-react-router-v6'

export default {
  title: 'Layouts/Mobile Footer',
  decorators: [withRouter],
  component: MobileFooter
}

const Template = (args) => <MobileFooter {...args} />

export const Primary = Template.bind({})

Primary.args = {}
