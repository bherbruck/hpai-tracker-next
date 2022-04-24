import { chromium } from 'playwright'

const main = async () => {
  const browser = await chromium.launch({
    headless: true,
  })
  const context = await browser.newContext()
  const page = await context.newPage()

  // TODO: find out how to pass this url in as an action secret
  await page.goto(
    'https://publicdashboards.dl.usda.gov/t/MRP_PUB/views/VS_Avian_HPAIConfirmedDetections2022/HPAI2022ConfirmedDetections'
  )

  await page
    .locator(
      '#tabZoneId101 .tab-zone-margin .tab-zone-padding .tab-tiledViewer .tab-clip .tab-tvTLSpacer img'
    )
    .click()

  await page.locator('[aria-label="Download"]').click()

  const [dataPage] = await Promise.all([
    page.waitForEvent('popup'),
    page.locator('div[role="dialog"] >> text=Data').click(),
  ])

  const link = await dataPage
    .locator('.csvLink_summary')
    .first()
    .getAttribute('href')

  console.log(link)

  await dataPage.close()
  await context.close()
  await browser.close()
}

main()
