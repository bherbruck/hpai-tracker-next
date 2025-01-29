import { type ModalProps, Modal } from './Modal'
import { type FC, useMemo, useCallback } from 'react'
import type {
  HpaiCase,
  Stats,
  CumulativeHpaiCase,
  HpaiCaseGeometry,
} from '$lib/types'
import { numberWithCommas } from '$lib/number-comma'
import { HpaiCaseChart } from './HpaiCaseChart'
import { HpaiCaseTable } from './HpaiCaseTable'
import { fillDates } from '$lib/fill-dates'

type StatsModalProps = ModalProps & {
  hpaiCases?: HpaiCaseGeometry[]
}

// Memoized sorting function
const useSortedData = <T,>(
  data: T[],
  compareFn: (a: T, b: T) => number,
  deps: any[] = [],
) => {
  return useMemo(() => [...data].sort(compareFn), [data, ...deps])
}

// Optimized date comparison function
const dateCompare = (a: Date, b: Date) => a.valueOf() - b.valueOf()

// Optimized flattening function with Set for deduplication
const useFlattenedHpaiCases = (hpaiCases: HpaiCaseGeometry[]) => {
  return useMemo(() => {
    const cases = new Set(hpaiCases?.flatMap(({ cases }) => cases))
    return Array.from(cases).sort((a, b) =>
      dateCompare(new Date(b.dateConfirmed), new Date(a.dateConfirmed)),
    )
  }, [hpaiCases])
}

// Optimized chart data processing
const useChartHpaiCases = (hpaiCases: HpaiCase[]): CumulativeHpaiCase[] => {
  return useMemo(() => {
    if (!hpaiCases.length) return []

    // Sort once at the beginning
    const sorted = hpaiCases.sort((a, b) =>
      dateCompare(new Date(a.dateConfirmed), new Date(b.dateConfirmed)),
    )

    const startDate = new Date(sorted[0].dateConfirmed)
    const endDate = new Date()
    const dates = fillDates(startDate, endDate)

    // Create a Map for faster lookups
    const dateMap = new Map<number, number>()

    // Group by date in a single pass
    sorted.forEach(({ dateConfirmed, flockSize = 0 }) => {
      const dateValue = new Date(dateConfirmed).valueOf()
      dateMap.set(dateValue, (dateMap.get(dateValue) ?? 0) + (flockSize ?? 0))
    })

    // Calculate cumulative sum in a single pass
    let cumSum = 0
    return dates.map((date) => {
      const dateValue = date.valueOf()
      cumSum += dateMap.get(dateValue) ?? 0
      return {
        dateConfirmed: date,
        flockSize: cumSum,
      }
    })
  }, [hpaiCases])
}

// Optimized stats calculation using Set for unique values
const useHpaiStats = (hpaiCases: HpaiCase[]): Stats => {
  return useMemo(() => {
    const states = new Set<string>()
    const counties = new Set<string>()
    let totalDeaths = 0

    hpaiCases.forEach(({ state, county, flockSize = 0 }) => {
      states.add(state)
      counties.add(`${state}-${county}`)
      totalDeaths += flockSize ?? 0
    })

    return {
      totalCases: hpaiCases.length,
      totalDeaths,
      affectedStates: states.size,
      affectedCounties: counties.size,
    }
  }, [hpaiCases])
}

export const StatsModal: FC<StatsModalProps> = ({
  hpaiCases = [],
  ...props
}) => {
  const flatCases = useFlattenedHpaiCases(hpaiCases)
  const stats = useHpaiStats(flatCases)
  const cumulativeCases = useChartHpaiCases(flatCases)

  const formatMillions = useCallback(
    (value: number) => `${numberWithCommas((value / 1_000_000).toFixed(1))}M`,
    [],
  )

  return (
    <Modal {...props} className="max-w-4xl">
      <div className="flex flex-col gap-4 w-full h-[75vh]">
        <h3 className="font-bold text-lg">Stats</h3>

        <div className="stats w-full">
          <div className="stat">
            <div className="stat-title">Birds Affected</div>
            <div className="stat-value">
              {formatMillions(stats.totalDeaths)}
            </div>
          </div>

          <div className="stat">
            <div className="stat-title">Total Cases</div>
            <div className="stat-value">
              {numberWithCommas(stats.totalCases)}
            </div>
          </div>

          <div className="stat">
            <div className="stat-title">States Affected</div>
            <div className="stat-value">
              {numberWithCommas(stats.affectedStates)}
            </div>
          </div>

          <div className="stat">
            <div className="stat-title">Counties Affected</div>
            <div className="stat-value">
              {numberWithCommas(stats.affectedCounties)}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-scroll">
          <HpaiCaseTable hpaiCases={flatCases} />
        </div>

        <div className="flex-1">
          <HpaiCaseChart cumulativeCases={cumulativeCases} />
        </div>
      </div>
    </Modal>
  )
}

export default StatsModal
