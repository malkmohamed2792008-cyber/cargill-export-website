# CARGILL Export Website — Full Code Audit & Evidence-Based Execution Plan

> **Scope:** full repository architecture/code review of `design/cargill-visual`
> **Review date:** 2026-08-16
> **Reviewed baseline:** branch tree commit `1c7ee293`
> **Purpose:** replace assumption-driven planning with a code-evidence-driven implementation program.

---

## 1. Executive Verdict

The project has moved well beyond a simple corporate landing page. It is now a Next.js + Prisma/PostgreSQL B2B export platform with:

- public corporate pages;
- a product catalog and product detail experience;
- an authenticated admin area;
- product/category/subcategory CRUD;
- quote and contact persistence;
- a media library and upload workflow;
- basic role-aware admin authorization;
- SEO primitives (`sitemap`, `robots`, product structured-data component);
- a substantial visual/design-system asset set.

However, **the repository is not yet production-ready**.

The biggest issue is not a missing visual feature. The biggest issue is that the application has reached the point where **security, validation, reliability, testability, deployment architecture, and data governance must become first-class engineering concerns**.

### Current maturity assessment

| Area | Assessment | Priority |
|---|---|---:|
| Public visual foundation | Good | P2 |
| Product catalog | Good foundation, needs hardening | P1 |
| Admin CMS | Functional foundation | P1 |
| Authentication | Implemented, needs hardening/testing | P0 |
| RBAC | Basic role gate exists; capability model incomplete | P0 |
| Input validation | Ad-hoc/manual | P0 |
| Rate limiting | Not present in reviewed branch | P0 |
| Security headers/CSP | Not present in reviewed Next config/middleware | P0 |
| Media security | Partial | P0/P1 |
| Quote/contact workflow | Functional persistence, production hardening needed | P1 |
| Database model | Strong start, needs normalization/business completeness | P1 |
| Testing | No meaningful automated test suite found | P0 |
| CI/CD | No project CI workflow found in reviewed tree | P1 |
| SEO | Good primitives, incomplete international/technical layer | P1 |
| i18n | Not implemented | P1 |
| Performance | Needs formal measurement and image cleanup | P1 |
| Observability | Not implemented | P2/P1 before launch |
| Production media storage | Local filesystem approach is risky for serverless deployment | P0 |
| Documentation | Strong planning documents, but implementation/status can drift | P1 |

---

# 2. Repository Architecture Findings

## 2.1 Current stack

The project uses Next.js `16.2.10`, React `19.2.4`, Prisma `7.9.0`, PostgreSQL, NextAuth v5 beta, Tailwind CSS 4, TypeScript 5, and Framer Motion. fileciteturn102file0L2-L2

### Important architectural implication

NextAuth is still a beta dependency in the current package manifest. Authentication therefore deserves an explicit compatibility and upgrade policy before production launch. fileciteturn102file0L2-L2

## 2.2 Repository contains legacy/duplicated-looking structure

The current tree contains both the active Next.js application structure and additional legacy-looking files/directories such as:

- `src/config/database.ts`
- `src/styles/tokens.css`
- `tailwind.config.cjs`
- `app/globals.css`
- empty files named `cd` and `git`
- both `components/ui/WhatsAppButton.tsx` and `components/whatsapp/WhatsAppButton.tsx`
- a very large `lib/products.ts` data file.

These should not be deleted blindly. First determine which are imported, which are dead, and which are historical assets. The objective is to leave one clear source of truth for application data, styling tokens, and shared UI.

### Action

Create an explicit **architecture cleanup sprint** after the security baseline. Use import analysis before deleting anything.

---

# 3. Authentication & Authorization Audit

## 3.1 What is already good

`auth.ts` uses credential authentication, checks that an admin exists and is active, verifies the password with bcrypt, and places the admin role into the JWT/session. It also lazy-loads Prisma inside `authorize`, which avoids importing server-only database dependencies during middleware evaluation. fileciteturn104file0L2-L2

