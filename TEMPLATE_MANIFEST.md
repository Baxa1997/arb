# Template Manifest — Lucid Template Next.js Website

> **Purpose**: Inject this file into AI coding prompts so the model knows exactly what exists, how it's structured, and how to extend it without recreating existing code or breaking conventions.

---

## Stack

- **Framework**: Next.js 14 (App Router) / React 18
- **Styling**: Tailwind CSS 3.4 + HSL CSS variables + shadcn/ui (initialized, 13 components installed)
- **State**: Zustand 4.5 (with `persist` middleware)
- **Data fetching**: TanStack React Query v5
- **Forms**: React Hook Form 7.51 + Zod 3.23 (via `@hookform/resolvers`)
- **HTTP**: Axios 1.7 (configured in `lib/api-client.js`)
- **Icons**: Lucide React 1.7 (centralized in `config/icons.js`)
- **Utilities**: clsx 2.1 + tailwind-merge 3.0 (combined in `lib/cn.js`), dayjs 1.11
- **Package manager**: pnpm
- **Deployment**: Vercel (configured via `vercel.json`)
- **Linting**: ESLint with `next/core-web-vitals`

---

## Import Aliases

```
@/* → src/*
```

**Examples**:
```js
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/store';
import { authService } from '@/services/auth.service';
import { siteConfig } from '@/config/site';
import { Icons } from '@/config/icons';
import { useDebounce } from '@/hooks';
```

Alias is defined in `jsconfig.json`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  }
}
```

---

## Available UI Components

All UI components live in `src/components/ui/` and are barrel-exported from `src/components/ui/index.js`.

**Barrel import**:
```js
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Badge, Avatar, Table, Textarea, Modal, Pagination, EmptyState, Spinner } from '@/components/ui';
```

---

### Button
**File**: `src/components/ui/Button.jsx`
**Props**: `variant` (`primary` | `secondary` | `outline` | `ghost` | `danger` | `link`), `size` (`sm` | `md` | `lg` | `icon`), `isLoading`, `disabled`, `className`, `onClick`, `children`
**Features**: `forwardRef`, built-in loading spinner via `Icons.spinner`
```jsx
<Button variant="primary" size="md">Save</Button>
<Button variant="outline" size="sm" isLoading>Saving...</Button>
<Button variant="ghost" size="icon"><Icons.edit className="h-4 w-4" /></Button>
```

---

### Input
**File**: `src/components/ui/Input.jsx`
**Props**: `label`, `error`, `icon` (Lucide component), `className`, plus all native `<input>` props
**Features**: `forwardRef`, optional left icon, error message display, label rendering
```jsx
<Input label="Email" icon={Icons.mail} error={errors.email?.message} {...register("email")} />
<Input placeholder="Search..." icon={Icons.search} />
```

---

### Textarea
**File**: `src/components/ui/Textarea.jsx`
**Props**: `className`, plus all native `<textarea>` props
**Features**: `forwardRef`
```jsx
<Textarea placeholder="Write your message..." className="min-h-[120px]" />
```

---

### Card (compound component)
**File**: `src/components/ui/Card.jsx`
**Exports**: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`
**Props**: Each accepts `className` + all native `<div>` props (except `CardTitle` → `<h3>`, `CardDescription` → `<p>`)
**Features**: All use `forwardRef`
```jsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Subtitle text</CardDescription>
  </CardHeader>
  <CardContent>Body content</CardContent>
  <CardFooter>Footer actions</CardFooter>
</Card>
```

---

### Badge
**File**: `src/components/ui/Badge.jsx`
**Props**: `variant` (`default` | `secondary` | `destructive` | `danger` | `outline` | `success` | `warning` | `info`), `className`
```jsx
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="info">New</Badge>
```

---

### Avatar
**File**: `src/components/ui/Avatar.jsx`
**Props**: `src`, `fallback` (string), `size` (`sm` | `md` | `lg`), `className`
**Features**: `forwardRef`, uses `next/image` for optimized images, uppercase fallback letter
```jsx
<Avatar src="/avatar.jpg" size="md" />
<Avatar fallback="JD" size="lg" />
```

