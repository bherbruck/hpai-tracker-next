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
import type { HpaiCaseGeometry, Stats } from '$lib/types'
import { useState } from 'react'

const Home: NextPage = (props) => {
  const statsModal = useModal()
  const aboutModal = useModal()
  const subscribeModal = useModal()
  const selectionModal = useModal()

  // maybe load this server-side?
  const { data: hpaiCaseGeometries } = useSWR<HpaiCaseGeometry[]>(
    '/api/hpai-case-geometry',
    (url: string) => fetch(url).then((r) => r.json())
  )

  const { data: stats } = useSWR<Stats>('/api/stats', (url: string) =>
    fetch(url).then((r) => r.json())
  )

  const [selectedHpaiCases, setSelectedHpaiCases] = useState<HpaiCaseGeometry>()

  const handleSelection = (hpaiCases: HpaiCaseGeometry) => {
    setSelectedHpaiCases(hpaiCases)
    selectionModal.open()
  }

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
        onStatsClick={() => statsModal.open()}
        onAboutClick={() => aboutModal.open()}
        onSubscribeClick={() => subscribeModal.open()}
      />

      <StatsModal
        {...statsModal}
        hpaiCases={hpaiCaseGeometries}
        stats={stats}
      />

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
        />
      </div>
    </div>
  )
}

export default Home