`lib/admin-auth.ts` provides a server-side authorization gate with three roles: `ADMIN`, `EDITOR`, and `VIEWER`. It distinguishes read access, content-write access, and admin-only access. fileciteturn109file0L2-L2

Admin APIs reviewed so far are actually using this helper. For example, categories use all-role access for GET, content-write roles for POST/PUT, and admin-only access for DELETE. fileciteturn119file0L2-L2

## 3.2 Remaining problems

### P0 — role model is incomplete

The existing role gate is useful, but the application plan requires a capability-oriented authorization model. Route-level role arrays will become difficult to maintain as Markets, Certifications, Media, Settings, Users, and Audit features expand.

### P0 — authorization must be tested, not assumed

Every protected API needs negative tests for:

- no session;
- invalid session;
- VIEWER attempting writes;
- EDITOR attempting admin-only operations;
- inactive admin with an existing session;
- malformed IDs;
- direct API access bypassing UI.

### P1 — session revocation behavior

`authorize()` checks `isActive`, but a previously issued JWT may continue to contain the role. The production policy must define what happens when an admin is deactivated or downgraded while a session exists.

### P1 — secret/configuration policy

`NEXTAUTH_SECRET` is explicitly configured. Production configuration must enforce a strong secret and fail safely if required secrets are missing. fileciteturn104file0L2-L2

---

# 4. Middleware Review

The middleware intentionally avoids importing Prisma/NextAuth and detects Auth.js session-token cookies before redirecting requests to `/admin`. It explicitly states that real authentication and RBAC remain server-side. fileciteturn105file0L2-L2

This is a sensible Edge-safe design, but the middleware must be treated only as a **navigation guard**, not an authorization boundary.

### Required tests

- direct `/admin/*` without cookie;
- forged/invalid cookie;
- authenticated user with insufficient role;
- direct `/api/admin/*` access;
- login redirect behavior;
- secure and non-secure cookie names in development/production.

---

# 5. Input Validation Audit

## Finding: P0

The branch does not contain Zod in `package.json`, and the reviewed public APIs manually inspect JavaScript values instead of using a shared schema system. fileciteturn102file0L2-L2

For example, the contact API manually converts fields to strings, checks required values, and uses utility validators for email/phone. fileciteturn111file0L2-L2

The quote API follows the same manual pattern and additionally accepts free-form `quantity`, `packaging`, and message data. fileciteturn112file0L2-L2

Admin product/category APIs destructure request JSON directly and then write the values into Prisma. fileciteturn108file0L2-L2 fileciteturn119file0L2-L2

### Required implementation

Introduce shared server-side schemas for:

- authentication credentials;
- product create/update;
- category/subcategory create/update;
- contact;
- quote;
- media metadata;
- media query parameters;
- IDs/slugs;
- inquiry filters and state transitions.

Every schema must define:

- required/optional fields;
- maximum lengths;
- enums;
- normalization rules;
- numeric constraints;
- array limits;
- unknown-field behavior.

---

# 6. Rate Limiting Audit

## Finding: P0

No rate-limiting dependency or implementation is present in the reviewed branch package manifest/tree. The public contact and quote endpoints are therefore not protected against repeated automated submissions. fileciteturn102file0L2-L2

### Minimum protected surfaces

1. `/api/auth/*`
2. `/api/contact`
3. `/api/quotes`
4. `/api/admin/media/upload`
5. sensitive admin mutations

Use a deployment-compatible distributed limiter when production is serverless/multi-instance. Do not rely only on an in-memory process counter.

---

# 7. Security Headers / CSP Audit

## Finding: P0

The reviewed `next.config.ts` contains image remote patterns and image formats but no security-header policy. fileciteturn115file0L2-L2

The middleware also currently focuses on authentication redirects and request pathname propagation; it does not add the required security response headers. fileciteturn105file0L2-L2

### Required headers

- Content-Security-Policy;
- Strict-Transport-Security;
- X-Content-Type-Options;
- Referrer-Policy;
- Permissions-Policy;
- frame protection through CSP;
- appropriate cross-origin policies.

