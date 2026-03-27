# Thought Process for Managing Security Quality Across 100+ Sensitive Endpoints

**At Ezra, we have over 100 endpoints that transfer sensitive data. What is your thought
process around managing the security quality of these endpoints? What are the
tradeoffs and potential risks of your solution?**

When dealing with medical data, security cannot rely on a single control. My approach focuses on the layers where a Senior QA Engineer can have the greatest measurable impact through automation, repeatability, and early detection of regressions.

# 1. Object‑Level Authorization (BOLA) — Highest QA Impact
Broken Object Level Authorization is the most common API vulnerability, and it’s exactly what could have surfaced during my testing.
QA can have enormous influence here by:

* Creating automated tests that verify ownership checks across all endpoints
* Ensuring every endpoint that accepts an ID (submissionId, appointmentId, scanId, etc.) validates that the authenticated user owns that object
* Building reusable test utilities that:
* * Log in as multiple users
* * Capture their object IDs
* * Attempt cross‑user access
* * Assert 403/404 behavior

**Why this matters:**<br>
With 100+ endpoints, manual testing will never catch all Object Level regressions. Automated Object Level tests create a safety net that prevents privacy leaks from reappearing.

**Tradeoff:**<br>
Requires upfront investment in test data management and token handling, but pays off massively in coverage and consistency.

# 2. Encryption Validation — Ensuring Sensitive Data Is Protected
While QA doesn’t implement encryption, we can validate that:
* All endpoints enforce HTTPS/TLS
* Sensitive fields are never returned in plaintext
* Tokens, IDs, and PII are not logged or exposed in responses
* No endpoint leaks internal identifiers or database keys
* Data at rest encryption can be validated indirectly (e.g., by reviewing logs, configs, or working with DevOps)

**Why this matters:**<br> 
Encryption failures often show up as accidental leaks in API responses — something QA automation can detect early.

**Tradeoff:**<br>
QA cannot directly validate database‑level encryption, so collaboration with DevOps/SRE is required.

# 3. Automated Security Testing — Scaling Security Across 100+ Endpoints
This is where QA shines.
I would build automated suites that cover:

**Authentication & Token Handling**
* Expired tokens
* Revoked tokens
* Token reuse
* Token swapping between users

**Authorization**
* Cross‑user access attempts
* Role‑based access
* Sequence enforcement (e.g., cannot submit step 3 before step 1)

**Input Validation**
* Special characters
* Oversized payloads
* Invalid types
* Missing required fields

**Endpoint Hardening**
* Rate limit validation
* Cross‑Origin Resource Sharing misconfigurations
* Error message sanitization

**Why this matters:**<br>
Automation ensures that every deployment validates the same security rules, preventing regressions.

**Tradeoff:**<br>
Security automation can generate false positives if not tuned carefully, and requires ongoing maintenance as APIs evolve.

# 4. Supporting Penetration Testing — QA as the Glue
Pen testers find the deep, creative vulnerabilities. QA ensures those vulnerabilities never come back.

**My role would be to:**
* Convert pen test findings into automated regression tests
* Build reproducible test cases for engineering
* Validate fixes across all similar endpoints

**Why this matters:**<br>
Pen tests are point‑in‑time; QA automation makes them continuous.

**Tradeoff:**<br>
Pen test findings can be complex, and translating them into automated tests requires strong technical understanding.

# 5. The Tradeoffs and Risks of This Approach
**Tradeoffs**
* Requires significant upfront investment in automation frameworks
* Increases test suite complexity
* May slow down CI pipelines if not optimized
* Needs close collaboration with backend, DevOps, and security teams

**Risks**
* Incomplete test coverage if object ownership patterns differ across services
* False positives from aggressive security tests
* Over‑reliance on automation without periodic manual review
* Missing business‑logic vulnerabilities that require human reasoning

# Final Thoughts

As a Senior QA Engineer, my focus is on building scalable, automated security validation that protects sensitive medical data across all endpoints. The areas where QA has the greatest impact are object‑level authorization, encryption validation, automated security testing, and converting penetration test findings into permanent regression coverage. While this approach requires upfront investment and cross‑team collaboration, it creates a durable, multi‑layered security posture that prevents privacy regressions and ensures that every release maintains Ezra’s commitment to protecting member data.