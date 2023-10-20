import type { HpaiCase as PrimaHpaiCase } from '@prisma/client'
import type { GeoJSON } from 'geojson'

export type HpaiCase = PrimaHpaiCase

export type ClientSideHpaiCase = Omit<
  HpaiCase,
  'dateConfirmed' | 'dateReleased' | 'dateCreated' | 'dateUpdated'
> & {
  dateConfirmed: string
  dateReleased?: string
  dateCreated?: string
  dateUpdated?: string
}

export type HpaiCaseInput = Omit<HpaiCase, 'id' | 'dateCreated' | 'dateUpdated'>

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

export type TableauExportData = {
  Confirmed: string
  State: string
  'County Name': string
  'Special Id': string
  Production: string
  'Control Area Released': string
  'Measure Names': string
  'AGG(Birds Affected)': string
}
