# CARGILL Export Website — Master Development Plan

> **Document:** CARGILL Development Master Plan
> **Version:** 1.0
> **Status:** Active — execution plan
> **Branch:** `design/cargill-visual`
> **Baseline:** `0d1a038`
> **Last reviewed:** 2026-08-16

---

## 1. Purpose

This document is the **single execution plan** for taking the CARGILL website from its current implementation to a professional, secure, maintainable, SEO-ready, production-grade export company platform.

It consolidates the intent of:

- `PROJECT_REQUIREMENTS.md`
- `PROJECT_ENHANCEMENTS.md`
- `PROJECT_ROADMAP.md`
- `PROJECT_CONTEXT.md`
- `AGENTS.md`

It also incorporates findings from the current GitHub codebase review and the recent implementation work.

This document does **not** replace the original requirements or enhancement specifications. It translates them into an ordered implementation program with explicit gates, priorities, acceptance criteria, and verification rules.

---

# 2. Product Vision

CARGILL should become a premium B2B corporate export platform for international buyers, importers, distributors, supermarkets, hotels, restaurants, food processors, and trading companies.

The website is **not an e-commerce store**. Its primary commercial conversion is a qualified business inquiry / quote request.

The target architecture is:

```text
Premium Corporate Website
        +
Product Catalog / CMS
        +
Media Management
        +
Quote & Inquiry CRM
        +
Export Markets
        +
Certifications / Quality
        +
SEO / Internationalization
        +
Security / Observability
        =
Production-ready CARGILL Export Platform
```

---

# 3. Current Baseline

## 3.1 Implemented in the latest update

The latest GitHub baseline already includes substantial work:

- Admin routes reorganized under `app/admin/(protected)/`.
- Admin authentication helper added.
- Media Library UI added.
- Media upload, listing, and delete APIs added.
- Media database migration/schema changes added.
- Contact API added.
- Quote API added.
- File upload and media picker components added.
- Export Markets admin page added.
- Certifications admin page added.
- Product editing updated for the new media workflow.
- Admin category/product/inquiry APIs updated.
- URL and upload-path utilities added.
- Existing public UI and accessibility refinements preserved.

## 3.2 Known issues / risks from review

The current implementation must **not yet be considered production-ready**.

Priority areas requiring verification or completion:

