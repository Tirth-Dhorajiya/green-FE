# Customer application architecture

The customer website follows the Next.js App Router structure while keeping
reusable code outside route folders:

- `app/` contains routes, layouts, metadata, and route-specific composition.
- `components/layout/` contains navigation, footer, providers, and decoration.
- `components/ui/` contains reusable modals, reveals, and loading primitives.
- `components/home/`, `components/growing/`, `components/orders/`,
  `components/products/`, and `components/reviews/` contain domain-specific UI.
- `context/` contains client-side authentication, cart, and wishlist state.
- `services/` contains the API client, endpoints, and backend data access.
- `utils/` contains pure formatting, sanitizing, redirect, and SEO helpers.
- `public/` contains static images and web assets.

Use the `@/` alias for cross-folder imports. Keep `app/` focused on routing and
composition; reusable rendering belongs in `components`, shared state in `context`,
network access in `services`, and pure helpers in `utils`.

Preserve existing server and client component boundaries when moving files.
`NEXT_PUBLIC_*` variables are public browser configuration and must never contain
credentials. `NEXT_PUBLIC_SITE_URL` provides the public origin used for canonical
URLs and redirect validation; redirect targets must also pass relative-path checks.
