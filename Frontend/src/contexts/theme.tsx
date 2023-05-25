import { createContext, useState, useEffect } from "react";
import { ThemeContextType, ThemeProviderProps } from "./Dtos/theme.dto";

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<ThemeProviderProps> = ({children}) => {
  const [ theme, setTheme ] = useState<'dark' | 'light'>(localStorage.getItem("theme") !== "dark" ? "light" : "dark");
  useEffect(()=>{
    const root = window.document.documentElement;
    const OldTheme = theme === "dark" ? "light" : "dark";
    root.classList.remove(OldTheme);
    root.classList.add(theme);
    localStorage.setItem("theme",theme)
  },[theme])

  const contextValue:ThemeContextType={theme, setTheme }
  return(
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )

}
