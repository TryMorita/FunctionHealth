# Integration Test Case: Prevent Members From Accessing Other Members’ Medical Data
**Being privacy‑focused is integral to our culture and business model. This integration test ensures that a member can only access their own Medical Questionnaire submission and cannot access or modify another member’s medical data, even if they manipulate submission IDs or use a valid token belonging to a different user.**

This test validates that the backend enforces object‑level authorization (Broken Object Level Authorization protection) and ties each submission to the authenticated user’s identity.

# Preconditions
* Member A has a valid access_token_A.
* Member B has a valid access_token_B.
* Member A has a Medical Questionnaire submission with ID A_submissionId (e.g., 3475).
* Member B has a Medical Questionnaire submission with ID B_submissionId (e.g., 3474).
* Both submissions exist in the system.

# Test Steps

Step 1 — Member A retrieves their own submission
* Request:  
`GET /diagnostics/api/medicaldata/forms/mq/submissions/{A_submissionId}/data`
* Expected Result:  
200 OK with Member A’s medical questionnaire data.

Step 2 — Member B retrieves their own submission
* Request:  
`GET /diagnostics/api/medicaldata/forms/mq/submissions/{B_submissionId}/data`
* Expected Result:  
200 OK with Member B’s medical questionnaire data.

Step 3 — Member A attempts to access Member B’s submission
* Request: 
`GET /diagnostics/api/medicaldata/forms/mq/submissions/{B_submissionId}/data`

* Expected (secure behavior):
403 Forbidden
404 Not Found

**Fail Conditions:**
* 200 OK with Member B’s data
* 200 OK with any non‑null data
* Any response that reveals the existence or structure of Member B’s submission

This is the core privacy boundary test.

Step 4 — Member A attempts to access a non‑existent submission
* Request:  
`GET /diagnostics/api/medicaldata/forms/mq/submissions/{invalidId}/data`

* Expected Result:  
403 Forbidden or 404 Not Found.

This confirms the backend does not leak information about invalid or unknown submissions.

Step 5 — Attempt access with an expired token
* Request:  
`GET /diagnostics/api/medicaldata/forms/mq/submissions/{A_submissionId}/data`<br>
using an expired or invalid token.

* Expected Result:  
401 Unauthorized with invalid_token.

This confirms token lifetime and session invalidation are enforced.

# Pass Criteria
* Members can access only their own submission.
* Members cannot access any other member’s submission.
* Invalid or expired tokens cannot access any medical data.
* Non‑existent submission IDs do not leak information.

# Fail Criteria
* Any of the following indicates a privacy breach:
* Member A receives 200 OK for Member B’s submission.
* Member A receives non‑null data for Member B’s submission.
* Member A can modify Member B’s submission.
* The API reveals whether another user’s submission exists.
* Expired tokens still return data.