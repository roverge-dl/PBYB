# PBYB (Pregnancy Build Your Blood) Design System & Tokens

Welcome to the **Pregnancy Build Your Blood (PBYB)** design system. This system translates the Figma designs (`resources/design/design-system/` and `resources/design/figma/`) into modern, scalable Tailwind CSS tokens and accessible React primitives.

The core principle is **zero unnecessary custom CSS**: components and layouts are styled using standard Tailwind utility classes extended with our custom brand tokens.

---

## 1. Brand Tokens & Color Palette

The design system is built upon three primary color families, each calibrated with 11 precise shades (0 to 10) extracted directly from Figma's `Shades.png`.

### Core Color Palette

| Token | Hex | Tailwind Utility | Role / Usage |
|---|---|---|---|
| **Primary** | `#800090` | `bg-primary`, `text-primary`, `border-primary` | Main brand purple; primary CTA buttons, active sidebar items, header accents |
| **Accent** | `#ECD4ED` | `bg-accent`, `text-accent-900`, `border-accent` | Soft lilac; subtle cards, active pill tab indicators, badges, highlights |
| **Secondary** | `#89CFF0` | `bg-secondary`, `text-secondary-900` | Sky blue; supporting metrics, secondary badges, illustrations |

---

### Shade Breakdown (From `Shades.png`)

#### Primary (Purple) — `#800090`
- **0** (`#F7B9FF` / `primary-100`): Lightest lavender highlight
- **0.5** (`#EBA7F4` / `primary-150`): Soft lilac hover
- **1** (`#DF94E9` / `primary-200`): Tinted background
- **1.5** (`#D382DE` / `primary-250`): Light border
- **2** (`#C76FD3` / `primary-300`): Decorative borders
- **3** (`#B04ABC` / `primary-400`): Secondary interaction
- **4** (`#9825A6` / `primary-500`): Vibrant purple
- **5 (Base)** (`#800090` / `primary-600` / `primary`): **Brand Base Purple**
- **6** (`#660073` / `primary-700`): Hover state for CTA buttons
- **7** (`#4D0056` / `primary-800`): Deep purple text / icons
- **8** (`#33003A` / `primary-900`): Dark plum background / avatars
- **8.5** (`#26002B` / `primary-925`): Deep shadow tint
- **9** (`#1A001D` / `primary-950`): Near-black plum
- **9.5** (`#0D000E` / `primary-975`): Darkest shade
- **10** (`#000000` / `primary-1000`): True black

#### Accent (Lilac / Pink) — `#ECD4ED`
- **0** (`#FFFFFF`): Pure white
- **0.5** (`#FDFBFD` / `accent-50`): App background canvas
- **1** (`#FBF6FB` / `accent-100`): Soft container background
- **1.5** (`#F9F2FA` / `accent-150`): Card background
- **2** (`#F7EEF8` / `accent-200`): Tab pill background
- **3** (`#F4E5F4` / `accent-300`): Border highlight
- **4** (`#F0DDF1` / `accent-400`): Slider inactive track
- **5 (Base)** (`#ECD4ED` / `accent-500` / `accent`): **Brand Base Accent**
- **6** (`#D2B3D3` / `accent-600`): Subtle border
- **7** (`#B891B9` / `accent-700`): Muted text
- **8** (`#9D70A0` / `accent-800`): Accent heading
- **8.5** (`#905F93` / `accent-850`): Dark lilac
- **9** (`#834E86` / `accent-900`): Text on light accent
- **9.5** (`#763E79` / `accent-925`): High-contrast accent
- **10** (`#692D6C` / `accent-950`): Deepest accent plum

#### Secondary (Sky Blue) — `#89CFF0`
- **0** (`#FFFFFF`): Pure white
- **0.5** (`#F3FAFE` / `secondary-50`): Tinted background
- **1** (`#E7F5FC` / `secondary-100`): Card highlight
- **1.5** (`#DCF1FB` / `secondary-150`): Soft border
- **2** (`#D0ECF9` / `secondary-200`): Blue badge background
- **3** (`#B8E2F6` / `secondary-300`): Active border
- **4** (`#A1D9F3` / `secondary-400`): Sky blue border
- **5 (Base)** (`#89CFF0` / `secondary-500` / `secondary`): **Brand Base Blue**
- **6** (`#6FB0CE` / `secondary-600`): Blue text / icon
- **7** (`#5691AD` / `secondary-700`): Muted slate-blue
- **8** (`#3C728B` / `secondary-800`): High-contrast blue
- **8.5** (`#2F637A` / `secondary-850`): Deep slate-blue
- **9** (`#23536A` / `secondary-900`): Dark blue text
- **9.5** (`#164459` / `secondary-925`): Near-black blue
- **10** (`#093448` / `secondary-950`): Darkest navy