CSP must be tested against actual Next.js scripts, styles, fonts, images, and future analytics/integration domains before enforcing a strict production policy.

---

# 8. Media Upload Security Audit

The upload route already has several good controls:

- authenticated write access;
- explicit allowed MIME types;
- SVG blocked;
- 10 MB size limit;
- folder sanitization;
- safe generated filename suffix;
- path traversal check.

These are positive foundations. fileciteturn113file0L2-L2

## Critical remaining issues

### P0 — MIME type is client-declared

The implementation trusts `file.type`. It should validate the actual file signature/magic bytes or use a trusted image parser before accepting the file as a specific format.

### P0 — local filesystem storage

Files are written to `process.cwd()/public/uploads`. fileciteturn113file0L2-L2

This is not a safe production architecture for typical serverless/ephemeral deployment. The production design should use object storage/CDN such as an approved S3-compatible provider, Cloudinary, ImageKit, or equivalent.

### P0 — database failure can create orphaned files

The file is written before the database record. If the database is unavailable, the endpoint deliberately returns success with the public URL instead of failing. That creates a storage asset that is not represented in the MediaAsset table. fileciteturn113file0L2-L2

This behavior must be redesigned with an explicit storage/database consistency strategy.

### P1 — server error leakage

The upload route returns `err.message` to the client on failure. Internal filesystem/database errors should be logged server-side and replaced with a safe public error message. fileciteturn113file0L2-L2

### P1 — image dimensions are not actually populated

`MediaAsset` has `width` and `height`, but the upload implementation does not populate them. fileciteturn103file0L2-L2

### P1 — no content transformation

For a production export catalog, consider stripping dangerous metadata where appropriate, normalizing orientation, and generating optimized derivatives/thumbnails.

---

# 9. Database Audit

The Prisma schema is substantially richer than the original landing-page scope. It includes products, categories, subcategories, specifications, packaging, storage, countries, certifications, admins, quotes, contact messages, company information, social media, SEO settings, and media assets. fileciteturn103file0L2-L2

## Strengths

- explicit relations;
- unique slugs;
- cascade/restrict decisions in several relationships;
- timestamps;
- enum statuses/roles;
- media metadata model;
- migration history.

## Gaps

### P1 — certification relation is incomplete

`Certification` has an optional `productId`, but the model shown does not define a corresponding `Product` relation field. This should be reviewed against the generated Prisma schema and intended business relationship before more certification functionality is added. fileciteturn103file0L2-L2

### P1 — quote workflow is too small for a real B2B pipeline

The current `QuoteRequest` model has basic buyer/product/message/status information but does not yet model a full commercial qualification workflow. fileciteturn103file0L2-L2

### P1 — contact workflow is minimal

`ContactMessage` currently stores read/archive flags but not a proper lifecycle, assignee, response history, or audit history. fileciteturn103file0L2-L2

### P1 — missing publication lifecycle

Products and other CMS entities need explicit draft/published/archived semantics if content is going to be managed by multiple administrators.

### P2 — indexing and query strategy

After defining actual traffic/query patterns, add indexes for frequent filters, status fields, timestamps, slugs, foreign keys, and admin search fields.

---

# 10. Admin CMS Audit

The current branch has an admin route group under `app/admin/(protected)` and pages for:

- dashboard;
- products;
- categories;
- subcategories;
- inquiries;
- media;
- markets;
- certifications.

This is a strong structural improvement over the previous flat admin route tree.

## Problems to resolve

1. Markets and Certifications are currently more like presentation/admin placeholders than full CMS modules.
2. Product editing is very large and should eventually be decomposed into focused sections/components.
3. Admin CRUD should share schemas and mutation helpers rather than repeating request parsing.
4. Delete operations need consistent confirmation, authorization, dependency handling, and audit behavior.
5. Admin list pages need pagination once datasets grow.
6. Bulk actions should be introduced only after permissions and audit rules are defined.

---

# 11. Public Product Experience

The public application already has a meaningful product system with:

