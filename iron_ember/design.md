---
name: Iron & Ember
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1b1c1c'
  surface-container: '#1f2020'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353535'
  on-surface: '#e5e2e1'
  on-surface-variant: '#e2beba'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#303030'
  outline: '#aa8986'
  outline-variant: '#5a403e'
  surface-tint: '#ffb4ac'
  primary: '#ffb4ac'
  on-primary: '#690007'
  primary-container: '#b22222'
  on-primary-container: '#ffc8c2'
  inverse-primary: '#b52424'
  secondary: '#c6c6cb'
  on-secondary: '#2f3034'
  secondary-container: '#46464b'
  on-secondary-container: '#b5b4ba'
  tertiary: '#c6c6c7'
  on-tertiary: '#2f3131'
  tertiary-container: '#5b5c5c'
  on-tertiary-container: '#d4d5d5'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad6'
  primary-fixed-dim: '#ffb4ac'
  on-primary-fixed: '#410003'
  on-primary-fixed-variant: '#92030f'
  secondary-fixed: '#e3e2e7'
  secondary-fixed-dim: '#c6c6cb'
  on-secondary-fixed: '#1a1b1f'
  on-secondary-fixed-variant: '#46464b'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353535'
typography:
  display-xl:
    fontFamily: Archivo Narrow
    fontSize: 64px
    fontWeight: '800'
    lineHeight: '1.0'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Archivo Narrow
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.1'
  headline-lg-mobile:
    fontFamily: Archivo Narrow
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.1'
  headline-md:
    fontFamily: Archivo Narrow
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.1em
  technical-data:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 16px
  margin-mobile: 20px
  margin-desktop: 64px
---

## Brand & Style

The design system is engineered for the serious griller and pitmaster, evoking the rugged reliability of heritage outdoor gear and industrial machinery. The brand personality is authoritative, durable, and utilitarian, positioning the product as a high-performance tool rather than a mere app. It targets an audience that values craftsmanship, precision cooking, and "over-fire" culture.

The visual style is **Tactile / Industrial Brutalism**. It prioritizes high-functionality through heavy visual weights, physical metaphors (stamped metal, debossed leather), and a "built-to-last" aesthetic. The UI should feel heavy, using thick borders and mechanical intersections to ground the digital experience in the physical world of steel and smoke.

## Colors

The palette is rooted in the "Pit and Forge" environment. **Charcoal** serves as the primary atmospheric base, providing a high-contrast backdrop for technical data. **Deep Clay Red** is the functional accent, used for high-heat warnings, primary actions, and "branded" elements. **Brushed Steel** provides a mid-tone for secondary UI elements and technical diagrams, while **Off-white** ensures maximum legibility for body copy and critical data readouts.

The color system utilizes a heavy-duty dark mode by default to minimize glare in outdoor cooking environments. Use high-contrast ratios (7:1 or higher) for all functional text against charcoal backgrounds.

## Typography

Typography is treated as an engineering spec. Headlines use **Archivo Narrow** in heavy weights to mimic industrial stamping and bold signage; these should always be uppercase to maintain a "branded" look.

For body content, **Hanken Grotesk** provides a clean, modern contrast that ensures recipes and instructions remain readable under varying light conditions. **JetBrains Mono** is utilized for technical data points (temperatures, durations, weights) to reinforce the precision-tool narrative and provide a distinct "instrument cluster" feel.

## Layout & Spacing

This design system employs a **Fixed Grid** model with high-density spacing. The layout is built on an 8px square grid, emphasizing structural rigidity. 

- **Desktop:** 12-column grid, 1200px max-width, center-aligned.
- **Mobile:** 4-column grid with 20px outer margins.
- **Rhythm:** Use large vertical gaps (48px+) between major content sections to simulate the "sections" of a technical manual. 

Components should feel "locked-in." Avoid fluid, airy layouts; instead, stack elements with visible "seams" or 2px charcoal dividers to create a modular, assembly-line feel.

## Elevation & Depth

Depth is achieved through **Materiality and Stacking** rather than soft ambient lighting.

1.  **The Base:** Backgrounds use a subtle "Cast Iron" texture (noise/grain at 5% opacity).
2.  **Debossed Surfaces:** Form inputs and secondary containers should appear "stamped into" the surface using inner shadows (1px, 90-degree angle, black at 40% opacity).
3.  **Raised Plates:** Primary cards and "Action Blocks" use 2px solid borders in Brushed Steel (#8E8E93) with a hard, 4px "drop shadow" (100% opacity, no blur) to create a physical, plate-on-plate effect.
4.  **Tactile Overlays:** Use high-grain leather textures on "Premium" or "Featured" cards to add warmth and a premium, rugged feel.

## Shapes

The shape language is strictly **Soft-Industrial**. We avoid sharp 90-degree corners to mimic the radiused edges of machined metal parts and heavy-duty coolers.

- **Standard Elements:** 4px (0.25rem) radius for a "stamped metal" look.
- **Large Containers/Cards:** 8px (0.5rem) radius.
- **Interactive States:** Maintain the same radius but increase border thickness from 1px to 3px to indicate focus or selection.
- **Iconography:** Icons must be enclosed in circular or "badge" shapes, appearing as if they were heat-branded or laser-etched into the UI.

## Components

- **Buttons:** Primary buttons are Deep Clay Red with white Archivo Narrow text. They feature a 2px top-highlight and a 2px bottom-shadow to create a "mechanical switch" effect.
- **Technical Cut Maps:** Use "Brushed Steel" vector outlines for meat cuts (cow, pig, lamb) with technical callouts using JetBrains Mono.
- **Passport Stamps:** Used for "Achievement" or "Cook Verification" badges. These should have a rough, ink-bleed edge and 15-degree rotation for an authentic "hand-stamped" look.
- **Input Fields:** Styled like gauges. Use a dark inner-shadow and a technical "unit" label (e.g., °F, lbs) pinned to the right side in JetBrains Mono.
- **Social Feed Cards:** Heavy borders (2px) and a "header plate" that looks like an etched serial number plate. Images should have a slight vignette and high-contrast treatment to match the rugged aesthetic.
- **Chips/Tags:** Styled as "Riveted Tags"—small rectangles with 4px radius and a small circle icon on the left/right edges representing a rivet hole.