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

const useFlattenedHpaiCases = (hpaiCases: HpaiCaseGeometry[]) => {
  return useMemo(() => {
    if (!hpaiCases?.length) return []
    return hpaiCases
      .flatMap(({ cases }) => cases)
      .sort((a, b) => b.dateConfirmed.valueOf() - a.dateConfirmed.valueOf())
  }, [hpaiCases])
}

const useChartHpaiCases = (hpaiCases: HpaiCase[]): CumulativeHpaiCase[] => {
  return useMemo(() => {
    if (!hpaiCases.length) return []

    const sorted = [...hpaiCases].sort(
      (a, b) => a.dateConfirmed.valueOf() - b.dateConfirmed.valueOf(),
    )

    const startDate = new Date(sorted[0].dateConfirmed)
    const lastDate = new Date(sorted[sorted.length - 1].dateConfirmed)
    const endDate = new Date(Math.max(lastDate.getTime(), new Date().getTime()))

    const dates = fillDates(startDate, endDate)

    const dateMap = new Map<string, number>()

    sorted.forEach(({ dateConfirmed, flockSize = 0 }) => {
      const dateStr = new Date(dateConfirmed).toISOString().split('T')[0]
      dateMap.set(dateStr, (dateMap.get(dateStr) ?? 0) + (flockSize ?? 0))
    })

    let cumSum = 0
    return dates.map((date) => {
      const dateStr = date.toISOString().split('T')[0]
      cumSum += dateMap.get(dateStr) ?? 0
      return {
        dateConfirmed: date,
        flockSize: cumSum,
      }
    })
  }, [hpaiCases])
}

const useHpaiStats = (hpaiCases: HpaiCase[]): Stats => {
  return useMemo(() => {
    const states = new Set<string>()
    const counties = new Set<string>()
    let totalDeaths = 0

    hpaiCases.forEach(({ state, county, flockSize = 0 }) => {
      if (state) states.add(state)
      if (state && county) counties.add(`${state}-${county}`)
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
