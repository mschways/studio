
"use client"

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme // User's selected preference
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "ip-explorer-theme", // Default key
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') {
      return defaultTheme; // For SSR, default to system or provided default
    }
    try {
      const storedTheme = localStorage.getItem(storageKey) as Theme;
      if (storedTheme) {
        return storedTheme;
      }
    } catch (e) {
      // localStorage may not be available (e.g., private browsing)
      console.error("Error reading theme from localStorage", e);
    }
    return defaultTheme;
  });

  useEffect(() => {
    const root = window.document.documentElement
    
    const applyActualTheme = (actualTheme: "light" | "dark") => {
      root.classList.remove("light", "dark")
      root.classList.add(actualTheme)
    }

    let mediaQuery: MediaQueryList | undefined;
    let systemThemeChangeHandler: ((e: MediaQueryListEvent) => void) | undefined;

    if (theme === "system") {
      mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      applyActualTheme(mediaQuery.matches ? "dark" : "light")
      systemThemeChangeHandler = (e: MediaQueryListEvent) => applyActualTheme(e.matches ? "dark" : "light")
      mediaQuery.addEventListener("change", systemThemeChangeHandler)
    } else {
      applyActualTheme(theme)
    }

    return () => {
      if (mediaQuery && systemThemeChangeHandler) {
        mediaQuery.removeEventListener("change", systemThemeChangeHandler)
      }
    }
  }, [theme])

  const value = {
    theme, // This is the user's preference ('system', 'light', or 'dark')
    setTheme: (newTheme: Theme) => {
      try {
        localStorage.setItem(storageKey, newTheme)
      } catch (e) {
        console.error("Error saving theme to localStorage", e);
      }
      setTheme(newTheme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
