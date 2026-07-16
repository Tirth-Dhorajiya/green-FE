# Green Commerce Completion Workflow

## Current Completed Work

The commerce system now has a customer storefront, backend API, and a separate admin app foundation.

- Customer frontend (`green-FE`): registration, login, product listing, product details, image gallery, cart, Razorpay checkout flow, order history, featured product display, and verified review submission.
- Backend (`green-BE`): auth, product CRUD, Cloudinary uploads, cart, order management, Razorpay payment creation/verification, review APIs, featured products, customer listing, admin stats, and UUID-based schema.
- Admin frontend (`green-admin`): Vite React TypeScript app with admin login, dashboard, product management, featured toggles, image upload, order status management, customers, review moderation, and settings.

## Pending Work

These items should be completed before production launch.

- Run `green-BE/schema/schema.sql` for a fresh database, or run UUID migration followed by `migrations/commerce_completion.sql` for an existing database.
- Configure production environment variables: `DATABASE_URL`, `JWT_SECRET`, `CLIENT_ORIGIN`, Cloudinary credentials, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and frontend/admin API URLs.
- Add email/SMS notifications for order confirmation, payment success, shipping updates, and delivery.
- Add refund handling and Razorpay webhook verification for production-grade payment reconciliation.
- Add coupon, tax, shipping charge, and invoice support if required by the business.
- Add automated integration tests for payment verification, order creation, review eligibility, and image cleanup.

## Customer Workflow

1. Customer registers or logs in.
2. Customer browses products by category: plants, seeds, tools, planters, or other.
3. Customer searches, sorts, and opens a product detail page.
4. Customer views product gallery photos, default image, thumbnail, price, stock, and reviews.
5. Customer selects quantity and adds the product to cart.
6. Customer reviews cart totals and proceeds to checkout.
7. Customer enters shipping address.
8. Frontend requests `POST /api/payments/razorpay/order`.
9. Razorpay checkout opens and collects payment.
10. Frontend sends Razorpay verification data to `POST /api/payments/razorpay/verify`.
11. Backend verifies signature, creates the order, reduces stock, stores shipping/payment references, and clears cart.
12. Customer views order history in profile.
13. After admin marks an order as delivered, customer can submit one verified review for each purchased product.

## Admin Workflow

1. Admin opens `green-admin` and logs in with an admin account.
2. Dashboard shows revenue, orders, products, and customers.
3. Products page allows add, edit, delete, stock updates, category changes, image upload, and featured toggles.
4. Product image uploads go through backend Cloudinary storage with max 10 files per product.
5. Admin selects default and thumbnail image during upload.
6. Orders page lets admin move orders through pending, processing, shipped, delivered, and cancelled.
7. Customers page lists registered users.
8. Reviews page lets admin hide or show customer reviews.
9. Settings page shows current API and asset base URL configuration.

## API And Data Model

Products include `is_featured`, `thumbnail_url`, and `images` metadata with `url`, `public_id`, `is_default`, `is_thumbnail`, and `sort_order`.

Orders include `shipping_address`, `payment_status`, `payment_provider`, `payment_reference`, `razorpay_order_id`, and `razorpay_payment_id`.

Reviews include `product_id`, `user_id`, `order_id`, `rating`, `comment`, and `status`.

Important endpoints:

- `GET /api/products?featured=true`
- `PUT /api/products/:id/featured`
- `POST /api/payments/razorpay/order`
- `POST /api/payments/razorpay/verify`
- `GET /api/products/:id/reviews`
- `POST /api/products/:id/reviews`
- `GET /api/admin/reviews`
- `PUT /api/admin/reviews/:id/status`
- `GET /api/admin/customers`

## Development Rules

- Keep backend responsibilities separated into routes, controllers, models, middleware, and config.
- Keep frontend and admin API paths in `apiConfig` files.
- Do not hardcode base URLs or endpoints inside components.
- Keep React components small and focused on one responsibility.
- Split large forms, tables, and workflows when they become difficult to scan.
- Use clear names for files, functions, state, and API payloads.
- Avoid unused imports, unused variables, syntax errors, and unnecessary complexity.
- Validate each feature manually and run build/lint checks before finalizing.

## Validation Checklist

- Backend: start server and test auth, product CRUD, Cloudinary image upload, featured products, cart, Razorpay order creation, payment verification, order creation, stock reduction, and review eligibility.
- Customer frontend: run lint/build, then test browse, search, gallery, add to cart, checkout, payment success/failure, order history, and review submission.
- Admin frontend: run lint/build, then test login guard, dashboard, product CRUD, image upload, featured toggle, order status updates, customers, and review moderation.
