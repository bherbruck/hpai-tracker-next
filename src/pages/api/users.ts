import type { NextApiHandler } from 'next'
import { prisma } from '$lib/prisma'
import { User } from '@prisma/client'
import { validate as isValidEmail } from 'email-validator'
import { methodHandler } from '$lib/method-handler'

export type UserResponse = { user: User } | { error: string }

const post: NextApiHandler<UserResponse> = async (req, res) => {
  const { email } = JSON.parse(req.body)
  if (!isValidEmail(email))
    return res.status(400).json({ error: 'Invalid email' })

  const existingUser = await prisma.user.findUnique({ where: { email } })

  if (!existingUser || !existingUser.active) {
    // TODO: send email to user
  }

  const user = await prisma.user.upsert({
    where: { email },
    update: { active: true },
    create: { email, active: true },
  })

  return res.json({ user })
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
  })

  return res.json({ user })
}

export default methodHandler<UserResponse>({ post, del })
