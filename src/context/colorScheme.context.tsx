import React, { useEffect, createContext, ReactNode, useState } from 'react'

interface ColorSchemeProps {
  children?: ReactNode
}

type ColorSchemeContext = {
  children?: React.ReactNode;
  isDark: boolean;
  setIsDark: (value: boolean) => void;
};

const useColorScheme = (): ColorSchemeContext => {
  const [isDark, setIsDark] = useState(false)

  // useEffect(() => {
  //   // const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  //   setIsDark(systemPrefersDark)
  // }, [])

  useEffect(() => {
    document.body.setAttribute('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  return {
    isDark,
    setIsDark
  }
}

export const ColorSchemeContext = createContext<ColorSchemeContext>({
  isDark: false,
  setIsDark: () => {
  }
})

export const ColorSchemeProvider: React.FC<ColorSchemeProps> = ({children}) => {
  const {isDark, setIsDark} = useColorScheme()
  return <ColorSchemeContext.Provider value={{isDark, setIsDark}}>{children}</ColorSchemeContext.Provider>
}
