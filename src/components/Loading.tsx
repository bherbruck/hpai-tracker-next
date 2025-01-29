import { createPortal } from 'react-dom'
import { useEffect, useState, type FC, type ReactNode } from 'react'

export const Loading: FC = () => {
  const [isLoaded, setLoaded] = useState(false)
  useEffect(() => setLoaded(true), [])

  return isLoaded ? (
    createPortal(
      <dialog className="modal backdrop-blur bg-transparent modal-open">
        <span className="loading loading-dots loading-xl"></span>
      </dialog>,
      document.body,
    )
  ) : (
    <></>
  )
}
