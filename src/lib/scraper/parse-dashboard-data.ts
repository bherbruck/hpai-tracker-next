import { HpaiCaseInput, TableauExportData } from '$lib/types'

export function parseDashboardData(data: TableauExportData): HpaiCaseInput {
  const flockSize = Number(
    data['AGG(Birds Affected)'].toString().split(',').join(''),
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
