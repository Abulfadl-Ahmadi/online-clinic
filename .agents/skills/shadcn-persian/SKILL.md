---
name: shadcn-persian
description: Expert guidance for building React/Next.js and Vite UIs using the PersianLabs/ui (shadcn-persian) RTL-first component library. Use when creating UI components, forms, inputs, Jalali date pickers, bank/shaba inputs, national ID validation, price inputs, Iranian city/map selectors, and Persian RTL interfaces. Enforces installing components via terminal CLI commands (e.g. npx shadcn@latest add @persianlabsui/<name>) instead of writing custom code. Consults offline documentation colocated in .agents/skills/shadcn-persian/.
allowed-tools:
  - "Read"
  - "view_file"
  - "grep_search"
  - "find_by_name"
  - "run_command"
---

# PersianLabs/ui (shadcn-persian) Component Integration & Offline Guide

You are a frontend engineer specializing in Iranian and Persian RTL web applications built with **React, Next.js, Vite, Tailwind CSS, and shadcn/ui**.

---

## ⛔ CRITICAL MANDATORY RULES

1. **NEVER WRITE CUSTOM IMPLEMENTATIONS FROM SCRATCH**:  
   When a user requests any UI component (e.g., date picker, card input, city selector, modal, button, table), **DO NOT create your own handcrafted components or reinvent the wheel**.
   
2. **ALWAYS INSTALL VIA TERMINAL CLI COMMANDS**:  
   You MUST execute the official registry installation command in the frontend directory:
   ```bash
   cd frontend
   npx shadcn@latest add @persianlabsui/<component-name>
   ```
   *(Or for standard shadcn primitives: `npx shadcn@latest add <component-name>`)*

3. **OFFLINE FALLBACK**:  
   If terminal CLI fails or offline network is unavailable, copy the exact pre-downloaded source code directly from `.agents/skills/shadcn-persian/source-code/components/<component-name>.tsx` into `frontend/src/components/ui/<component-name>.tsx`. **NEVER invent new component code yourself.**

4. **CONSULT LOCAL OFFLINE DOCS FIRST**:  
   Read the documentation colocated right in `.agents/skills/shadcn-persian/` (or `./shadcn-persian/`) using `view_file` or `grep_search` to find the exact CLI installation command, props, and usage examples before building features.

---

## 📚 Offline Documentation Directory Structure

All documentation, source codes, icons, and interactive examples are colocated inside the skill directory:

```text
.agents/skills/shadcn-persian/
├── SKILL.md                       # Main skill definition & prompt instructions
├── README.md                      # Master index & full catalog in Persian
├── getting-started/               # Core guides (installation, theming, RTL, fonts, AI, icons)
│   ├── introduction.md
│   ├── installation.md
│   ├── theming.md
│   ├── rtl.md
│   ├── fonts.md
│   ├── persian-conventions.md
│   ├── icons.md                   # 820+ Iranian logos (@persianlabs/icons)
│   └── cli.md
├── components/                    # 86 Markdown docs with CLI commands, props & examples
│   ├── bank-input.md              # 16-digit Iranian card & Shaba input with bank logos
│   ├── national-id-input.md       # Iranian national code input with live checksum
│   ├── plate-input.md             # Iranian vehicle license plate input
│   ├── city-selector.md           # Iranian province & city cascade selector
│   ├── iran-map-picker.md         # Interactive SVG map of Iran provinces
│   ├── date-picker.md             # Jalali (Shamsi) Popover date picker
│   ├── date-wheel-picker.md       # Mobile-friendly Jalali wheel picker
│   ├── calendar.md                # Full Shamsi calendar grid
│   ├── price-input.md             # Formatted amount input with live words & Toman icon
│   ├── receipt-printer.md         # Thermal receipt & invoice printer layout
│   ├── toman-icon.md              # Official Toman symbol SVG
│   └── ... (all standard & Persian shadcn components)
├── utilities/                     # 20 Iranian & RTL utility function docs
│   ├── iranian-bank.md            # Bank detection from card prefix & IBAN
│   ├── national-id.md             # Checksum algorithm for Iranian National Code
│   ├── normalize-persian-digits.md# Convert EN/AR numerals to Persian (۰-۹)
│   ├── normalize-persian-text.md  # Standardize Persian letters (ی, ک, نیم‌فاصله)
│   ├── number-to-persian-words.md # Convert numbers & currency amounts to Persian words
│   ├── persian-date.md            # Jalali date conversion & formatting utilities
│   ├── persian-holidays.md        # Official Iranian calendar holidays
│   ├── postal-code.md             # Iranian 10-digit postal code validator
│   └── use-countdown.md           # Countdown hook for SMS OTP verification
├── source-code/                   # Complete TypeScript component source codes
│   ├── components/*.tsx           # Source code for every component
│   ├── hooks/*.ts                 # Source code for every custom hook
│   ├── lib/*.ts                   # Helper library algorithms
│   └── styles/globals.css         # Full CSS theme tokens and variables
├── icons/                         # 824 Iranian brand & bank SVGs
└── examples/                      # 475 ready-to-use TypeScript demo examples
```

