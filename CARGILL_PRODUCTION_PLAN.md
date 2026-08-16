# CARGILL — Production Website & Export Platform Plan

> **Document type:** Product, UX, Architecture, Security & Production Specification  
> **Project:** CARGILL Egyptian Export & Import Company  
> **Status:** Strategic implementation plan  
> **Target:** Production-ready B2B corporate export website  
> **Primary stack:** Next.js + TypeScript + Tailwind CSS + Prisma + PostgreSQL + NextAuth

---

## 1. Executive Summary

CARGILL should be positioned as a **professional B2B export company platform**, not simply as a marketing website.

The target experience is:

> A buyer in Russia, Europe, the Middle East, or another international market should be able to understand who CARGILL is, discover products, verify quality and logistics capabilities, and submit a professional commercial inquiry with confidence.

The existing project provides a strong foundation: modern Next.js architecture, TypeScript, PostgreSQL/Prisma data modeling, authentication, product management, inquiries, SEO metadata, sitemap generation, and an administrative interface.

The objective of this plan is to harden and evolve that foundation into a **production-grade corporate export platform** without unnecessary rewriting.

---

## 2. Product Vision

### Core positioning

**CARGILL — Egyptian Fresh Produce Exporter**

The website should communicate:

- Egyptian origin
- Export-grade quality
- Reliable sourcing
- Professional packing
- Cold-chain and shipping capability
- International market coverage
- Transparent specifications
- Fast B2B communication

### Business model

CARGILL is a **B2B export business**.

The website should therefore prioritize:

- Product discovery
- Export specifications
- Packaging information
- Markets
- Quality
- Logistics
- Request for Quote (RFQ)
- Contact with the export team

It should **not** be designed primarily as a consumer e-commerce store.

Avoid exposing retail checkout functionality unless the business model changes.

---

# 3. Target Website Architecture

```text
CARGILL EXPORT
│
├── Public Website
│   ├── Home
│   ├── About Us
│   ├── Products
│   │   ├── Fresh Fruits
│   │   ├── Fresh Vegetables
│   │   └── Frozen Products
│   ├── Product Details
│   ├── Export Markets
│   ├── Quality & Certifications
│   ├── Packaging & Logistics
│   ├── Export Process
│   ├── Contact
│   └── Request a Quote
│
├── Internationalization
│   ├── English
│   ├── Arabic
│   └── Russian
│
├── Admin Platform
│   ├── Dashboard
│   ├── Products
│   ├── Categories
│   ├── Markets
│   ├── Certifications
│   ├── Quote Requests
│   ├── Contact Messages
│   ├── SEO
│   ├── Company Settings
│   └── Activity Logs
│
└── Infrastructure
    ├── PostgreSQL
    ├── Prisma
    ├── Authentication
    ├── Authorization
    ├── Rate Limiting
    ├── Security Headers
    ├── Analytics
    ├── Monitoring
    ├── Backups
    └── CI/CD
```

---

# 4. Corporate Website Requirements

## 4.1 Homepage

The homepage must answer the following within the first few seconds:

1. Who is CARGILL?
2. What does CARGILL export?
3. Where are products sourced?
4. Which markets are served?
5. Why should an importer work with CARGILL?
6. How can a buyer request an offer?

### Recommended hero

**Headline:**

> Premium Egyptian Fresh Produce

**Supporting message:**

> Egyptian fruits and vegetables carefully sourced, packed and exported to international markets.

### Primary actions

- Request a Quote
- Explore Products
- Contact Export Team

### Homepage sections

1. Hero
2. Product categories
3. Featured products
4. Why CARGILL
5. Quality process
6. Export markets
7. Packaging & logistics
8. Export process
9. Certifications
10. Call to action
11. Footer/contact information

---

# 5. Product Experience

Product pages should function as professional B2B product sheets.

## Required product information

### Overview

- Product name
- Commercial name
- Scientific name where relevant
- Category
- Origin
- Variety
- Grade
- Availability

