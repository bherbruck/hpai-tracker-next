import { createPortal } from 'react-dom'
import { useEffect, useState, type FC, type ReactNode } from 'react'

export const Loading: FC = () => {
  const [isLoaded, setLoaded] = useState(false)
  useEffect(() => setLoaded(true), [])

  return isLoaded ? (
    createPortal(
      <div className="modal backdrop-blur bg-transparent modal-open">
        <button className="btn btn-ghost loading">Loading...</button>
      </div>,
      document.body,
    )
  ) : (
    <></>
  )
}