---

### Table
**File**: `src/components/ui/Table.jsx`
**Props**: `columns` (array of `{ key, label, headerClassName?, cellClassName?, render? }`), `data` (array), `rowKey` (string, default `"id"`), `className`
**Features**: `forwardRef`, custom cell rendering via `render(value, row)`, empty state built-in
```jsx
<Table
  columns={[
    { key: "name", label: "Name" },
    { key: "status", label: "Status", render: (val) => <Badge>{val}</Badge> },
  ]}
  data={users}
  rowKey="id"
/>
```

---

### Modal
**File**: `src/components/ui/Modal.jsx`
**Props**: `isOpen`, `onClose`, `title`, `children`, `className`
**Features**: Backdrop blur, body scroll lock, close button with `Icons.close`
```jsx
<Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Confirm Action">
  <p>Are you sure?</p>
  <Button onClick={handleConfirm}>Confirm</Button>
</Modal>
```

---

### Pagination
**File**: `src/components/ui/Pagination.jsx`
**Props**: `page`, `totalPages`, `onNext`, `onPrev`, `className`
**Features**: Uses `Button` internally, auto-disables at boundaries
```jsx
<Pagination page={page} totalPages={10} onNext={nextPage} onPrev={prevPage} />
```

---

### EmptyState
**File**: `src/components/ui/EmptyState.jsx`
**Props**: `icon` (Lucide component, default `Icons.search`), `title`, `description`, `action` (ReactNode), `className`
```jsx
<EmptyState
  icon={Icons.users}
  title="No users found"
  description="Try adjusting your search filters."
  action={<Button>Add User</Button>}
/>
```

---

### Spinner
**File**: `src/components/ui/Spinner.jsx`
**Props**: `className`
```jsx
<Spinner className="h-6 w-6" />
```

---

## Available Layout Components

Located in `src/components/layout/`:

### MarketingHeader
**File**: `src/components/layout/MarketingHeader.jsx`
**Features**: Sticky header, scroll-triggered glass blur effect, responsive mobile drawer, active link highlighting via `usePathname()`, logo from `siteConfig`
**Nav links**: About (`/about`), Contact (`/contact`), Features (`/#features`)
**Actions**: Sign In → `/login`, Get Started → `/contact`
**Usage**: Automatically included via `(marketing)/layout.js`

### MarketingFooter
**File**: `src/components/layout/MarketingFooter.jsx`
**Features**: 4-column grid (Brand, Product, Resources, Legal), social icon links, copyright with dynamic year
**Usage**: Automatically included via `(marketing)/layout.js`

---

## Available Hooks

Located in `src/hooks/`, barrel-exported from `src/hooks/index.js`.

### useDebounce
**File**: `src/hooks/useDebounce.js`
**Signature**: `useDebounce(value: any, delay: number) → debouncedValue`
```js
const debouncedSearch = useDebounce(searchTerm, 300);
```

### useLocalStorage
**File**: `src/hooks/useLocalStorage.js`
**Signature**: `useLocalStorage(key: string, initialValue: any) → [storedValue, setValue]`
**Features**: SSR-safe (`typeof window` check), JSON serialize/deserialize, supports updater functions
```js
const [theme, setTheme] = useLocalStorage("theme", "light");
```

### usePagination
**File**: `src/hooks/usePagination.js`
**Signature**: `usePagination(initialPage?: number, initialLimit?: number) → { page, limit, setPage, setLimit, nextPage, prevPage }`
```js
const { page, limit, nextPage, prevPage } = usePagination(1, 10);
```

---

## Available Stores

Located in `src/store/`, barrel-exported from `src/store/index.js`.

### useAuthStore
**File**: `src/store/auth.store.js`
**State shape**:
```ts
{
  user: null | { id, name, email, avatar },
  token: null | string,
  isAuth: boolean,
}
```
**Actions**:
- `setAuth(user, token)` → sets user, token, isAuth=true
- `logout()` → clears user, token, isAuth=false

**Persistence**: Zustand `persist` middleware, localStorage key: `"auth-storage"`
```js
const { user, isAuth, setAuth, logout } = useAuthStore();
// Outside React (e.g., in interceptors):
useAuthStore.getState().token;
```

