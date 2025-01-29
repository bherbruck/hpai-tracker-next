import { createPortal } from 'react-dom'
import { type FC, type ReactNode, useState, useEffect } from 'react'
import { useModal } from '$hooks/useModal'

export type ModalProps = ReturnType<typeof useModal> & {
  className?: string
  children?: ReactNode
}

export const Modal: FC<ModalProps> = ({
  isOpen,
  close,
  className,
  children,
}) => {
  const [isLoaded, setLoaded] = useState(false)

  useEffect(() => setLoaded(true), [])

  return isLoaded ? (
    <dialog
      className={`modal ${isOpen ? 'modal-open' : null}`}
      onKeyDown={({ key }) => key === 'Escape' && close()}
    >
      <div className={`modal-box ${className}`}>
        <button
          className="btn btn-sm btn-circle absolute right-2 top-2"
          onClick={close}
        >
          ✕
        </button>
        {children}
      </div>
      <div className="modal-backdrop backdrop-blur" onClick={close} />
    </dialog>
  ) : null
}
