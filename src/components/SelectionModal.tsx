import { type ModalProps, Modal } from './Modal'
import { FC } from 'react'
import type { HpaiCaseGeometryResponse } from '$lib/types'
import { numberWithCommas } from '$lib/number-comma'
import { formatDate } from '$lib/format-date'

type SelectionModalProps = ModalProps & {
  hpaiCases?: HpaiCaseGeometryResponse
}

export const SelectionModal: FC<SelectionModalProps> = ({
  hpaiCases,
  ...props
}) => {
  if (!hpaiCases) return null
  const { county, state, cases } = hpaiCases

  return (
    <Modal {...props}>
      <h3 className="font-bold text-lg pb-4">
        {county} {state}
      </h3>
      <table className="table table-fixed w-full h-full">
        <thead>
          <tr>
            <th>Confirmed</th>
            <th>Flock Type</th>
            <th>Flock Size</th>
          </tr>
        </thead>
        <tbody>
          {cases.map(({ id, dateConfirmed, flockType, flockSize }) => (
            <tr key={id}>
              <td>{formatDate(dateConfirmed)}</td>
              <td className="whitespace-pre-wrap">{flockType}</td>
              <td>{numberWithCommas(flockSize as number)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Modal>
  )
}
