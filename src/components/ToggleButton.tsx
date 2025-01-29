import clsx from 'clsx'
import { type FC, type ReactNode, useState, useEffect } from 'react'
import { twMerge } from 'tailwind-merge'

export type ToggleButtonProps = {
  className?: string
  ariaLabel?: string
  initialState?: boolean
  onChange?: (isActive: boolean) => void
  children: {
    on: ReactNode
    off: ReactNode
  }
}

const ToggleButton: FC<ToggleButtonProps> = ({
  className = '',
  ariaLabel,
  initialState = false,
  onChange,
  children,
}) => {
  const [isActive, setIsActive] = useState(initialState)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newState = e.target.checked
    setIsActive(newState)
    onChange?.(newState)
  }

  return (
    <label
      className={twMerge(clsx(className, 'swap swap-rotate'))}
      aria-label={ariaLabel}
    >
      <input type="checkbox" checked={isActive} onChange={handleChange} />
      <div className="swap-on">{children.on}</div>
      <div className="swap-off">{children.off}</div>
    </label>
  )
}

export default ToggleButton
