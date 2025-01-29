import type { NextApiHandler } from 'next'
import { prisma } from '$lib/prisma'
import { HpaiCase } from '@prisma/client'
import { methodHandler } from '$lib/method-handler'

const get: NextApiHandler = async (req, res) => {
  const filterStart = new Date(new Date().setDate(new Date().getDate() - 7))

  // only active or new cases (WOAH non-poultry are released same day as confirmed)
  const filter = {
    OR: [
      {
        dateReleased: null,
      },
      {
        AND: [
          { dateReleased: { equals: prisma.hpaiCase.fields.dateConfirmed } },
          { dateReleased: { gte: filterStart } },
        ],
      },
    ],
  }

  const group = await prisma.hpaiCase.groupBy({
    // where: filter,
    by: ['state', 'county'],
  })
  const cases = await prisma.hpaiCase.findMany({
    // where: filter,
  })

  const groupedCases = await Promise.all(
    group.map(async ({ state, county }) => {
      const countyCases = cases.filter(
        ({ state: caseState, county: caseCounty }) =>
          state === caseState && county === caseCounty,
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
    }),
  )

  return res.json(groupedCases)
}

export default methodHandler<HpaiCase[]>({ get })
