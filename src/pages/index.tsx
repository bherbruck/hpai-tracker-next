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
import { useDebugValue, useMemo, useState } from 'react'
import { useTheme } from '$hooks/useTheme'
import { FilterBar } from '$components/FilterBar'

type Filters = {
  Commercial: boolean
  Backyard: boolean
  Layer: boolean
  Turkey: boolean
  Broiler: boolean
}

const filterHpaiCases = (
  hpaiCases: HpaiCaseGeometry[],
  filters: string[]
): HpaiCaseGeometry[] => {
  if (filters.length === 0) return hpaiCases
  const filteredGeometries = hpaiCases.reduce((acc, cur) => {
    const filteredCases = {
      ...cur,
      cases: cur.cases.filter((hpaiCase) =>
        filters.some((filter) => hpaiCase.flockType.includes(filter))
      ),
    } as HpaiCaseGeometry

    return [
      ...acc,
      filteredCases.cases.length > 0 ? filteredCases : undefined,
    ].filter((value) => value) as HpaiCaseGeometry[]
  }, [] as HpaiCaseGeometry[])

  return filteredGeometries
}

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
          dateReleased: hpaiCase.dateReleased
            ? new Date(hpaiCase.dateReleased)
            : null,
          dateCreated: hpaiCase.dateCreated
            ? new Date(hpaiCase.dateCreated)
            : null,
          dateUpdated: hpaiCase.dateUpdated
            ? new Date(hpaiCase.dateUpdated)
            : null,
        })),
      }))
    }
  )

  const [filters, setFilters] = useState<Filters>({
    Commercial: false,
    Backyard: false,
    Layer: false,
    Turkey: false,
    Broiler: false,
  })

  const filteredHpaiCaseGeometries = useMemo(
    () =>
      filterHpaiCases(
        hpaiCaseGeometries ?? [],
        Object.entries(filters)
          .filter(([, isActive]) => isActive)
          .map(([key]) => key)
      ),
    [filters, hpaiCaseGeometries]
  )

  const [selectedHpaiCases, setSelectedHpaiCases] = useState<HpaiCaseGeometry>()

  const handleSelection = <T extends HpaiCaseGeometry>(hpaiCases: T) => {
    setSelectedHpaiCases(hpaiCases)
    selectionModal.open()
  }

  const { theme, setTheme } = useTheme()

  useDebugValue(hpaiCaseGeometries)
  useDebugValue(filteredHpaiCaseGeometries)
  useDebugValue(selectedHpaiCases)
  useDebugValue(theme)

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

      <FilterBar
        className="absolute bottom-0 p-4 flex-wrap-reverse z-[999999]"
        booleanFilters={Object.keys(filters).reduce((acc, cur) => {
          return {
            ...acc,
            [cur]: (isActive: boolean) =>
              setFilters({ ...filters, [cur]: isActive }),
          }
        }, {})}
      />

      <Navbar
        theme={theme ?? 'light'}
        onToggleTheme={setTheme}
        onStatsClick={() => statsModal.open()}
        onAboutClick={() => aboutModal.open()}
        onSubscribeClick={() => subscribeModal.open()}
      />

      <StatsModal {...statsModal} hpaiCases={filteredHpaiCaseGeometries} />

      <Modal {...aboutModal}>
        <h3 className="font-bold text-lg pb-4">About</h3>
        <p>
          HPAI Tracker is a free tool to map the locations of HPAI cases in the
          United States by county. Click on a county to see the cases in the
          selected county.
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
          hpaiCaseGeometries={filteredHpaiCaseGeometries}
          onCountyClick={handleSelection}
          theme={theme}
        />
      </div>
    </div>
  )
}

export default Home
