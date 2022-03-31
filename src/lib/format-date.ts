export const formatDate = (value: number | string | Date): string => {
  return new Date(value)
    .toLocaleDateString(undefined, { timeZone: 'utc' })
    .split(' ')[0]
}
