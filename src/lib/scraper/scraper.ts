import { prisma } from '$lib/prisma'
import { scrapeTableauData } from './scrape-tableau-data'
import type { HpaiCase, TableauExportData } from '$lib/types'
import { parseDashboardData } from './parse-dashboard-data'

export async function scrapeHpaiCases(baseUrl: string) {
  console.log(`fetching hpai cases...`)

  const rawHpaiCases = await scrapeTableauData<TableauExportData[]>(baseUrl)

  const hpaiCases = rawHpaiCases.map(parseDashboardData).flat()

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
    Promise.resolve([] as HpaiCase[]),
  )

  // delete existing hpai cases that are no longer in the list
  const existingHpaiCases = await prisma.hpaiCase.findMany()
  const existingHpaiCaseNames = existingHpaiCases.map((c) => c.name)
  const newHpaiCaseNames = hpaiCases.map((c) => c.name)
  const deletedHpaiCaseNames = existingHpaiCaseNames.filter(
    (name) => !newHpaiCaseNames.includes(name),
  )
  // await prisma.hpaiCase.deleteMany({
  //   where: { name: { in: deletedHpaiCaseNames } },
  // })

  return { newHpaiCases, deletedHpaiCaseNames }
}
