import type { NextApiHandler } from 'next'
import { validate as isValidEmail } from 'email-validator'
import { prisma } from '$lib/prisma'
import { User } from '@prisma/client'

export type UserResponse = { user: Omit<User, 'id'> } | { error: string }

const handler: NextApiHandler<UserResponse> = async (req, res) => {
  const { email } =
    typeof req.body === 'string' ? JSON.parse(req.body) : req.body.email
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

export default handler
