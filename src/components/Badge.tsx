import { type FC, type ReactNode, useState } from 'react'

export type BadgeProps = {
  className?: string
  onChange?: (isActive: boolean) => void
  children: ReactNode
}

export const Badge: FC<BadgeProps> = ({ children, className, onChange }) => {
  const [isActive, setIsActive] = useState(false)

  const handleClick = () => {
    onChange && onChange(!isActive)
    setIsActive(!isActive)
  }

  return (
    <span
      className={`badge rounded-full select-none cursor-pointer ${
        isActive && 'badge-error'
      } ${className ?? ''}`}
      onClick={handleClick}
    >
      {children}
    </span>
  )
}
