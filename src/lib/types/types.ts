import type { HpaiCase as PrimaHpaiCase } from '@prisma/client'
import type { GeoJSON } from 'geojson'

export type HpaiCase = PrimaHpaiCase

export type ClientSideHpaiCase = Omit<HpaiCase, 'dateConfirmed'> & {
  dateConfirmed: string
}

export type HpaiCaseInput = Omit<HpaiCase, 'id'>

export type HpaiCaseGeometry = {
  state: string
  county: string
  cases: HpaiCase[]
  geoJSON: GeoJSON
}

export type HpaiCaseGeometryResponse = Omit<HpaiCaseGeometry, 'cases'> & {
  cases: ClientSideHpaiCase[]
}

export type Stats = {
  totalCases: number
  totalDeaths: number
  affectedStates: number
  affectedCounties: number
}

export type CumulativeHpaiCase = {
  dateConfirmed: Date
  flockSize: number
}
