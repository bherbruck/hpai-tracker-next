import { prisma } from '$lib/prisma'
import { fetchHpaiCases } from './fetch-hpai-cases'

export async function scrapeHpaiCases(url: string) {
  console.log(`fetching hpai cases...`)

  const hpaiCases = await fetchHpaiCases(url)

  const existingHpaiCaseCount = await prisma.hpaiCase.count()

  const newHpaiCases = hpaiCases.slice(existingHpaiCaseCount)

  console.log(`${newHpaiCases.length} new cases found`)

  if (newHpaiCases.length <= 0) return newHpaiCases

  const { count: createdCount } = await prisma.hpaiCase.createMany({
    data: newHpaiCases as any,
  })

  console.log(`${createdCount} new cases created`)

  return newHpaiCases
}
