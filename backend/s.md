got it—here’s a clean, copy-pastable issue set with a clear hierarchy. each item includes: labels, files to create/modify, crisp description, and acceptance criteria. (numbers removed, as you asked.)

---

# Main issue (Epic)

### Title

**Core Payments & Zarinpal Integration (Epic)**

**Type:** Main issue (parent)
**Labels:** `epic` `payments` `backend` `zarinpal`

**Description:**
Stand up a reusable payments architecture:

* Independent `finance.Transaction` model usable from any domain
* Zarinpal provider adapter
* Orchestrator service to run initiate → callback → verify
* DRF API endpoints
* Signals for domain state updates
* Env/config, CI, docs, and tests

**Acceptance Criteria:**

* All payment operations persist to `finance.Transaction`.
* Zarinpal end-to-end works in sandbox and live modes.
* Idempotent callbacks; replay/mismatch guarded.
* Domains update via payment signals (no tight coupling).
* CI green on PRs; docs enable dev setup in ≤10 minutes.

**Files to create:** *(none; handled by sub-issues)*
**Files to modify:** *(none; handled by sub-issues)*

---

# Sub-issues

### Title

**feat(finance): create independent Transaction model**

**Type:** Sub-issue (child of Epic)
**Labels:** `feature` `finance` `backend` `schema`

**Description:**
Create a standalone `finance` app with a polymorphic `Transaction` model (GenericForeignKey) to link any subject object (Appointment/Order/…).

**Acceptance Criteria:**

* `Transaction` supports: UUID PK, user FK, provider/intent_id/transaction_id/idempotency_key, amount_minor/currency, status/provider_status/provider_message, meta JSON, ip, is_sandbox, timestamps, verified_at/refunded_at.
* Indexes & constraints (unique provider+intent, lookup by subject, provider, status).
* Admin registered; basic CRUD smoke tests pass.

**Files to create:**

* `finance/__init__.py`
* `finance/apps.py`
* `finance/models.py`
* `finance/admin.py`
* `finance/migrations/0001_initial.py`
* `finance/tests/test_transaction_model.py`

**Files to modify:**

* `settings.py` (add `finance` to `INSTALLED_APPS`)

---

### Title

**chore(appointments): expose GenericRelation to transactions**

**Type:** Sub-issue
**Labels:** `chore` `appointments` `finance` `backend`

**Description:**
Add a `GenericRelation` on `Appointment` for easy reverse access to transactions.

**Acceptance Criteria:**

* `appointment.transactions.all()` works.
* No circular imports; migration succeeds.

**Files to create:**

* (optional) `appointments/tests/test_transactions_relation.py`

**Files to modify:**

* `appointments/models/appointment_model.py` (add `GenericRelation`)
* `appointments/migrations/XXXX_add_transactions_relation.py`

---

### Title

**feat(payments): define provider adapter interface**

**Type:** Sub-issue
**Labels:** `feature` `payments` `backend` `interfaces`

**Description:**
Add an abstract `ProviderAdapter` with `create_intent`, `verify`, `refund`, `parse_callback`. No Django request types in signatures (pure).

**Acceptance Criteria:**

* Base interface defined; unit test ensures abstract methods exist.
* Simple `Provider` enum-like constants added.

**Files to create:**

* `payments/__init__.py`
* `payments/adapters/base.py`
* `payments/tests/test_provider_interface.py`

**Files to modify:**

* none

---

### Title

**feat(payments): implement ZarinpalAdapter**

**Type:** Sub-issue
**Labels:** `feature` `payments` `zarinpal` `backend`

**Description:**
Implement Zarinpal adapter (request, verify, refund stub, callback parsing) with rial↔toman conversion and sandbox/live base URLs. Add structured logs and safe error handling.

**Acceptance Criteria:**

* `create_intent` returns `{ ok, payment_intent_id (Authority), redirect_url }`.
* `verify` returns `{ ok, transaction_id (RefID) }`.
* `refund` raises `NotImplementedError`.
* Amount conversion correct; timeouts set; provider errors masked.

**Files to create:**

* `payments/adapters/zarinpal.py`
* `payments/tests/test_zarinpal_adapter.py`

**Files to modify:**

* none

---

### Title

**feat(payments): orchestrator service (initiate & callback/verify)**

**Type:** Sub-issue
**Labels:** `feature` `payments` `backend`

**Description:**
Add `payments/orchestrator.py` with functions to call adapter, persist `finance.Transaction`, enforce idempotency, and finalize on verify.

**Acceptance Criteria:**

* `initiate_payment_for_subject(...)` creates `Transaction` with `pending` and returns `redirect_url`.
* `handle_zarinpal_callback(...)` is idempotent; moves to `paid` on verify OK, `failed` otherwise.
* Uses DB locking / status checks to prevent double-confirm.

**Files to create:**

* `payments/orchestrator.py`
* `payments/tests/test_orchestrator.py`

**Files to modify:**

* none

---

### Title

