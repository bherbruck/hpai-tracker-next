export const fillDates = (startDate: Date, endDate: Date): Date[] => {
  const msPerDay = 1000 * 3600 * 24
  const numDays = Math.ceil(
    (endDate.valueOf() - startDate.valueOf()) / msPerDay
  )

  return Array.from(
    { length: numDays },
    (_, i) => new Date(startDate.valueOf() + i * msPerDay)
  )
}

fillDates(new Date('1970-01-01'), new Date())
