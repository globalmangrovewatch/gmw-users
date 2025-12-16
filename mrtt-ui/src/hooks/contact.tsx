import express from 'express'
import { Resend } from 'resend'

const router = express.Router()
const recipients = []
interface ContactEmailProps {
  name: string
  email: string
  message: string
}

const resend = new Resend(process.env.RESEND_API_KEY)

router.post('/contact', async (req, res) => {
  const { name, email, message } = req.body as ContactEmailProps

  try {
    const { data, error } = await resend.emails.send({
      from: 'GMW <noreply@globalmangrovewatch.org>',
      to: ['maria.luena@vizzuality.com'],
      subject: `New message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    })

    if (error) {
      console.error('Resend error:', error)
      return res.status(400).json({ error: 'Failed to send email' })
    }

    res.status(200).json({ message: 'Email sent successfully', data })
  } catch (err) {
    console.error('Server error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
