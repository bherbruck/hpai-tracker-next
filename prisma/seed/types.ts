export type CountyGeoJSON = {
  type: string
  features: Feature[]
}

export type Feature = {
  type: string
  geometry: Geometry
  properties: Properties
}

export type Geometry = {
  type: string
  coordinates: Coordinate[][][]
}

export type Coordinate = number[] | number

export type Properties = {
  intptlat: string
  countyfp_nozero: string
  countyns: string
  stusab: string
  csafp?: string
  state_name: string
  aland: number
  geoid: string
  namelsad: string
  countyfp: string
  awater: number
  classfp: string
  lsad: string
  name: string
  funcstat: string
  cbsafp?: string
  intptlon: string
  statefp: string
  mtfcc: string
  geo_point_2d: number[]
  metdivfp?: string
}