---

## 2. Typography

We use two typefaces loaded from Google Fonts in `resources/views/inertia_layout.edge`:

### 1. Anton (`font-display`)
- **Usage**: Impactful headlines, numerical stats, leaderboard ranks, uppercase badges.
- **Weights**: 400 (Single bold display weight).
- **Style**: Uppercase, tight tracking, punchy.

### 2. DM Sans (`font-sans`)
- **Usage**: Main application UI, body text, form labels, inputs, buttons, navigation items.
- **Weights**: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold).

### Typographic Scale (from `Typography.jpg` & `Typography (1).jpg`)

| Size Class | Size | Line Height | Usage |
|---|---|---|---|
| `text-3xl` | `1.875rem` (30px) | `2.375rem` (38px) | Section titles, Hero displays |
| `text-2xl` | `1.5rem` (24px) | `2rem` (32px) | Page headings ("Welcome, Sarah") |
| `text-xl` | `1.25rem` (20px) | `1.875rem` (30px) | Card headers, modal titles |
| `text-lg` | `1.125rem` (18px) | `1.75rem` (28px) | Subheadings, feature titles |
| `text-md` | `1rem` (16px) | `1.5rem` (24px) | Standard body copy |
| `text-sm` | `0.875rem` (14px) | `1.25rem` (20px) | Input fields, button text, labels |
| `text-xs` | `0.75rem` (12px) | `1.125rem` (18px) | Hints, error messages, captions |

---

## 3. Responsive Breakpoints

Custom breakpoints configured in `tailwind.config.js` and defined as CSS custom properties in `resources/css/app.css`:

| Breakpoint Name | Min-Width (rem) | Pixel Equivalent | Purpose / Devices |
|---|---|---|---|
| `mobilexxs` | `20rem` | `320px` | Smallest smartphones |
| `mobilexs` | `21.5625rem` | `344px` | Compact mobile phones |
| `mobilesm` | `23.4375rem` | `376px` | iPhone SE, mini phones |
| `mobilemd` | `30rem` | `480px` | Standard smartphones / large phones |
| `mobilelg` | `35.4375rem` | `568px` | Phablets / landscape mobile |
| `tabletsm` | `47.9375rem` | `768px` | iPad Portrait / Small tablets |
| `tabletmd` | `50rem` | `800px` | Medium tablets |
| `tabletlg` | `62rem` | `992px` | iPad Landscape / Small desktop |
| `laptopmd` | `75rem` | `1200px` | Standard laptop displays |
| `xl` | `80rem` | `1280px` | Desktop screens |
| `xxl` | `96rem` | `1536px` | Wide monitors |

---

## 4. Radii, Spacing & Shadows

### Border Radius
- `rounded-full`: Pill buttons (CTAs, social buttons, filter tags, badges).
- `rounded-3xl` (`24px`): Modals, upload dropzones, large dashboard panels.
- `rounded-2xl` (`20px`): Cards, referral rows, segmented control containers.
- `rounded-xl` (`16px`): Form inputs, select dropdowns, square social buttons.
- `rounded-lg` (`12px`): Checkboxes, small tooltips.

### Box Shadows
- `shadow-subtle`: Subtle elevation for inputs, small controls.
- `shadow-card`: Default card elevation (`0 4px 20px -2px rgba(128, 0, 144, 0.05)`).
- `shadow-card-hover`: Elevated card on hover.
- `shadow-modal`: Dialog floating elevation (`0 25px 50px -12px rgba(128, 0, 144, 0.25)`).
- `shadow-button`: Primary button soft purple glow (`0 4px 14px 0 rgba(128, 0, 144, 0.28)`).

---

