import { parse } from 'papaparse'
import { HpaiCaseInput } from '$lib/types'

type InputCsv = {
  Confirmed: string
  State: string
  'County Name': string
  'Special Id': string
  Production: string
  Released: string
  'Measure Names': string
  'Birds Affected': string
}

export function parseRawData(data: InputCsv): HpaiCaseInput {
  const flockSize = Number(
    data['Birds Affected'].toString().split(',').join('')
  )
  const dateReleased =
    data['Released'] === 'Active' ? null : new Date(data['Released'])
  return {
    dateConfirmed: new Date(data['Confirmed']),
    state: data.State,
    county: data['County Name'],
    flockType: data['Production'],
    flockSize: isNaN(flockSize) ? null : flockSize,
    dateReleased: dateReleased,
    name: `${data['State']} ${data['Special Id']}`,
    pressReleaseUrl: null,
  }
}

export function parseCsv(csvText: string): HpaiCaseInput[] {
  const rawData = parse<InputCsv>(csvText.trim(), {
    quoteChar: `"`,
    header: true,
  }).data
  const processedData = rawData.map(parseRawData)
  return processedData
}
