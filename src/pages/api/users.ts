import type { NextApiHandler } from 'next'
import { validate as isValidEmail } from 'email-validator'
import { sendEmail } from '$lib/email'
import { prisma } from '$lib/prisma'
import { User } from '@prisma/client'
import { methodHandler } from '$lib/method-handler'

export type UserResponse = { user: Omit<User, 'id'> } | { error: string }

const post: NextApiHandler<UserResponse> = async (req, res) => {
  const { email } = JSON.parse(req.body)
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

    const confirmationUrl = `http://${new URL(req.headers.host)}/confirm/${user.id}`

    console.log(confirmationUrl)

    const { error } = await sendEmail({
      to: user.email,
      subject: 'Confirm your HPAI Tracker subscription',
      html: `
      <p>
        Hi ${user.email},
      </p>
      <p>
        Thank you for subscribing to HPAI Tracker.
      </p>
      <p>
        Please confirm your subscription by clicking the link below.
      </p>
      <p>
        <a href="${confirmationUrl}">
          Confirm subscription
        </a>
      </p>
      <p>
        If you did not request this, please ignore this email.
      </p>
    `,
    })

    if (error) {
      console.error(error)
      return res.status(500).json({ error: 'Error sending confirmation email' })
    }
  }

  return res.json({ user: { email: user.email, active: user.active } })
}

const del: NextApiHandler<UserResponse> = async (req, res) => {
  const { email } = JSON.parse(req.body)
  if (!isValidEmail(email))
    return res.status(400).json({ error: 'Invalid email' })

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (!existingUser) return res.status(404).json({ error: 'User not found' })

  const user = await prisma.user.update({
    where: { email },
    data: { active: false },
    select: {
      email: true,
      active: true,
    },
  })

  return res.json({ user })
}

export default methodHandler<UserResponse>({ post, del })
