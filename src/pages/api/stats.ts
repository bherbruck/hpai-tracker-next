import type { NextApiHandler } from 'next'
import { prisma } from '$lib/prisma'
import { methodHandler } from '$lib/method-handler'
import type { Stats } from '$lib/types'

const get: NextApiHandler<Stats> = async (req, res) => {
  const totalCases = await prisma.hpaiCase.count()
  const totalDeaths =
    (await prisma.hpaiCase.aggregate({ _sum: { flockSize: true } }))._sum
      .flockSize ?? 0
  const affectedStates = (await prisma.hpaiCase.groupBy({ by: ['state'] }))
    .length
  const affectedCounties = (await prisma.hpaiCase.groupBy({ by: ['county'] }))
    .length
  return res.json({
    totalCases,
    totalDeaths,
    affectedStates,
    affectedCounties,
  })
}

export default methodHandler<Stats>({ get })
