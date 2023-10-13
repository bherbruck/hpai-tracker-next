import type { NextApiHandler } from 'next'
import { validate as isValidEmail } from 'email-validator'
import { prisma } from '$lib/prisma'
import { User } from '@prisma/client'
import { Resend } from 'resend'
import { SubscribeEmail } from '$components/email/subscribe-email'

export type UserResponse = { user: Omit<User, 'id'> } | { error: string }

const handler: NextApiHandler<UserResponse> = async (req, res) => {
  const resendApiKey = process.env.RESEND_API_KEY
  if (!resendApiKey) return { error: 'Email not implemented' }

  const { email } =
    typeof req.body === 'string' ? JSON.parse(req.body) : req.body.email
  if (!isValidEmail(email))
    return res.status(400).json({ error: 'Invalid email' })

  const existingUser = await prisma.user.findUnique({ where: { email } })

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email },
  })

  if (!existingUser?.active) {
    if (!req.headers.host)
      return res.status(500).json({ error: 'Error sending confirmation email' })

    const confirmationUrl = `http://${req.headers.host}/confirm/${user.id}`

    const resend = new Resend(resendApiKey)

    try {
      // @ts-ignore
      await resend.emails.send({
        from: 'HPAI Tracker <no-reply@hpai-tracker.com>',
        to: user.email,
        subject: 'Confirm your HPAI Tracker subscription',
        react: SubscribeEmail({ confirmationUrl }),
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Error sending confirmation email' })
    }
  }

  return res.json({ user: { email: user.email, active: user.active } })
}

export default handler