### Specifications

- Size
- Color
- Shape
- Diameter
- Weight
- Taste
- Texture
- Shelf life
- Storage temperature
- Humidity requirements
- Transportation method

### Seasonality

- Available months
- Peak export months
- Off-season information

### Packaging

- Packaging type
- Carton dimensions
- Net weight
- Gross weight
- Pieces per carton
- Cartons per pallet
- Pallet configuration

### Export

- Export countries
- Destination markets
- Shipping method
- Refrigerated container requirements

### Product page actions

- Request a Quote
- Contact Export Team
- Download Product Specification where applicable

---

# 6. Packaging & Logistics

Create a dedicated professional section for export packaging and shipping.

Example information structure:

```text
PACKAGING

Carton Dimensions
390 × 283 × 108 mm

Net Weight
15 KG

Gross Weight
16 KG

Cartons / Pallet
10

Pallets / 40ft Container
40
```

Only publish specifications that have been verified by the company.

Do not invent certifications, capacities, shipping routes, or technical specifications for marketing purposes.

---

# 7. Export Process

Create a visual process explaining how CARGILL handles export orders.

```text
01 — Sourcing
        ↓
02 — Quality Control
        ↓
03 — Sorting & Grading
        ↓
04 — Packing
        ↓
05 — Cold Storage
        ↓
06 — Documentation
        ↓
07 — Shipping
        ↓
08 — Delivery
```

Each stage should have a short explanation and, where available, real company photography.

---

# 8. Export Markets

The Markets section should demonstrate international capability.

Initial market examples may include:

- Russia
- European markets
- Middle East
- Africa
- Domestic Egypt where relevant

Each market page/card may contain:

- Market name
- Country/region
- Products supplied
- Shipping method
- Relevant packaging
- Export notes

### Important

Only claim markets where CARGILL actually operates or intends to officially target them.

---

# 9. Quality & Certifications

The website should make quality a core trust element.

Recommended process visualization:

```text
Farm / Supplier Selection
        ↓
Harvest Control
        ↓
Sorting
        ↓
Grading
        ↓
Packing
        ↓
Final Inspection
        ↓
Export
```

### Certifications

Show only certifications and standards that CARGILL actually possesses or is authorized to claim.

For every certification, store:

- Name
- Issuer
- Validity where applicable
- Certificate/document reference where appropriate
- Related product/category

---

# 10. Request for Quote (RFQ)

RFQ is one of the most important conversion features of the platform.

## Recommended fields

- Product
- Quantity
- Packaging
- Destination country
- Destination port
- Required delivery date
- Company name
- Buyer name
- Email
- Phone/WhatsApp
- Message

### Workflow

```text
Buyer
  ↓
Product Page
  ↓
Request a Quote
  ↓
RFQ Form
  ↓
Server-side Validation
  ↓
Anti-spam / Rate Limit
  ↓
Database
  ↓
Admin Notification
  ↓
Sales Team
  ↓
Commercial Follow-up
```

### RFQ statuses

- PENDING
- PROCESSED
- COMPLETED
- CANCELLED

The existing data model already supports these concepts and should be extended rather than replaced unnecessarily.

---

# 11. Contact System

Public contact forms should support:

- Name
- Email
- Phone
- Company
- Subject
- Message

Admin should support:

- Read/unread
- Archive
- Search
- Filtering
- Status where useful
- Timestamp

---

# 12. Internationalization (i18n)

Target languages:

### English

Primary international business language.

### Russian

Important for the Russian export market.

### Arabic

Important for the Egyptian/local business context.

Recommended URL architecture:

```text
/en
/ar
/ru
```

Examples:

```text
/en/products/oranges
/ar/products/oranges
/ru/products/oranges
```

### i18n requirements

- Translated navigation
- Translated product content
- Translated metadata
- Translated forms
- Language switcher
- `hreflang`
- Localized canonical URLs
- Localized sitemap entries
- Correct `lang` attributes

