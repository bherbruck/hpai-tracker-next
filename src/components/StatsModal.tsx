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

type ProcessedStats = {
  flatCases: HpaiCase[]
  stats: Stats
  cumulativeCases: CumulativeHpaiCase[]
}

const useProcessedHpaiCases = (
  hpaiCases: HpaiCaseGeometry[] = [],
): ProcessedStats => {
  return useMemo(() => {
    if (!hpaiCases.length) {
      return {
        flatCases: [],
        stats: {
          totalCases: 0,
          totalDeaths: 0,
          affectedStates: 0,
          affectedCounties: 0,
        },
        cumulativeCases: [],
      }
    }

    // Flatten and sort cases in descending order of dateConfirmed
    const flatCases = hpaiCases
      .flatMap(({ cases }) => cases)
      .sort((a, b) => b.dateConfirmed.valueOf() - a.dateConfirmed.valueOf())

    // Compute stats
    const states = new Set<string>()
    const counties = new Set<string>()
    let totalDeaths = 0

    flatCases.forEach(({ state, county, flockSize = 0 }) => {
      if (state) states.add(state)
      if (state && county) counties.add(`${state}-${county}`)
      totalDeaths += flockSize
    })

    const stats: Stats = {
      totalCases: flatCases.length,
      totalDeaths,
      affectedStates: states.size,
      affectedCounties: counties.size,
    }

    // Prepare data for cumulative chart
    if (!flatCases.length) {
      return { flatCases, stats, cumulativeCases: [] }
    }

    // Sort cases in ascending order for cumulative calculation
    const sortedAscCases = [...flatCases].sort(
      (a, b) => a.dateConfirmed.valueOf() - b.dateConfirmed.valueOf(),
    )

    const startDate = new Date(sortedAscCases[0].dateConfirmed)
    const lastDate = new Date(
      sortedAscCases[sortedAscCases.length - 1].dateConfirmed,
    )
    const currentDate = new Date()
    const endDate = lastDate > currentDate ? lastDate : currentDate

    const dates = fillDates(startDate, endDate)

    const dateMap = new Map<string, number>()

    sortedAscCases.forEach(({ dateConfirmed, flockSize = 0 }) => {
      const dateStr = dateConfirmed.toISOString().split('T')[0]
      dateMap.set(dateStr, (dateMap.get(dateStr) ?? 0) + flockSize)
    })

    let cumSum = 0
    const cumulativeCases: CumulativeHpaiCase[] = dates.map((date) => {
      const dateStr = date.toISOString().split('T')[0]
      cumSum += dateMap.get(dateStr) ?? 0
      return {
        dateConfirmed: date,
        flockSize: cumSum,
      }
    })

    return { flatCases, stats, cumulativeCases }
  }, [hpaiCases])
}

export const StatsModal: FC<StatsModalProps> = ({
  hpaiCases = [],
  ...props
}) => {
  const { flatCases, stats, cumulativeCases } = useProcessedHpaiCases(hpaiCases)

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

        <div className="flex-1 overflow-auto">
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
