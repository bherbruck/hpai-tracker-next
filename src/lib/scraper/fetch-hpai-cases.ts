import { parseCsv } from './parseCsv'

export async function fetchHpaiCases(url: string) {
  const res = await fetch(url, { method: 'GET' })
  const csvText = await res.text()
  const hpaiCases = parseCsv(csvText)
  return hpaiCases
}
