import { prisma } from '$lib/prisma'
import { fetchHpaiCases } from './fetch-hpai-cases'

export async function scrapeHpaiCases(url: string) {
  console.log(`fetching hpai cases...`)

  const hpaiCases = await fetchHpaiCases(url)
  const existingHpaiCaseCount = await prisma.hpaiCase.count()
  const newHpaiCases = hpaiCases.slice(existingHpaiCaseCount)

  /**
   * TODO:
   * - create a new table for the import
   * - run a diff on the new csv and the latest record in the import table
   * - insert new rows
   * - update existing rows
   * - delete rows? (not sure if this is necessary)
   */
  // since the data source is not reliable and not indexed, we need to
  // completely refresh the table to avoid duplicates
  await prisma.hpaiCase.deleteMany()
  await prisma.hpaiCase.createMany({ data: hpaiCases })

  console.log(`${newHpaiCases.length} new cases found`)

  return newHpaiCases
}
