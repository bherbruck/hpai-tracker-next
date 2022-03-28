import { type FC, type ReactChild, useState } from 'react'

export type ToggleButtonProps = {
  className?: string
  initialState?: boolean
  onChange?: (isActive: boolean) => void
  children: {
    on: ReactChild
    off: ReactChild
  }
}

const ToggleButton: FC<ToggleButtonProps> = ({
  className = '',
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
      onClick={handleClick}
    >
      <div className="swap-on">{children.on}</div>
      <div className="swap-off">{children.off}</div>
    </button>
  )
}

export default ToggleButton
