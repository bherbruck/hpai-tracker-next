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
import type { HpaiCaseGeometry, HpaiCaseGeometryResponse } from '$lib/types'
import { useCallback, useMemo, useState } from 'react'
import { useTheme } from '$hooks/useTheme'
import { FilterBar } from '$components/FilterBar'
import { Loading } from '$components/Loading'
import { BMAC } from '$components/BMAC'

// Define FilterKeys as a string union type
type FilterKeys = 'Commercial' | 'WOAH' | 'Layer' | 'Turkey' | 'Broiler'

type Filters = Record<FilterKeys, boolean>

const INITIAL_FILTERS: Filters = {
  Commercial: false,
  WOAH: false,
  Layer: false,
  Turkey: false,
  Broiler: false,
}

const fetchHpaiCaseGeometries = async (
  url: string,
): Promise<HpaiCaseGeometry[]> => {
  const response = await fetch(url)
  const json = (await response.json()) as HpaiCaseGeometryResponse[]

  return json.map((geometry) => ({
    ...geometry,
    cases: geometry.cases
      .map((hpaiCase) => ({
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
      }))
      .sort((a, b) => b.dateConfirmed.valueOf() - a.dateConfirmed.valueOf()), // Pre-sorted
  }))
}

const filterHpaiCases = (
  hpaiCases: HpaiCaseGeometry[],
  activeFilters: string[],
  filterOptions?: {
    recentOnly?: boolean
  },
  thirtyDaysAgo?: Date,
): HpaiCaseGeometry[] => {
  if (!hpaiCases?.length) return []

  if (!activeFilters.length && !filterOptions?.recentOnly) return hpaiCases

  const effectiveThirtyDaysAgo = filterOptions?.recentOnly
    ? thirtyDaysAgo ||
      (() => {
        const date = new Date()
        date.setDate(date.getDate() - 30)
        return date
      })()
    : null

  return hpaiCases
    .map((geometry) => {
      const filteredCases = geometry.cases.filter((hpaiCase) => {
        const matchesCategory =
          !activeFilters.length ||
          activeFilters.some((filter) => hpaiCase.flockType.includes(filter))

        const isRecentOrActive =
          !filterOptions?.recentOnly ||
          !hpaiCase.dateReleased ||
          hpaiCase.dateConfirmed >= (effectiveThirtyDaysAgo as Date)

        return matchesCategory && isRecentOrActive
      })

      return filteredCases.length ? { ...geometry, cases: filteredCases } : null
    })
    .filter((geometry): geometry is HpaiCaseGeometry => geometry !== null)
}

const useFilteredHpaiCases = (
  hpaiCases: HpaiCaseGeometry[] | undefined,
  activeFilters: string[],
  thirtyDaysAgo: Date,
) => {
  return useMemo(() => {
    if (!hpaiCases?.length) return { filtered: [], recent: [] }

    if (!activeFilters.length) {
      return {
        filtered: hpaiCases,
        recent: hpaiCases.filter((geometry) =>
          geometry.cases.some(
            (hpaiCase) =>
              !hpaiCase.dateReleased || hpaiCase.dateConfirmed >= thirtyDaysAgo,
          ),
        ),
      }
    }

    const filtered = filterHpaiCases(hpaiCases, activeFilters)
    const recent = filterHpaiCases(
      hpaiCases,
      activeFilters,
      { recentOnly: true },
      thirtyDaysAgo,
    )

    return { filtered, recent }
  }, [hpaiCases, activeFilters, thirtyDaysAgo])
}

const Home: NextPage = () => {
  const statsModal = useModal()
  const aboutModal = useModal()
  const subscribeModal = useModal()
  const selectionModal = useModal()

  const { theme, setTheme } = useTheme()

  const { data: hpaiCaseGeometries, error } = useSWR<HpaiCaseGeometry[]>(
    '/api/hpai-case-geometry',
    fetchHpaiCaseGeometries,
  )

  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS)
  const [selectedHpaiCases, setSelectedHpaiCases] = useState<
    HpaiCaseGeometry | undefined
  >(undefined)

  const activeFilters = useMemo(
    () => Object.keys(filters).filter((key) => filters[key as FilterKeys]),
    [filters],
  )

  const thirtyDaysAgo = useMemo(() => {
    const date = new Date()
    date.setDate(date.getDate() - 30)
    return date
  }, [])

  const {
    filtered: filteredHpaiCaseGeometries,
    recent: mapHpaiCaseGeometries,
  } = useFilteredHpaiCases(hpaiCaseGeometries, activeFilters, thirtyDaysAgo)

  const handleSelection = useCallback(
    (hpaiCases: HpaiCaseGeometry) => {
      setSelectedHpaiCases(hpaiCases)
      selectionModal.open()
    },
    [selectionModal],
  )

  const handleFilterChange = useCallback((key: FilterKeys, value: boolean) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }, [])

  const booleanFilters = useMemo(() => {
    const handlers: Record<FilterKeys, (isActive: boolean) => void> = {
      Commercial: (isActive: boolean) =>
        handleFilterChange('Commercial', isActive),
      WOAH: (isActive: boolean) => handleFilterChange('WOAH', isActive),
      Layer: (isActive: boolean) => handleFilterChange('Layer', isActive),
      Turkey: (isActive: boolean) => handleFilterChange('Turkey', isActive),
      Broiler: (isActive: boolean) => handleFilterChange('Broiler', isActive),
    }
    return handlers
  }, [handleFilterChange])

  const filterBarProps = { booleanFilters }

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
