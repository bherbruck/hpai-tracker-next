import { parse } from 'papaparse'
import { HpaiCaseInput } from '$lib/types'

type InputCsv = {
  Confirmed: string
  State: string
  'County Name': string
  'Special Id': string
  Production: string
  'Control Area Released': string
  'Measure Names': string
  'Birds Affected': string
}

export function parseRawData(data: InputCsv): HpaiCaseInput {
  const flockSize = Number(
    data['Birds Affected'].toString().split(',').join('')
  )

  // if Control Area Released is 'NA', then dateReleased is dateConfirmed
  // if Control Area Released is 'Active', then dateReleased is null
  // if Control Area Released is a date, then dateReleased is that date
  const dateReleased = () => {
    if (data['Control Area Released'] === 'NA')
      return new Date(data['Confirmed'])
    else if (data['Control Area Released'] === 'Active') return null
    else return new Date(data['Control Area Released'])
  }

  return {
    dateConfirmed: new Date(data['Confirmed']),
    state: data.State,
    county: data['County Name'],
    flockType: data['Production'],
    flockSize: isNaN(flockSize) ? null : flockSize,
    dateReleased: dateReleased(),
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