1. Authentication and authorization must be audited at every protected API boundary.
2. True RBAC must be implemented and tested if multiple admin roles are required.
3. Server-side validation must be standardized with Zod (or the project's approved validation layer).
4. Rate limiting must be implemented for public and sensitive endpoints.
5. Security headers / CSP must be audited and hardened.
6. Media upload security must be audited: MIME validation, extension validation, size limits, filename handling, storage path safety, and abuse protection.
7. Contact and quote endpoints need production-grade validation, anti-spam controls, persistence guarantees, and error handling.
8. Markets and Certifications currently contain static presentation data and should become database-backed only when their real CMS requirements are defined.
9. The current ESLint command returns exit code `1` even when the reported result contains `0 errors` and warnings only; this must be diagnosed before the quality gate is considered passed.
10. Remaining `<img>` warnings should be reviewed and converted to `next/image` where appropriate, while retaining plain `<img>` only where technically justified.
11. Automated tests are not yet sufficient for the security-critical workflows.
12. SEO, structured data, internationalization, performance, and production observability require a dedicated verification pass.

---

# 4. Execution Rules

These rules apply to every phase.

## 4.1 No blind implementation

Before changing code:

1. Read the relevant requirements.
2. Inspect the existing implementation.
3. Identify dependencies and side effects.
4. Decide the architecture.
5. Define acceptance criteria.
6. Implement the smallest coherent change.
7. Run validation.
8. Review the diff.
9. Update project documentation/status.
10. Commit only verified work.

## 4.2 Preserve existing functionality

Do not remove working functionality merely to simplify implementation.

Do not redesign completed public pages unless the change is required for usability, accessibility, performance, SEO, security, or a clearly approved business requirement.

## 4.3 Production-first security

All security decisions must be enforced server-side. Client-side checks are UX helpers, not authorization controls.

## 4.4 Data integrity

Database migrations must be reversible where practical, documented, and tested against a realistic dataset before production deployment.

## 4.5 Every completed phase must be verifiable

A phase is not complete because code exists. It is complete only when its acceptance criteria and validation gates pass.

---

# 5. Priority System

| Priority | Meaning |
|---|---|
| P0 | Critical security, data-loss, build, deployment, or production blocker |
| P1 | High-impact functionality or architecture required before production |
| P2 | Important quality, SEO, performance, UX, and maintainability work |
| P3 | Enhancement / optimization that can follow production readiness |

---

# 6. Phase 0 — Baseline & Engineering Quality

**Priority:** P0  
**Status:** In progress

## Objectives

Establish a trustworthy baseline before adding more features.

## Tasks

- [ ] Diagnose why `npm run lint` exits with code `1` despite reporting `0 errors`.
- [ ] Run `npx tsc --noEmit`.
- [ ] Run `npm run build`.
- [ ] Verify Prisma schema and migrations.
- [ ] Verify there are no accidental secrets or local-only files tracked.
- [ ] Verify route uniqueness and imports after the admin route-group move.
- [ ] Verify production environment variables are documented without exposing secrets.
- [ ] Establish a repeatable local verification command set.
- [ ] Add/confirm CI quality checks.

## Exit criteria

```text
npm run lint        PASS
npx tsc --noEmit    PASS
npm run build       PASS
Prisma validation   PASS
Git working tree    CLEAN
```

---

# 7. Phase 1 — Security & Foundation

**Priority:** P0  
**Status:** Planned / partially implemented

This is the first major implementation phase.

## 7.1 Authentication

- [ ] Audit `auth.ts`, middleware, and `lib/admin-auth.ts` together.
- [ ] Confirm authentication cannot be bypassed through alternate routes.
- [ ] Confirm protected API routes independently verify authentication.
- [ ] Confirm session/cookie configuration is production-safe.
- [ ] Confirm `NEXTAUTH_SECRET`/equivalent secret requirements are documented.
- [ ] Test unauthenticated access to every Admin page and API.

## 7.2 RBAC

Define roles before implementation. Initial proposed roles:

```text
SUPER_ADMIN
ADMIN
EDITOR
VIEWER
```

Permissions should be capability-based rather than relying only on route names.

Proposed capabilities:

- products.read/write/delete
- categories.read/write/delete
- media.read/write/delete
- inquiries.read/update/delete
- markets.read/write/delete
- certifications.read/write/delete
- users.read/write
- settings.read/write
- audit.read

Tasks:

- [ ] Define role/permission model.
- [ ] Add database representation if required.
- [ ] Add server-side authorization helpers.
- [ ] Apply authorization to every sensitive API route.
- [ ] Apply UI visibility rules only as a convenience; never rely on them for security.
- [ ] Add authorization tests.

## 7.3 Validation

Standardize all external input validation with Zod or the approved project validator.

Required targets:

- [ ] Contact payload.
- [ ] Quote payload.
- [ ] Product create/update.
- [ ] Category create/update.
- [ ] Subcategory create/update.
- [ ] Inquiry filters / IDs.
- [ ] Media query parameters.
- [ ] Media upload metadata.
- [ ] Admin route IDs and query parameters.

Rules:

- Reject unknown/invalid input where appropriate.
- Normalize strings.
- Enforce maximum lengths.
- Validate enums explicitly.
- Validate IDs before database access.
- Never trust client-provided authorization fields.

## 7.4 Rate Limiting

Implement a production-compatible rate limiter appropriate to the deployment environment.

Minimum targets:

- [ ] Contact endpoint.
- [ ] Quote endpoint.
- [ ] Authentication endpoints.
- [ ] Upload endpoint.
- [ ] Sensitive Admin APIs.

Define per-route limits and a consistent `429` response contract.

## 7.5 Security Headers / CSP

Audit and implement:

- [ ] Content-Security-Policy.
- [ ] Strict-Transport-Security.
- [ ] X-Content-Type-Options.
- [ ] Referrer-Policy.
- [ ] Permissions-Policy.
- [ ] Frame protection / `frame-ancestors` through CSP.
- [ ] Appropriate cross-origin policies.

CSP must be tested against actual Next.js assets, fonts, images, analytics, and external integrations before enforcement.

## 7.6 Media Security

Before production media uploads are enabled:

- [ ] Enforce maximum file size.
- [ ] Validate actual MIME type, not only extension.
- [ ] Allow only approved image formats.
- [ ] Sanitize filenames.
- [ ] Prevent path traversal.
- [ ] Generate safe storage names.
- [ ] Prevent executable content from being served as active content.
- [ ] Validate image dimensions where useful.
- [ ] Add rate limiting.
- [ ] Define deletion behavior and database/storage consistency.
- [ ] Define orphan-file cleanup strategy.

## Exit criteria

No protected endpoint is accessible without the required authorization, external input is validated server-side, abusive public endpoints are rate limited, and security headers are verified in a production-like environment.

---

# 8. Phase 2 — Data & CMS Foundation

**Priority:** P1

## Products

- [ ] Audit all Product fields against the actual export business requirements.
- [ ] Ensure product/category/subcategory relationships are correct.
- [ ] Add robust slug uniqueness.
- [ ] Add publish/draft/archived state if needed.
- [ ] Add ordering/featured flags.
- [ ] Add media relationships.
- [ ] Add related products.
- [ ] Add export-season data.
- [ ] Add packaging and logistics data.
- [ ] Add certifications per product.

## Categories / Subcategories

- [ ] Verify complete CRUD.
- [ ] Validate deletion dependencies.
- [ ] Prevent duplicate names/slugs where business rules require.
- [ ] Add safe cascading/restrict behavior.

## Markets

Replace static admin cards with a database-backed CMS only after defining the data model:

```text
Market
- name
- slug
- region
- description
- target buyer types
- import requirements
- certificates
- shipping information
- packaging requirements
- active/published
- SEO metadata
```

## Certifications

Define a proper certification model:

```text
Certification
- name
- issuer
- description
- certificate number (if applicable)
- issue date
- expiry date
- document/media reference
- active
- public visibility
```

---

# 9. Phase 3 — Media Platform

**Priority:** P1

The current Media Library is a strong foundation but needs production hardening.

## Tasks

- [ ] Complete upload security from Phase 1.
- [ ] Add image metadata management.
- [ ] Add alt text editing.
- [ ] Add folders/tags with controlled vocabulary.
- [ ] Add pagination.
- [ ] Add bulk actions where useful.
- [ ] Add orphan detection.
- [ ] Add image replacement workflow.
- [ ] Add responsive image strategy.
- [ ] Move to Cloudinary/ImageKit/object storage when production requirements justify it.
- [ ] Implement optimization and CDN delivery.

## Acceptance

An admin can safely upload, find, reuse, replace, and delete media without corrupting references or creating insecure files.

---

# 10. Phase 4 — Quote & Inquiry CRM

**Priority:** P1

This is the core commercial workflow.

## Quote Request

Standardize quote data:

```text
Buyer
Company
Country
Email
Phone / WhatsApp
Product
Quantity
Packaging
Destination
Preferred Incoterm
Message
Status
Created At
Updated At
```

Suggested statuses:

```text
NEW
CONTACTED
QUALIFIED
QUOTED
NEGOTIATING
WON
LOST
SPAM
ARCHIVED
```

## Contact Requests

Suggested statuses:

```text
NEW
READ
REPLIED
CLOSED
SPAM
```

## Tasks

- [ ] Persist all requests reliably.
- [ ] Validate payloads.
- [ ] Rate limit public submission.
- [ ] Add anti-spam strategy.
- [ ] Add admin filtering/search/sorting.
- [ ] Add status transitions.
- [ ] Add internal notes if required.
- [ ] Add email notification architecture.
- [ ] Add audit history for important status changes.

---

# 11. Phase 5 — Public Product Experience

**Priority:** P1

Implement the product specification in `PROJECT_ENHANCEMENTS.md` while reusing existing components.

## Product page

Each product should support, where applicable:

- [ ] Gallery.
- [ ] Overview.
- [ ] Technical specifications.
- [ ] Packaging.
- [ ] Storage.
- [ ] Shelf life.
- [ ] Export season.
- [ ] Target markets.
- [ ] Related products.
- [ ] FAQ.
- [ ] Downloads.
- [ ] Container loading information.
- [ ] Certifications.
- [ ] Video.
- [ ] Quote CTA.

## Search / filters

- [ ] Name.
- [ ] Category.
- [ ] Subcategory.
- [ ] Country/market.
- [ ] Season.
- [ ] Packaging.
- [ ] Temperature.
- [ ] Shelf life.
- [ ] Certification.
- [ ] Availability.

---

# 12. Phase 6 — Markets & Export Intelligence

**Priority:** P1

Create public market pages such as:

```text
/markets/russia
/markets/europe
/markets/uae
/markets/saudi-arabia
```

Each market should explain:

- Products supplied.
- Buyer requirements.
- Relevant certifications.
- Packaging.
- Shipping/logistics.
- Commercial contact CTA.

All factual regulatory information must be sourced and reviewed before publication.

---

# 13. Phase 7 — Internationalization

**Priority:** P1

Target languages:

```text
English
Arabic
Russian
```

## Tasks

- [ ] Choose i18n architecture before implementation.
- [ ] Localized URLs.
- [ ] Language switcher.
- [ ] RTL support.
- [ ] Localized metadata.
- [ ] `hreflang`.
- [ ] Localized sitemap.
- [ ] Localized structured data.
- [ ] Translation key governance.
- [ ] Avoid duplicated hard-coded strings.

Do not begin translation before the content/data model is stable enough to avoid repeated work.

---

# 14. Phase 8 — SEO & Discoverability

**Priority:** P1

## Technical SEO

- [ ] Dynamic metadata.
- [ ] Canonical URLs.
- [ ] Sitemap.
- [ ] Robots.
- [ ] OpenGraph.
- [ ] Social cards.
- [ ] Breadcrumbs.
- [ ] Structured data.
- [ ] Product schema where valid.
- [ ] Organization schema.
- [ ] FAQ schema only where content genuinely qualifies.
- [ ] Image metadata.
- [ ] Local/business structured data where accurate.

## Content SEO

- [ ] Product titles/descriptions.
- [ ] Market landing pages.
- [ ] Export-focused content.
- [ ] Internal linking.
- [ ] Buyer-focused landing pages.

Never publish fabricated certifications, export figures, client names, market claims, or statistics.

---

# 15. Phase 9 — Performance

**Priority:** P1

Targets from the existing specification should be treated as goals, not guaranteed scores:

- Lighthouse: 95+ where realistically achievable.
- Strong Core Web Vitals.
- Fast mobile load.

## Tasks

- [ ] Replace unnecessary `<img>` usage with `next/image` where appropriate.
- [ ] Optimize hero images.
- [ ] Use responsive image sizes.
- [ ] Reduce client components.
- [ ] Use Server Components by default.
- [ ] Cache stable database queries.
- [ ] Use ISR/revalidation where appropriate.
- [ ] Avoid unnecessary client-side fetches.
- [ ] Analyze bundle size.
- [ ] Lazy-load non-critical UI.
- [ ] Optimize fonts.
- [ ] Test mobile performance.

---

# 16. Phase 10 — Accessibility & UX

**Priority:** P1/P2

## Tasks

- [ ] Keyboard-only navigation.
- [ ] Focus management.
- [ ] Dialog accessibility.
- [ ] Form labels/errors.
- [ ] Screen-reader semantics.
- [ ] Color contrast.
- [ ] Reduced-motion support.
- [ ] Touch target review.
- [ ] Error and loading states.
- [ ] Empty states.
- [ ] Confirmation patterns for destructive actions.
- [ ] Mobile navigation audit.

The existing semantic/accessibility improvements should be preserved and extended.

---

# 17. Phase 11 — Testing & Quality Engineering

**Priority:** P0/P1

## Unit tests

Focus on:

- Validation schemas.
- Authorization helpers.
- Utility functions.
- Slug generation.
- Business rules.

## Integration tests

Focus on:

- Authentication.
- RBAC.
- Product CRUD.
- Media upload/delete.
- Contact submission.
- Quote submission.
- Inquiry status changes.

## End-to-end tests

Critical journeys:

```text
Public visitor
  → Products
  → Product detail
  → Request Quote
  → Successful submission

Admin
  → Login
  → Dashboard
  → Product CRUD
  → Media upload
  → Inquiry review
  → Status update
  → Logout
```

## Quality gate

```text
npm run lint
npx tsc --noEmit
npm run build
```

Plus automated tests and database migration verification.

---

# 18. Phase 12 — Observability & Production Operations

**Priority:** P1/P2

- [ ] Centralized error logging.
- [ ] Request correlation where useful.
- [ ] Production error monitoring.
- [ ] Health check strategy.
- [ ] Database backup strategy.
- [ ] Media backup/recovery strategy.
- [ ] Audit logs for sensitive admin operations.
- [ ] Deployment rollback procedure.
- [ ] Environment variable documentation.
- [ ] Incident response notes.

---

# 19. Phase 13 — Analytics & Business Intelligence

**Priority:** P2

Only after privacy/legal requirements are defined.

Potential integrations:

- Google Analytics.
- Google Search Console.
- Microsoft Clarity.
- Custom admin metrics.

Business KPIs:

- Quote requests.
- Contact requests.
- Product views.
- Market page views.
- Conversion rate.
- Top products.
- Top countries.
- Inquiry response time.

---

# 20. Phase 14 — API & Integrations

**Priority:** P2

Do not expose internal Admin APIs as public APIs by accident.

Define a versioned external API only if a real integration requires it.

Potential resources:

```text
/products
/categories
/markets
/certifications
/contact
/quotes
```

Every external API must have authentication, authorization, validation, rate limiting, documentation, and versioning requirements appropriate to its exposure.

---

# 21. Phase 15 — Final Production Readiness

**Priority:** P0

Before production launch:

## Security

- [ ] Authentication verified.
- [ ] RBAC verified.
- [ ] Validation verified.
- [ ] Rate limiting verified.
- [ ] Security headers verified.
- [ ] CSP verified.
- [ ] Upload security verified.
- [ ] Secrets verified.
- [ ] Dependency audit reviewed.

## Application

- [ ] Lint passes.
- [ ] TypeScript passes.
- [ ] Build passes.
- [ ] Tests pass.
- [ ] No broken routes.
- [ ] No broken images.
- [ ] No duplicate slugs.
- [ ] No invalid migrations.

## UX

- [ ] Responsive.
- [ ] Accessible.
- [ ] Loading states.
- [ ] Error states.
- [ ] Empty states.
- [ ] Forms tested.

## SEO

- [ ] Metadata.
- [ ] Sitemap.
- [ ] Robots.
- [ ] Canonicals.
- [ ] Structured data.
- [ ] Social cards.

## Operations

- [ ] Environment configuration.
- [ ] Database backup.
- [ ] Deployment rollback.
- [ ] Error monitoring.
- [ ] Domain/HTTPS.

---

# 22. Recommended Execution Order

The team must **not** implement the old roadmap strictly by numeric phase if a security or dependency issue has higher priority.

Recommended actual order:

```text
PHASE 0  Baseline / Build / Lint / TypeScript
   ↓
PHASE 1  Security / Auth / RBAC / Validation / Rate Limit / Headers
   ↓
PHASE 2  Database / CMS integrity
   ↓
PHASE 3  Media production hardening
   ↓
PHASE 4  Quote + Contact CRM
   ↓
PHASE 5  Public Product Experience
   ↓
PHASE 6  Markets / Export pages
   ↓
PHASE 7  Internationalization
   ↓
PHASE 8  SEO
   ↓
PHASE 9  Performance
   ↓
PHASE 10 Accessibility / UX
   ↓
PHASE 11 Automated Testing
   ↓
PHASE 12 Observability / Operations
   ↓
PHASE 13 Analytics
   ↓
PHASE 14 External API / integrations
   ↓
PHASE 15 Production launch gate
```

---

# 23. Definition of Done

A task is **DONE** only when all applicable conditions are true:

- [ ] Requirements reviewed.
- [ ] Existing implementation reviewed.
- [ ] Architecture decision documented when non-trivial.
- [ ] Code implemented.
- [ ] Server-side security controls implemented where applicable.
- [ ] Validation implemented.
- [ ] Error/loading/empty states handled.
- [ ] Accessibility considered.
- [ ] SEO considered where applicable.
- [ ] Tests added/updated where applicable.
- [ ] Lint passes.
- [ ] TypeScript passes.
- [ ] Build passes.
- [ ] Diff reviewed.
- [ ] No unrelated changes.
- [ ] Documentation/status updated.
- [ ] Commit message is intentional.
- [ ] GitHub branch is updated only after verification.

---

# 24. AI Agent Execution Protocol

This project will use AI coding agents as implementers, not as autonomous decision makers.

Every implementation prompt should contain:

1. **Context** — what part of CARGILL is being changed.
2. **Problem** — the exact problem to solve.
3. **Goal** — measurable desired outcome.
4. **Constraints** — architecture/design/security rules.
5. **Files to inspect** — never assume file contents.
6. **Implementation requirements** — exact behavior.
7. **Acceptance criteria** — objective checks.
8. **Validation commands** — lint, typecheck, build, tests.
9. **Diff review requirement** — no unrelated modifications.
10. **Git rule** — do not push unverified or broken changes.
11. **Documentation rule** — update the relevant MD/status when the phase changes.

### Standard final instruction for AI agents

> After completing the implementation, run all relevant validation checks, review the final diff for correctness, security, regressions, and unrelated changes, and update the GitHub branch only after the implementation is verified. Do not push broken, untested, or incomplete changes. Report exactly what was changed, what was tested, and any remaining risks.

---

# 25. Git Workflow

Recommended workflow for every meaningful phase:

```text
1. Start from the latest remote branch.
2. Create a focused feature/fix branch when appropriate.
3. Inspect before editing.
4. Implement one coherent scope.
5. Run lint/typecheck/build/tests.
6. Review git diff.
7. Commit intentionally.
8. Push the verified commit.
9. Review GitHub state.
10. Continue to the next phase.
```

Never use force push unless explicitly reviewed and justified.

Never commit secrets, `.env` files, local caches, generated credentials, or private keys.

---

# 26. Current Immediate Sprint

The next sprint is intentionally narrow.

## Sprint 01 — Security & Foundation

### Task S01-01 — Fix quality baseline

- Diagnose ESLint exit code `1`.
- Run TypeScript check.
- Run production build.
- Record exact failures.

### Task S01-02 — Authentication audit

- Audit middleware.
- Audit `lib/admin-auth.ts`.
- Audit every Admin API.
- Verify authentication bypass resistance.

### Task S01-03 — RBAC design

- Define roles.
- Define permissions.
- Decide DB model.
- Implement server-side authorization helper.

### Task S01-04 — Zod validation

- Create reusable schemas.
- Apply to contact, quotes, products, categories, inquiries, and media.

### Task S01-05 — Rate limiting

- Choose deployment-compatible strategy.
- Protect auth, contact, quotes, upload, and sensitive APIs.

### Task S01-06 — Security headers

- Audit current headers.
- Implement hardened baseline.
- Test CSP with all current resources.

### Task S01-07 — Media security review

- File size.
- MIME.
- Extension.
- Filename.
- Storage path.
- Abuse controls.
- Delete consistency.

### Sprint exit gate

```text
[ ] Lint passes
[ ] TypeScript passes
[ ] Build passes
[ ] Auth tests pass
[ ] Authorization tests pass
[ ] Validation tests pass
[ ] Rate-limit tests pass
[ ] Security headers verified
[ ] Media upload security verified
[ ] Git diff reviewed
[ ] GitHub updated with verified commit
```

---

# 27. What We Will Not Do Yet

To prevent wasted work and architectural churn, the following are intentionally deferred until the foundation is stable:

- Full multi-language implementation.
- Large-scale UI redesign.
- External API publication.
- Advanced analytics.
- Customer portal.
- Blog/news CMS.
- Complex automation.
- Cloud media migration unless current storage requirements justify it.

---

# 28. Project Success Criteria

The project is successful when CARGILL can confidently present itself online as a professional export company and internally manage its commercial web workflows without relying on insecure client-side behavior or manual code edits.

The final system should provide:

- Trustworthy corporate presentation.
- High-quality product catalog.
- Secure admin CMS.
- Safe media management.
- Qualified quote generation.
- Inquiry management.
- Export market information.
- International SEO.
- Strong performance.
- Accessibility.
- Observability.
- Maintainable architecture.
- Repeatable deployment and rollback.

---

# 29. Change Log

## v1.0 — 2026-08-16

- Created the master execution plan.
- Consolidated requirements, enhancements, roadmap, current implementation, and review findings.
- Reordered work around security and production readiness.
- Added explicit phase exit criteria.
- Added AI-agent execution protocol.
- Added immediate Security & Foundation sprint.
