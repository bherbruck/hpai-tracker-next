import { PrismaClient, Prisma } from '@prisma/client'
import type { CountyGeoJSON } from './types'
import data from './data.json'

const prisma = new PrismaClient()

export const seed = async () => {
  const counties = (data as CountyGeoJSON).features.map((feature) => {
    const { name: county, state_name: state } = feature.properties
    return {
      county,
      state,
      geometry: feature.geometry,
    }
  }) as Prisma.CountyGeometryCreateInput[]

  await prisma.countyGeometry.createMany({
    data: counties,
    skipDuplicates: true,
  })
}
