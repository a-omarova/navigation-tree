import React, { useCallback, useContext } from 'react'
import styles from './Header.module.css'
import Link from 'next/link'
import { Icon } from '@/components/Icon/Icon'
import { ColorSchemeContext } from '@/context/colorScheme.context'

export const Header = () => {
  const {isDark, setIsDark} = useContext(ColorSchemeContext)
  const toggleTheme = useCallback(() => setIsDark(!isDark), [isDark, setIsDark])

  return (
    <header className={styles.root}>
      <Link href="https://www.jetbrains.com/">
        <Icon name="home" className={styles.homeIcon}/>
      </Link>
      <label className={styles.themeSwitchLabel}>
        <input type="checkbox" className={styles.themeSwitchCheckbox} checked={isDark} onChange={toggleTheme}/>
        <div className={styles.themeIcons}>
          <Icon name="light" className={styles.lightThemeIcon}/>
          <Icon name="dark" className={styles.darkThemeIcon}/>
        </div>
      </label>
    </header>
  )
}
