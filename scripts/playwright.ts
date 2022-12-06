import { chromium } from 'playwright'

const URL =
  'https://www.aphis.usda.gov/aphis/ourfocus/animalhealth/animal-disease-information/avian/avian-influenza/hpai-2022/2022-hpai-commercial-backyard-flocks'

const TIMES_TO_SCROLL = 5

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const main = async () => {
  const browser = await chromium.launch({
    headless: true,
  })
  const context = await browser.newContext()
  const page = await context.newPage()

  await page.goto(URL)

  // scroll down to the map (it's not visible until you scroll down)
  await page.mouse.wheel(0, 100_000)

  // scroll up and down a few times to make sure the map loads
  // there is a strange bug where the dashboard loads different "versions" data
  for (let i = 0; i < TIMES_TO_SCROLL; i++) {
    await page.mouse.wheel(0, -100)
    await sleep(1000)
    await page.mouse.wheel(0, 100)
    await sleep(1000)
  }

  await page
    .frameLocator('iframe')
    .locator(
      '#tabZoneId101 > .tab-zone-margin > .tab-zone-padding > .tab-tiledViewer > .tab-clip > .tab-tvTLSpacer > img'
    )
    .click()

  await page
    .frameLocator('iframe')
    .getByRole('toolbar', { name: 'Visualization controls' })
    .getByRole('button', { name: 'Download' })
    .click()

  const [dataPage] = await Promise.all([
    page.waitForEvent('popup'),
    page
      .frameLocator('iframe')
      .getByRole('menuitem', { name: 'Data' })
      .getByText('Data')
      .click(),
  ])

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
