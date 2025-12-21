import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    mode: localStorage.getItem("themeMode") || "system",
    isDark: localStorage.getItem("isDark") === "true" 
      ? true 
      : localStorage.getItem("isDark") === "false"
      ? false
      : window.matchMedia("(prefers-color-scheme: dark)").matches,
  },
  reducers: {
    setThemeMode: (state, action) => {
      const mode = action.payload;
      state.mode = mode;
      localStorage.setItem("themeMode", mode);

      if (mode === "system") {
        const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        state.isDark = isDark;
        localStorage.removeItem("isDark");
        updateTheme(isDark);
      } else if (mode === "dark") {
        state.isDark = true;
        localStorage.setItem("isDark", "true");
        updateTheme(true);
      } else if (mode === "light") {
        state.isDark = false;
        localStorage.setItem("isDark", "false");
        updateTheme(false);
      }
    },
    toggleTheme: (state) => {
      if (state.mode === "system") {
        state.mode = "light";
        state.isDark = false;
        localStorage.setItem("themeMode", "light");
        localStorage.setItem("isDark", "false");
        updateTheme(false);
      } else if (state.mode === "light") {
        state.mode = "dark";
        state.isDark = true;
        localStorage.setItem("themeMode", "dark");
        localStorage.setItem("isDark", "true");
        updateTheme(true);
      } else {
        state.mode = "light";
        state.isDark = false;
        localStorage.setItem("themeMode", "light");
        localStorage.setItem("isDark", "false");
        updateTheme(false);
      }
    },
  },
});

const updateTheme = (isDark) => {
  const root = document.documentElement;
  if (isDark) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
};

export const { setThemeMode, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
