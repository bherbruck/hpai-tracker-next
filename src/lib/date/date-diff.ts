import { DATE_DIFF_INTERVAL } from './interval'

export type DateDiffOptions = {
  interval: keyof typeof DATE_DIFF_INTERVAL
  includeLastDate: boolean
}

const DEFAULT_DATA_DIFF_OPTIONS: DateDiffOptions = {
  interval: 'day',
  includeLastDate: false,
}

/**
 * Calculate the difference in time between two dates by a given interval,
 * rounded down to the nearest interval
 */
export const dateDiff = (
  startDate: Date,
  endDate: Date,
  options?: Partial<DateDiffOptions>,
): number => {
  const { interval, includeLastDate } = {
    ...DEFAULT_DATA_DIFF_OPTIONS,
    ...options,
  }
  const diff = endDate.valueOf() - startDate.valueOf()
  return (
    Math.floor(diff / DATE_DIFF_INTERVAL[interval]) + (includeLastDate ? 1 : 0)
  )
}