---

## Available Services

Located in `src/services/`.

### authService
**File**: `src/services/auth.service.js`
**Exported functions**:
- `authService.login(credentials: { email, password })` → `{ user, token }`
- `authService.getMe()` → user object
- `authService.logout()` → `true`

**Note**: Currently uses mock data. Each method includes commented-out real API calls ready to uncomment.
```js
const { user, token } = await authService.login({ email, password });
```

---

## API Client

**Location**: `src/lib/api-client.js`
**Import**: `import { apiClient } from '@/lib/api-client'`
**Base URL**: `process.env.NEXT_PUBLIC_API_URL` (fallback: `/api`)

**Features**:
- Request interceptor: auto-attaches `Authorization: Bearer <token>` from auth store
- Response interceptor: unwraps `response.data` automatically, auto-redirects to `/login` on 401

**Usage**:
```js
const data = await apiClient.get('/users');
const created = await apiClient.post('/users', { name: 'John' });
const updated = await apiClient.put('/users/1', { name: 'Jane' });
await apiClient.delete('/users/1');
```

---

## Utility: cn()

**Location**: `src/lib/cn.js`
**Import**: `import { cn } from '@/lib/cn'`
**Implementation**: `clsx` + `tailwind-merge` — safely merges Tailwind classes with conditional logic
```js
className={cn("base-class", isActive && "active-class", className)}
```

---

## Config Files

### Site Config
**File**: `src/config/site.js`
```js
export const siteConfig = {
  name: "Lucid Template",
  description: "A modern, production-ready website template...",
  url: "https://example.com",
  logoText: "LUCID",
  ogImage: "/og-image.png",
};
```

### Navigation Config
**File**: `src/config/navigation.js`
```js
export const navigationConfig = [
  { title: "Home", href: "/", icon: "home" },
  { title: "About", href: "/about", icon: "users" },
  { title: "Contact", href: "/contact", icon: "mail" },
];
```

### Icons Registry
**File**: `src/config/icons.js`
**Available icons**: `home`, `dashboard`, `users`, `settings`, `logout`, `menu`, `close`, `add`, `edit`, `delete`, `search`, `chevronLeft`, `chevronRight`, `moreVertical`, `spinner`, `mail`, `lock`, `warning`
```js
import { Icons } from '@/config/icons';
<Icons.search className="h-4 w-4" />
```

---

## Providers

**File**: `src/components/Providers.jsx`
**Wraps**: `QueryClientProvider` (TanStack React Query) → `TooltipProvider` (shadcn)
**Config**: `staleTime: 60s`, `retry: 1`
**Usage**: Already wrapping `{children}` in root layout — do NOT rewrap.

---

## Middleware

**File**: `src/middleware.js`
**Description**: Placeholder for server-side route protection. Currently passes all requests through.
**Matcher**: Excludes `api`, `_next/static`, `_next/image`, `favicon.ico`.

---

## Routing Pattern

This template uses **Next.js App Router** with **route groups**:

```
src/app/
├── globals.css              ← Global styles + CSS variables
├── layout.js                ← Root layout (Inter font, metadata, Providers)
├── (marketing)/             ← Public pages with header + footer
│   ├── layout.js            ← Wraps children in MarketingHeader + MarketingFooter
│   ├── page.js              ← Landing page (/)
│   ├── about/page.js        ← About page (/about)
│   └── contact/
│       ├── layout.js        ← Contact metadata
│       └── page.js          ← Contact page (/contact)
└── (auth)/                  ← Auth pages (centered, no header/footer)
    ├── layout.js            ← Centered card layout
    ├── login/page.js        ← Login page (/login)
    └── register/page.js     ← Register page (/register)
```

### How to add a new marketing page (e.g., `/pricing`):
1. Create `src/app/(marketing)/pricing/page.js`
2. Export `metadata` for SEO: `export const metadata = { title: "Pricing" };`
3. Export default component — it auto-inherits MarketingHeader + MarketingFooter
4. Add navigation link to `src/components/layout/MarketingHeader.jsx` → `navLinks` array
5. Update footer links in `src/components/layout/MarketingFooter.jsx` if needed
6. Optionally add to `src/config/navigation.js`

