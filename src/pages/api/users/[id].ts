import type { NextApiHandler } from 'next'
import { validate as isValidEmail } from 'email-validator'
import { prisma } from '$lib/prisma'
import { User } from '@prisma/client'

export type UserResponse = { user: Omit<User, 'id'> } | { error: string }

const handler: NextApiHandler<UserResponse> = async (req, res) => {
  const email = req.query.email as string
  if (!isValidEmail(email))
    return res.status(400).json({ error: 'Invalid email' })

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      email: true,
      active: true,
    },
  })

  if (!user) return res.status(404).json({ error: 'User not found' })

  return res.json({ user })
}

export default handler
