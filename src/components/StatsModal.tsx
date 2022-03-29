import { type ModalProps, Modal } from './Modal'
import { FC, useEffect, useState } from 'react'
import type { HpaiCaseGeometry, ClientSideHpaiCase, Stats } from '$lib/types'
import { numberWithCommas } from '$lib/number-comma'
import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  Area,
  Tooltip,
} from 'recharts'

type StatsModalProps = ModalProps & {
  hpaiCases?: HpaiCaseGeometry[]
  stats?: Stats
}

type CumulativeHpaiCase = Pick<
  ClientSideHpaiCase,
  'dateConfirmed' | 'flockSize'
>

const sort = <T extends Record<any, any>>(
  arr: T[],
  compareFn: (a: T, b: T) => number
): T[] => [...arr].sort((a, b) => compareFn(a, b))

const accumulateHpaiCases = (
  hpaiCases: ClientSideHpaiCase[]
): CumulativeHpaiCase[] =>
  hpaiCases.reduce((acc, { dateConfirmed, flockSize }, index) => {
    if (!acc.length) return [{ dateConfirmed, flockSize }]
    const cumulativeFlockSize =
      (acc[index - 1]?.flockSize ?? 0) + (flockSize ?? 0)
    return [
      ...acc,
      {
        dateConfirmed: new Date(dateConfirmed).toLocaleDateString(undefined, {
          timeZone: 'utc',
        }),
        flockSize: cumulativeFlockSize,
      },
    ]
  }, [] as CumulativeHpaiCase[])

export const StatsModal: FC<StatsModalProps> = ({
  hpaiCases,
  stats,
  ...props
}) => {
  const [flatCases, setFlatCases] = useState<ClientSideHpaiCase[]>([])
  const [cumulativeCases, setCumulativeCases] = useState<CumulativeHpaiCase[]>(
    []
  )

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

  useEffect(() => {
    setCumulativeCases(
      accumulateHpaiCases(
        sort(flatCases, (a, b) => {
          return (
            new Date(a.dateConfirmed).valueOf() -
            new Date(b.dateConfirmed).valueOf()
          )
        })
      )
    )
    return () => setCumulativeCases([])
  }, [flatCases])

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

        <div className="flex-1 overflow-scroll h-full">
          <table className="table table-compact w-full">
            <thead className="sticky top-0">
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
                    <td>{state}</td>
                    <td>{county}</td>
                    <td>{flockType}</td>
                    <td>{numberWithCommas(flockSize as number)}</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
        <div className="flex-1">
          {/* this should probably be its own component */}
          <ResponsiveContainer>
            <AreaChart data={cumulativeCases}>
              <XAxis dataKey="dateConfirmed" />
              <YAxis width={0} />
              <Area
                type="monotone"
                dataKey="flockSize"
                stroke="hsl(var(--a))"
                fill="hsl(var(--a))"
                fillOpacity={0.5}
                strokeWidth={5}
              />
              {/* this should probably be its own component */}
              <Tooltip
                content={(props) =>
                  props.payload &&
                  props.payload.length > 0 && (
                    <div className="rounded-lg bg-base-300 border-0 p-2 flex flex-col">
                      <span className="font-bold text-sm text-base-content">
                        {props.payload[0].payload.dateConfirmed}
                      </span>
                      <span className=" text-sm text-base-content">
                        Birds Affected:
                        <br />
                        {numberWithCommas(props.payload[0].payload.flockSize)}
                      </span>
                    </div>
                  )
                }
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Modal>
  )
}

export default StatsModal
