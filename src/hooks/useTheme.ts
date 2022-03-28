import { useEffect } from 'react'
import { useLocalStorage } from 'react-use'

export type Theme = 'light' | 'dark'

// https://gist.githubusercontent.com/kulak-at/62a7a5ba4d02142391f39830827bd455/raw/3879955167a778aaf8a0543aefaf96d076edbf87/app.js
export const useTheme = () => {
  const darkMediaQuery = '(prefers-color-scheme: dark)'
  const getPreferredTheme = () =>
    typeof window !== 'undefined' && window.matchMedia(darkMediaQuery).matches
      ? 'dark'
      : 'light'
  const getLocalStorageTheme = () =>
    typeof localStorage !== 'undefined' &&
    (localStorage.getItem('theme') as Theme)

  const getCurrentTheme = (): Theme =>
    getLocalStorageTheme() || getPreferredTheme() || 'light'
  const [theme, setTheme] = useLocalStorage<Theme>('theme', getCurrentTheme())

  useEffect(() => {
    document.documentElement.removeAttribute('data-theme')
    document.documentElement.setAttribute('data-theme', theme ?? 'light')
  }, [theme])

  return { theme, setTheme }
}
