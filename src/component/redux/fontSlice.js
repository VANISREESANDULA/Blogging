import { createSlice } from "@reduxjs/toolkit";

const FONT_OPTIONS = [
  {
    id: "inter",
    name: "Inter",
    googleFont: "Inter",
    cssVariable: "'Inter', sans-serif",
  },
  {
    id: "poppins",
    name: "Poppins",
    googleFont: "Poppins",
    cssVariable: "'Poppins', sans-serif",
  },
  {
    id: "roboto",
    name: "Roboto",
    googleFont: "Roboto",
    cssVariable: "'Roboto', sans-serif",
  },
  {
    id: "playfair",
    name: "Playfair Display",
    googleFont: "Playfair Display",
    cssVariable: "'Playfair Display', serif",
  },
  {
    id: "lora",
    name: "Lora",
    googleFont: "Lora",
    cssVariable: "'Lora', serif",
  },
  {
    id: "opensans",
    name: "Open Sans",
    googleFont: "Open Sans",
    cssVariable: "'Open Sans', sans-serif",
  },
  {
    id: "montserrat",
    name: "Montserrat",
    googleFont: "Montserrat",
    cssVariable: "'Montserrat', sans-serif",
  },
  {
    id: "raleway",
    name: "Raleway",
    googleFont: "Raleway",
    cssVariable: "'Raleway', sans-serif",
  },
  {
    id: "nunito",
    name: "Nunito",
    googleFont: "Nunito",
    cssVariable: "'Nunito', sans-serif",
  },
  {
    id: "ubuntu",
    name: "Ubuntu",
    googleFont: "Ubuntu",
    cssVariable: "'Ubuntu', sans-serif",
  },
  {
    id: "quicksand",
    name: "Quicksand",
    googleFont: "Quicksand",
    cssVariable: "'Quicksand', sans-serif",
  },
  {
    id: "josefin",
    name: "Josefin Sans",
    googleFont: "Josefin Sans",
    cssVariable: "'Josefin Sans', sans-serif",
  },
  {
    id: "sourceserif",
    name: "Source Serif Pro",
    googleFont: "Source Serif Pro",
    cssVariable: "'Source Serif Pro', serif",
  },
  {
    id: "sourcecode",
    name: "Source Code Pro",
    googleFont: "Source Code Pro",
    cssVariable: "'Source Code Pro', monospace",
  },
  {
    id: "ibmlex",
    name: "IBM Plex Mono",
    googleFont: "IBM Plex Mono",
    cssVariable: "'IBM Plex Mono', monospace",
  },
];

const FONT_SIZE_OPTIONS = [
  { id: "xs", label: "Small", value: 0.875, cssClass: "text-xs" },
  { id: "sm", label: "Normal", value: 1, cssClass: "text-sm" },
  { id: "md", label: "Medium", value: 1.125, cssClass: "text-base" },
  { id: "lg", label: "Large", value: 1.25, cssClass: "text-lg" },
  { id: "xl", label: "Extra Large", value: 1.5, cssClass: "text-xl" },
];

const fontSlice = createSlice({
  name: "font",
  initialState: {
    currentFont: localStorage.getItem("selectedFont") || "inter",
    currentFontSize: localStorage.getItem("selectedFontSize") || "sm",
  },
  reducers: {
    setFont: (state, action) => {
      const fontId = action.payload;
      state.currentFont = fontId;
      localStorage.setItem("selectedFont", fontId);
      applyFont(fontId);
    },
    setFontSize: (state, action) => {
      const sizeId = action.payload;
      state.currentFontSize = sizeId;
      localStorage.setItem("selectedFontSize", sizeId);
      applyFontSize(sizeId);
    },
  },
});

const applyFont = (fontId) => {
  const fontOption = FONT_OPTIONS.find((font) => font.id === fontId);
  if (fontOption) {
    // Load Google Font dynamically
    const fontLink = document.getElementById("google-font-link");
    const fontUrl = `https://fonts.googleapis.com/css2?family=${fontOption.googleFont.replace(/ /g, "+")}&display=swap`;

    if (fontLink) {
      fontLink.href = fontUrl;
    } else {
      const newLink = document.createElement("link");
      newLink.id = "google-font-link";
      newLink.rel = "stylesheet";
      newLink.href = fontUrl;
      document.head.appendChild(newLink);
    }

    // Apply font to body
    document.documentElement.style.fontFamily = fontOption.cssVariable;
  }
};

const applyFontSize = (sizeId) => {
  const sizeOption = FONT_SIZE_OPTIONS.find((size) => size.id === sizeId);
  if (sizeOption) {
    // Apply font size as CSS variable and direct property
    document.documentElement.style.fontSize = `${sizeOption.value * 16}px`;
    document.documentElement.style.setProperty("--font-size-multiplier", sizeOption.value);
  }
};

export const { setFont, setFontSize } = fontSlice.actions;
export const getFontOptions = () => FONT_OPTIONS;
export const getFontSizeOptions = () => FONT_SIZE_OPTIONS;
export default fontSlice.reducer;
