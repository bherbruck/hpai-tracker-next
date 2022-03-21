import type { NextApiHandler } from 'next'
import { prisma } from '$lib/prisma'
import { HpaiCase } from '@prisma/client'
import { methodHandler } from '$lib/method-handler'

const get: NextApiHandler = async (req, res) => {
  const group = await prisma.hpaiCase.groupBy({
    by: ['state', 'county'],
  })
  const cases = await prisma.hpaiCase.findMany()

  const groupedCases = await Promise.all(
    group.map(async ({ state, county }) => {
      const countyCases = cases.filter(
        ({ state: caseState, county: caseCounty }) =>
          state === caseState && county === caseCounty
      )
      const geoJSON = (
        await prisma.countyGeometry.findUnique({
          where: {
            county_state: {
              county,
              state,
            },
          },
        })
      )?.geometry
      return {
        state,
        county,
        cases: countyCases,
        geoJSON,
      }
    })
  )

  return res.json(groupedCases)
}

export default methodHandler<HpaiCase[]>({ get })
