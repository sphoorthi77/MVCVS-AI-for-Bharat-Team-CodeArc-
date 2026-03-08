import { createContext, useContext, useEffect, useState } from "react"

const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  )

  useEffect(() => {
    const root = document.documentElement

    // Remove existing theme classes
    root.classList.remove("light", "dark")

    // Apply theme based on selection
    if (theme === "system") {
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      root.classList.add(systemDark ? "dark" : "light")
      root.setAttribute("data-theme", systemDark ? "dark" : "light")
    } else {
      root.classList.add(theme)
      root.setAttribute("data-theme", theme)
    }

    // Save preference
    localStorage.setItem("theme", theme)
  }, [theme])

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== "system") return

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    
    const handleChange = (e) => {
      const root = document.documentElement
      root.classList.remove("light", "dark")
      root.classList.add(e.matches ? "dark" : "light")
      root.setAttribute("data-theme", e.matches ? "dark" : "light")
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)

