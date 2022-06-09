import { dateDiff } from './date-diff'
import { DATE_DIFF_INTERVAL } from './interval'

/**
 * Generate a date range in days from a start date to an end date
 */
export const dateRange = function (startDate: Date, endDate: Date) {
  const dates = Array.from({
    length: dateDiff(startDate, endDate, {
      interval: 'day',
      includeLastDate: true,
    }),
  })
  return dates.map(
    (_, i) => new Date(startDate.valueOf() + i * DATE_DIFF_INTERVAL.day)
  )
}