Do not rely on client-side text swapping alone for SEO-critical content.

---

# 13. SEO Strategy

## Technical SEO

Implement:

- Metadata per page
- Canonical URLs
- Open Graph
- Twitter cards
- XML sitemap
- Robots configuration
- Breadcrumbs
- Structured data
- Clean URLs
- Correct status codes
- Image alt text
- International `hreflang`

## Product SEO

Each product should have:

- Unique title
- Unique description
- Canonical URL
- Open Graph image
- Product structured data where appropriate
- Breadcrumb structured data

## Keyword themes

Potential keyword themes include:

- Egyptian fruit exporter
- Egyptian vegetable exporter
- Fresh produce exporter Egypt
- Egyptian orange exporter
- Valencia orange exporter
- Fresh fruits supplier Egypt
- Frozen fruits exporter Egypt
- Egyptian agricultural exporter

Keyword strategy must be based on actual market research and should not result in keyword stuffing.

---

# 14. Open Graph & Brand Assets

Do not use generic stock imagery as the primary social sharing image for a production corporate website.

Create branded assets such as:

```text
/public/og-image.jpg
/public/og-home.jpg
/public/og-products.jpg
/public/og-contact.jpg
```

Recommended dimensions for major OG images:

- 1200 × 630 px

Use real CARGILL branding and verified company/product photography.

---

# 15. Admin Platform

The existing admin interface should evolve into a controlled CMS.

## Dashboard

Recommended KPIs:

```text
Products
Categories
New Inquiries
Quote Requests
Unread Messages

Recent Quote Requests
Recent Messages
Popular Products
```

## Content management

Admin should be able to manage:

- Products
- Categories
- Markets
- Certifications
- Company information
- Social links
- SEO settings
- Product images
- Packaging data
- Product specifications

---

# 16. Role-Based Access Control (RBAC)

Authentication and authorization are separate responsibilities.

## ADMIN

Full system access.

- Manage products
- Manage categories
- Manage markets
- Manage certifications
- Manage inquiries
- Manage settings
- Manage administrators
- Delete records
- View audit logs

## EDITOR

Content management only.

- Products
- Categories
- Markets
- Certifications
- Content

No access to:

- Admin management
- Critical settings
- Security configuration
- Destructive administrative operations unless explicitly authorized

## VIEWER

Read-only access.

- Dashboard
- Inquiries
- Messages
- Reports

### Rule

Every sensitive server action/API must independently verify both:

1. Authentication
2. Authorization/role

Do not rely solely on UI visibility.

---

# 17. Security Requirements

Security is a release blocker for production.

## Authentication

- Secure password hashing
- Secure sessions
- Strong secrets
- Session expiration policy
- Account activation/deactivation
- Login error handling

## Authorization

Every protected mutation must verify role server-side.

## Input validation

Use runtime schemas such as Zod for:

- Login
- Contact forms
- RFQ forms
- Product creation
- Product editing
- Category editing
- Settings
- SEO configuration
- Any API/server action input

TypeScript alone is not runtime validation.

## Rate limiting

At minimum protect:

```text
/admin/login
/contact
/request-quote
/api/auth/*
```

## Anti-spam

Public forms should use an appropriate combination of:

- Rate limiting
- Honeypot
- Server-side validation
- Abuse detection
- CAPTCHA only when necessary

## Security headers

Evaluate and configure:

- Content-Security-Policy
- Strict-Transport-Security
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy
- Frame protections

Avoid adding a CSP that breaks legitimate Next.js functionality without testing it.

## Secrets

Never commit:

- Database credentials
- Authentication secrets
- API keys
- SMTP credentials
- Private tokens

Use environment variables and production secret management.

---

# 18. Database Integrity

The current relational model is a strong foundation.

Important rules:

- Use unique constraints for slugs and unique business identifiers.
- Validate category/subcategory relationships.
- Prevent orphaned records.
- Use foreign keys consistently.
- Use appropriate cascading/restrict behavior.
- Add indexes based on actual query patterns.
- Keep migrations version-controlled.

### Product integrity example

A Product's category and subcategory must always be logically compatible.

Do not allow:

```text
Product
Category: Citrus
Subcategory: Apples
```

unless the data model explicitly permits that relationship.

---

# 19. Prisma / Database Runtime

Keep a controlled Prisma client lifecycle for server-side execution.

Production behavior should fail clearly when `DATABASE_URL` is missing rather than silently allowing application code to operate with an absent database client.

Database errors shown to end users must be generic.

Detailed errors should go to server-side logs/monitoring.

---

# 20. Performance

Target a fast international corporate site.

### Core Web Vitals targets

- LCP < 2.5s
- CLS < 0.1
- INP < 200ms

### Techniques

- Next.js Server Components where appropriate
- `next/image`
- AVIF/WebP where supported
- Lazy loading
- Proper image dimensions
- Minimize client-side JavaScript
- Avoid unnecessary global providers
- Cache stable content
- Optimize fonts
- Optimize third-party scripts

### Image policy

Product photography is business-critical, so optimize images without destroying visual quality.

---

# 21. Responsive Design

Required breakpoints/use cases:

- Mobile
- Tablet
- Laptop
- Desktop
- Large desktop / 4K

Test especially:

- Navigation
- Product gallery
- Product specifications
- RFQ form
- Admin tables
- Admin sidebar
- Long product descriptions
- Arabic RTL layouts
- Russian text expansion

---

# 22. Accessibility

Target WCAG 2.2 AA where practical.

Requirements:

- Semantic HTML
- Keyboard navigation
- Visible focus states
- Accessible labels
- Alt text
- Sufficient contrast
- Correct heading hierarchy
- Form error messages
- Screen-reader-friendly interactive controls
- Reduced motion support where appropriate

---

# 23. Analytics & Conversion Tracking

Measure business outcomes, not just page views.

Recommended events:

```text
page_view
product_view
product_search
quote_started
quote_submitted
contact_started
contact_submitted
whatsapp_clicked
email_clicked
phone_clicked
```

### Conversion funnel

```text
Visitor
  ↓
Landing Page
  ↓
Product View
  ↓
Product Interest
  ↓
RFQ Started
  ↓
RFQ Submitted
  ↓
Qualified Lead
```

Analytics implementation must respect applicable privacy requirements.

---

# 24. Monitoring & Reliability

Production should have:

- Application error monitoring
- Server logs
- Database monitoring
- Availability monitoring
- Deployment logs
- Alerting for critical failures

Monitor especially:

- Authentication failures
- Database connectivity
- RFQ submission failures
- Email notification failures
- 5xx responses
- Slow server responses

---

# 25. Backups

Production PostgreSQL must have automated backups.

Recommended policy:

- Daily backups
- Retention policy
- Off-site backup storage
- Periodic restore test

A backup is not considered reliable until a restore has been tested.

---

# 26. CI/CD

Recommended pipeline:

```text
Git Push
   ↓
Lint
   ↓
Type Check
   ↓
Unit Tests
   ↓
Build
   ↓
Security Checks
   ↓
Preview Deployment
   ↓
Production Approval
   ↓
Production Deployment
```

Production deployment should not depend on manually copying project files.

---

# 27. Testing Strategy

## Unit tests

Test:

- Validation schemas
- Utility functions
- Business rules
- Data transformation

## Integration tests

Test:

- Authentication
- Authorization
- Prisma operations
- RFQ submission
- Contact submission

## End-to-end tests

Critical journeys:

1. Visitor opens homepage.
2. Visitor opens product.
3. Visitor requests a quote.
4. Admin receives the request.
5. Admin updates request status.
6. Unauthorized user cannot access admin.
7. Editor cannot perform restricted administrative operations.

---

# 28. Content Quality Rules

