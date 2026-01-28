# One-time Offer A/B Experiment – Readout

## What I did

- Created the experiment in **Firebase A/B Testing**, including control and variant setup, variant assignment, and `in_app_purchase` as the experiment goal.
- Implemented the one-time offer experiment flow:
  - Track paywall close count
  - Show the discounted offer **only after the 2nd eligible paywall close**
  - Ensure the offer is shown **only once per user** and persists across app restarts

- Added a dedicated one-time offer paywall screen.
- Implemented assets (hero image, logo, close button) and matched layout spacing to the provided Figma specs (header height, paddings, content width, CTA sizing).
- Added claim feedback (toast) and close behavior that returns the user to the main map/home screen.
- Left the experiment defaulted to the Variant during development to make testing and validation of the offer flow easier. This can be switched back to normal rollout settings at any time in Firebase.

---

## One-time offer flow (demo)

![One-time offer](apps/mobile/assets/images/one-time-offer.gif)

---

## Issues I ran into

### iOS local environment issues

I ran into local Xcode / iOS simulator issues on my machine (unrelated to the app code itself) that I didn’t have time to fully resolve within the scope of this assignment.

To avoid blocking progress, I validated the full experiment flow on Android, where I was able to test all scenarios end-to-end (control vs variant, second paywall close, one-time offer display, persistence across restarts).

The implementation itself is platform-agnostic and should behave identically on iOS once the environment issue is resolved.

---

## Choices I made (and why)

- Used `require()` for images instead of static imports to avoid TypeScript module declaration friction and keep React Native asset handling predictable.
- For claim confirmation, used an Expo-safe approach:
  - Native Android toast
  - iOS fallback alert
    This avoided pulling in additional dependencies for a simple acknowledgement.

- Avoided hardcoded navigation resets to guessed route names and instead targeted known, valid navigation paths to prevent runtime errors.

---

## What I’d do with more time

- Move hardcoded spacing, colors, and fonts into design tokens (e.g. `tokens/spacing.ts`, `tokens/colors.ts`, `tokens/typography.ts`) to keep the UI aligned with the rest of the app.
- Implement a consistent cross-platform toast (same UX on iOS and Android).
- Add a loading / disabled state on the claim CTA to prevent double-taps.
- Expand analytics and experiment tracking with consistent event naming and payloads.
- Add rollout safety:
  - Feature flag via Remote Config
  - Kill switch
  - Variant assignment persistence

- Fully validate visually on iOS once local environment issues are resolved.
- Add defensive handling for navigation edge cases (deep links, interrupted stacks).

---

## Autonomy / improvements proposed

I kept the core experiment intact (one-time offer after the 2nd paywall close) while tightening flow reliability and UX:

- Navigation close logic targets actual route names instead of guessed routes, preventing reset errors and improving UX consistency.
- Delayed closing the screen slightly after showing the toast so the user can actually see the confirmation.
- UX improvements proposed:
  - Disabled CTA + spinner on claim
  - Optional “Limited time” or “50% off” pill for clarity (if consistent with design)

- Analytics events proposed:
  - `paywall_shown` (regular vs one-time-offer, source, variant)
  - `paywall_closed` (count, reason)
  - `offer_shown`
  - `offer_claim_clicked`
  - `offer_claim_success` / `offer_claim_failed`

- Safety & edge-case handling proposed:
  - Handle purchase failures without dismissing the paywall

- Styling improvements proposed:
  - Replace local spacing constants with shared spacing atoms
  - Introduce a shared Header component for paywalls
  - Load and apply the Vadelma font only to the brand wordmark

---
