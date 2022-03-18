export function numberWithCommas(num: number | string, sep = ','): string {
  if (isNaN(Number(num))) return ''
  return Number(num)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, sep)
}
