import { type ModalProps, Modal } from './Modal'
import { FC } from 'react'
import type { HpaiCaseAggregate } from '$lib/types'
import { numberWithCommas } from '$lib/number-comma'

type SelectionModalProps = ModalProps & {
  hpaiCases?: HpaiCaseAggregate
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
              <td>
                {new Date(dateConfirmed).toLocaleDateString().split(' ')[0]}
              </td>
              <td className="whitespace-pre-wrap">{flockType}</td>
              <td>{numberWithCommas(flockSize as number)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Modal>
  )
}