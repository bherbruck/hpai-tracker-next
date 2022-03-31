import { createPortal } from 'react-dom'
import { type FC, useState, useEffect } from 'react'
import { useModal } from '$hooks/useModal'

export type ModalProps = ReturnType<typeof useModal> & {
  className?: string
}

export const Modal: FC<ModalProps> = ({
  isOpen,
  close,
  className,
  children,
}) => {
  const [isLoaded, setLoaded] = useState(false)

  useEffect(() => setLoaded(true), [])

  return isLoaded
    ? createPortal(
        <div
          className={`modal backdrop-blur bg-transparent z-[10000] ${
            isOpen ? 'modal-open' : null
          }`}
          onClick={({ target, currentTarget }) => {
            if (target !== currentTarget) return
            close()
          }}
        >
          {isOpen ? (
            <div className={`modal-box ${className}`}>
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
