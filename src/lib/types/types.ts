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
