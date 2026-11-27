---
name: ARZ
description: Premium panjabis and bespoke tailoring from Bangladesh, warm, refined and minimal.
colors:
  walnut-thread: "#3D2500"
  zari-gold: "#BFA27E"
  unbleached-muslin: "#EFEBE0"
  ink: "#1A1A1A"
  slate-muted: "#666666"
  pure-white: "#FFFFFF"
  hairline: "rgba(0,0,0,0.08)"
  sale-red: "#CC0000"
typography:
  display:
    fontFamily: "'Frank Ruhl Libre', serif"
    fontSize: "clamp(20px, 3vw, 28px)"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: "'Frank Ruhl Libre', serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.5px"
  body:
    fontFamily: "'Frank Ruhl Libre', serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "-0.01em"
  nav:
    fontFamily: "'Frank Ruhl Libre', serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "1px"
  label:
    fontFamily: "'Frank Ruhl Libre', serif"
    fontSize: "10px"
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: "2px"
rounded:
  none: "0px"
  xs: "4px"
  md: "12px"
  pill: "50px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "40px"
  xl: "60px"
  2xl: "80px"
components:
  button-primary:
    backgroundColor: "{colors.walnut-thread}"
    textColor: "{colors.pure-white}"
    rounded: "{rounded.pill}"
    padding: "16px 48px"
    typography: "{typography.label}"
  button-solid-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.unbleached-muslin}"
    rounded: "{rounded.xs}"
    padding: "16px 24px"
  product-card:
    backgroundColor: "{colors.unbleached-muslin}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
  header:
    backgroundColor: "{colors.unbleached-muslin}"
    textColor: "{colors.walnut-thread}"
    height: "70px"
  announcement-bar:
    backgroundColor: "#000000"
    textColor: "{colors.pure-white}"
    height: "36px"
    typography: "{typography.label}"
---

# Design System: ARZ

## Overview

**Creative North Star: "The Tailor's Atelier"**

ARZ feels like a tailor's workshop on a quiet afternoon: unbleached cloth on the table, deep walnut thread, a glint of zari. The page is warm muslin, never stark white. Garment photography does the talking, framed edge to edge, and the interface stays out of its way. Type is a classical serif throughout, so even prices and labels read as considered rather than transactional.

The mood is **warm, refined and minimal**. Space is generous, elements are few, and ornament comes from the clothes themselves, not the UI. Interactive pieces are **soft and tactile**: pill-shaped calls to action, gentle lifts and image swaps on hover, never sharp jolts.

**Key Characteristics:**
- Warm muslin background (never pure white) with walnut-brown and ink text.
- Classical serif everywhere; uppercase, wide-tracked labels for navigation and small captions.
- Full-bleed, square-cornered product imagery; soft pill CTAs.
- Gold appears as an accent detail, not a fill.
- Calm motion: short fades and small lifts, respecting reduced-motion.

## Colors

A warm, low-saturation palette of cloth and thread, with one restrained metallic accent.

### Primary
- **Walnut Thread** (walnut-thread): the brand colour. Logo, header text, primary CTA fill, the slim scrollbar, focus rings.

### Secondary
- **Zari Gold** (zari-gold): accent detail like the gold thread in embroidery. Thin rules, highlights, small badges, hover hints. Never a large fill.

### Neutral
- **Unbleached Muslin** (unbleached-muslin): the page, header and card background everywhere.
- **Ink** (ink): body text, headings, prices, solid dark panels (e.g. the size-spec box).
- **Slate Muted** (slate-muted): secondary text, inactive tabs, meta info.
- **Hairline** (hairline): dividers and borders.
- **Pure White** (pure-white): text on dark fills only, never as a page background.
- **Sale Red** (sale-red): sale and error states only.

### Named Rules
**The Muslin Ground Rule.** The page background is always Unbleached Muslin. White surfaces read as a different, colder brand.

**The Zari Thread Rule.** Gold is a thread, not a fabric: use it for lines, small marks and highlights, never as a background block or a large button.

## Typography

**Font:** Frank Ruhl Libre (with serif), weights 300–900, loaded from Google Fonts

**Character:** One classical text serif carries every role. Hierarchy comes from size, weight and uppercase tracking, so headings, labels and prices read as tailoring labels and printed price tags rather than web UI.

