# Font System Implementation Guide

## Overview
A complete font system has been implemented for your blogging project that supports 15 different Google Fonts with global application across the entire project.

## Components Created/Modified

### 1. **Font Redux Slice** (`src/component/redux/fontSlice.js`)
- Manages font state globally using Redux
- Stores 15 Google Font options
- Dynamically loads fonts from Google Fonts API
- Persists font choice in localStorage
- Automatically applies selected font to entire document

### 2. **Available Fonts (15 Total)**
1. **Inter** - Modern, clean sans-serif
2. **Poppins** - Geometric sans-serif
3. **Roboto** - Versatile sans-serif
4. **Playfair Display** - Elegant serif
5. **Lora** - Calming serif
6. **Open Sans** - Friendly sans-serif
7. **Montserrat** - Urban sans-serif
8. **Raleway** - Sophisticated sans-serif
9. **Nunito** - Rounded sans-serif
10. **Ubuntu** - Bold sans-serif
11. **Quicksand** - Playful sans-serif
12. **Josefin Sans** - Stylized sans-serif
13. **Source Serif Pro** - Professional serif
14. **Source Code Pro** - Monospace code font
15. **IBM Plex Mono** - Technical monospace

### 3. **Files Modified**

#### `src/store.js`
- Added `fontReducer` to Redux store configuration

#### `src/App.jsx`
- Added font initialization effect
- Loads selected font on app mount
- Dynamically applies font when user changes selection

#### `src/component/homepage/Settings.jsx`
- Added font change handler
- Updated Font Selection section to display all 15 fonts
- Enhanced FontOption component with:
  - Selection indicator (✓ Selected)
  - Visual feedback for selected font
  - Dark mode support
  - Responsive grid layout (2-5 columns based on screen size)

#### `index.html`
- Added Google Fonts link with ID for dynamic updates
- Initial font set to Inter (default)

## How It Works

### Font Selection Flow
1. User clicks on a font in Settings → Appearance → Font Style
2. `handleFontChange()` dispatches `setFont(fontId)` action
3. Font reducer:
   - Updates state with new font ID
   - Saves to localStorage
   - Constructs Google Fonts URL
   - Updates or creates `<link>` element in document head
   - Applies CSS font-family to document root
4. All components automatically use the new font (no page reload needed)

### Font Persistence
- Selected font is saved to localStorage as `selectedFont`
- Font loads automatically on app restart
- If no font is saved, defaults to "Inter"

### Global Application
- Font is applied to `document.documentElement.style.fontFamily`
- All child elements inherit the font automatically
- Works across all pages and components

## Usage Example

To change font programmatically:
```jsx
import { useDispatch } from "react-redux";
import { setFont } from "../redux/fontSlice";

function MyComponent() {
  const dispatch = useDispatch();
  
  const changeFontToRoboto = () => {
    dispatch(setFont("roboto"));
  };
  
  return <button onClick={changeFontToRoboto}>Use Roboto</button>;
}
```

## Font IDs Reference
- `inter`, `poppins`, `roboto`, `playfair`, `lora`
- `opensans`, `montserrat`, `raleway`, `nunito`, `ubuntu`
- `quicksand`, `josefin`, `sourceserif`, `sourcecode`, `ibmlex`

## Testing the Implementation
1. Navigate to Settings page
2. Open "Appearance Settings"
3. Scroll to "Font Style" section
4. Click on any font option
5. Font changes instantly across entire app
6. Refresh page - font selection persists
7. Toggle between light/dark mode - fonts display correctly

## Performance Notes
- Google Fonts are loaded on-demand only when user selects them
- Initial page load uses Inter font for performance
- Font links are cached by browser for subsequent visits
- No impact on app performance or bundle size

## Future Enhancements
- Add font size multiplier slider (0.8x - 1.5x)
- Add font weight selector for supported fonts
- Add line-height adjustment
- Add letter-spacing adjustment
- Create font preview with actual content
