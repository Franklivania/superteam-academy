# Customization Guide

## Theming

The platform uses **shadcn/ui** with CSS custom properties. To customize colors:

1. Edit `app/src/app/globals.css` — modify the `:root` and `.dark` CSS variables
2. All components use semantic tokens (`--primary`, `--foreground`, `--muted`, etc.)
3. The neo-brutalist design uses `rounded-none`, `border-2`, and box shadows

### Key Design Tokens

```css
:root {
  --primary: 262 83% 58%;      /* Main accent color */
  --background: 0 0% 100%;     /* Page background */
  --foreground: 240 10% 3.9%;  /* Text color */
  --card: 0 0% 100%;           /* Card background */
  --border: 240 5.9% 90%;      /* Border color */
  --muted: 240 4.8% 95.9%;     /* Muted backgrounds */
}
```

## Adding a New Locale

1. Create `app/messages/<locale>.json` — copy from `en.json` and translate all values
2. Add the locale to `app/src/i18n/config.ts`:
   ```typescript
   export const locales = ["en", "es", "pt-BR", "pt", "hi", "YOUR_LOCALE"] as const;
   ```
3. Add a label in `localeSwitcher` section of each existing locale file

## Adding a New Page

1. Create the page file under the appropriate route group:
   - `(web)` — public pages
   - `(user)` — authenticated pages
   - `(admin)` — admin-only pages
2. Use `useTranslations()` for all user-facing text
3. Follow the neo-brutalist design: `rounded-none`, `border-2`, shadow utility classes

## Modifying XP Rules

XP calculations live in `app/src/lib/services/xp-service.ts`:

- Lesson completion XP
- Challenge completion XP
- Level thresholds: `level² × 100`

## Modifying Streak Rules

Streak logic is in `app/src/lib/services/streak-service.ts`:

- Daily activity detection
- Streak reset after missed days
- Milestone markers at 7, 30, 100 days

## On-Chain Program

The Anchor program ID is in `.env.local` as `ANCHOR_PROGRAM_ID`. To deploy your own:

1. Update the program in the `programs/` directory
2. Build and deploy: `anchor build && anchor deploy`
3. Update `ANCHOR_PROGRAM_ID` in `.env.local`

## Component Library

All UI components are in `app/src/components/ui/` (shadcn/ui). To add new ones:

```bash
bunx --bun shadcn@latest add <component>
```
