import type { NextPage } from 'next'
import Head from 'next/head'
import Script from 'next/script'
import { Navbar } from '$components/Navbar'
import { Modal } from '$components/Modal'
import { useModal } from '$hooks/useModal'
import { StatsModal } from '$components/StatsModal'
import { SubscribeModal } from '$components/SubscribeModal'
import { SelectionModal } from '$components/SelectionModal'
import { Map } from '$components/map/ClientSideMap'
import useSWR from 'swr'
import type { HpaiCaseGeometry, HpaiCaseGeometryResponse } from '$lib/types'
import { useDebugValue, useState } from 'react'
import { useTheme } from '$hooks/useTheme'

const Home: NextPage = (props) => {
  const statsModal = useModal()
  const aboutModal = useModal()
  const subscribeModal = useModal()
  const selectionModal = useModal()

  // maybe load this server-side?
  const { data: hpaiCaseGeometries } = useSWR<HpaiCaseGeometry[]>(
    '/api/hpai-case-geometry',
    async (url: string) => {
      const json = (await (
        await fetch(url)
      ).json()) as HpaiCaseGeometryResponse[]
      return json.map((geometry) => ({
        ...geometry,
        cases: geometry.cases.map((hpaiCase) => ({
          ...hpaiCase,
          dateConfirmed: new Date(hpaiCase.dateConfirmed),
        })),
      }))
    }
  )

  useDebugValue(hpaiCaseGeometries)

  const [selectedHpaiCases, setSelectedHpaiCases] = useState<HpaiCaseGeometry>()

  const handleSelection = <T extends HpaiCaseGeometry>(hpaiCases: T) => {
    setSelectedHpaiCases(hpaiCases)
    selectionModal.open()
  }

  const { theme, setTheme } = useTheme()

  return (
    <div className="inset-0 absolute">
      <Head>
        <title>HPAI Tracker</title>
        <meta
          name="description"
          content="A map of all Highly Pathogenic Avian Influenza (HPAI) cases confirmed by USDA APHIS"
        />
        <link rel="icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="width=device-width, user-scalable=no"
        ></meta>
      </Head>

      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GTAG_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'GA_MEASUREMENT_ID');
        `}
      </Script>

      <Navbar
        theme={theme ?? 'light'}
        onToggleTheme={setTheme}
        onStatsClick={() => statsModal.open()}
        onAboutClick={() => aboutModal.open()}
        onSubscribeClick={() => subscribeModal.open()}
      />

      <StatsModal {...statsModal} hpaiCases={hpaiCaseGeometries} />

      <Modal {...aboutModal}>
        <h3 className="font-bold text-lg pb-4">About</h3>
        <p>
          HPAI Tracker is a free tool to map the locations of HPAI cases in the
          United States by county. Click on a county to see the cases in the
          selected county.
        </p>
        <p>
          Data is provided by{' '}
          <a className="link" href={process.env.NEXT_PUBLIC_HPAI_CSV_URL}>
            USDA APHIS
          </a>
        </p>
        <p>
          Source code is available at{' '}
          <a
            className="link"
            href="https://github.com/bherbruck/hpai-tracker-next"
          >
            github.com/bherbruck/hpai-tracker-next
          </a>
        </p>
      </Modal>

      <SubscribeModal {...subscribeModal} />

      <SelectionModal {...selectionModal} hpaiCases={selectedHpaiCases} />

      <div className="h-full w-full">
        <Map
          hpaiCaseGeometries={hpaiCaseGeometries}
          onCountyClick={handleSelection}
          theme={theme}
        />
      </div>
    </div>
  )
}

export default Home