All public claims must be verified.

Never fabricate:

- Certifications
- Export destinations
- Production capacity
- Shipping routes
- Company history
- Partnerships
- Years of experience
- Quality standards
- Customer logos

The website should communicate confidence through **verified information**, not exaggerated marketing claims.

---

# 29. Brand & Visual Direction

The visual system should feel:

- Premium
- Agricultural
- International
- Trustworthy
- Clean
- Modern
- B2B
- Professional

Avoid:

- Overly flashy animations
- Generic SaaS styling
- Excessive gradients
- Consumer e-commerce patterns
- Stock-photo-heavy pages
- Unverified visual claims

Use real company/product photography whenever available.

---

# 30. UX Principles

### Principle 1 — Buyer first

A buyer should reach product specifications quickly.

### Principle 2 — Trust before conversion

Show quality, origin, packaging, logistics, and process before aggressively asking for contact information.

### Principle 3 — Clear CTA

Every important product page should have a clear commercial action.

### Principle 4 — No friction

RFQ forms should collect enough information for a useful commercial response without becoming unnecessarily long.

### Principle 5 — International readiness

Language, units, dates, currencies, ports, and terminology must work for international buyers.

---

# 31. Recommended Public Navigation

```text
Home
About
Products
Markets
Quality
Export Process
Packaging & Logistics
Contact
Request a Quote
```

Mobile navigation should prioritize:

1. Products
2. Request a Quote
3. Contact

---

# 32. Recommended Footer

Include:

- Company description
- Main navigation
- Products
- Markets
- Contact information
- Email
- Phone
- WhatsApp
- Address
- Social media
- Legal links
- Privacy Policy
- Terms
- Copyright

Do not display placeholder contact information in production.

---

# 33. Legal & Trust Pages

Before launch, evaluate the need for:

- Privacy Policy
- Terms & Conditions
- Cookie notice/consent where applicable
- Data handling statement
- Contact information
- Company registration information where appropriate

Legal text should be reviewed for the actual business jurisdiction and target markets.

---

# 34. Production Environment

Recommended environment separation:

```text
Development
    ↓
Staging / Preview
    ↓
Production
```

Use separate:

- Database
- Environment variables
- Authentication secrets
- Email configuration
- Analytics configuration

Never use production credentials during local development.

---

# 35. Production Checklist

## Infrastructure

- [ ] Production database created
- [ ] Database backups enabled
- [ ] Restore test completed
- [ ] Domain configured
- [ ] HTTPS enabled
- [ ] DNS verified
- [ ] Environment variables configured
- [ ] Monitoring configured
- [ ] Error tracking configured

## Application

- [ ] Production build passes
- [ ] TypeScript passes
- [ ] Lint passes
- [ ] Tests pass
- [ ] No debug output
- [ ] No development credentials
- [ ] No placeholder content

## Security

- [ ] RBAC implemented
- [ ] Input validation implemented
- [ ] Rate limiting implemented
- [ ] Public forms protected
- [ ] Security headers configured
- [ ] Secrets removed from source
- [ ] Authentication tested
- [ ] Authorization tested

## SEO

- [ ] Metadata complete
- [ ] Canonicals correct
- [ ] Sitemap valid
- [ ] Robots valid
- [ ] Structured data tested
- [ ] OG images branded
- [ ] Images have alt text
- [ ] i18n/hreflang configured

## UX

- [ ] Mobile tested
- [ ] Tablet tested
- [ ] Desktop tested
- [ ] RTL tested
- [ ] Russian text tested
- [ ] Forms tested
- [ ] Error states tested
- [ ] Loading states tested
- [ ] Accessibility reviewed

## Business

- [ ] Product specifications verified
- [ ] Packaging specifications verified
- [ ] Markets verified
- [ ] Certifications verified
- [ ] Contact information verified
- [ ] Export team notification tested
- [ ] RFQ workflow tested

---

# 36. Implementation Roadmap

