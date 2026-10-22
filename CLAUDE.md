# foundry-getting-lost

Shared standards live in `.claude/rules/` (loaded automatically); this file covers only what is specific to this package.

## What this is

Foundry VTT module "Getting Lost Helper" (id `foundry-getting-lost`). Adds two `JournalEntryPage` subtypes:

- `foundry-getting-lost.lostMap`: map image + number of divisions (1-5 in the sheet) + flavor text. The "Run Lost Map" button rolls `{divisions}d20` and creates a result page.
- `foundry-getting-lost.lostMapResult`: read-only page showing the map, the rolls (as compass quadrants), and the landing spot, with toggleable division lines.

TypeScript, compiled with `tsc` to `dist/`. Target: Foundry v13 minimum, v14 verified. Intended to be system-agnostic (see Gotchas).

## Commands

- `npm ci`: install dependencies.
- `npm run check`: lint (ESLint, type-aware), Prettier check, JSON validation of `module.json` and `src/languages/en.json`, and `tsc --noEmit`. Must exit 0 before every commit; CI runs the same command.
- `npm run lint:fix` / `npm run format`: auto-fix lint and formatting.
- `npm run build:all`: clean `dist/`, compile `src/scripts` via `tsc`, copy other `src/*` folders into `dist/`.
- `npm run watch:all`: `tsc --watch` plus static-file copy on change.
- `npm run typecheck` (`tsc --noEmit`): type check only. Must pass (`strict` is on).
- No test suite (`npm test` is a placeholder that fails).

## Layout

- `src/scripts/module.ts`: entry point. `init` hook calls `settings.init()` and `lostMaps.init()`.
- `src/scripts/lostMaps.ts`: registers the data models and sheets; sidebar hook stub.
- `src/scripts/settings.ts`: setting registration and typed get/set wrapper.
- `src/scripts/models/`: `TypeDataModel`s for the map and the result (the result extends the map and adds `rollResult`).
- `src/scripts/sheets/`: one page sheet per subtype (both extend `JournalTextPageSheet`).
- `src/scripts/template.ts`: builds template paths under the module's `dist/templates` folder.
- `src/scripts/logger.ts`: module logger (prefix `Getting Lost Helper`). Use it instead of `console.*`.
- `src/templates/journal/`: Handlebars templates: map edit, map view, result view.
- `src/styles/module.css`, `src/languages/en.json` (the only language file): copied verbatim to `dist/`.
- `copyStatic.mjs`: copies every `src/*` folder except `src/scripts` into `dist/`.
- `.github/workflows/main.yml`: on GitHub release, replaces tokens in `module.json`/`package.json`, runs `npm ci` and `npm run build:all`, zips `module.json README.md LICENSE dist/`.
- `module.json` loads `dist/scripts/module.js`, `dist/styles/module.css`, `dist/languages/en.json`.

## Foundry integration

- Subtypes declared in `module.json` `documentTypes.JournalEntryPage` (`lostMap`, `lostMapResult`); both have `htmlFields: ["text"]` and `filePathFields.mapImage`.
- `init` hook: `CONFIG.JournalEntryPage.dataModels` gets both models; `DocumentSheetConfig.registerSheet(JournalEntryPage, ...)` registers sheet ids `fgl-lost-map` and `fgl-lost-map-result`.
- Setting `foundry-getting-lost.results-show-divisions` (world, boolean, default true): initial visibility of division lines on result pages.
- Hook `renderSidebarTab` is registered but only logs; the button code behind it is dead (see legacy list).
- Sheet actions (`data-action`): `run-map` (roll, create result page, `Journal.show`), `toggle-divisions` (class toggle only, not persisted).
- Result math: each roll picks a quadrant (`>= 10` south, `5 < r < 16` east); position halves per roll. Lines/coordinates are computed in the sheets and passed to templates as CSS custom properties.
- i18n keys: `foundry-getting-lost.*` in `src/languages/en.json`. CSS classes are prefixed `fgl-`.

## Known legacy patterns

Per the strict upgrade rule, touching a file means bringing it to standard first, in a separate commit. Items marked "ask" are migration-sized: stop and ask before converting.