- product listing;
- category filtering/search;
- product detail routes;
- gallery;
- specifications;
- packaging;
- storage;
- export season;
- countries;
- related products;
- quote CTA;
- structured product component.

This is a good foundation and should be **hardened rather than rewritten**.

### Next product work

- dynamic metadata per product;
- correct canonical URLs;
- valid product structured data;
- robust empty/error states;
- image optimization;
- buyer-oriented content completeness;
- downloadable specification/certificate assets where legally/business appropriate;
- market and certification relationships.

---

# 12. SEO Audit

The repository already contains `app/sitemap.ts`, `app/robots.ts`, and a `ProductSchema` component. The schema also contains `SeoSettings`. This means SEO has a foundation.

### Missing/needs verification

- complete dynamic metadata strategy;
- canonical URL consistency;
- Organization/LocalBusiness structured data where accurate;
- breadcrumb structured data;
- multilingual `hreflang`;
- localized sitemap strategy;
- OpenGraph image generation/management;
- noindex policy for admin/private pages;
- search engine validation after deployment.

Do not publish unverified export statistics, certifications, buyer names, or market claims.

---

# 13. Performance Audit

The project has nine known `@next/next/no-img-element` warnings from the local lint run previously supplied during this project. Warnings were concentrated in Media, Product Edit, FileUpload, MediaPickerModal, Header, Footer, FooterMinimal, and Logo.

These are not all equally important. Admin previews do not have the same LCP priority as the public hero. The correct strategy is:

- use `next/image` for public performance-critical imagery;
- use appropriate dimensions/aspect ratios;
- retain plain `<img>` only where dynamic/admin preview behavior genuinely justifies it;
- measure before/after with Lighthouse and Core Web Vitals.

Do not optimize based on lint warnings alone.

---

# 14. Testing Audit

No meaningful automated test suite is present in the reviewed repository tree. There are no visible test scripts/dependencies in `package.json`. fileciteturn102file0L2-L2

This is a **P0 production-readiness gap** because the project now contains authentication, authorization, database mutations, file uploads, and commercial forms.

## Required test layers

### Unit

- validation schemas;
- authorization helpers;
- slug utilities;
- upload path utilities;
- pure data mappers.

### Integration

- auth;
- admin API permissions;
- product CRUD;
- category CRUD;
- quote creation;
- contact creation;
- media lifecycle.

### End-to-end

- login;
- unauthorized admin redirect;
- viewer/editor/admin permission matrix;
- product create/edit/delete;
- media upload/delete;
- quote submission;
- contact submission;
- public product navigation.

### Security regression tests

Every discovered vulnerability becomes a permanent regression test.

---

# 15. CI/CD Audit

No GitHub Actions workflow is visible in the reviewed repository tree. The project therefore needs a CI quality gate before production launch.

Minimum pipeline:

```text
install
  ↓
lint
  ↓
typecheck
  ↓
prisma validate/generate
  ↓
test
  ↓
build
```

Security scanning and dependency review should be added after the baseline pipeline is stable.

---

# 16. Documentation Audit

The repository contains several planning documents and a new master execution plan. This is good, but documentation must stop being a second source of truth.

### Rule

The implementation status must be updated immediately after each verified feature.

Each feature should record:

- problem;
- decision;
- implementation;
- affected files;
- migration;
- tests;
- deployment requirements;
- rollback notes;
- Git commit.

---

# 17. Evidence-Based Execution Plan

## PHASE 0 — Baseline / Stabilization — P0

### Goal
Create a trustworthy engineering baseline.

Tasks:

- [ ] Fix/understand ESLint exit code `1`.
- [ ] TypeScript check.
- [ ] Production build.
- [ ] Prisma validation/generate.
- [ ] Dependency audit.
- [ ] Remove/ignore accidental artifacts (`cd`, `git`) after confirming they are unused.
- [ ] Add CI workflow.
- [ ] Add a documented verification command.

**Gate:** lint + typecheck + build + Prisma validation + CI all pass.

---

## PHASE 1 — Security Foundation — P0

### Sprint 1.1 Authentication

