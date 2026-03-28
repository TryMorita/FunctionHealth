# Top 15 Test Cases for the First Three Steps of the Ezra Booking Flow
The booking flow is integral to Ezra's business operation. Please go through the first
three steps of the booking process including payment and devise 15 test cases
throughout the entire process you think are the most important. When submitting the
assignment, please return the test cases from the most important to the least important

# Top 15 Test Cases for the First Three Steps of the Ezra Booking Flow
**Ranked from Most Important → Least Important**

1. Age‑Based Scan Restrictions<br>
Objective: Ensure users outside the allowed age range cannot select restricted scans (Heart CT, Lung CT).<br>
Risk: High medical‑safety and compliance impact.<br>

2. Pre‑Screening Flow for Heart CT / Lung CT<br>
Objective: Selecting a medically restricted scan must:
* Trigger the Pre‑Screen modal
* Block the user if any disqualifying answers are selected
* Allow the user only if their answers are appropriate<br>
Risk: Prevents unsafe or non‑compliant bookings.<br>

3. Scan Selection Dynamically Updates Pricing, Add‑Ons, and Required Steps<br>
Objective: When the user selects or changes a scan, the system must dynamically update all dependent logic, including:<br>
* Pricing (base scan + add‑ons)
* Available add‑ons (only compatible ones should appear)
* Required steps (e.g., Pre‑Screen for Heart CT / Lung CT)
* Resetting downstream selections (location, date, times, payment)<br>
Risk: Incorrect pricing or flow logic directly impacts revenue and user trust.<br>

4. Location Filtering by Scan Availability and State Restrictions<br>
Objective: Locations must filter correctly by:
* State (AK, CA, FL, NJ, NY)
* Which scans are offered
* Recommended vs. other available centers<br>
Risk: Prevents invalid bookings at incompatible centers.<br>

5. “Find Closest Center” Returns Nearest Eligible Location<br>
Objective: Geolocation‑based center selection must return the closest valid center.<br>
Risk: Impacts conversion and user trust.<br>

6. Only Future and Available Dates Are Selectable<br>
Objective: Past or unavailable dates must be disabled in the date picker.<br>
Risk: Prevents invalid scheduling.<br>

7. Selecting a Date Loads Correct Appointment Times<br>
Objective: Appointment times must reflect real availability for the chosen scan and location.<br>
Risk: Core scheduling functionality.<br>

8. MRI with Skeletal & Neurological Assessment Triggers Additional Requirements<br>
Objective: This scan must require:<br>
* Additional scheduling info text box
* Three appointment time selections (across different days if needed)<br>
Risk: Unique flow with high complexity.<br>

9. Appointment Times Are Editable and Deselectable<br>
Objective: Users must be able to:<br>
* Change selected times
* Deselect by clicking again
* Update all required times<br>
Risk: Prevents user frustration and booking errors.<br>

10. Editing Scan Selections Resets Dependent Steps Correctly<br>
Objective: UserWhen a user navigates backward and changes their scan selection, the system must correctly reset all dependent steps, including:<br>
* Add‑ons
* Location selection
* Date picker
* Appointment times
* Payment information
Risk: High user‑flow stability requirement.<br>

10. Payment Page Accurately Reflects All User Selections<br>
Objective: Payment summary must show:<br>
* Scan(s)
* Add‑ons
* Location
* Appointment time(s)
* Correct total price<br>
Risk: Prevents billing disputes and user confusion.<br>

12. Total Price Calculation Is Correct<br>
Objective: Pricing must update dynamically and match backend rules for scans + add‑ons.<br>
Risk: Direct revenue impact.<br>

13. Payment Methods Display Correctly (Card, Affirm, Bank)<br>
Objective: Each payment method must show the correct UI and required fields.<br>
Risk: Ensures checkout is functional for all users.<br>

14. Card Payment Option Allows Optional Saving of Payment Info<br>
Objective: Saving card info should require email + phone number, but remain optional.<br>
Risk: Lower‑risk UX detail but important for user experience.<br>

15. Informational Pop‑Ups Display Correct Content<br>
Objective: “What’s Included,” “What’s Not Included,” and “Learn More” links must show accurate, scan‑specific details.<br>
Risk: Ensures transparency and reduces user confusion.<br>