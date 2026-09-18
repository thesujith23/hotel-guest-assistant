# Security Review and Interview Notes

## Security posture

This application is a **public guest-assistant prototype**, not an authenticated booking system. Its main security goals are to protect server secrets, limit abuse, validate untrusted input, prevent unsupported AI claims, and return safe errors.

## JWT: why it is not currently used

JWT is **not implemented in this demo by design**. The assignment only requires anonymous guests to ask questions and check read-only mock availability. There is no user account, private profile, reservation modification, or privileged endpoint that needs an identity token.

A good interview answer is:

> “I did not add JWT just because it is common. For this anonymous read-only guest flow, JWT would add complexity without protecting a real authorization boundary. If I added authenticated booking or staff/admin APIs, I would add short-lived access tokens, refresh-token rotation, role/permission checks, and server-side authorization on every protected route. The UI would never be treated as the authorization layer.”

For production authentication, use:

- short-lived access tokens;
- refresh-token rotation and revocation strategy;
- issuer, audience, expiry, and signature verification;
- least-privilege roles such as `guest`, `staff`, and `admin`;
- authorization checks after authentication;
- secure, HttpOnly, SameSite cookies when appropriate;
- no sensitive data in JWT payloads because JWT payloads are readable by the holder.

## Rate limiting

The API uses `express-rate-limit` on `/api/chat` and `/api/availability`:

- 60 requests per IP per 60-second window;
- standard `RateLimit-*` response headers;
- legacy headers disabled.

This helps control accidental loops, basic scraping, and LLM-cost abuse. It is not a complete DDoS defense. In a multi-instance production deployment, use a shared Redis store so limits are consistent across instances, and add an API gateway/WAF, bot detection, request quotas, and provider-level spend limits.

For a real product, use different limits for anonymous chat, authenticated users, staff, and expensive AI calls. Return `429 Too Many Requests` with a retry hint and monitor rate-limit events.

## Input validation and sanitization

Validation happens at the Express boundary with Zod before business logic or database access:

- question: trimmed, 2–1000 characters;
- history: maximum 12 messages;
- message roles: only `user` or `assistant`;
- message content: trimmed, 1–1000 characters;
- adults: integer from 1 to 12;
- dates: strict `YYYY-MM-DD` shape plus a semantic check that checkout follows check-in;
- JSON body: maximum 20 KB.

The API does not accept arbitrary MongoDB filters from the browser. Database queries are constructed from server-owned fields, which reduces MongoDB operator-injection risk. Mongoose schemas add another validation boundary.

There is no HTML rendering of assistant content in React; content is rendered as text, so the frontend does not use `dangerouslySetInnerHTML`. This avoids an HTML/script injection path. If rich markdown is added later, sanitize it with a strict allowlist before rendering.

“Sanitization” is not a replacement for validation. Validation asks whether data is acceptable for the operation; output encoding or sanitization protects the next context where data is rendered.

## Headers, CORS, and secrets

- Helmet adds common security headers.
- `x-powered-by` is disabled to reduce framework fingerprinting.
- CORS allows the configured client origin rather than `*`.
- Body size is capped.
- AI credentials are read only from server environment variables.
- The React bundle only receives the public `VITE_API_URL`; it never receives `AI_API_KEY`.
- `.env` is ignored by version control.

CORS is not authentication. It controls browser-origin behavior; an attacker can still call an API with a non-browser client, so server validation and authorization remain necessary.

## AI-specific security

- User text is treated as untrusted prompt content.
- The server sends only selected hotel facts to the model.
- The prompt instructs the model not to reveal instructions or invent policies, prices, or availability.
- Output is bounded and checked before returning it.
- Availability is never inferred from model text; it comes from deterministic application logic.
- Provider failure, timeout, bad status, or unusable output falls back to deterministic hotel facts.
- Full guest messages are not intentionally logged.

This reduces prompt-injection and hallucination risk, but no prompt can guarantee perfect model behavior. The application must keep authorization, inventory, and policy decisions outside the model.

## Error handling and observability

Each request receives a UUID request ID, returned in `X-Request-ID` and structured JSON responses. Internal errors are logged server-side with the request ID, while clients receive a generic message. Production logging should redact tokens, credentials, payment data, and unnecessary guest content, and should add latency, dependency status, and abuse metrics.

## Remaining production work

Before a real hotel launch, add authentication where user-specific actions exist, centralized secrets management and rotation, TLS termination, a WAF/API gateway, distributed rate limiting, audit logs, dependency scanning, SAST/DAST, MongoDB least-privilege credentials, backups, monitoring/alerting, a real PMS integration, and a formal privacy/data-retention policy.
