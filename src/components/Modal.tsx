import { createPortal } from 'react-dom'
import { type FC, type ReactNode, useState, useEffect } from 'react'
import { useModal } from '$hooks/useModal'
import { twMerge } from 'tailwind-merge'
import clsx from 'clsx'

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

  useEffect(() => {
    setLoaded(true)
    return () => setLoaded(false)
  }, [])

  if (!isLoaded || !isOpen) return null

  return createPortal(
    <dialog
      className={twMerge('modal', clsx({ 'modal-open': isOpen }))}
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
      <div className="modal-backdrop" onClick={close} />
    </dialog>,
    document.body,
  )
}
