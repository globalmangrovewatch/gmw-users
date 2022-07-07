import { action } from '@storybook/addon-actions'

import React, { useState } from 'react'

import ConfirmPrompt from './ConfirmPrompt'

export default {
  title: 'ConfirmPrompt',
  component: ConfirmPrompt
}

export const Basic = () => {
  const [isOpen, setIsOpen] = useState(true)
  return (
    <ConfirmPrompt
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title='X'
      promptText='Should X bla bla bla bla bla bjkdls dshjkf ashj sfhjaskf ashjk?'
      confirmButtonText='Do it!'
      onConfirm={action('confirmed')}
    />
  )
}
