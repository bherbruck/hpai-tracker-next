import { type FC, type ReactChild, useState } from 'react'

export type ToggleButtonProps = {
  className?: string
  ariaLabel?: string
  initialState?: boolean
  onChange?: (isActive: boolean) => void
  children: {
    on: ReactChild
    off: ReactChild
  }
}

const ToggleButton: FC<ToggleButtonProps> = ({
  className = '',
  ariaLabel,
  initialState,
  onChange,
  children,
}) => {
  const [isActive, setIsActive] = useState(initialState)

  const handleClick = () => {
    onChange?.(!isActive)
    setIsActive(!isActive)
  }

  return (
    <button
      className={`${className} swap swap-rotate ${
        isActive ? 'swap-active' : ''
      }`}
      aria-label={ariaLabel}
      onClick={handleClick}
    >
      <div className="swap-on">{children.on}</div>
      <div className="swap-off">{children.off}</div>
    </button>
  )
}

export default ToggleButton
