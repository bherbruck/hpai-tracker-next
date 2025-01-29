import { formatDate } from '$lib/format-date'
import { numberWithCommas } from '$lib/number-comma'
import type { HpaiCase } from '$lib/types'
import { type FC } from 'react'

export type HpaiCaseTableProps = {
  hpaiCases: HpaiCase[]
}

export const HpaiCaseTable: FC<HpaiCaseTableProps> = ({ hpaiCases }) => (
  <div className="h-full">
    <table className="table table-xs md:table-sm">
      <thead className="bg-base-100 sticky top-0">
        <tr>
          <th>Confirmed</th>
          <th>State</th>
          <th>County</th>
          <th>Flock Type</th>
          <th>Flock Size</th>
          <th>Released</th>
        </tr>
      </thead>
      <tbody>
        {hpaiCases.map(
          ({
            id,
            dateConfirmed,
            state,
            county,
            flockType,
            flockSize,
            dateReleased,
          }) => (
            <tr key={id}>
              <th>{formatDate(dateConfirmed)}</th>
              <td>{state}</td>
              <td>{county}</td>
              <td>{flockType}</td>
              <td>{numberWithCommas(flockSize as number)}</td>
              <td>{dateReleased && formatDate(dateReleased)}</td>
            </tr>
          ),
        )}
      </tbody>
    </table>
  </div>
)
