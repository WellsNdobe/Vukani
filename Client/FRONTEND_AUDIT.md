# Frontend exploration notes: flaws & improvement opportunities

## 1) Core product flow gaps

1. **Saved jobs flow is incomplete at the navigation level.**
   The `Saved` tab currently renders only placeholder text (`"Saved Jobs Page"`) and does not connect to actual saved items, which breaks a key loop for a job-search app. 

2. **Messages are not connected to backend state.**
   The messages list and thread views are powered by local mock data and in-memory reply state. Replies disappear after navigation/reload, and there is no indication of delivery/read status or backend persistence.

3. **Social auth CTAs are misleading.**
   "Continue with LinkedIn/Google" on login triggers the normal email/password login handler instead of a real social OAuth flow, and sign-up social buttons simply route users to login. This creates a trust/expectation mismatch.

## 2) Environment & reliability issues

4. **Hardcoded `localhost` API URLs appear throughout app screens.**
   Multiple screens call `http://localhost:5000/...` directly. On physical devices/emulators this often fails unless special host routing is configured. It also prevents environment-based configuration (dev/staging/prod).

5. **Mixed API base strategies can cause broken features.**
   Some calls use absolute URLs (`http://localhost:5000/...`), while saved-jobs hook uses relative routes (`/api/saved/...`). Without a shared API client/base URL strategy, behavior can vary per screen and environment.

6. **Auth session resilience is weak.**
   Auth context is in-memory only and starts with `null`, with no hydration from persisted token/user. App restarts or refreshes can drop perceived login state and reroute users unexpectedly.

## 3) UX and interaction consistency

7. **Search UI is present but not wired into the job feed.**
   Home screen renders a `Header` search input but does not pass handlers/value to filter jobs. This is a dead interaction and can frustrate users.

8. **"Save" behavior is inconsistent across screens.**
   Job card save uses `useSavedJobs`, while job details save is a local toggle plus alert only. Users can see conflicting saved states depending on where they interact.

9. **Primary CTA language and behavior mismatch.**
   Home card uses "View details" in the apply button location; job detail has both save/apply patterns and alert-driven fallbacks. CTA intent hierarchy is unclear for users trying to quickly apply.

10. **Limited empty/error-state UX.**
   Most failures show alerts or console logs; few screens provide recoverable inline states (retry, guidance, partial rendering). Example: profile fetch failures only log errors.

## 4) Design system coherence

11. **Theme inconsistency across app surfaces.**
   Several screens use a nude palette while messaging and various controls use iOS default blues (`#007AFF`, etc.). The visual identity feels fragmented.

12. **Tab layout container uses black background while tab bar uses theme background.**
   This can create visual flashes/edges and inconsistent contrast on transitions.

13. **Typography/spacing rhythm varies significantly by screen.**
   Auth, jobs, messages, and profile have different spacing scales and control sizing, giving a "stitched together" feel instead of a unified product.

## 5) Logic and data handling quality

14. **Several components rely on `any` for critical entities.**
   Jobs/profile responses are typed as `any`, reducing safety around missing/renamed fields and increasing runtime UI break risk.

15. **Potential stale-session issue on logout.**
   Logout clears context state, but token persistence lifecycle is inconsistent across flows; if token remains in storage, app behavior may drift between screens that check token directly and those that trust context.

16. **Profile data calls appear unauthenticated.**
   Profile endpoints are called without bearer headers despite token-based auth elsewhere. Depending on backend rules, this can cause silent failure or exposure risks.

## 6) Recommended next priorities (high impact)

1. Implement a **single API client/config** (base URL from env, common headers, interceptors).
2. Implement **real auth session hydration** (restore user from token on app boot; loading state distinct from unauthenticated).
3. Make **Saved** tab real and unify save source-of-truth between cards/details/profile counts.
4. Replace mock messaging with backend-backed conversation model (list, thread, send, optimistic updates).
5. Convert dead/misleading actions (social auth, search) into real flows or hide until implemented.
6. Establish a small **design system pass** (color tokens, spacing scale, button hierarchy, state patterns).