- [ ] Audit all admin routes and API handlers.
- [ ] Define session invalidation policy.
- [ ] Enforce production secret requirements.
- [ ] Add auth regression tests.

### Sprint 1.2 Authorization/RBAC

- [ ] Convert role lists into capability definitions.
- [ ] Define `ADMIN`, `EDITOR`, `VIEWER` responsibilities precisely.
- [ ] Decide whether `SUPER_ADMIN` is actually needed; do not add it without a real business requirement.
- [ ] Apply capability checks to all mutations.
- [ ] Test permission matrix.

### Sprint 1.3 Validation

- [ ] Add Zod.
- [ ] Create shared schemas.
- [ ] Replace manual request parsing in APIs.
- [ ] Add length/enumeration/ID constraints.

### Sprint 1.4 Rate Limiting

- [ ] Choose deployment-compatible limiter.
- [ ] Protect auth/contact/quote/upload.
- [ ] Define `429` response contract.

### Sprint 1.5 Headers

- [ ] Implement security headers.
- [ ] Build/test CSP in report-only mode first.
- [ ] Enforce production CSP after compatibility verification.

**Gate:** all security tests pass; no critical P0 finding remains.

---

## PHASE 2 — Media Production Architecture — P0/P1

- [ ] Choose production object storage/CDN.
- [ ] Implement real content-type verification.
- [ ] Generate optimized derivatives.
- [ ] Populate width/height.
- [ ] Make DB/storage consistency explicit.
- [ ] Add orphan cleanup.
- [ ] Add upload rate limits.
- [ ] Remove public internal error leakage.
- [ ] Test delete/replacement failures.

**Gate:** upload/delete/recovery tests pass in a production-like environment.

---

## PHASE 3 — CMS/Data Model — P1

- [ ] Review Product model against real export operations.
- [ ] Add publication lifecycle.
- [ ] Complete certification relationships.
- [ ] Define Markets model.
- [ ] Define certification document/media references.
- [ ] Add ordering/visibility rules.
- [ ] Add indexes after query profiling.
- [ ] Add audit history for important admin mutations.

---

## PHASE 4 — Commercial CRM — P1

- [ ] Quote lifecycle.
- [ ] Contact lifecycle.
- [ ] Assignment.
- [ ] Internal notes.
- [ ] Status history.
- [ ] Search/filter/pagination.
- [ ] Notification architecture.
- [ ] Anti-spam strategy.

Suggested quote lifecycle:

```text
NEW → CONTACTED → QUALIFIED → QUOTED → NEGOTIATING → WON/LOST
```

---

## PHASE 5 — Public Product & Markets — P1

- [ ] Complete product content model.
- [ ] Public market pages.
- [ ] Certification presentation.
- [ ] Buyer-focused CTAs.
- [ ] Product-to-market relationships.
- [ ] Export/logistics information.

---

## PHASE 6 — Internationalization — P1

Target:

- English;
- Arabic;
- Russian.

Tasks:

- [ ] Choose i18n architecture.
- [ ] Localized routes.
- [ ] RTL.
- [ ] localized metadata;
- [ ] `hreflang`;
- [ ] localized sitemap;
- [ ] translation governance.

---

## PHASE 7 — SEO — P1

- [ ] Dynamic metadata.
- [ ] Canonicals.
- [ ] Organization schema.
- [ ] Product schema validation.
- [ ] Breadcrumbs.
- [ ] OpenGraph.
- [ ] Search Console setup.
- [ ] International SEO.

---

## PHASE 8 — Performance — P1

- [ ] Replace critical public `<img>` usage.
- [ ] Optimize hero/gallery images.
- [ ] Reduce unnecessary client components.
- [ ] Cache/revalidate database reads.
- [ ] Bundle analysis.
- [ ] Mobile performance testing.
- [ ] Core Web Vitals measurement.

---

## PHASE 9 — Accessibility & UX — P1/P2

- [ ] Keyboard navigation.
- [ ] Focus management.
- [ ] screen-reader semantics.
- [ ] color contrast.
- [ ] reduced-motion support.
- [ ] form error accessibility.
- [ ] mobile navigation.
- [ ] loading/empty/error states.

