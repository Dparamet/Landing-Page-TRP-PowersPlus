# Spec: Handoff-Friendly Website Structure

## Objective
Make the TRP Powers Plus website easier to hand off to another developer or a non-programmer maintainer. Success means a new maintainer can install, run, test, build, update text, and replace portfolio images by following repository documentation without guessing which component file to edit.

## Tech Stack
- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Node built-in test runner
- Static export via `next.config.ts`

## Commands
- Install: `npm install`
- Run locally: `npm run dev`
- Run locally on another port: `npm run dev -- -p 3001`
- Test: `npm test`
- Lint: `npm run lint`
- Build/export: `npm run build`

## Project Structure
- `src/app/`: Next.js app shell, page layout, metadata, global CSS.
- `src/components/`: UI sections and interactive React components.
- `src/content/`: editable business content such as contact channels, service categories, service-selector guidance, and portfolio items.
- `src/locales/`: Thai and English website text.
- `src/lib/`: shared logic such as the solar estimator and cookie storage.
- `tests/`: regression tests for content shape and calculation logic.
- `public/images/`: website image files. Portfolio images belong in `public/images/portfolio/`.
- `docs/`: handoff notes, content-editing instructions, and project specs.

## Code Style
Keep editable content as plain objects with descriptive names:

```ts
export const companyProfile = {
  phoneDisplay: '+66 (0) 12-345-6789',
  email: 'TRPPowersplus@gmail.com',
  facebookUrl: 'https://facebook.com/TRPPowersplus',
};
```

React components should read content from `src/content/` and translations from `src/locales/` instead of hardcoding business details in multiple places.

## Testing Strategy
- Unit tests live in `tests/*.test.mjs`.
- Content tests should catch missing image files, mismatched translation keys, invalid contact URLs, incomplete service categories, and incomplete portfolio decision data.
- Calculator tests should lock Thailand-specific tariff assumptions and solar sizing behavior.
- Run `npm test`, `npm run lint`, and `npm run build` before handoff.

## Boundaries
- Always: keep Thai and English translation keys in sync, run tests before delivery, keep portfolio images under `public/images/portfolio/` or `public/images/`.
- Ask first: changing electricity tariff assumptions, adding dependencies, changing deployment target, replacing brand logo.
- Never: commit API keys or credentials, edit generated `.next/` or `out/`, remove tests to make the suite pass.

## Success Criteria
- README contains complete install, run, test, build, and handoff instructions.
- Non-programmers have a Thai guide for editing text and replacing images.
- Portfolio image paths are defined in one content file and validated by tests.
- Service categories define customer fit, included work, preparation guidance, and LINE lead messages.
- Portfolio items include category filters, flexible decision metrics, province, and before/during/after gallery images.
- Contact information is defined once and reused in contact/footer sections.
- `npm test`, `npm run lint`, and `npm run build` pass.

## Open Questions
- Final real phone number, address, Line ID, and Google Maps embed should be confirmed before production.
- Real portfolio project images should replace the temporary logo placeholder paths when available.
