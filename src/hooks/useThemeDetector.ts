import { useEffect, useState } from 'react'

// https://gist.githubusercontent.com/kulak-at/62a7a5ba4d02142391f39830827bd455/raw/3879955167a778aaf8a0543aefaf96d076edbf87/app.js
export const useThemeDetector = () => {
  const darkMediaQuery = '(prefers-color-scheme: dark)'
  const getCurrentTheme = () => window.matchMedia(darkMediaQuery).matches
  const [isDarkTheme, setIsDarkTheme] = useState(getCurrentTheme())

  const mqListener = ({ matches }: MediaQueryListEvent) =>
    setIsDarkTheme(matches)

  useEffect(() => {
    const darkThemeMq = window.matchMedia(darkMediaQuery)
    darkThemeMq.addEventListener('change', mqListener)
    return () => darkThemeMq.removeEventListener('change', mqListener)
  })

  return { isDarkTheme }
}
