import { numberWithCommas } from '$lib/number-comma'
import type { ClientSideHpaiCase } from '$lib/types'
import { type FC } from 'react'

export type HpaiCaseTableProps = {
  hpaiCases: ClientSideHpaiCase[]
}

export const HpaiCaseTable: FC<HpaiCaseTableProps> = ({ hpaiCases }) => (
  <table className="table table-compact w-full h-full">
    <thead className="sticky top-0 z-[12]">
      <tr>
        <th>Confirmed</th>
        <th>State</th>
        <th>County</th>
        <th>Flock Type</th>
        <th>Flock Size</th>
      </tr>
    </thead>
    <tbody>
      {hpaiCases.map(
        ({ id, dateConfirmed, state, county, flockType, flockSize }) => (
          <tr key={id}>
            <th>
              {
                new Date(dateConfirmed)
                  .toLocaleDateString(undefined, { timeZone: 'utc' })
                  .split(' ')[0]
              }
            </th>
            <td>{state}</td>
            <td>{county}</td>
            <td>{flockType}</td>
            <td>{numberWithCommas(flockSize as number)}</td>
          </tr>
        )
      )}
    </tbody>
  </table>
)
