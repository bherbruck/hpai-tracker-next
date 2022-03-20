import { createPortal } from 'react-dom'
import { PropsWithChildren, useState, useEffect } from 'react'
import { useModal } from '$hooks/useModal'
import type { FC } from 'react'

export type ModalProps = PropsWithChildren<ReturnType<typeof useModal>>

export const Modal: FC<ModalProps> = ({ isOpen, close, children }) => {
  const [isLoaded, setLoaded] = useState(false)

  useEffect(() => setLoaded(true), [])

  return isLoaded
    ? createPortal(
        <div
          className={`modal backdrop-blur bg-transparent ${
            isOpen ? 'modal-open' : null
          }`}
          onClick={({ target, currentTarget }) => {
            if (target !== currentTarget) return
            close()
          }}
        >
          {isOpen ? (
            <div className="modal-box relative max-w-xl">
              <button
                className="btn btn-sm btn-circle absolute right-2 top-2"
                onClick={close}
              >
                ✕
              </button>
              {children}
            </div>
          ) : null}
        </div>,
        document.body
      )
    : null
}