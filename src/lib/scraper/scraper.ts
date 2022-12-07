import { prisma } from '$lib/prisma'
import { fetchHpaiCases } from './fetch-hpai-cases'
import type { HpaiCase } from '$lib/types'

export async function scrapeHpaiCases(url: string) {
  console.log(`fetching hpai cases...`)

  const hpaiCases = await fetchHpaiCases(url)

  const newHpaiCases = await hpaiCases.reduce(
    async (newHpaiCases, hpaiCase) => {
      const existingHpaiCase = await prisma.hpaiCase.findUnique({
        where: { name: hpaiCase.name },
      })
      const newHpaiCase = await prisma.hpaiCase.upsert({
        where: { name: hpaiCase.name },
        create: hpaiCase,
        update: hpaiCase,
      })

      return existingHpaiCase
        ? await newHpaiCases
        : [...(await newHpaiCases), newHpaiCase]
    },
    Promise.resolve([] as HpaiCase[])
  )

  // delete existing hpai cases that are no longer in the list
  const existingHpaiCases = await prisma.hpaiCase.findMany()
  const existingHpaiCaseNames = existingHpaiCases.map((c) => c.name)
  const newHpaiCaseNames = hpaiCases.map((c) => c.name)
  const deletedHpaiCaseNames = existingHpaiCaseNames.filter(
    (name) => !newHpaiCaseNames.includes(name)
  )
  // await prisma.hpaiCase.deleteMany({
  //   where: { name: { in: deletedHpaiCaseNames } },
  // })

  return { newHpaiCases, deletedHpaiCaseNames }
}
