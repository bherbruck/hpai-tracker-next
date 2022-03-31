import { type ModalProps, Modal } from './Modal'
import { FC, useEffect, useMemo, useState } from 'react'
import type {
  HpaiCaseGeometry,
  ClientSideHpaiCase,
  Stats,
  CumulativeHpaiCase,
} from '$lib/types'
import { numberWithCommas } from '$lib/number-comma'
import { HpaiCaseChart } from './HpaiCaseChart'
import { HpaiCaseTable } from './HpaiCaseTable'

type StatsModalProps = ModalProps & {
  hpaiCases?: HpaiCaseGeometry[]
  stats?: Stats
}

const sort = <T extends Record<any, any>>(
  arr: T[],
  compareFn: (a: T, b: T) => number
): T[] => [...arr].sort((a, b) => compareFn(a, b))

const accumulateHpaiCases = (
  hpaiCases: ClientSideHpaiCase[]
): CumulativeHpaiCase[] => {
  const sorted = sort(hpaiCases, (a, b) => {
    return (
      new Date(a.dateConfirmed).valueOf() - new Date(b.dateConfirmed).valueOf()
    )
  })

  const grouped = sorted.reduce((acc, { dateConfirmed, flockSize }) => {
    const fmtDateConfirmed = new Date(dateConfirmed).toLocaleDateString(
      undefined,
      { timeZone: 'utc' }
    )

    return {
      ...acc,
      [fmtDateConfirmed]: (acc[fmtDateConfirmed] ?? 0) + (flockSize ?? 0),
    }
  }, {} as Record<string, number>)

  const arr = Object.entries(grouped).reduce(
    (acc, [dateConfirmed, flockSize]) => {
      return [
        ...acc,
        {
          dateConfirmed,
          flockSize:
            flockSize + (acc.length > 0 ? acc[acc.length - 1].flockSize : 0),
        },
      ]
    },
    [] as CumulativeHpaiCase[]
  )

  return arr
}

export const StatsModal: FC<StatsModalProps> = ({
  hpaiCases,
  stats,
  ...props
}) => {
  const [flatCases, setFlatCases] = useState<ClientSideHpaiCase[]>([])

  useEffect(() => {
    setFlatCases(
      sort(hpaiCases?.flatMap(({ cases }) => cases) ?? [], (a, b) => {
        return (
          new Date(b.dateConfirmed).valueOf() -
          new Date(a.dateConfirmed).valueOf()
        )
      })
    )
    return () => setFlatCases([])
  }, [hpaiCases])

  const cumulativeCases = useMemo(
    () => accumulateHpaiCases(flatCases),
    [flatCases]
  )

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