## 4. UI Component Library (`resources/js/components/ui/`)

All components are written in TypeScript and styled with Tailwind CSS via the `cn()` utility.

### Component Summary

| Component | Figma Reference | Key Features |
|---|---|---|
| `Button` | `CTA BUTTONS.png` | `primary`, `secondary`, `outline`, `light`, `ghost`, `danger`, `white`; sizes `sm`, `md`, `lg`; pill shape (`rounded-full`), loading spinner, left/right icons |
| `SocialButton` | `Social media buttons.png` | Google, Facebook, Apple; full pill width or square/circle icon-only |
| `Input` | `Input.png` | Floating label, hint text, error message with `(!)` icon, left/right icons |
| `PasswordInput` | `Input.png` | Eye toggle to show/hide password, requirement bullet (`• minimum 8 characters`) turning green/red/gray |
| `PhoneInput` | `Input.png` | Country flag dropdown (Nigeria 🇳🇬 `+234` default, expandable), formatted input |
| `Select` | `Input.png` | Custom styled select input matching Figma dropdowns with chevron |
| `Checkbox` | `Other Buttons.png` | Custom rounded checkbox with checkmark `✓` in purple |
| `Radio` | `Other Buttons.png` | Custom radio with purple filled circle and white center dot |
| `ToggleSwitch` | `Other Buttons.png` | Custom toggle switch with `-` in off thumb and `✓` in on thumb |
| `Slider` | `Other Buttons.png` | Range slider with purple filled track, lilac background, white circular thumb |
| `Badge` | Figma mockups | Points, ranking, and status badges (`primary`, `accent`, `secondary`, `success`, `warning`, `error`, `neutral`) |
| `Card` | Figma mockups | Rounded cards with optional interactive hover elevation |
| `Avatar` | Figma mockups | Initial fallbacks (e.g. "CO", "PS" in purple circle), images, edit pencil badge |
| `SegmentedControl` | `PCV.png` | Tab switcher (e.g. "Upload Blood Count" vs "History") with lilac active pill indicator |
| `Modal` | `Home Page.png` | Dialog with dark backdrop blur, rounded-3xl container, purple `X` close button |

---

## 5. Usage Examples

### Primary Pill Button
```tsx
import { Button } from '@/components/ui'

<Button variant="primary" size="md">
  Get Started
</Button>
```

### Form Input with Error
```tsx
import { Input } from '@/components/ui'

<Input
  label="Email Address"
  placeholder="sarah@example.com"
  error={errors.email}
/>
```

### Password Input with Live Requirement
```tsx
import { PasswordInput } from '@/components/ui'

<PasswordInput
  label="Password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  isRequirementMet={password.length >= 8}
/>
```

### Toggle Switch
```tsx
import { ToggleSwitch } from '@/components/ui'

<ToggleSwitch
  checked={notifications}
  onChange={setNotifications}
  label="SMS Notifications"
  description="Receive daily blood test reminders"
/>
```

---

## 6. Interactive Design System Showcase

You can view and test every single token and component interactively by visiting:
**`http://localhost:3333/design-system`** (when dev server is running).

---

## 7. Authentication Pages

All authentication pages have been implemented with full responsiveness for both mobile devices (`mobilexxs` to `tabletmd`) and desktop displays (`tabletlg` to `xxl`):

| Route | View Component | Mobile Experience (`< tabletlg`) | Desktop Experience (`tabletlg+`) |
|---|---|---|---|
| `/register` | `resources/js/pages/auth/register.tsx` | Centered layout with BirthSafe logo, role switcher, form inputs, Google sign-up | Split 2-column layout with hero mother card on left and form on right |
| `/login` | `resources/js/pages/auth/login.tsx` | Centered layout with BirthSafe logo, email & password, forgot password link, Google sign-in | Split 2-column layout with hero mother card on left and form on right |
| `/forgot-password` | `resources/js/pages/auth/forgot_password.tsx` | Centered layout with BirthSafe logo, email input, reset instructions, and confirmation state | Split 2-column layout with hero mother card on left and form on right |
| `/reset-password` | `resources/js/pages/auth/reset_password.tsx` | Centered layout with BirthSafe logo, OTP code input, new password, confirm password | Split 2-column layout with hero mother card on left and form on right |
