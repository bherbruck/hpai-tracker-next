import { type ModalProps, Modal } from './Modal'
import { FC } from 'react'
import type { HpaiCaseGeometry } from '$lib/types'
import { numberWithCommas } from '$lib/number-comma'
import { formatDate } from '$lib/format-date'

type SelectionModalProps = ModalProps & {
  hpaiCases?: HpaiCaseGeometry
}

export const SelectionModal: FC<SelectionModalProps> = ({
  hpaiCases,
  ...props
}) => {
  if (!hpaiCases) return null
  const { county, state, cases } = hpaiCases

  return (
    <Modal {...props} className="max-w-4xl">
      <h3 className="font-bold text-lg pb-4">
        {county} {state}
      </h3>
      <table className="table w-full h-full">
        <thead>
          <tr>
            <th>Confirmed</th>
            <th>Flock Type</th>
            <th>Flock Size</th>
            <th>Released</th>
          </tr>
        </thead>
        <tbody>
          {cases.map(
            ({ id, dateConfirmed, flockType, flockSize, dateReleased }) => (
              <tr key={id}>
                <td>{formatDate(dateConfirmed)}</td>
                <td className="whitespace-pre-wrap">{flockType}</td>
                <td>{numberWithCommas(flockSize as number)}</td>
                <td>{dateReleased && formatDate(dateReleased)}</td>
              </tr>
            ),
          )}
        </tbody>
      </table>
    </Modal>
  )
}
