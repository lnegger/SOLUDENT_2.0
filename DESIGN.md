# Design System: Gestión Dental Centralizada
**Project ID:** 1696540687454740377

## 1. Visual Theme & Atmosphere
**The Clinical Sanctuary**: The aesthetic is defined by surgical precision, intentional negative space, and a sophisticated editorial hierarchy. It rejects cluttered, "spreadsheet-heavy" layouts in favor of a curated workspace where information breathes. The atmosphere is calming yet authoritative, evoking the feeling of a high-end professional dental suite.

## 2. Color Palette & Roles
* **Deep Midnight Navy (#001e40):** Primary color used for core branding and architectural strength.
* **Surgical Steel Blue (#2d6484):** Secondary color representing modern precision.
* **Sanctuary White (#f7f9fb):** Base surface color for the global background, providing a clean, clinical foundation.
* **Subtle Slate (#f2f4f6):** Surface Container Low, used for primary work zones and grouping content without lines.
* **Pure Clarity White (#ffffff):** Surface Container Lowest, reserved for active interaction cards and "pop" of clarity.
* **Soft Clinical Gray (#e6e8ea):** Surface Container High, used for sidebars and secondary metadata panels.
* **Clinical Teal Gradient (#003366 to #004766):** A 45-degree linear gradient used for high-impact elements like navigation and primary actions.

## 3. Typography Rules
* **Headers & Display (Manrope):** A geometric, modern font used for dashboard welcomes and patient names. Conveys openness and structural trust.
* **Body & Data (Inter):** The industry standard for clinical legibility. Used for patient notes and technical dental records.
* **Editorial Detail:** Technical labels use all-caps with a 5% tracking (letter-spacing) increase to enhance the professional medical aesthetic.

## 4. Component Stylings
* **Buttons:** Primary buttons use the Clinical Teal Gradient with a subtly rounded 0.5rem (ROUND_FOUR) corner radius. Secondary buttons use a Soft Clinical Gray background to integrate into the page.
* **Cards/Containers:** Defined through tonal shifts rather than 1px borders. They use ROUND_FOUR corner roundness and sit in a hierarchy of layered planes.
* **Inputs/Forms:** "Soft Inputs" without 4-sided borders, using a subtle Soft Clinical Gray background and a 2px bottom-stroke in Deep Midnight Navy upon focus.
* **Navigation:** A pinned sidebar utilizing the signature gradient with light-stroke (1.5px) icons.

## 5. Layout Principles
* **Editorial White Space:** Significant vertical spacing (24px) between records instead of dividers to avoid "grid-trap."
* **Tonal Layering:** Depth is achieved by placing lighter cards on slightly darker backgrounds (e.g., Pure Clarity White on Sanctuary White), mimicking "paper-on-stone."
* **Ambient Depth:** Floating elements use extra-diffused shadows (`0px 20px 40px rgba(0, 30, 64, 0.06)`) tinted with the surface color for a natural, high-end feel.
* **The "No-Line" Rule:** 1px solid borders are strictly prohibited for sectioning; boundaries are defined exclusively through tonal hierarchy.
