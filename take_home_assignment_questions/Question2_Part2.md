# HTTP Requests for Integration Test Case
**Please devise HTTP requests from Part 1 to implement your test case. Submitting
written HTTP requisitions is fine, you do not need to submit a postman project.**

Below are the raw HTTP requests that implement the test steps defined in Part 1.
Each request uses standard headers and demonstrates the expected authorization behavior.

# 1. Member A retrieves their own submission (should succeed)

`GET /diagnostics/api/medicaldata/forms/mq/submissions/{A_submissionId}/data`<br>
`Authorization: Bearer <access_token_A>`<br>
`Accept: application/json`<br>
* Expected Response:
200 OK with Member A’s medical questionnaire data.

# 2. Member B retrieves their own submission (should succeed)

`GET /diagnostics/api/medicaldata/forms/mq/submissions/{B_submissionId}/data`<br>
`Authorization: Bearer <access_token_B>`<br>
`Accept: application/json`<br>
* Expected Response:  
200 OK with Member B’s medical questionnaire data.

# 3. Member A attempts to access Member B’s submission (should fail)

`GET /diagnostics/api/medicaldata/forms/mq/submissions/{B_submissionId}/data`<br>
`Authorization: Bearer <access_token_A>`<br>
`Accept: application/json`<br>
* Expected (secure behavior):
403 Forbidden or
404 Not Found

**Fail Condition:**
200 OK with any non‑null data<br>
Any response that reveals Member B’s submission exists<br>

# 4. Member A attempts to access a non‑existent submission (should fail)

`GET /diagnostics/api/medicaldata/forms/mq/submissions/{invalid_submissionId}/data`<br>
`Authorization: Bearer <access_token_A>`<br>
`Accept: application/json`<br>
* Expected Response:  
403 Forbidden or 404 Not Found.<br>

This ensures the API does not leak information about invalid or unknown submissions.

# 5. Access attempt using an expired or invalid token (should fail)

`GET /diagnostics/api/medicaldata/forms/mq/submissions/{A_submissionId}/data`<br>
`Authorization: Bearer <expired_or_invalid_token>`<br>
`Accept: application/json`<br>
* Expected Response:  
401 Unauthorized:<br>