### How to add a new auth page (e.g., `/forgot-password`):
1. Create `src/app/(auth)/forgot-password/page.js`
2. Add `"use client"` directive at top
3. Use Card components for consistent auth UI
4. It auto-inherits the centered auth layout

---

## How to Add a New Feature (full workflow)

1. **Service** → `src/services/feature.service.js`
   - Import `apiClient` from `@/lib/api-client`
   - Export async functions for CRUD operations
2. **Store** (if needed) → `src/store/feature.store.js`
   - Create Zustand store with `create()`
   - Export from `src/store/index.js`
3. **Hook** (if complex logic) → `src/hooks/useFeature.js`
   - Wrap TanStack Query calls or complex state logic
   - Export from `src/hooks/index.js`
4. **Page** → `src/app/(marketing)/feature/page.js` or `src/app/(auth)/feature/page.js`
   - Import components from `@/components/ui`
   - Import service from `@/services/feature.service`
5. **Navigation** → Add link to `MarketingHeader.jsx` navLinks and `config/navigation.js`

---

## CSS Variables Available

Defined in `src/app/globals.css`. All values are HSL triplets (used as `hsl(var(--name))`):

### Light Mode (`:root`)
| Variable | Value | Purpose |
|---|---|---|
| `--background` | `0 0% 100%` | Page background |
| `--foreground` | `0 0% 12%` | Default text color |
| `--card` | `0 0% 100%` | Card background |
| `--card-foreground` | `0 0% 12%` | Card text |
| `--popover` | `0 0% 100%` | Popover background |
| `--popover-foreground` | `0 0% 12%` | Popover text |
| `--primary` | `0 0% 10%` | Primary brand color |
| `--primary-foreground` | `0 0% 98%` | Text on primary |
| `--secondary` | `0 0% 96.1%` | Secondary surfaces |
| `--secondary-foreground` | `0 0% 12%` | Text on secondary |
| `--muted` | `0 0% 96.1%` | Muted backgrounds |
| `--muted-foreground` | `0 0% 45.1%` | Muted text |
| `--accent` | `0 0% 96.1%` | Accent/hover backgrounds |
| `--accent-foreground` | `0 0% 12%` | Text on accent |
| `--destructive` | `0 84.2% 60.2%` | Danger/error color |
| `--destructive-foreground` | `0 0% 98%` | Text on destructive |
| `--border` | `0 0% 90%` | Border color |
| `--input` | `0 0% 90%` | Input border |
| `--ring` | `0 0% 10%` | Focus ring |
| `--radius` | `0.5rem` | Border radius base |

### Dark Mode (`.dark`)
| Variable | Value |
|---|---|
| `--background` | `240 10% 3.9%` |
| `--foreground` | `0 0% 98%` |
| `--card` | `240 10% 3.9%` |
| `--card-foreground` | `0 0% 98%` |
| `--popover` | `240 10% 3.9%` |
| `--popover-foreground` | `0 0% 98%` |
| `--primary` | `0 0% 98%` |
| `--primary-foreground` | `240 5.9% 10%` |
| `--secondary` | `240 3.7% 15.9%` |
| `--secondary-foreground` | `0 0% 98%` |
| `--muted` | `240 3.7% 15.9%` |
| `--muted-foreground` | `240 5% 64.9%` |
| `--accent` | `240 3.7% 15.9%` |
| `--accent-foreground` | `0 0% 98%` |
| `--destructive` | `0 62.8% 30.6%` |
| `--destructive-foreground` | `0 0% 98%` |
| `--border` | `240 3.7% 15.9%` |
| `--input` | `240 3.7% 15.9%` |
| `--ring` | `0 0% 98%` |

### Base Styles Applied
```css
* { @apply border-border; }
html { scroll-behavior: smooth; }
body { @apply bg-background text-foreground text-sm antialiased; }
h1-h6 { @apply font-medium tracking-tight; }
```

---

## Tailwind Custom Configuration

**File**: `tailwind.config.js`