---

## PHASE 10 — Testing & Quality Engineering — P0/P1

- [ ] Unit tests.
- [ ] Integration tests.
- [ ] E2E tests.
- [ ] security regression suite.
- [ ] CI enforcement.
- [ ] coverage targets for critical modules.

Critical modules must have stronger coverage than decorative UI.

---

## PHASE 11 — Observability & Production Operations — P1

- [ ] Structured server logging.
- [ ] Error monitoring.
- [ ] Request correlation IDs.
- [ ] health/readiness checks.
- [ ] database backup policy.
- [ ] migration deployment procedure.
- [ ] alerting.
- [ ] incident runbook.

---

## PHASE 12 — Analytics & Conversion — P2

Measure business outcomes rather than vanity metrics:

- product views;
- quote starts;
- quote completions;
- contact submissions;
- market page engagement;
- CTA conversion;
- top export products;
- buyer-country interest.

Respect privacy and applicable regulations.

---

## PHASE 13 — Production Launch — P0 Gate

Do not launch until:

```text
[ ] Security audit passed
[ ] Auth/RBAC tests passed
[ ] Validation passed
[ ] Rate limits passed
[ ] Headers/CSP verified
[ ] Media storage production-ready
[ ] DB migrations tested
[ ] Backups verified
[ ] CI green
[ ] Build green
[ ] E2E critical flows green
[ ] SEO verified
[ ] Mobile UX verified
[ ] Performance measured
[ ] Error monitoring active
[ ] Domain/HTTPS verified
[ ] Environment variables documented
[ ] Rollback procedure documented
```

---

# 18. What We Should NOT Do Yet

Do not start with:

- a complete visual redesign;
- a large blog system;
- complex analytics dashboards;
- ERP integration;
- advanced AI features;
- unnecessary microservices;
- premature caching infrastructure;
- large dependency additions without a concrete need.

The highest-value work now is **security + reliability + testability + production architecture**.

---

# 19. First Implementation Order

The immediate execution sequence is:

```text
S0.1  Establish lint/typecheck/build baseline
  ↓
S0.2  Add CI
  ↓
S1.1  Authentication audit + tests
  ↓
S1.2  Capability-based RBAC
  ↓
S1.3  Zod validation
  ↓
S1.4  Distributed rate limiting
  ↓
S1.5  Security headers + CSP
  ↓
S2.1  Production media storage architecture
  ↓
S2.2  Media upload hardening
  ↓
S3.1  Database/CMS corrections
  ↓
S4.1  Quote/contact CRM hardening
  ↓
S5+   Public product/markets/i18n/SEO/performance
```

---

# 20. AI Agent Execution Contract

Every implementation prompt for an AI coding agent must include these requirements:

1. Read the relevant project documentation before editing.
2. Inspect the existing implementation before creating new abstractions.
3. Preserve unrelated working functionality.
4. Make the smallest coherent change for the requested task.
5. Add or update tests for behavior/security changes.
6. Run lint, typecheck, build, and targeted tests as applicable.
7. Review the final diff for accidental changes, secrets, dead code, and regressions.
8. Update the relevant `.md` documentation/status.
9. Create an intentional commit message.
10. **After all verification passes, update the GitHub branch with the verified implementation.**
11. **After pushing, verify that the GitHub branch contains the expected commit and changed files.**
12. Do not claim completion if any required verification step failed.

---

# 21. Definition of Done

A CARGILL feature is complete only when:

```text
Requirement understood
        ↓
Existing code inspected
        ↓
Architecture decided
        ↓
Implementation complete
        ↓
Validation complete
        ↓
Tests complete
        ↓
Security reviewed
        ↓
Diff reviewed
        ↓
Documentation updated
        ↓
Commit created
        ↓
GitHub updated
        ↓
GitHub state verified
```

This document is the evidence-based implementation plan. It should be updated after every major verified phase so that the plan never becomes detached from the actual codebase.
