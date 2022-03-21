import { methodHandler } from '$lib/method-handler'
import { prisma } from '$lib/prisma'
import type { NextApiHandler } from 'next'

const get: NextApiHandler = async (req, res) => {
  const id = req.query.id as string
  const existingUser = await prisma.user.findUnique({ where: { id } })
  if (!existingUser) return res.status(404).json({ error: 'User not found' })

  const user = await prisma.user.update({
    where: { id },
    data: { active: true },
  })

  return res.json({ user })
}

export default methodHandler({ get })
