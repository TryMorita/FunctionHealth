export const users = {
  userA: {
    // UserA is used for Age‑Based Scan Restrictions
    // UserA must be uneligible for the FB60 scan based on age (e.g. 40 years old)
    email: "UserNameForUserA",
    password: "PasswordForUserA"
  },
  userB: {
    // UserB is used for Pre‑Screening Flow & Dynamic Scan Selection Updates Pricing, Add‑Ons, and Required Steps tests
    // UserB must be eligible for the FB60 scan based on age (e.g. 65 years old) and must answer prescreening questions in a way that allows selection of both add‑ons without pre‑screen failure

    email: "UserNameForUserB",
    password: "PasswordForUserB"
  }
};