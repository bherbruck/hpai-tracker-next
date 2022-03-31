import type { HpaiCase } from '@prisma/client'
import type { GeoJSON } from 'geojson'

export type ClientSideHpaiCase = Omit<HpaiCase, 'dateConfirmed'> & {
  dateConfirmed: string
}
export type HpaiCaseInput = Omit<HpaiCase, 'id'>
export type HpaiCaseGeometry = {
  state: string
  county: string
  cases: ClientSideHpaiCase[]
  geoJSON: GeoJSON
}

export type Stats = {
  totalCases: number
  totalDeaths: number
  affectedStates: number
  affectedCounties: number
}

export type CumulativeHpaiCase = {
  dateConfirmed: string
  flockSize: number
}
