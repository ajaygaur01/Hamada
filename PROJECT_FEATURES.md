# Kaori by Chiran — Complete Feature & Flow Documentation

> **Platform**: B2B Japanese Tea E-Commerce Platform  
> **Tech Stack**: Next.js (App Router), TypeScript, Prisma ORM, PostgreSQL, Razorpay Payments  
> **Brand Palette**: `#4E3D33` (Dark Brown), `#D04636` (Brand Red), `#E7DDC1` (Cream), White  

---

## Table of Contents

1. [Authentication System](#1-authentication-system)
2. [Homepage](#2-homepage)
3. [Products Catalog](#3-products-catalog)
4. [Product Details Page](#4-product-details-page)
5. [Sample Order Flow](#5-sample-order-flow)
6. [Bulk Order Flow](#6-bulk-order-flow)
7. [GST Verification](#7-gst-verification)
8. [User Account Dashboard](#8-user-account-dashboard)
9. [Wishlist System](#9-wishlist-system)
10. [About Us Page](#10-about-us-page)
11. [How It Works Page](#11-how-it-works-page)
12. [Contact Us Page](#12-contact-us-page)
13. [Wholesale Page](#13-wholesale-page)
14. [Admin Panel](#14-admin-panel)
15. [Global Layout](#15-global-layout)
16. [Database Schema](#16-database-schema)
17. [API Routes Map](#17-api-routes-map)

---

## 1. Authentication System

### Flow
1. User clicks **Login/Signup** in the navbar → modal dialog opens.
2. **Signup**: Collects email + password, creates user with `role: customer`, hashes password via bcrypt, issues JWT token stored in an HTTP-only cookie.
3. **Login**: Validates credentials, issues JWT token.
4. **Logout**: Clears the auth cookie.
5. **Session Check**: `GET /api/auth/me` returns current user info from the token.

### Files
| File | Purpose |
|------|---------|
| `src/components/auth/AuthProvider.tsx` | Client-side auth context with login/signup modal UI |
| `src/app/api/auth/login/route.ts` | Login endpoint |
| `src/app/api/auth/signup/route.ts` | Signup endpoint |
| `src/app/api/auth/logout/route.ts` | Logout endpoint |
| `src/app/api/auth/me/route.ts` | Session check endpoint |
| `src/lib/auth/jwt.ts` | JWT sign/verify helpers |
| `src/lib/auth/password.ts` | Bcrypt hash/compare helpers |
| `src/lib/auth/constants.ts` | Cookie name constant |
| `src/lib/auth/validators.ts` | Input validation helpers |
| `src/lib/auth/server-session.ts` | Server-side auth user fetcher |
| `src/lib/auth/require-user.ts` | Server-side user requirement helper |

### Security
- JWT tokens with expiry
- HTTP-only cookies (not accessible via JS)
- Server-side role checking (`admin` vs `customer`)
- Password hashing with bcrypt

---

## 2. Homepage

### Sections
1. **Hero Banner** — Full-width hero with headline and CTA buttons
2. **Teas Section** — Featured teas with "Order Sample" functionality
3. **Features Section** — Key selling points / USPs
4. **Our Story** — Brief brand narrative
5. **Trusted By** — Client logos / social proof

### Files
| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Homepage server component |
| `src/components/home/Hero.tsx` | Hero banner |
| `src/components/home/Teas.tsx` | Featured teas grid |
| `src/components/home/Features.tsx` | Feature highlights |
| `src/components/home/Story.tsx` | Brand story |
| `src/components/home/TrustedBy.tsx` | Trust badges |

---

## 3. Products Catalog

### Flow
1. Server-side fetch of all active products with categories, variants, and reviews.
2. Products grouped into **Premium Japanese Teas** and **Instant Teas & Ready Formats**.
3. **Use-case filter pills** (e.g. "Cafés", "Hotels") — click to filter products by use case.
4. **Live search bar** — search by product name or category.
5. Product cards show: image, name, category tag, use-case tags, star rating, review count, starting sample price, and **"View"** CTA button.
6. **"Sample Available"** / **"On Request"** status badges on each card.
7. Wishlist button on each card (heart icon).
8. Bottom CTA section: "Order a Sample" (links to `/products`) and "Contact Us".

### Files
| File | Purpose |
|------|---------|
| `src/app/products/page.tsx` | Server component fetching products from DB |
| `src/components/products/PageHeader.tsx` | Page header/banner |
| `src/components/products/ProductGrid.tsx` | Client component with search, filters, product grid |
| `src/components/products/ProductCard.tsx` | Individual product card |
| `src/components/products/CTASection.tsx` | Bottom CTA with "Order a Sample" + "Contact Us" |

### Design
- Filter pills and "View" buttons use `#D04636` (brand red)
- "Sample Available" badge: `#D04636`, "On Request" badge: `#4E3D33`
- Hover animations with shadow elevation

---

## 4. Product Details Page

### Flow
1. Dynamic route `/products/[slug]` — server-side fetches product by slug with all variants, images, reviews.
2. **Breadcrumb navigation** at top.
3. **Image gallery** — multiple product images with primary image display.
4. **Product info** — name, description, grade, origin, tasting profile, use cases, storage instructions, shelf life.
5. **Brewing guide** component.
6. **Order form** — select variant size, choose sample or bulk order, redirects to checkout.
7. **Reviews section** — star ratings, review text, user reviews fetched from DB.

### Files
| File | Purpose |
|------|---------|
| `src/app/products/[slug]/page.tsx` | Server component with full product data |
| `src/components/product-details/Breadcrumb.tsx` | Navigation breadcrumbs |
| `src/components/product-details/ImageGallery.tsx` | Product image gallery |
| `src/components/product-details/ProductInfo.tsx` | Product details (description, origin, tasting profile, etc.) |
| `src/components/product-details/OrderForm.tsx` | Variant selection + Order buttons |
| `src/components/product-details/BrewingGuide.tsx` | Brewing instructions |
| `src/components/product-details/ReviewsSection.tsx` | Customer reviews with star ratings |
| `src/app/api/reviews/route.ts` | Reviews CRUD API |

---

## 5. Sample Order Flow

### Flow (3-Step Wizard)
1. User selects a product variant from the product details page → redirected to `/sample-order?product=...&variant=...`.
2. **Step 1 — Contact Details**: Full name, business name, email, phone. Pre-filled if logged in.
3. **Step 2 — Shipping Address**: Address Line 1, Address Line 2, Landmark, City, State, Pincode, Country.
4. **Step 3 — Review & Pay**: Dark-themed order summary card (product name, variant, amount), additional notes field. "Pay & Place Order" button triggers Razorpay.
5. **Razorpay integration**:
   - `POST /api/sample-orders/create-payment-order` — creates a Razorpay order + database record.
   - Razorpay checkout popup opens.
   - On success: `POST /api/sample-orders/verify-payment` — verifies signature, updates payment status.
   - On failure: `POST /api/sample-orders/mark-failed` — marks order as failed.
6. **Success view** (Step 4) — "Order Confirmed!" with shipping summary and links.
7. **Quote API**: `GET /api/sample-orders/quote` — returns payable amount for a product/variant.

### Visual Design
- Progress bar with 3 circles connected by a red line
- Step transitions with slide-in animations
- Simplified distraction-free header (just "KAORI" logo)
- Brand colors: red CTAs, dark brown accents

### Files
| File | Purpose |
|------|---------|
| `src/app/sample-order/page.tsx` | Server component with product data |
| `src/components/sample-order/SampleOrderPageClient.tsx` | 3-step wizard client component |
| `src/app/api/sample-orders/quote/route.ts` | Price quote endpoint |
| `src/app/api/sample-orders/create-payment-order/route.ts` | Create Razorpay order |
| `src/app/api/sample-orders/verify-payment/route.ts` | Verify Razorpay payment |
| `src/app/api/sample-orders/mark-failed/route.ts` | Mark failed payments |
| `src/lib/sample-order.ts` | Sample order helper logic |

---

## 6. Bulk Order Flow

### Prerequisites
- User must be logged in.
- User must have a verified GSTIN (redirects to `/bulk-order/verify-gstin` if not).

### Flow (3-Step Wizard)
1. User selects a product variant and quantity from the product page → redirected to `/bulk-order/checkout?variant=...&qty=...`.
2. **Step 1 — Contact Details**: Displays verified **Company Name** and **GSTIN** (read-only, green verified badge). Collects contact person name, email, and phone.
3. **Step 2 — Shipping Address**: Granular address fields (pre-filled with company address). All fields are combined into a single address string for the API.
4. **Step 3 — Review & Pay**: Dark order summary card with product, variant, quantity, subtotal, GST (5%), and total. Additional notes field. "Pay ₹X" button triggers Razorpay.
5. **Razorpay integration**:
   - `POST /api/bulk-orders` — creates order with address.
   - Razorpay popup opens.
   - On success: `POST /api/bulk-orders/verify` — verifies payment and redirects to success page.
6. **Success page**: `/bulk-order/success/[orderId]` — order confirmation.

### Additional Pages
- **Cart page**: `/bulk-order/cart` — cart management for bulk items.
- **Bulk order landing**: `/bulk-order` — entry point.

### Files
| File | Purpose |
|------|---------|
| `src/app/bulk-order/page.tsx` | Bulk order landing |
| `src/app/bulk-order/cart/` | Cart page |
| `src/app/bulk-order/checkout/page.tsx` | Server component with auth/GST guards |
| `src/app/bulk-order/checkout/BulkOrderCheckoutClient.tsx` | 3-step wizard client component |
| `src/app/bulk-order/success/` | Success page |
| `src/app/api/bulk-orders/route.ts` | Create bulk order endpoint |
| `src/app/api/bulk-orders/verify/route.ts` | Verify bulk order payment |

---

## 7. GST Verification

### Flow
1. User attempts to access bulk order checkout without verified GSTIN → redirected to `/bulk-order/verify-gstin`.
2. **Step 1**: Enter 15-digit GSTIN in a centered, clean form with monospace input. Real-time format validation.
3. **Verify**: `POST /api/gstin/verify` with `action: "verify"` — calls GST portal API, returns company name + address.
4. **Step 2**: Verified card shows company name and address with emerald green checkmark. User confirms with "Yes, Confirm".
5. **Confirm**: `POST /api/gstin/verify` with `action: "confirm"` — saves to database, marks `gstin_verified: true`.
6. Redirects back to the original page (checkout, etc.).

### Files
| File | Purpose |
|------|---------|
| `src/app/bulk-order/verify-gstin/page.tsx` | GST verification page (client component) |
| `src/app/api/gstin/verify/route.ts` | GSTIN verification API |

### Design
- Clean white background, no heavy color blocks
- Red CTA buttons, emerald success state
- Monospace centered GSTIN input

---

## 8. User Account Dashboard

### Sections (Tab-based navigation)
1. **Overview** — Stat cards: Total Orders, Sample Orders, Bulk Orders, Pending Orders. Each card has a brand brown (`#4E3D33`) icon wrapper.
2. **My Orders** — Table of user's orders with status badges, payment info.
3. **Profile** — User info form (name, email, phone). "Verified Wholesale Buyer" badge with brand brown theme.
4. **Addresses** — List of saved addresses fetched from `/api/account/addresses`. Real data, no mock data.
5. **Invoices** — List of invoices fetched from `/api/account/invoices`. Real data from database.

### Auth Guard
- Server-side in `src/app/account/page.tsx` — redirects unauthenticated users to login.

### Design
- Left sidebar with brand brown (`#4E3D33`) background
- Active section highlighted with brand red (`#D04636`)
- White content area
- Mobile: bottom navigation bar with brand dark-mode styling

### Files
| File | Purpose |
|------|---------|
| `src/app/account/page.tsx` | Server component with auth guard |
| `src/components/account/AccountPageClient.tsx` | Tab-based dashboard client component |
| `src/components/account/sections/OverviewSection.tsx` | Stats overview |
| `src/components/account/sections/OrdersSection.tsx` | Orders table |
| `src/components/account/sections/ProfileSection.tsx` | Profile form |
| `src/components/account/sections/AddressesSection.tsx` | Saved addresses (real data) |
| `src/components/account/sections/InvoicesSection.tsx` | Invoice list (real data) |
| `src/app/api/account/addresses/route.ts` | Addresses API |
| `src/app/api/account/invoices/route.ts` | Invoices API |

---

## 9. Wishlist System

### Flow
1. Heart icon on product cards — click to toggle wishlist.
2. Requires authentication.
3. State persisted to database via API.

### Files
| File | Purpose |
|------|---------|
| `src/components/wishlist/WishlistButton.tsx` | Wishlist toggle button component |
| `src/app/api/wishlist/route.ts` | Wishlist CRUD API |

---

## 10. About Us Page

### Sections
1. **About Hero** — Banner using `about.png` image.
2. **Our Story** — Brand narrative with `about1.avif` image.
3. **Hema's Story** — Founder story with `about2.avif` image.
4. **Awards & Certifications** — Awards showcase with brand brown (`#4E3D33`) background.

### Files
| File | Purpose |
|------|---------|
| `src/app/about/page.tsx` | About page |
| `src/components/about/AboutHero.tsx` | Hero banner |
| `src/components/about/OurStory.tsx` | Brand story |
| `src/components/about/HemasStory.tsx` | Founder story |
| `src/components/about/Awards.tsx` | Awards section |

---

## 11. How It Works Page

### Sections
1. **Header** — Banner using `how.avif` image.
2. **Steps Section** — Step-by-step process (Browse → Sample → Bulk Order).
3. **FAQ Section** — Expandable FAQ accordion.
4. **Still Have Questions?** — CTA section with brand brown (`#4E3D33`) background, linking to contact page.

### Files
| File | Purpose |
|------|---------|
| `src/app/how-it-works/page.tsx` | How It Works page |
| `src/components/how-it-works/HowItWorksHeader.tsx` | Hero with banner |
| `src/components/how-it-works/StepsSection.tsx` | Step cards |
| `src/components/how-it-works/FAQSection.tsx` | FAQ accordion |
| `src/components/how-it-works/StillHaveQuestions.tsx` | CTA |

---

## 12. Contact Us Page

### Sections
1. **Contact Header** — Banner using `getin.avif` image.
2. **Connect Info** — WhatsApp (with WhatsApp icon color), Email, Address, Map.
3. **Inquiry Form** — Name, email, phone, message — form submission.

### Files
| File | Purpose |
|------|---------|
| `src/app/contact/page.tsx` | Contact page |
| `src/components/contact/ContactHeader.tsx` | Hero banner |
| `src/components/contact/ConnectInfo.tsx` | Contact details + WhatsApp |
| `src/components/contact/InquiryForm.tsx` | Inquiry form |

---

## 13. Wholesale Page

### Sections
1. **Wholesale Hero** — Headline and CTA for wholesale buyers.
2. **Business Types** — Target customer segments (Cafés, Hotels, Retailers, etc.).
3. **Program Details** — Wholesale program benefits.
4. **Wholesale Pricing** — Pricing tiers and MOQ info.
5. **Wholesale CTA** — Final call-to-action.

### Files
| File | Purpose |
|------|---------|
| `src/app/wholesale/page.tsx` | Wholesale page |
| `src/components/wholesale/WholesaleHero.tsx` | Hero section |
| `src/components/wholesale/BusinessTypes.tsx` | Target segments |
| `src/components/wholesale/ProgramDetails.tsx` | Program benefits |
| `src/components/wholesale/WholesalePricing.tsx` | Pricing info |
| `src/components/wholesale/WholesaleCTA.tsx` | CTA |

---

## 14. Admin Panel

### Access Control
- Route: `/admin`
- **Server-side auth guard**: Only users with `role: admin` can access. Non-admins are redirected to `/`.

### Layout
- **Dark sidebar** (zinc-900) with navigation: Dashboard, Products, Orders, Users.
- Active item highlighted in `#D04636` (brand red).
- "Back to Site" link at bottom.
- **Mobile**: Top bar + bottom tab navigation.

### Sections

#### 14.1 Dashboard
- **5 stat cards**: Total Products, Sample Orders, Bulk Orders, Total Users, Total Revenue.
- **Recent Orders table**: Last 10 orders (sample + bulk combined), sorted by date. Color-coded badges for payment and order status.

#### 14.2 Products Management
- **View toggle**: Grid view (cards) or Table view.
- **Live search**: Debounced search by product name.
- **Product cards** (grid): Image thumbnail, name, category, featured star, all variants with sample/bulk prices and stock count, total orders, reviews count, active/inactive toggle.
- **Full edit modal**: Opens on pencil click:
  - Product name and short description
  - Category dropdown (all categories from DB)
  - Active/Featured checkboxes
  - Image preview (primary highlighted with red border)
  - **Each variant**: Editable sample price, bulk price, stock quantity, active toggle
  - Save/Cancel buttons
- **Delete**: Soft-delete (deactivates product) with confirmation dialog.

#### 14.3 Orders Management
- **Tab toggle**: "Sample Orders" / "Bulk Orders"
- **Search**: By order number, customer name, or email.
- **Orders table**: Order #, Customer, Product, Amount, Payment status badge, Order status badge, Date.
- **Expandable detail row** (click any order):
  - Full contact info
  - **Status update dropdown** (pending → confirmed → processing → dispatched → delivered → cancelled)
  - **Tracking link input** field
  - "Save Changes" button — persists to database

#### 14.4 Users Management
- **Search**: By name, email, or company name.
- **Users table**: Avatar initial, name, email, company, GSTIN verification badge, order count, join date.
- **User detail view** (click any user):
  - Full profile card: Name, email, phone, join date, role badge
  - Business details: Company name, GSTIN, verification status
  - **Complete order history**: All sample + bulk orders in a combined table with type badge, product, amount, payment/order status, date.

### Admin API Routes
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/admin/stats` | GET | Dashboard statistics |
| `/api/admin/products` | GET | All products with variants, images, categories |
| `/api/admin/products` | PATCH | Update product name, desc, category, active/featured, variant prices/stock |
| `/api/admin/products?id=` | DELETE | Soft-delete (deactivate) product |
| `/api/admin/orders?type=&search=` | GET | All sample or bulk orders |
| `/api/admin/orders` | PATCH | Update order status, tracking link |
| `/api/admin/users?search=` | GET | All users with order counts |
| `/api/admin/users/[id]` | GET | Single user with all orders |

### Files
| File | Purpose |
|------|---------|
| `src/app/admin/page.tsx` | Server component with admin role guard |
| `src/components/admin/AdminPanelClient.tsx` | Main layout with sidebar navigation |
| `src/components/admin/sections/DashboardSection.tsx` | Stats + recent orders |
| `src/components/admin/sections/ProductsSection.tsx` | Product management with grid/table + edit modal |
| `src/components/admin/sections/OrdersSection.tsx` | Order management with tabs + expandable rows |
| `src/components/admin/sections/UsersSection.tsx` | User management with detail drill-down |
| `src/app/api/admin/stats/route.ts` | Stats API |
| `src/app/api/admin/products/route.ts` | Products CRUD API |
| `src/app/api/admin/orders/route.ts` | Orders management API |
| `src/app/api/admin/users/route.ts` | Users list API |
| `src/app/api/admin/users/[id]/route.ts` | User detail API |

---

## 15. Global Layout

### Navbar
- Brand logo "KAORI"
- Navigation links: Products, How It Works, Contact, About Us, Wholesale
- Auth button (Login/Signup or Account)
- Dark brown (`#4E3D33`) background with cream text

### Footer
- Multi-column layout with brand links
- Social media links
- Copyright info

### Files
| File | Purpose |
|------|---------|
| `src/app/layout.tsx` | Root layout with global providers |
| `src/components/layout/Navbar.tsx` | Main navigation bar |
| `src/components/layout/Footer.tsx` | Site footer |

---

## 16. Database Schema

### Models (PostgreSQL via Prisma)

| Model | Description |
|-------|-------------|
| `User` | Users with email, password, role (customer/admin), GSTIN info |
| `Address` | User addresses (line1, line2, city, state, pincode) |
| `Category` | Product categories |
| `Product` | Products with name, slug, description, origin, tasting profile, use cases, brewing guide |
| `ProductVariant` | Size/price variants (sample price, bulk price, stock, min bulk qty) |
| `ProductImage` | Product images with display order and primary flag |
| `SampleOrder` | Sample orders with customer info, payment, tracking |
| `BulkOrder` | Bulk orders linked to user + address with GST breakdown |
| `BulkOrderItem` | Individual items in a bulk order |
| `Invoice` | GST invoices for bulk orders |
| `Cart` | Shopping cart items |
| `Wishlist` | User product wishlists |
| `Review` | Product reviews with ratings |
| `GstinVerification` | GSTIN verification records |
| `EmailLog` | Email sending logs |
| `AnalyticsEvent` | Analytics tracking events |

### Enums
- `Role`: customer, admin
- `PaymentMethod`: upi, razorpay, bank_transfer
- `PaymentStatus`: pending, verified, paid, failed, refunded
- `OrderStatus`: pending, confirmed, processing, dispatched, delivered, cancelled
- `GstinVerificationStatus`: pending, verified, failed
- `EmailType`: sample_confirmation, bulk_confirmation, dispatched, gstin_verified, welcome
- `EmailStatus`: sent, failed

---

## 17. API Routes Map

```
/api
├── auth/
│   ├── login/          POST — Login with email/password
│   ├── signup/         POST — Register new user
│   ├── logout/         POST — Clear auth cookie
│   └── me/             GET  — Current user info
├── account/
│   ├── addresses/      GET  — User's saved addresses
│   └── invoices/       GET  — User's invoices
├── admin/
│   ├── stats/          GET  — Dashboard statistics
│   ├── products/       GET/PATCH/DELETE — Product management
│   ├── orders/         GET/PATCH — Order management
│   └── users/
│       ├── route        GET  — Users list
│       └── [id]/        GET  — User detail with orders
├── bulk-orders/
│   ├── route            POST — Create bulk order
│   └── verify/          POST — Verify bulk payment
├── gstin/
│   └── verify/          POST — GSTIN verify/confirm
├── reviews/             GET/POST — Product reviews
├── sample-orders/
│   ├── quote/           GET  — Price quote
│   ├── create-payment-order/ POST — Create Razorpay order
│   ├── verify-payment/  POST — Verify payment
│   ├── mark-failed/     POST — Mark failed payment
│   └── place-cod/       POST — Place COD order
├── users/               User management
├── wishlist/            GET/POST/DELETE — Wishlist operations
└── test-user/           Development helper
```

---

## Design System Summary

| Element | Color |
|---------|-------|
| Navbar & structural elements | `#4E3D33` (Dark Brown) |
| CTA buttons, active states, badges | `#D04636` (Brand Red) |
| CTA hover state | `#B83C2D` (Darker Red) |
| Cream accents & text on dark bg | `#E7DDC1` |
| Page backgrounds | `#FFFFFF` (White) |
| Input focus rings | `#D04636` |
| Success states (verified, paid, delivered) | Emerald/Green |
| Warning/Pending states | Amber |
| Error/Failed states | Red |

---

*Last updated: May 10, 2026*
