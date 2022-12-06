import { type FC } from 'react'
import { Badge } from './Badge'

export type FilterBarProps = {
  className?: string
  booleanFilters: Record<string, (isActive: boolean) => void>
}

export const FilterBar: FC<FilterBarProps> = ({
  className,
  booleanFilters,
}) => {
  return (
    <div className={`flex flex-row flex-wrap gap-1 max-w-1/2 ${className}`}>
      {Object.entries(booleanFilters).map(([label, onChange]) => (
        <Badge key={label} onChange={onChange}>
          {label}
        </Badge>
      ))}
    </div>
  )
}
