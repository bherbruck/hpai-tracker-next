import type { NextPage } from 'next'
import Head from 'next/head'
import Script from 'next/script'
import { Navbar } from '$components/Navbar'
import { Modal } from '$components/Modal'
import { useModal } from '$hooks/useModal'
import { StatsModal } from '$components/StatsModal'
import { SubscribeModal } from '$components/SubscribeModal'
import { SelectionModal } from '$components/SelectionModal'
import { ClientSideMap } from '$components/map/ClientSideMap'
import useSWR from 'swr'
import type {
  HpaiCase,
  HpaiCaseGeometry,
  HpaiCaseGeometryResponse,
} from '$lib/types'
import { useCallback, useMemo, useState } from 'react'
import { useTheme } from '$hooks/useTheme'
import { FilterBar } from '$components/FilterBar'
import { Loading } from '$components/Loading'
import { BMAC } from '$components/BMAC'

type Filters = {
  Commercial: boolean
  WOAH: boolean
  Layer: boolean
  Turkey: boolean
  Broiler: boolean
}

const INITIAL_FILTERS: Filters = {
  Commercial: false,
  WOAH: false,
  Layer: false,
  Turkey: false,
  Broiler: false,
}

const filterHpaiCases = (
  hpaiCases: HpaiCaseGeometry[],
  activeFilters: string[],
  filterOptions?: {
    recentOnly?: boolean
  },
): HpaiCaseGeometry[] => {
  if (!hpaiCases?.length) return []

  if (!activeFilters.length && !filterOptions?.recentOnly) return hpaiCases

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  return hpaiCases
    .map((geometry) => {
      const filteredCases = geometry.cases.filter((hpaiCase) => {
        const matchesCategory =
          !activeFilters.length ||
          activeFilters.some((filter) => hpaiCase.flockType.includes(filter))

        const isRecentOrActive =
          !filterOptions?.recentOnly ||
          !hpaiCase.dateReleased ||
          hpaiCase.dateConfirmed >= thirtyDaysAgo

        return matchesCategory && isRecentOrActive
      })

      return filteredCases.length ? { ...geometry, cases: filteredCases } : null
    })
    .filter((geometry): geometry is HpaiCaseGeometry => geometry !== null)
}

const Home: NextPage = () => {
  const statsModal = useModal()
  const aboutModal = useModal()
  const subscribeModal = useModal()
  const selectionModal = useModal()

  const { theme, setTheme } = useTheme()

  const { data: hpaiCaseGeometries } = useSWR<HpaiCaseGeometry[]>(
    '/api/hpai-case-geometry',
    async (url: string) => {
      const response = await fetch(url)
      const json = (await response.json()) as HpaiCaseGeometryResponse[]

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
    },
  )

  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS)
  const [selectedHpaiCases, setSelectedHpaiCases] = useState<HpaiCaseGeometry>()

  const activeFilters = useMemo(
    () =>
      Object.entries(filters).reduce<string[]>((acc, [key, isActive]) => {
        if (isActive) acc.push(key)
        return acc
      }, []),
    [filters],
  )

  const filteredHpaiCaseGeometries = useMemo(
    () => filterHpaiCases(hpaiCaseGeometries ?? [], activeFilters),
    [activeFilters, hpaiCaseGeometries],
  )

  const mapHpaiCaseGeometries = useMemo(
    () =>
      filterHpaiCases(hpaiCaseGeometries ?? [], activeFilters, {
        recentOnly: true,
      }),
    [activeFilters, hpaiCaseGeometries],
  )

  const handleSelection = useCallback(
    (hpaiCases: HpaiCaseGeometry) => {
      const sortedCases = [...hpaiCases.cases].sort(
        (a, b) => b.dateConfirmed.valueOf() - a.dateConfirmed.valueOf(),
      )
      setSelectedHpaiCases({ ...hpaiCases, cases: sortedCases })
      selectionModal.open()
    },
    [selectionModal],
  )

  const handleFilterChange = useCallback(
    (key: keyof Filters, value: boolean) => {
      setFilters((prev) => ({ ...prev, [key]: value }))
    },
    [],
  )

  const filterBarProps = useMemo(
    () => ({
      booleanFilters: Object.keys(INITIAL_FILTERS).reduce(
        (acc, key) => ({
          ...acc,
          [key]: (isActive: boolean) =>
            handleFilterChange(key as keyof Filters, isActive),
        }),
        {},
      ),
    }),
    [handleFilterChange],
  )

  return (
    <div className="inset-0 absolute">
      <Head>
        <title>HPAI Tracker</title>
        <meta
          name="description"
          content="A map of all Highly Pathogenic Avian Influenza (HPAI) cases confirmed by USDA APHIS"
        />
        <link rel="icon" href="/favicon.svg" />
        <meta name="viewport" content="width=device-width, user-scalable=no" />
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
          gtag('config', '${process.env.NEXT_PUBLIC_GTAG_ID}');
        `}
      </Script>

      <FilterBar
        className="absolute bottom-0 p-4 flex-wrap-reverse z-[999999]"
        {...filterBarProps}
      />

      <Navbar
        theme={theme ?? 'light'}
        onToggleTheme={setTheme}
        onStatsClick={statsModal.open}
        onAboutClick={aboutModal.open}
        onSubscribeClick={subscribeModal.open}
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
        {!hpaiCaseGeometries && <Loading />}
        <ClientSideMap
          hpaiCaseGeometries={mapHpaiCaseGeometries}
          onCountyClick={handleSelection}
          theme={theme}
        />
      </div>

      <BMAC />
    </div>
  )
}

export default Home
