---
name: aio-frontend-design
description: Design, build, restyle or critique a user interface (web page, app screen, component, dashboard) and check it against one quality list covering accessibility, layout, type, color, motion and states. Use for any task that changes how an interface looks, feels or responds.
---

# Frontend design

## 1. Read the brief and the project

- The brief wins. Honor named fonts, palettes, eras and references even when they break a rule below.
- Refining keeps the existing identity, copy and behaviour outside the scope. Redesigning keeps the product's content and function.
- Look for a design system first: tokens, components, `DESIGN.md`, Tailwind config. Extend it rather than adding a parallel one.

## 2. Set the ambition from the surface

| Surface | The visitor wants to | Design for |
| --- | --- | --- |
| Persuade: landing, pricing, campaign | decide and act | a clear point of view and one strong focal point |
| Operate: app UI, dashboard, settings, admin | finish a task | scanability, consistency, familiar patterns |
| Read: docs, articles, changelog | understand | measure, hierarchy, comfortable reading |
| Experience: portfolio, gallery | look at the work | the content first; the interface recedes |

Choose by the page, not the product: a developer tool's landing page is still Persuade.

## 3. Build

- Real content: real copy, real data shapes. No lorem ipsum, no invented statistics, testimonials or logos.
- Every interactive element has hover, focus, active, disabled, loading and error states. Lists have an empty state.
- Choose web APIs with `aio-modern-web`. For a ready-made component, see `aio-ui-components`.

## 4. Check

### Accessibility (blocking)

- Text contrast at least 4.5:1, large text 3:1. Test it; don't eyeball it.
- Every control works with the keyboard and shows a visible focus ring.
- Images have alt text; icon-only buttons have an accessible name.
- Respect `prefers-reduced-motion`.

### Layout

- No horizontal scroll from 320 px up. Text never escapes its container.
- Touch targets at least 44 × 44 px.
- Spacing follows one scale. Related items sit closer than unrelated ones; more space above a heading than below it.

### Type and color

- Body text 16 px or larger, line length about 65 to 75 characters.
- Colors come from tokens, not raw hex in components. One accent color unless the brief says otherwise.

### Motion

- Motion explains a change of state. Animate `transform` and `opacity`; avoid animating layout properties.

### Avoid by default

The brief can ask for any of these.

- Grids of identical icon-heading-text cards as the page structure; cards inside cards.
- Gradient text, decorative glassmorphism, glowing shadows, purple-to-blue gradients.
- An eyebrow label above every heading; "01 / 02 / 03" section numbers that carry no meaning.
- Emoji or Unicode glyphs in place of an icon set.
- Monospace type as a costume for "technical".

## 5. Verify by looking

Render the result and look at it at the sizes it ships at: phone, tablet, desktop, light and dark if supported. Fix what one look shows, then look again. With Chrome DevTools MCP available, use `aio-browser-debug` to take screenshots and run an accessibility check.

Optional upstream tools, if installed by the user: `npx impeccable detect <path-or-url>` runs impeccable's design detector; the ui-ux-pro-max skill adds a searchable database of palettes, font pairings and UX rules.

Adapted from miqdadbadjuber/anti-slop (MIT), nextlevelbuilder/ui-ux-pro-max-skill (MIT) and pbakaus/impeccable (Apache-2.0). Merged and rewritten for AIO-AGENT.
