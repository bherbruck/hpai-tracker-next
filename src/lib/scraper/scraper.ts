import { prisma } from '$lib/prisma'
import { fetchHpaiCases } from './fetch-hpai-cases'
import type { HpaiCase } from '$lib/types'

export async function scrapeHpaiCases(url: string) {
  console.log(`fetching hpai cases...`)

  const hpaiCases = await fetchHpaiCases(url)

  const newHpaiCases = hpaiCases.reduce(async (newHpaiCases, hpaiCase) => {
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
  }, Promise.resolve([] as HpaiCase[]))

  return newHpaiCases
}
