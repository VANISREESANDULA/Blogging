# Font System - Quick Setup Guide

## What Was Implemented

✅ **15 Google Fonts integrated** - From modern to classic styles
✅ **Global application** - Applied to entire project automatically
✅ **Persistent storage** - Font choice saved in localStorage
✅ **Dark mode compatible** - Works seamlessly with dark/light modes
✅ **Interactive UI** - 15 font options displayed in Settings
✅ **Instant switching** - No page reload needed to change fonts
✅ **Responsive design** - Font grid adapts to screen size

## Quick Test

1. **Navigate to Settings** → Click on "Appearance Settings"
2. **Scroll to "Font Style"** section
3. **Click any font** - Changes apply instantly
4. **Refresh page** - Your selection persists
5. **Try dark mode** - All fonts work in both themes

## Architecture

```
App.jsx (initializes font on load)
    ↓
Store (contains font reducer)
    ↓
fontSlice.js (manages font state & Google Fonts loading)
    ↓
Settings.jsx (UI for font selection)
    ↓
Document Root (font applied via fontFamily style)
    ↓
All Components (inherit font automatically)
```

## Font Files

- **Redux Slice**: `src/component/redux/fontSlice.js` (136 lines)
- **Settings UI**: `src/component/homepage/Settings.jsx` (updated)
- **App Init**: `src/App.jsx` (added font effect)
- **Store**: `src/store.js` (added font reducer)
- **HTML**: `index.html` (added font link)

## Available Font Options

| # | Font Name | Type | ID |
|---|-----------|------|-----|
| 1 | Inter | Sans-serif | inter |
| 2 | Poppins | Sans-serif | poppins |
| 3 | Roboto | Sans-serif | roboto |
| 4 | Playfair Display | Serif | playfair |
| 5 | Lora | Serif | lora |
| 6 | Open Sans | Sans-serif | opensans |
| 7 | Montserrat | Sans-serif | montserrat |
| 8 | Raleway | Sans-serif | raleway |
| 9 | Nunito | Sans-serif | nunito |
| 10 | Ubuntu | Sans-serif | ubuntu |
| 11 | Quicksand | Sans-serif | quicksand |
| 12 | Josefin Sans | Sans-serif | josefin |
| 13 | Source Serif Pro | Serif | sourceserif |
| 14 | Source Code Pro | Monospace | sourcecode |
| 15 | IBM Plex Mono | Monospace | ibmlex |

## Features

### For Users
- Easy font switching from Settings
- Visual feedback showing selected font
- Font persists across sessions
- Works in light and dark modes
- Responsive layout for all screen sizes

### For Developers
- Redux state management
- Centralized font configuration
- Easy to add new fonts
- localStorage integration
- Dynamic Google Fonts loading

## Code Examples

### Get Current Font
```jsx
const currentFont = useSelector((state) => state.font.currentFont);
```

### Change Font Programmatically
```jsx
const dispatch = useDispatch();
dispatch(setFont("roboto")); // Change to Roboto
```

### Get All Font Options
```jsx
import { getFontOptions } from "../redux/fontSlice";
const fonts = getFontOptions();
```

## Performance Optimizations

✅ Fonts loaded on-demand (not all at once)
✅ Google Fonts cached by browser
✅ No impact on initial load time
✅ Dynamic link replacement (no duplication)
✅ Zero bundle size increase

## Troubleshooting

**Font not changing?**
- Clear localStorage: `localStorage.clear()`
- Refresh browser
- Check Redux DevTools for font state

**Font not persisting?**
- Check if localStorage is enabled
- Verify `selectedFont` key in localStorage

**Style not applying?**
- Check if `document.documentElement.style.fontFamily` is set
- Verify Google Fonts link loaded in `<head>`
- Check browser console for CORS issues