- `src/scripts/sheets/LostMap.ts`, `src/scripts/sheets/LostMapResult.ts`: ApplicationV1 `JournalTextPageSheet` with `defaultOptions`, `getData`, `activateListeners`, jQuery (`$(...)`, `.find().on()`) -> `foundry.applications.sheets.journal.JournalEntryPageHandlebarsSheet` (AppV2, `HandlebarsApplicationMixin`, `_prepareContext`, `static DEFAULT_OPTIONS.actions`, DOM APIs). Ask. Verify the exact class names against foundryvtt.com/api/v14/ first.
- Same sheets: global `TextEditor.enrichHTML` -> `foundry.applications.ux.TextEditor.implementation.enrichHTML`; drop the `async: true` option.
- Same sheets: `_addDivisionLines` and the `lineColors` palette are duplicated -> one shared module. Hard-coded hex colors also conflict with the CSS rule on theme variables.
- Same sheets, `src/scripts/settings.ts`: `// @ts-ignore` comments (`ban-ts-comment`) and the unsafe-`any` findings they cause (`no-unsafe-argument`, `no-unsafe-member-access`, `no-unsafe-assignment`, e.g. around `TextEditor.enrichHTML` and `$(event.target)`) -> proper types, or `@ts-expect-error` with a description each.
- Same sheets: `no-misused-promises` on the V1 `activateListeners` jQuery click handler (async `_onAction`) -> disappears with the AppV2 `actions` migration.
- `src/scripts/lostMaps.ts`: `renderSidebarTab` hook with jQuery `html` argument and `app.tabName` (V1 sidebar) -> v13+ render hook for the Journal directory (`renderJournalDirectory`) taking an `HTMLElement`. Verify the hook name in the v14 docs.
- `src/scripts/lostMaps.ts`: dead `_addRolltableButton` uses `innerHTML` and `html.find`, with a `TODO` lacking an issue ref -> delete it, or rebuild with `createElement`/`textContent` and `TODO(#n)`.
- `src/scripts/lostMaps.ts`: `DocumentSheetConfig.registerSheet(JournalEntryPage, ...)` and bare `JournalEntryPage` global -> `foundry.applications.apps.DocumentSheetConfig.registerSheet(...)`. Verify in the v14 docs.
- `src/scripts/module.ts`: `CONFIG.debug.hooks = true` at import time (debug logging left on) -> remove. Registering the `init` hook is the only allowed import-time effect.
- `src/scripts/logger.ts`: the module logger wraps `console.*`, so its six `no-console` calls carry legacy suppressions (the only sanctioned `console` use; keep them until lint config offers a logger exemption). It still has a hard-coded prefix -> derive it from the module id.
- `src/scripts/settings.ts`: `name`/`hint` hard-coded English -> `game.i18n` keys added to `src/languages/en.json`; `// @ts-ignore` on `register` -> typed config.
- `src/templates/journal/*.hbs`: `{{{content}}}` / `{{{editor.content}}}` lack the adjacent "why safe" comment; `{{> journalEntryPageHeader }}` and `{{ editor }}`/`cssClass` are V1 page-sheet idioms -> comment them now; replace with AppV2 partials during the sheet migration.
- `src/styles/module.css`: bare `.fgl-*` selectors are prefixed but not under one root class -> scope under a module root class when the sheets are migrated.
- `package.json`: copy-paste fields (`keywords: ["Foundry VTT", "WLED"]`, `description`, `main: dist/module.js` which does not exist) -> correct them. `@league-of-foundry-developers/fvtt-types` is pinned to a commit hash (the one previously locked); bumping it is migration-sized, ask first.

## Verification checklist

Static (report actual output):

1. `npm run check` exits 0 (lint, format, JSON, `tsc --noEmit`).
2. `npm run build:all` exits 0; `dist/scripts/module.js`, `dist/styles/module.css`, `dist/languages/en.json`, `dist/templates/journal/*.hbs` exist.
3. Every new i18n key is in the language file (JSON validity is covered by `npm run check`).

Manual in Foundry (list for the user; never claim they pass until the user confirms):

1. Enable the module in a world, no console errors or deprecation warnings on load.
2. Create a Journal page of type "Lost Map". Edit map image, divisions, flavor text; changes persist after reload.
3. Set divisions to 1, then to the maximum offered by the select (the model caps at 5; see Gotchas). Division lines render on the view.
4. Click "Run Lost Map". A "<name> - Result" page is created and shown, with one roll per division, a marker at the matching quadrant, and the flavor text.
5. Toggle "Show Divisions"/"Hide Divisions" on a map page and on a result page.
6. Change the world setting "Show divisions in results"; open a result page and confirm the initial state follows it.
7. Repeat 2-5 in a world with a non-dnd5e system (e.g. a generic or other system). The module must work without dnd5e.
8. Open as a non-GM player with Observer/Owner permission; confirm what they can and cannot do.

## Gotchas

- Edit `src/`, never `dist/`. `dist/` is git-ignored build output; the release CI rebuilds it.
- The model allows 1-5 divisions (`LostMap.MAX_DIVISIONS = 5`), but the language file has a "6 division" label and `lineColors` has 6 colors. A 6-division map is not currently reachable from the sheet; do not assume it works.
- System-agnostic is the goal (the module must work without dnd5e and declares no system requirement), but both sheets add the `dnd5e2-journal` CSS class unconditionally, so on other systems it is a dead class and the dnd5e styling is untested. Follow-up: apply it only when `game.system.id === "dnd5e"`.
- `module.json`: `compatibility.minimum` is 13, `library` is boolean `false`, and `relationships.systems` is empty because the module is system-agnostic. Do not add a system requirement.
- `module.json` `version` must stay the `#{VERSION}#` token; the release workflow fills it. Do not hard-code a version.
- `package.json` also uses `#{VERSION}#`, so npm prints that string as the version. This is expected.
- `LostMapResult` extends `LostMap` and inherits its schema; schema changes affect both subtypes and existing documents. Changing `defineSchema` or field names needs a migration plan; ask first.
- `rollTableAdjustments` is stored as a JSON string but nothing consumes it beyond a truthiness check in `_isRunAvailable`.
- Template paths are built from `dist/templates`, so templates only load after `npm run build:all`.
- fvtt-types tracks Foundry types loosely; types for V1 sheets will disappear as the migration proceeds.
