export interface ThemeContextType {
  theme: 'dark' | 'light';
  setTheme: React.Dispatch<React.SetStateAction<'dark' | 'light'>>;
}

export interface ThemeProviderProps{
  children: React.ReactNode;
}