**feat(payments.api): add initiate & callback endpoints (DRF)**

**Type:** Sub-issue
**Labels:** `feature` `api` `payments` `backend`

**Description:**
Expose DRF endpoints to initiate payment and handle Zarinpal callback, delegating to orchestrator.

**Acceptance Criteria:**

* `POST /api/v1/payments/initiate/` → `{ redirect_url, payment_intent_id }`
* `GET|POST /api/v1/payments/callback/zarinpal/` → verify + final state
* Auth required for initiate; safe responses; no provider internals leaked.

**Files to create:**

* `payments/api/__init__.py`
* `payments/api/serializers.py`
* `payments/api/views.py`
* `payments/api/urls.py`
* `payments/tests/test_api_payments.py`

**Files to modify:**

* Project `urls.py` (include payments api routes)

---

### Title

**feat(finance): transaction signals (paid/failed) & domain handlers**

**Type:** Sub-issue
**Labels:** `feature` `finance` `signals` `backend`

**Description:**
Emit `transaction_paid` / `transaction_failed` from finance; add domain receiver in `appointments` to set `status=confirmed` on paid.

**Acceptance Criteria:**

* Signals emitted exactly once when status transitions.
* Appointment status updates only for its own subject transaction.

**Files to create:**

* `finance/signals.py`
* `finance/tests/test_signals.py`
* `appointments/signals.py` (receiver)
* `appointments/tests/test_paid_signal_updates_appointment.py`

**Files to modify:**

* `finance/apps.py` (ready() to connect signals)
* `appointments/apps.py` (ready() to connect receiver)
* `settings.py` (ensure apps’ ready hooks run)

---

### Title

**chore(settings): env & configuration for Zarinpal**

**Type:** Sub-issue
**Labels:** `chore` `settings` `payments` `zarinpal`

**Description:**
Add env variables and derived constants for Zarinpal mode and amount units.

**Acceptance Criteria:**

* `ZARINPAL_MERCHANT_ID`, `ZARINPAL_MODE (sandbox|live)`, `ZARINPAL_AMOUNT_UNIT (rial|toman)` available via settings.
* `ZARINPAL_API_BASE`, `ZARINPAL_STARTPAY_BASE` derived by mode.
* `.env.example` updated.

**Files to create:**

* none

**Files to modify:**

* `online_clinic_backend/settings.py`
* `.env.example`

---

### Title

**test(payments): end-to-end Zarinpal flow**

**Type:** Sub-issue
**Labels:** `test` `payments` `zarinpal` `backend`

**Description:**
End-to-end tests with mocked HTTP: initiate → callback OK → verify success; cancel; replay; mismatch; provider errors.

**Acceptance Criteria:**

* Transactions end in correct states (`paid`/`failed`).
* Idempotency verified (replays do not double-confirm).
* Amount mismatch rejected.

**Files to create:**

* `payments/tests/test_e2e_zarinpal_flow.py`

**Files to modify:**

* none

---

### Title

**docs(payments): Zarinpal integration guide**

**Type:** Sub-issue
**Labels:** `docs` `payments` `zarinpal`

**Description:**
Author a developer guide with env setup, flow diagram, sandbox steps, and troubleshooting.

**Acceptance Criteria:**

* New devs can run sandbox payments in ≤10 minutes.
* Diagrams and examples included; no secrets leaked.

**Files to create:**

* `docs/payments_zarinpal.md`

**Files to modify:**

* `README.md` (link to the doc)

---

### Title

**chore(ci): enforce payments tests & secrets in GitHub Actions**

**Type:** Sub-issue
**Labels:** `chore` `ci` `payments` `backend`

**Description:**
Add/adjust CI to run Django tests (including payments) and configure required secrets/variables. Mark checks as required for `develop`/`main`. Optionally protect branches.

**Acceptance Criteria:**

* CI green required to merge into `develop`/`main`.
* Repo/Environment secrets set for sandbox mode.
* Branch protection updated (PR reviews + checks).

**Files to create:**

* `.github/workflows/ci.yml`

**Files to modify:**

* GitHub repo settings (branch protection, required checks)
* GitHub Actions → Secrets/Variables (`ZARINPAL_MERCHANT_ID`, `ZARINPAL_MODE`, `ZARINPAL_AMOUNT_UNIT`, db vars as needed)

---

## Suggested labels (create them once if they don’t exist)

`epic`, `feature`, `chore`, `test`, `docs`, `backend`, `api`, `schema`, `signals`, `ci`, `payments`, `zarinpal`, `finance`, `appointments`, `settings`, `interfaces`

---

### Optional helper (paste into each issue body top)

> **Parent Epic:** *Core Payments & Zarinpal Integration (Epic)*
> **Dependencies:** *(list any sibling issues that must land first, e.g., Transaction model before Orchestrator)*
> **Out of Scope:** *(any UI/analytics not required for MVP)*

if you want, I can also turn these into **issue templates** (YAML front-matter + Markdown) so you can create them quickly from GitHub’s “New issue” menu.
