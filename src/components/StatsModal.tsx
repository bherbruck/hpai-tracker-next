import { type ModalProps, Modal } from './Modal'
import { type FC, useDebugValue, useMemo } from 'react'
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
import { sum } from '$lib/sum'

type StatsModalProps = ModalProps & {
  hpaiCases?: HpaiCaseGeometry[]
}

const sort = <T extends {}>(arr: T[], compareFn: (a: T, b: T) => number): T[] =>
  [...arr].sort((a, b) => compareFn(a, b))

const flattenHpaiCases = (hpaiCases: HpaiCaseGeometry[]) =>
  sort(
    hpaiCases?.flatMap(({ cases }) => cases) ?? [],
    (a, b) =>
      new Date(b.dateConfirmed).valueOf() - new Date(a.dateConfirmed).valueOf()
  )

const chartHpaiCases = (hpaiCases: HpaiCase[]): CumulativeHpaiCase[] => {
  // TODO: optimize this

  const sorted = sort(
    hpaiCases,
    (a, b) =>
      new Date(a.dateConfirmed).valueOf() - new Date(b.dateConfirmed).valueOf()
  )

  const filledDates = fillDates(
    sorted[0]?.dateConfirmed ?? new Date(),
    new Date()
  )

  const grouped = filledDates.reduce((acc, date) => {
    const hpaiCases = sorted.filter(
      (h) => h.dateConfirmed.valueOf() === date.valueOf()
    ) as HpaiCase[]
    const dateValue = date.valueOf()
    const flockSize = sum(hpaiCases.map((h) => h.flockSize ?? 0))

    return {
      ...acc,
      [dateValue]: (acc[dateValue] ?? 0) + flockSize,
    }
  }, {} as Record<string, number>)

  const arr = Object.entries(grouped).reduce(
    (acc, [dateConfirmed, flockSize]) => {
      return [
        ...acc,
        {
          dateConfirmed: new Date(Number(dateConfirmed)),
          flockSize:
            flockSize +
            (acc.length > 0 ? acc[acc.length - 1]?.flockSize ?? 0 : 0),
        },
      ]
    },
    [] as CumulativeHpaiCase[]
  )

  return arr
}

const summarizeHpaiCases = (hpaiCases: HpaiCase[]): Stats => {
  const temp = hpaiCases.reduce(
    ({ stats, seenStates, seenCounties }, { state, county, flockSize }) => {
      const isStateSeen = seenStates.includes(state)
      const stateCounty = `${state}-${county}`
      const isCountySeen = isStateSeen && seenCounties.includes(stateCounty)
      return {
        stats: {
          totalCases: stats.totalCases + 1,
          totalDeaths: stats.totalDeaths + (flockSize ?? 0),
          affectedStates: isStateSeen
            ? stats.affectedStates
            : stats.affectedStates + 1,
          affectedCounties: isCountySeen
            ? stats.affectedCounties
            : stats.affectedCounties + 1,
        },
        seenStates: isStateSeen ? seenStates : [...seenStates, state],
        seenCounties: isCountySeen
          ? seenCounties
          : [...seenCounties, stateCounty],
      }
    },
    {
      stats: {
        totalCases: 0,
        totalDeaths: 0,
        affectedStates: 0,
        affectedCounties: 0,
      },
      seenStates: [],
      seenCounties: [],
    } as { stats: Stats; seenStates: string[]; seenCounties: string[] }
  )

  return temp.stats
}

export const StatsModal: FC<StatsModalProps> = ({
  hpaiCases,
  // stats,
  ...props
}) => {
  const flatCases = useMemo(
    () => flattenHpaiCases(hpaiCases ?? []),
    [hpaiCases]
  )
  const stats = useMemo(() => summarizeHpaiCases(flatCases), [flatCases])
  const cumulativeCases = useMemo(() => chartHpaiCases(flatCases), [flatCases])

  useDebugValue(flatCases)
  useDebugValue(cumulativeCases)

  return (
    // TODO: make this mobile friendly
    <Modal {...props} className="max-w-4xl">
      <div className="flex flex-col gap-4 w-full h-[75vh]">
        <h3 className="font-bold text-lg">Stats</h3>

        <div className="stats w-full">
          <div className="stat">
            <div className="stat-title">Birds Affected</div>
            <div className="stat-value">
              {numberWithCommas(
                ((stats?.totalDeaths ?? 0) / 1_000_000).toFixed(1)
              )}
              M
            </div>
          </div>

          <div className="stat">
            <div className="stat-title">Total Cases</div>
            <div className="stat-value">
              {numberWithCommas(stats?.totalCases ?? 0)}
            </div>
          </div>

          <div className="stat">
            <div className="stat-title">States Affected</div>
            <div className="stat-value">
              {numberWithCommas(stats?.affectedStates ?? 0)}
            </div>
          </div>
          <div className="stat">
            <div className="stat-title">Counties Affected</div>
            <div className="stat-value">
              {numberWithCommas(stats?.affectedCounties ?? 0)}
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
