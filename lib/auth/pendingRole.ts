// In-memory store for the role the user selected before sign-in.
// Persists across screen navigations within a native app session.
// Web: GoogleSignInButton.web.tsx also saves to sessionStorage before the OAuth redirect.

let _role: "patient" | "dietitian" = "patient";

export const setPendingRole = (r: "patient" | "dietitian") => { _role = r; };
export const getPendingRole = () => _role;
