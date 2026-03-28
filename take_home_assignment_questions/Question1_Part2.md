# Top 3 Test Case Justifications

1. Age‑Based Scan Restrictions

Age‑based restrictions are essential because they protect users from unnecessary medical risk. Certain scans, such as Heart CT and Lung CT, involve higher radiation exposure or require medical justification. Enforcing age limits ensures that users are not scheduling scans that may not be appropriate for their health profile. If a user genuinely requires one of these higher‑risk scans, that determination should come from their physician. Ezra’s role is to provide preventive, peace‑of‑mind imaging, not to replace medical judgment. Ensuring this restriction works correctly helps maintain user safety and prevents inappropriate or costly bookings.

2. Pre‑Screening Flow for Heart CT / Lung CT

The Pre‑Screening flow acts as a lightweight medical triage step for scans that carry elevated risk. When a user selects a scan like Heart CT or Lung CT, the system must present the Pre‑Screening questionnaire and evaluate the user’s answers accurately. If this flow were to fail by either not appearing when required or by allowing users to proceed despite disqualifying answers, Ezra could inadvertently schedule unsafe appointments. Ensuring the Pre‑Screening logic works correctly is essential for maintaining both user safety and medical compliance.

3. Scan Selection Dynamically Updates Pricing, Add‑Ons, and Required Steps

The scan selection step drives the entire booking flow. Every downstream component from pricing, add‑ons, pre‑screening requirements, location availability, scheduling, and payment precisely depends on the accuracy of this logic. When a user changes their scan selection, the system must immediately update all dependent elements and reset any downstream selections to prevent stale or inconsistent data. This is one of the most comprehensive areas to validate because it touches multiple layers of the system. A failure here breaks the integrity of the entire booking flow, making it a top‑priority test case to automate and verify thoroughly.