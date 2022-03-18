import { parse } from 'papaparse'
import { HpaiCaseInput } from '$lib/types'

type InputCsv = {
  State: string
  County: string
  'Date Confirmed': string
  'Flock Type': string
  'Flock Size': string
}
export function parseRawData(data: InputCsv): HpaiCaseInput {
  const flockSize = Number(data['Flock Size'].toString().split(',').join(''))
  return {
    dateConfirmed: new Date(data['Date Confirmed']),
    state: data.State,
    county: data.County.split(' County')[0].trim(),
    flockType: data['Flock Type'],
    flockSize: isNaN(flockSize) ? null : flockSize,
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
