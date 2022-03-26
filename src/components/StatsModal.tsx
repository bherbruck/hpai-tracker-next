import { type ModalProps, Modal } from './Modal'
import { FC, useEffect, useState } from 'react'
import type { HpaiCaseGeometry, ClientSideHpaiCase, Stats } from '$lib/types'
import { numberWithCommas } from '$lib/number-comma'

type StatsModalProps = ModalProps & {
  hpaiCases?: HpaiCaseGeometry[]
  stats?: Stats
}

const sort = <T extends Record<any, any>>(
  arr: T[],
  compareFn: (a: T, b: T) => number
): T[] => [...arr].sort((a, b) => compareFn(a, b))

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
                ((stats?.totalDeaths ?? 0) / 1000000).toFixed(1)
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

        <div className="flex-1 overflow-scroll h-full">
          <table className="table table-compact w-full">
            <thead>
              <tr>
                <th>Confirmed</th>
                <th>State</th>
                <th>County</th>
                <th>Flock Type</th>
                <th>Flock Size</th>
              </tr>
            </thead>
            <tbody>
              {flatCases.map(
                ({
                  id,
                  dateConfirmed,
                  state,
                  county,
                  flockType,
                  flockSize,
                }) => (
                  <tr key={id}>
                    <td>
                      {
                        new Date(dateConfirmed)
                          .toLocaleDateString(undefined, { timeZone: 'utc' })
                          .split(' ')[0]
                      }
                    </td>
                    <td className="whitespace-pre-wrap">{state}</td>
                    <td className="whitespace-pre-wrap">{county}</td>
                    <td className="whitespace-pre-wrap">{flockType}</td>
                    <td className="whitespace-pre-wrap">
                      {numberWithCommas(flockSize as number)}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  )
}
