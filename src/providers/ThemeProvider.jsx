import React, { createContext, useState, useContext, useEffect } from "react";

// Create ThemeContext
const ThemeContext = createContext();

// Provide the theme context to the rest of the app
export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  // Set initial theme based on user's preference or default to light
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDark(savedTheme === "dark");
    }
  }, []);

  // Set theme on the body element
  useEffect(() => {
    document.body.setAttribute("data-theme", isDark ? "dark" : "light");
  }, [isDark]);

  // Toggle theme function
  const toggleTheme = () => {
    setIsDark((prev) => {
      const newTheme = !prev;
      localStorage.setItem("theme", newTheme ? "dark" : "light");
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the ThemeContext
export const useTheme = () => useContext(ThemeContext);