### Custom Colors (all HSL-variable-driven)
`background`, `foreground`, `border`, `input`, `ring`,
`primary` / `primary-foreground`,
`secondary` / `secondary-foreground`,
`destructive` / `destructive-foreground`,
`muted` / `muted-foreground`,
`accent` / `accent-foreground`,
`popover` / `popover-foreground`,
`card` / `card-foreground`

### Custom Font
```js
fontFamily: { sans: ['var(--font-inter)', 'system-ui', 'sans-serif'] }
```

### Custom Border Radius
```js
borderRadius: {
  lg: "var(--radius)",        // 0.5rem
  md: "calc(var(--radius) - 2px)",
  sm: "calc(var(--radius) - 4px)",
}
```

### Custom Animation
```js
keyframes: {
  "fade-in-up": {
    "0%": { opacity: "0", transform: "translateY(10px)" },
    "100%": { opacity: "1", transform: "translateY(0)" },
  },
},
animation: {
  "fade-in-up": "fade-in-up 0.5s ease-out",
}
```

### Container
```js
container: { center: true, padding: "2rem", screens: { "2xl": "1400px" } }
```

### Content Paths
```
'./src/components/**/*.{js,jsx,mdx}'
'./src/app/**/*.{js,jsx,mdx}'
```

---

## Environment Variables

| Variable | Used In | Purpose |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `src/lib/api-client.js` | API base URL (default: `/api`) |

> **Note**: No `.env.example` file exists yet. Create one with the above variable.

---

## shadcn/ui Components (Installed)

**Status**: Initialized and configured via `components.json`.
**Config**: `components.json` at project root (style: `base-nova`, tsx: false, cssVariables: true)
**Add more**: `npx shadcn@latest add <component-name> -y`

All shadcn components are in `src/components/ui/` (lowercase filenames) and barrel-exported from `index.js`.

### Accordion
**File**: `src/components/ui/accordion.jsx`
**Exports**: `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`
```jsx
<Accordion>
  <AccordionItem value="item-1">
    <AccordionTrigger>Section title</AccordionTrigger>
    <AccordionContent>Content here</AccordionContent>
  </AccordionItem>
</Accordion>
```

### AlertDialog
**File**: `src/components/ui/alert-dialog.jsx`
**Exports**: `AlertDialog`, `AlertDialogTrigger`, `AlertDialogContent`, `AlertDialogHeader`, `AlertDialogFooter`, `AlertDialogTitle`, `AlertDialogDescription`, `AlertDialogAction`, `AlertDialogCancel`, `AlertDialogMedia`, `AlertDialogOverlay`, `AlertDialogPortal`
```jsx
<AlertDialog>
  <AlertDialogTrigger><Button>Delete</Button></AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### Checkbox
**File**: `src/components/ui/checkbox.jsx`
**Exports**: `Checkbox`
```jsx
<Checkbox id="terms" />
<Label htmlFor="terms">Accept terms</Label>
```

### DropdownMenu
**File**: `src/components/ui/dropdown-menu.jsx`
**Exports**: `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuLabel`, `DropdownMenuSeparator`, `DropdownMenuGroup`, `DropdownMenuSub`, `DropdownMenuSubTrigger`, `DropdownMenuSubContent`, `DropdownMenuCheckboxItem`, `DropdownMenuRadioGroup`, `DropdownMenuRadioItem`, `DropdownMenuShortcut`, `DropdownMenuPortal`
```jsx
<DropdownMenu>
  <DropdownMenuTrigger><Button variant="outline">Open</Button></DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Actions</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Edit</DropdownMenuItem>
    <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Label
**File**: `src/components/ui/label.jsx`
**Exports**: `Label`
```jsx
<Label htmlFor="email">Email</Label>
```

### ScrollArea
**File**: `src/components/ui/scroll-area.jsx`
**Exports**: `ScrollArea`, `ScrollBar`
```jsx
<ScrollArea className="h-72 w-48">
  {items.map(item => <div key={item}>{item}</div>)}
</ScrollArea>
```

