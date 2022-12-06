import { chromium } from 'playwright'

const main = async () => {
  const browser = await chromium.launch({
    headless: true,
  })
  const context = await browser.newContext()
  const page = await context.newPage()

  await page.goto(
    'https://www.aphis.usda.gov/aphis/ourfocus/animalhealth/animal-disease-information/avian/avian-influenza/hpai-2022/2022-hpai-commercial-backyard-flocks'
  )

  // scroll down to the map
  await page.mouse.wheel(0, 100_000)

  // wait for the map to load
  await page
    .frameLocator('iframe')
    .locator(
      '#tabZoneId101 > .tab-zone-margin > .tab-zone-padding > .tab-tiledViewer > .tab-clip > .tab-tvTLSpacer > img'
    )
    .click()

  // wait for the download button to load
  await page
    .frameLocator('iframe')
    .getByRole('toolbar', { name: 'Visualization controls' })
    .getByRole('button', { name: 'Download' })
    .click()

  // wait for the data popup page to load
  const [dataPage] = await Promise.all([
    page.waitForEvent('popup'),
    page
      .frameLocator('iframe')
      .getByRole('menuitem', { name: 'Data' })
      .getByText('Data')
      .click(),
  ])

  // wait for the download to start
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    dataPage.getByRole('button', { name: 'Download' }).click(),
  ])

  console.log(download.url())

  // ---------------------
  await context.close()
  await browser.close()
}

main()
