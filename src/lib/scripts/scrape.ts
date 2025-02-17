import { scrapeHpaiCases } from '$lib/scraper/scraper'

const TABLEAU_BASE_URL =
  'https://publicdashboards.dl.usda.gov/vizql/t/MRP_PUB/w/VS_Avian_HPAIConfirmedDetections2022/v/HPAI2022ConfirmedDetections'

async function main() {
  const baseUrl = process.env.TABLEAU_BASE_URL ?? TABLEAU_BASE_URL

  console.log('refreshing...')

  const { newHpaiCases, deletedHpaiCaseNames } = await scrapeHpaiCases(baseUrl)

  console.log('refreshed')

  console.log(
    `new cases: ${newHpaiCases.length}, deleted cases: ${deletedHpaiCaseNames.length}`,
  )
}

main()