### Hierarchy
- **Display** (400, clamp(20px, 3vw, 28px), 1.2): page and collection titles.
- **Title** (600, 16px, 1.4, uppercase, 0.5px tracking): product names on cards; 13px on phones.
- **Body** (400, 14px, 1.5): descriptions, details, form text.
- **Nav** (600, 14px, uppercase, 1px tracking): header menu, in Walnut Thread.
- **Label** (500–700, 10–11px, uppercase, 2px tracking): announcement bar, badges, section kickers, CTA text.

### Named Rules
**The Single Family Voice Rule.** Everything is serif. No sans-serif UI text, including buttons and forms.

## Layout

- Full-width layout with 40px side padding on desktop, 16–20px on phones.
- Product grids: 4 columns (desktop), 3 (≤1200px), 2 (≤900px and on phones), with a 20px gap on collection pages. The homepage product grid is deliberately edge-to-edge with no gap, in 3 columns.
- Spacing rhythm: 8 / 16 / 24 / 40 / 60 / 80px.
- Header is fixed over the page on desktop (below the 36px announcement bar) and in normal flow on phones (≤768px). Page offsets use the measured header height, never a hardcoded one.
- Breakpoints in use: 480, 768, 900, 1024, 1200px.

## Elevation & Depth

Mostly flat. Depth comes from photography and tonal contrast (ink panels on muslin), not stacked shadows. Shadows appear only in response to state: the header once scrolled, and hover on floating elements.

### Shadow Vocabulary
- **Header settled** (`box-shadow: 0 2px 10px rgba(0,0,0,0.08)`): the fixed header after scrolling.
- **Soft lift** (`box-shadow: 0 8px 20px rgba(0,0,0,0.18)`): hovered floating panels (e.g. the size-spec box).
- **CTA hover** (`box-shadow: 0 8px 25px rgba(0,0,0,0.15)`): pill buttons on hover.

### Named Rules
**The Flat-At-Rest Rule.** Surfaces are flat at rest; shadows only answer to interaction or scroll state.

## Shapes

Two shape families: **square** for anything that frames the garment (product images, cards, gallery, gallery video) and **soft** for things you press (pill CTAs at 50px, inputs and small panels at 4–12px). Badges and chips use a small 2–4px radius.

**The Square Frame Rule.** Garment imagery is never rounded; rounding is reserved for controls.

## Components

### Buttons
- **Shape:** pill (50px) for primary CTAs; small radius (4px) for full-width form buttons.
- **Primary:** Walnut Thread fill, white uppercase label text with 2px tracking, 16px × 48px padding.
- **Hover / Focus:** a 2px lift with the CTA hover shadow; keyboard focus shows a 2px Walnut Thread outline offset by 2px.
- **Solid Ink:** Ink fill with muslin text for add-to-cart and checkout.

### Cards / Containers
- **Product card:** square full-bleed image (4:5), muslin background, no border. On hover, the image swaps to the second photo or plays the hover video, with a slight zoom. No card lift.
- **Info:** uppercase serif title, clamped to 2 lines, and the price in Ink at 600 weight. Sale shows the original price struck through, then the sale price.
- **Badges:** small uppercase labels top-left (SOLD OUT, SALE, SAVE ৳…, NEW).

### Navigation
- **Header:** muslin bar with Walnut Thread menu text (uppercase, tracked) and a centred wordmark. Transparent with the light logo only over the homepage hero; solid elsewhere. Hides after deliberate downward scrolling, returns on scrolling up, and never hides while a menu or drawer is open.
- **Announcement bar:** black strip, white 10px uppercase marquee separated by ✦.
- **Mobile:** hamburger left, logo centred, account and cart right; a slide-in muslin drawer.

### Size Spec Panel (signature)
An Ink panel under the size selector that shows the chosen size's measurements in muslin text. It reads "CHOOSE YOUR SIZE" until a size is picked.

## Do's and Don'ts

### Do:
- **Do** keep every page on Unbleached Muslin, with Walnut Thread and Ink for text.
- **Do** let photography run full-bleed with square corners.
- **Do** use uppercase, wide-tracked serif for navigation, labels and CTAs.
- **Do** keep motion short (≈0.3–0.7s, ease-out), small (≤18px travel), and off under reduced motion.
- **Do** scope section CSS to its own section wrapper. Shopify loads every section's styles on every page.

### Don't:
- **Don't** use white page backgrounds or cold greys as surfaces.
- **Don't** use gold as a fill or for large buttons.
- **Don't** round garment images or put them in floating rounded frames.
- **Don't** introduce sans-serif UI type.
- **Don't** borrow Corso Velle's visual identity; ARZ stays distinct.