### Select
**File**: `src/components/ui/select.jsx`
**Exports**: `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`, `SelectGroup`, `SelectLabel`, `SelectSeparator`, `SelectScrollUpButton`, `SelectScrollDownButton`
```jsx
<Select defaultValue="apple">
  <SelectTrigger>
    <SelectValue placeholder="Select fruit" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="apple">Apple</SelectItem>
    <SelectItem value="banana">Banana</SelectItem>
  </SelectContent>
</Select>
```

### Separator
**File**: `src/components/ui/separator.jsx`
**Exports**: `Separator`
```jsx
<Separator />
<Separator orientation="vertical" />
```

### Sheet
**File**: `src/components/ui/sheet.jsx`
**Exports**: `Sheet`, `SheetTrigger`, `SheetContent`, `SheetHeader`, `SheetFooter`, `SheetTitle`, `SheetDescription`, `SheetClose`
**Props**: `SheetContent` accepts `side` (`top` | `right` | `bottom` | `left`)
```jsx
<Sheet>
  <SheetTrigger><Button>Open</Button></SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Panel Title</SheetTitle>
      <SheetDescription>Description text</SheetDescription>
    </SheetHeader>
    {/* Content */}
  </SheetContent>
</Sheet>
```

### Skeleton
**File**: `src/components/ui/skeleton.jsx`
**Exports**: `Skeleton`
```jsx
<Skeleton className="h-4 w-[250px]" />
<Skeleton className="h-12 w-12 rounded-full" />
```

### Switch
**File**: `src/components/ui/switch.jsx`
**Exports**: `Switch`
```jsx
<Switch id="notifications" />
<Label htmlFor="notifications">Enable notifications</Label>
```

### Tabs
**File**: `src/components/ui/tabs.jsx`
**Exports**: `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`
```jsx
<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="account">Account settings here.</TabsContent>
  <TabsContent value="settings">App settings here.</TabsContent>
</Tabs>
```

### Tooltip
**File**: `src/components/ui/tooltip.jsx`
**Exports**: `Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipProvider`
**Note**: `TooltipProvider` is already wrapped in `Providers.jsx`
```jsx
<Tooltip>
  <TooltipTrigger><Button variant="ghost" size="icon"><Icons.settings /></Button></TooltipTrigger>
  <TooltipContent>Settings</TooltipContent>
</Tooltip>
```

### Adding more shadcn components
```bash
npx shadcn@latest add <component-name> -y
# Examples:
npx shadcn@latest add radio-group -y
npx shadcn@latest add toast -y
npx shadcn@latest add popover -y
npx shadcn@latest add command -y
```
New components auto-install to `src/components/ui/` and import from `@/lib/cn`.

---

## DO NOT Create These (Already Exist)

### Root Config Files
```
.eslintrc.json
.gitignore
components.json
jsconfig.json
next.config.mjs
package.json
pnpm-lock.yaml
postcss.config.js
tailwind.config.js
vercel.json
TEMPLATE_MANIFEST.md
```

### Source Files — Custom
```
src/middleware.js
src/app/globals.css
src/app/layout.js
src/app/(auth)/layout.js
src/app/(auth)/login/page.js
src/app/(auth)/register/page.js
src/app/(marketing)/layout.js
src/app/(marketing)/page.js
src/app/(marketing)/about/page.js
src/app/(marketing)/contact/layout.js
src/app/(marketing)/contact/page.js
src/components/Providers.jsx
src/components/layout/MarketingHeader.jsx
src/components/layout/MarketingFooter.jsx
src/components/ui/Avatar.jsx
src/components/ui/Badge.jsx
src/components/ui/Button.jsx
src/components/ui/Card.jsx
src/components/ui/EmptyState.jsx
src/components/ui/Input.jsx
src/components/ui/Modal.jsx
src/components/ui/Pagination.jsx
src/components/ui/Spinner.jsx
src/components/ui/Table.jsx
src/components/ui/Textarea.jsx
src/components/ui/index.js
src/config/icons.js
src/config/navigation.js
src/config/site.js
src/hooks/index.js
src/hooks/useDebounce.js
src/hooks/useLocalStorage.js
src/hooks/usePagination.js
src/lib/api-client.js
src/lib/cn.js
src/lib/utils.js
src/services/auth.service.js
src/store/auth.store.js
src/store/index.js
```