## Phase 1 — Security & Foundation

**Priority: P0**

- RBAC
- Server-side authorization
- Zod validation
- Rate limiting
- Form anti-spam
- Security headers
- Error handling
- Database integrity
- Secrets review

### Exit criteria

No critical authentication, authorization, validation, or secrets issues remain.

---

## Phase 2 — Corporate Website

**Priority: P0**

- Homepage
- About
- Products
- Product detail
- Markets
- Quality
- Export Process
- Packaging & Logistics
- Contact
- RFQ

### Exit criteria

A real buyer can understand the company and submit a complete commercial inquiry.

---

## Phase 3 — Internationalization

**Priority: P1**

- English
- Arabic
- Russian
- Localized routing
- RTL
- hreflang
- Localized metadata
- Localized sitemap

### Exit criteria

All public commercial content works correctly in the three target languages.

---

## Phase 4 — SEO & Discoverability

**Priority: P1**

- Technical SEO
- Structured data
- Product SEO
- OG assets
- Search Console setup
- Sitemap validation
- Image optimization

### Exit criteria

All indexable public pages have valid metadata and canonical strategy.

---

## Phase 5 — Admin & CRM Workflow

**Priority: P1**

- Dashboard
- RFQ management
- Message management
- Search/filtering
- Activity logs
- Content management
- SEO management

### Exit criteria

The sales/content team can operate the website without editing code.

---

## Phase 6 — Analytics & Reliability

**Priority: P1**

- Analytics
- Conversion events
- Error monitoring
- Performance monitoring
- Database monitoring
- Backups
- Restore tests

### Exit criteria

Business and technical failures can be detected and investigated.

---

## Phase 7 — Final Production Launch

**Priority: P0**

- Full QA
- Security review
- Performance review
- Mobile review
- Content verification
- Legal review
- DNS/HTTPS
- Production deployment
- Post-launch monitoring

---

# 37. Definition of Done

CARGILL is considered **Production Ready** only when:

1. Public website is stable.
2. All critical user journeys work.
3. Admin is protected by authentication and authorization.
4. Public forms are validated and rate-limited.
5. No critical security issues are known.
6. Database backups are working and restore-tested.
7. SEO metadata and sitemap are valid.
8. English, Arabic, and Russian experiences are functional if enabled for launch.
9. Product specifications are verified.
10. Contact/RFQ workflows reach the responsible team.
11. Monitoring and error reporting are operational.
12. Mobile and desktop QA are complete.
13. Production secrets are securely configured.
14. Build, type check, lint, and automated tests pass.
15. Legal/trust content has been reviewed.

---

# 38. Priority Matrix

| Priority | Meaning | Examples |
|---|---|---|
| P0 | Launch blocker | Authentication, authorization, data loss, broken RFQ |
| P1 | Important for professional launch | i18n, SEO, analytics, monitoring |
| P2 | Quality improvement | Advanced dashboards, additional automation |
| P3 | Future enhancement | Nice-to-have features |

---

# 39. Final Target

The final product should not feel like a template or a small company brochure.

It should feel like:

> **A credible Egyptian B2B export company with a modern digital sales and content platform.**

The technical architecture should remain maintainable, secure, fast, multilingual, and scalable.

The commercial experience should make it easy for an importer to:

```text
Discover CARGILL
      ↓
Understand Products
      ↓
Verify Quality
      ↓
Understand Packaging & Logistics
      ↓
Choose Destination / Market
      ↓
Request a Quote
      ↓
Communicate with Export Team
```

---

# 40. Implementation Principle

**Do not rebuild the project from scratch.**

The current architecture is a useful foundation. Improve it incrementally through controlled phases, tests, code review, and production-focused hardening.

Every implementation should answer three questions:

1. Does it improve the buyer experience?
2. Does it improve business operations?
3. Does it improve security, reliability, or maintainability?

If it does none of these, it should not be prioritized for the production launch.