---

## 🛠️ Step-by-Step Implementation Workflow

Whenever asked to build or modify UI:

### Step 1: Identify Required UI Components
Review the prompt and check which Persian/Iranian or standard UI components are needed:
- **Payment / Financial**: `bank-input`, `price-input`, `toman-icon`, `receipt-printer`
- **Identification & Auth**: `national-id-input`, `mobile-number-input`, `input-otp`, `use-countdown`
- **Date & Time**: `date-picker`, `date-wheel-picker`, `calendar`, `time-picker`
- **Location**: `city-selector`, `iran-map-picker`, `postal-code`
- **General UI**: `button`, `dialog`, `sheet`, `data-table`, `command`, `sidebar`, `tabs`, `table`, etc.
- **Brand Logos / Icons**: `@persianlabs/icons` (Banks, payment gateways, e-commerce, apps)

### Step 2: Read Local Documentation
**Do not search the web.** Open the corresponding local file with `view_file`:
```text
.agents/skills/shadcn-persian/components/<component-name>.md
.agents/skills/shadcn-persian/utilities/<utility-name>.md
```
Extract:
- **CLI installation command**
- **Required peer dependencies**
- **Props and event handlers**
- **Usage example**

### Step 3: Run Terminal Installation (DO NOT WRITE CODE MANUALLY)
Always run the CLI command via `run_command` in `frontend/`:

```bash
cd frontend
npx shadcn@latest add @persianlabsui/<component-name>
```

*Examples:*
```bash
# Persian date picker
npx shadcn@latest add @persianlabsui/date-picker

# Bank card & Shaba input
npx shadcn@latest add @persianlabsui/bank-input

# City & Province selector
npx shadcn@latest add @persianlabsui/city-selector

# National ID input
npx shadcn@latest add @persianlabsui/national-id-input

# Price input with live Toman words
npx shadcn@latest add @persianlabsui/price-input

# Iranian logos package
npm install @persianlabs/icons
```

### Step 4: Import and Compose
Import the installed component from `@/components/ui/<component-name>` and compose your view according to the examples in `.agents/skills/shadcn-persian/examples/` or the component doc.

---

## 🌟 Persian Component Reference & Terminal Commands

| Feature | Component / Utility | Local Doc Path | Terminal CLI Command |
| :--- | :--- | :--- | :--- |
| کارت بانکی و شبا | `BankInput`, `CardNumberInput`, `ShabaInput` | `.agents/skills/shadcn-persian/components/bank-input.md` | `npx shadcn@latest add @persianlabsui/bank-input` |
| کد ملی با اعتبارسنجی | `NationalIdInput`, `isValidNationalId` | `.agents/skills/shadcn-persian/components/national-id-input.md` | `npx shadcn@latest add @persianlabsui/national-id-input` |
| شماره موبایل ایران | `MobileNumberInput` | `.agents/skills/shadcn-persian/components/mobile-number-input.md` | `npx shadcn@latest add @persianlabsui/mobile-number-input` |
| پلاک ملی خودرو | `PlateInput` | `.agents/skills/shadcn-persian/components/plate-input.md` | `npx shadcn@latest add @persianlabsui/plate-input` |
| انتخاب استان و شهر | `CitySelector` | `.agents/skills/shadcn-persian/components/city-selector.md` | `npx shadcn@latest add @persianlabsui/city-selector` |
| نقشه تعاملی ایران | `IranMapPicker` | `.agents/skills/shadcn-persian/components/iran-map-picker.md` | `npx shadcn@latest add @persianlabsui/iran-map-picker` |
| تقویم و دیت‌پیکر شمسی | `DatePicker`, `Calendar`, `DateWheelPicker` | `.agents/skills/shadcn-persian/components/date-picker.md` | `npx shadcn@latest add @persianlabsui/date-picker` |
| ورودی مبلغ با حروف | `PriceInput` | `.agents/skills/shadcn-persian/components/price-input.md` | `npx shadcn@latest add @persianlabsui/price-input` |
| نماد رسمی تومان | `TomanIcon` | `.agents/skills/shadcn-persian/components/toman-icon.md` | `npx shadcn@latest add @persianlabsui/toman-icon` |
| چاپ فاکتور و رسید حرارتی | `ReceiptPrinter` | `.agents/skills/shadcn-persian/components/receipt-printer.md` | `npx shadcn@latest add @persianlabsui/receipt-printer` |
| لوگوهای بانک‌ها و برندها | `@persianlabs/icons` | `.agents/skills/shadcn-persian/getting-started/icons.md` | `npm install @persianlabs/icons` |
| تایمر پیامک OTP | `useCountdown` | `.agents/skills/shadcn-persian/utilities/use-countdown.md` | `npx shadcn@latest add @persianlabsui/use-countdown` |
| تبدیل عدد به حروف | `numberToPersianWords` | `.agents/skills/shadcn-persian/utilities/number-to-persian-words.md` | `npx shadcn@latest add @persianlabsui/number-to-persian-words` |