### Source Files — shadcn/ui
```
src/components/ui/accordion.jsx
src/components/ui/alert-dialog.jsx
src/components/ui/checkbox.jsx
src/components/ui/dropdown-menu.jsx
src/components/ui/label.jsx
src/components/ui/scroll-area.jsx
src/components/ui/select.jsx
src/components/ui/separator.jsx
src/components/ui/sheet.jsx
src/components/ui/skeleton.jsx
src/components/ui/switch.jsx
src/components/ui/tabs.jsx
src/components/ui/tooltip.jsx
```

### Public Assets
```
public/.gitkeep
```

---

## Project Structure (Complete Tree)

```
lucid-template-nextjs-website/
├── .eslintrc.json
├── .gitignore
├── components.json              ← shadcn/ui config
├── jsconfig.json
├── next.config.mjs
├── package.json
├── pnpm-lock.yaml
├── postcss.config.js
├── tailwind.config.js
├── vercel.json
├── TEMPLATE_MANIFEST.md          ← This file
├── public/
│   └── .gitkeep
└── src/
    ├── middleware.js
    ├── app/
    │   ├── globals.css
    │   ├── layout.js              ← Root: Inter font + Providers
    │   ├── (auth)/
    │   │   ├── layout.js          ← Centered card layout
    │   │   ├── login/page.js      ← Login with RHF + Zod
    │   │   └── register/page.js   ← Register stub
    │   └── (marketing)/
    │       ├── layout.js          ← Header + Footer wrapper
    │       ├── page.js            ← Landing page (Hero + Features + CTA)
    │       ├── about/page.js      ← Team + Mission
    │       └── contact/
    │           ├── layout.js      ← Contact metadata
    │           └── page.js        ← Contact form + FAQ
    ├── components/
    │   ├── Providers.jsx          ← QueryClient + TooltipProvider
    │   ├── layout/
    │   │   ├── MarketingHeader.jsx
    │   │   └── MarketingFooter.jsx
    │   └── ui/
    │       ├── index.js           ← Barrel export (all custom + shadcn)
    │       ├── Avatar.jsx         ── Custom
    │       ├── Badge.jsx          ── Custom
    │       ├── Button.jsx         ── Custom
    │       ├── Card.jsx           ── Custom
    │       ├── EmptyState.jsx     ── Custom
    │       ├── Input.jsx          ── Custom
    │       ├── Modal.jsx          ── Custom
    │       ├── Pagination.jsx     ── Custom
    │       ├── Spinner.jsx        ── Custom
    │       ├── Table.jsx          ── Custom
    │       ├── Textarea.jsx       ── Custom
    │       ├── accordion.jsx      ── shadcn/ui
    │       ├── alert-dialog.jsx   ── shadcn/ui
    │       ├── checkbox.jsx       ── shadcn/ui
    │       ├── dropdown-menu.jsx  ── shadcn/ui
    │       ├── label.jsx          ── shadcn/ui
    │       ├── scroll-area.jsx    ── shadcn/ui
    │       ├── select.jsx         ── shadcn/ui
    │       ├── separator.jsx      ── shadcn/ui
    │       ├── sheet.jsx          ── shadcn/ui
    │       ├── skeleton.jsx       ── shadcn/ui
    │       ├── switch.jsx         ── shadcn/ui
    │       ├── tabs.jsx           ── shadcn/ui
    │       └── tooltip.jsx        ── shadcn/ui
    ├── config/
    │   ├── icons.js
    │   ├── navigation.js
    │   └── site.js
    ├── hooks/
    │   ├── index.js               ← Barrel export
    │   ├── useDebounce.js
    │   ├── useLocalStorage.js
    │   └── usePagination.js
    ├── lib/
    │   ├── api-client.js
    │   ├── cn.js                  ← Primary utility (clsx + tw-merge)
    │   └── utils.js               ← shadcn alias → same as cn.js
    ├── services/
    │   └── auth.service.js
    └── store/
        ├── index.js               ← Barrel export
        └── auth.store.js
```
