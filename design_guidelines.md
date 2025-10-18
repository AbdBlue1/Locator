# Design Guidelines: Pret A Manger UK Branch Finder

## Design Approach

**Selected Framework:** Material Design with Pret Brand Integration  
**Rationale:** This is a utility-focused location finder application where efficiency and usability are paramount. Material Design provides excellent patterns for data-dense interfaces, interactive maps, and search functionality. We'll customize it with Pret's distinctive brand identity.

**Key Design Principles:**
1. **Clarity First:** Information hierarchy prioritizes findability
2. **Brand-Aligned Minimalism:** Clean, uncluttered interface reflecting Pret's modern aesthetic
3. **Responsive Efficiency:** Seamless experience across desktop and mobile devices

---

## Core Design Elements

### A. Color Palette

**Primary Colors:**
- Pret Burgundy: `350 75% 45%` - Primary brand color for headers, CTAs, active states
- Deep Burgundy: `350 80% 35%` - Hover states, depth emphasis
- Light Burgundy Tint: `350 50% 95%` - Backgrounds, subtle highlights

**Neutral Base:**
- White: `0 0% 100%` - Primary background, cards
- Light Gray: `0 0% 96%` - Secondary backgrounds, dividers
- Medium Gray: `0 0% 60%` - Secondary text, icons
- Dark Charcoal: `0 0% 20%` - Primary text, headings

**Functional Colors:**
- Success Green: `142 70% 45%` - Open status indicators
- Warning Amber: `38 90% 50%` - Limited hours indicators
- Error Red: `0 70% 50%` - Closed status, errors
- Info Blue: `210 80% 55%` - Active map markers, links

### B. Typography

**Font Families:**
- Primary: 'Inter', system-ui, sans-serif (clean, highly legible)
- Monospace: 'JetBrains Mono', monospace (postcodes, times)

**Type Scale:**
- Display (Hero): 3rem / 48px, font-weight 700
- H1: 2rem / 32px, font-weight 700
- H2: 1.5rem / 24px, font-weight 600
- H3: 1.25rem / 20px, font-weight 600
- Body: 1rem / 16px, font-weight 400
- Small: 0.875rem / 14px, font-weight 400
- Micro: 0.75rem / 12px, font-weight 500 (labels, badges)

**Text Styles:**
- Headers: Burgundy primary color
- Body text: Dark charcoal for high contrast
- Secondary text: Medium gray for de-emphasis
- Links: Info blue with underline on hover

### C. Layout System

**Spacing Primitives:**  
Use Tailwind units: **2, 4, 6, 8, 12, 16, 24** (as in p-2, m-4, gap-6, etc.)

**Grid Structure:**
- Desktop: Two-column layout (sidebar 30% / map 70%)
- Tablet: Collapsible sidebar or tab-based navigation
- Mobile: Stacked layout with toggle between list and map views

**Container Widths:**
- Full width: Map container (100vw for immersive experience)
- Sidebar: Fixed 400px on desktop, full-width on mobile
- Content max-width: 1440px for any centered content sections

**Responsive Breakpoints:**
- Mobile: < 768px (single column, stacked views)
- Tablet: 768px - 1024px (collapsible sidebar)
- Desktop: > 1024px (persistent sidebar + map)

### D. Component Library

**Navigation:**
- Top header bar: White background with Pret burgundy logo, height 64px
- Search bar: Prominent placement in header or sidebar top, rounded corners (border-radius: 8px)
- Filter chips: Pill-shaped buttons with outline style, burgundy accent when active

**Map Container:**
- Full-height interactive map (Leaflet or Mapbox)
- Custom map markers: Burgundy coffee cup icon or circular burgundy pins
- Map controls: Bottom-right corner (zoom, locate me, reset view)
- Cluster markers: Numbered burgundy circles when multiple locations overlap

**Location Cards (Sidebar List):**
- White cards with subtle shadow (shadow-md)
- Spacing: p-4, gap-3 between elements
- Rounded corners: rounded-lg (12px)
- Border: 1px light gray, burgundy left accent bar (4px) on hover
- Content structure:
  - Location name: H3 weight, burgundy color
  - Address: Body text, gray color
  - Distance indicator: Small text with location icon
  - Opening hours: Badge component (green=open, amber=closing soon, red=closed)
  - "Get Directions" link: Info blue, small weight

**Map Popups:**
- White background with rounded corners (rounded-md, 8px)
- Compact padding: p-3
- Same content as cards but condensed
- Primary CTA button: "View Details" in burgundy

**Search & Filters:**
- Search input: Full-width, icon prefix, clear button suffix
- Filter toggles: Checkbox group for "Open Now", "24/7", "Delivery Available"
- Sort dropdown: Distance, Name A-Z, Opening hours

**Status Badges:**
- Open: Green background, white text, "Open until HH:MM"
- Closing Soon: Amber background, dark text, "Closes at HH:MM"
- Closed: Red background, white text, "Closed • Opens MON HH:MM"
- Border-radius: rounded-full (pill shape)
- Padding: px-3 py-1

**Loading States:**
- Skeleton screens for location cards (animated pulse)
- Map loading: Centered spinner with burgundy color
- Shimmer effect: Light gray to white gradient

**Empty States:**
- Icon: Large gray location pin icon
- Message: "No Pret locations found in this area"
- CTA: "Clear filters" or "Search different location"

### E. Interactions & Animations

**Use Sparingly:**
- Card hover: Subtle lift (translateY -2px) with enhanced shadow, 200ms ease
- Map marker click: Gentle bounce animation
- List item selection: Smooth background color transition to light burgundy
- Sidebar toggle: Slide animation (300ms ease-in-out)

**No Animations:**
- Search filtering (instant update)
- Status badge changes
- Map panning/zooming (native map controls)

---

## Key Features & Layout

### Header Component:
- Pret logo (left-aligned, 120px width)
- Search bar (center, max-width 600px)
- "About" and "Help" links (right-aligned)
- Mobile: Hamburger menu, search icon trigger

### Sidebar (Desktop) / Bottom Sheet (Mobile):
- Sticky search bar at top
- Filter chips row below search
- Scrollable location list with infinite scroll
- Results counter: "Showing 247 locations"
- Compact view toggle: List vs. Grid cards

### Map View:
- Interactive UK map centered on geographic center
- Zoom level: 6 (shows entire UK)
- Marker clustering for dense areas (London)
- User location indicator (blue pulsing dot)
- Tooltip on marker hover showing location name
- Click to open detailed popup

### Mobile Optimizations:
- Tabs: "Map" and "List" toggle at top
- Floating search button over map
- Swipeable location cards (carousel style)
- "Get Directions" opens native maps app

---

## Accessibility

- High contrast ratios: 4.5:1 minimum for all text
- Keyboard navigation: Full tab support for all interactive elements
- Focus indicators: 2px burgundy outline on all focusable items
- ARIA labels: Descriptive labels for map controls, buttons, and status badges
- Screen reader announcements: Location count updates, filter changes

---

## Brand Consistency

Pret's visual identity emphasizes **clean, welcoming, and efficient** design. This application reflects that through:
- Generous whitespace preventing visual clutter
- Burgundy accents sparingly used for emphasis (not overwhelming)
- Clear typography hierarchy for rapid information scanning
- Professional, trustworthy aesthetic befitting a food service brand

This is a **functional tool**, not a marketing page—design serves usability above all else.