# SubEventsPage - Final Updates

## ✅ Changes Applied

### 1. **Scroll Indicators on Existing Scrollbar**
- **Fixed**: Scroll indicators now overlay **on the scrollbar area** instead of being separate elements
- **Position**: 
  - Right-aligned on the scrollbar (right: 0)
  - Top indicator at top: 0
  - Bottom indicator at bottom: 0
- **Size**: 20px wide × 40px tall (compact to fit on scrollbar)
- **Visual**:
  - Gold background with transparency
  - Smaller icons (18px instead of 24px)
  - Pulse and bounce animations
  - Rounded corners (4px)

### 2. **Centered Codex (When Few Events)**
- **Condition**: When events ≤ 6
- **Behavior**: Codex container centers vertically
- **CSS**: 
  ```css
  .codex-container.centered {
      display: flex;
      flex-direction: column;
      justify-content: center;
      overflow-y: visible;
  }
  ```

### 3. **Background Image Added**
- **Image URL**: `https://lh3.googleusercontent.com/aida-public/AB6AXuBat5U2ZAyuxnX-siYfQGCZ1FFmyiEZ7Tz3wo6kgGW4hsit6WF0WPY0XCzYde0ev0UeOegtEe2Nm2siP5haopVe3yHBB7CZh7QvfrOv38RN3`
- **Properties**:
  - Background size: cover
  - Background position: center
  - Opacity: 0.3 (subtle, doesn't overpower content)
- **Layer Order**:
  1. Background image (bottom)
  2. Forest gradient overlay
  3. Noise texture
  4. Content (top)

## 🎨 Visual Layout

### Scroll Indicators on Scrollbar
```
┌──────────────┐
│ Event 1  ↑ ← │  Indicator on scrollbar
│ Event 2  ║   │
│ Event 3  ║   │
│ Event 4  ║   │
│ Event 5  ║   │
│ Event 6  ║   │
│ Event 7  ↓ ← │  Indicator on scrollbar
└──────────────┘
```

### CSS Structure
```css
.scroll-indicator-overlay {
    position: absolute;
    right: 0;              /* On the scrollbar */
    width: 20px;           /* Narrow to fit scrollbar */
    height: 40px;
    background: rgba(184, 134, 11, 0.15);
    color: #b8860b;
    z-index: 10;
    animation: pulse-glow 2s ease-in-out infinite;
}
```

## 🔧 Technical Implementation

### Wrapper Structure
```jsx
<div className="codex-wrapper">
  {/* Codex Container */}
  <div className={`codex-container ${events.length <= 6 ? 'centered' : ''}`}>
    {/* Event tabs */}
  </div>
  
  {/* Scroll Indicators - Only if > 6 events */}
  {events.length > 6 && (
    <>
      <div className="scroll-indicator-overlay top">
        <span className="material-icons">keyboard_arrow_up</span>
      </div>
      <div className="scroll-indicator-overlay bottom">
        <span className="material-icons">keyboard_arrow_down</span>
      </div>
    </>
  )}
</div>
```

### Background Layers
```jsx
<div className="fixed inset-0 z-0 pointer-events-none">
  {/* 1. Main Background Image */}
  <div style={{
    backgroundImage: 'url(...)',
    opacity: 0.3
  }}></div>
  
  {/* 2. Forest Gradient Overlay */}
  <div className="bg-forest-gradient"></div>
  
  {/* 3. Noise Texture */}
  <div className="opacity-20" style={{
    backgroundImage: 'url(noise-svg)'
  }}></div>
</div>
```

## ✨ Benefits

✅ **Scroll indicators on existing scrollbar** - No extra space taken
✅ **Compact design** - 20px wide indicators fit perfectly on scrollbar
✅ **Centered codex** - Better visual balance with few events
✅ **Background image** - Adds depth and atmosphere to the page
✅ **Subtle opacity** - Background doesn't overpower the grimoire content
✅ **Smooth animations** - Pulse and bounce effects guide the eye

## Files Modified
- `SubEventsPage.jsx` - Updated scroll indicators, added background image
