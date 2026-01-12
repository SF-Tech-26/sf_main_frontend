# SubEventsPage - Centered Codex & Scroll Indicators

## ✅ Changes Applied

### 1. **Centered Codex When Few Events**
- **Condition**: When there are **6 or fewer events**
- **Behavior**: Codex container is vertically centered relative to the grimoire
- **CSS**: 
  ```css
  .codex-container.centered {
      display: flex;
      flex-direction: column;
      justify-content: center;
      overflow-y: visible;
  }
  ```
- **Implementation**: Dynamic class added based on event count
  ```jsx
  <div className={`codex-container ${events.length <= 6 ? 'centered' : ''}`}>
  ```

### 2. **Scroll Indicators (Arrows)**
- **Condition**: Shown when there are **more than 6 events**
- **Position**: 
  - Top arrow: Above the codex container
  - Bottom arrow: Below the codex container
- **Visual Effects**:
  - **Pulse animation**: Opacity fades in/out (0.6 → 1 → 0.6)
  - **Bounce animation**: Arrows move up/down slightly
  - **Gold gradient background**: Fades from gold to transparent
  - **Gold color**: Matches the grimoire theme (#b8860b)

### 3. **Codex Wrapper**
- New wrapper container to hold:
  - Top scroll indicator
  - Codex container
  - Bottom scroll indicator
- **Height**: Fixed at 520px to match grimoire
- **Centering**: Uses flexbox to center content vertically

## 🎨 Visual Design

### Scroll Indicators
```css
.scroll-indicator {
    position: absolute;
    width: 100px;
    height: 30px;
    background: linear-gradient(to bottom/top, rgba(184, 134, 11, 0.3), transparent);
    color: #b8860b;
    animation: pulse-glow 2s ease-in-out infinite;
}

.scroll-indicator .material-icons {
    font-size: 24px;
    animation: bounce-vertical 1.5s ease-in-out infinite;
}
```

### Animations
1. **Pulse Glow** (2s loop):
   - 0%: opacity 0.6
   - 50%: opacity 1
   - 100%: opacity 0.6

2. **Bounce Vertical** (1.5s loop):
   - 0%: translateY(0)
   - 50%: translateY(-3px)
   - 100%: translateY(0)

## 📊 Behavior Logic

```
IF events.length <= 6:
  - Codex is centered vertically
  - No scroll indicators shown
  - Scrollbar hidden (overflow-y: visible)

ELSE (events.length > 6):
  - Codex starts at top
  - Top arrow (↑) shown
  - Bottom arrow (↓) shown
  - Scrollbar visible
  - Arrows pulse and bounce to indicate scrollability
```

## 🎯 User Experience

### Few Events (≤6)
```
┌─────────────────┐
│                 │
│                 │
│   ┌─────────┐   │
│   │ Event 1 │   │ ← Centered
│   │ Event 2 │   │
│   │ Event 3 │   │
│   └─────────┘   │
│                 │
│                 │
└─────────────────┘
```

### Many Events (>6)
```
┌─────────────────┐
│       ↑         │ ← Top indicator (pulsing)
│   ┌─────────┐   │
│   │ Event 1 │   │
│   │ Event 2 │   │
│   │ Event 3 │   │
│   │ Event 4 │   │
│   │ Event 5 │   │
│   │ Event 6 │   │
│   │ Event 7 │ ↕ │ ← Scrollbar
│   └─────────┘   │
│       ↓         │ ← Bottom indicator (pulsing)
└─────────────────┘
```

## 🔧 Technical Details

### Structure
```jsx
<div className="codex-wrapper">
  {/* Top Scroll Indicator - Only if events > 6 */}
  {events.length > 6 && (
    <div className="scroll-indicator top">
      <span className="material-icons">keyboard_arrow_up</span>
    </div>
  )}
  
  {/* Codex Container - Centered if events <= 6 */}
  <div className={`codex-container ${events.length <= 6 ? 'centered' : ''}`}>
    {/* Event tabs */}
  </div>
  
  {/* Bottom Scroll Indicator - Only if events > 6 */}
  {events.length > 6 && (
    <div className="scroll-indicator bottom">
      <span className="material-icons">keyboard_arrow_down</span>
    </div>
  )}
</div>
```

## ✨ Benefits

✅ **Better Visual Balance**: Codex is centered when there are few events
✅ **Clear Scroll Indication**: Animated arrows show users they can scroll
✅ **Consistent Height**: Codex wrapper always matches grimoire height (520px)
✅ **Smooth Animations**: Subtle pulse and bounce effects
✅ **Responsive**: Adapts to number of events dynamically
✅ **Theme Consistent**: Gold colors match the grimoire aesthetic

## Files Modified
- `SubEventsPage.jsx` - Added codex wrapper, scroll indicators, and centered state
