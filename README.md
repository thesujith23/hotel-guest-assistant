# Harborlight Hotel Guest Assistant

A secure, interview-ready **MERN** demo for a hotel guest assistant. Guests can ask grounded hotel questions, ask follow-ups, and check deterministic room availability.

> This is a fictional hotel demo. It does not create reservations, process payments, or store guest profiles.

## What problem it solves

Guests often need quick answers before booking or arriving, while hotel teams repeat the same FAQ and availability responses. This experience combines a conversational interface for natural questions with a structured availability flow for dates and guest count.

## Architecture

- **React + Vite:** responsive chat and availability UI.
- **Express + Node.js:** API boundary, validation, security middleware, intent routing, AI orchestration, and deterministic business logic.
- **MongoDB + Mongoose:** seeded hotel facts, room types, and inventory. If MongoDB is unavailable, the same seeded demo data is used in memory so the assignment remains runnable.
- **Optional server-side LLM:** receives only relevant trusted facts and bounded history. The browser never sees the provider key.

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the data-flow diagram.

See [SECURITY.md](./SECURITY.md) for the JWT decision, rate-limiting model, validation/sanitization boundaries, AI-specific threats, and production hardening plan.

See [PRODUCT_THINKING.md](./PRODUCT_THINKING.md) for the customer problem, guest journey, UX rationale, AI boundaries, failure handling, measurement plan, and production improvements.

## Run locally

Requirements: Node.js 18+, npm, and optionally MongoDB 6+.

```bash
cp .env.example .env
npm install
npm run seed                 # seeds MongoDB when MONGODB_URI is configured
npm run dev                  # API: http://localhost:4000, UI: http://localhost:5173
```

The app works without MongoDB or an AI key using deterministic demo fallback data. To enable the free AI path, create an OpenRouter key at [openrouter.ai/settings/keys](https://openrouter.ai/settings/keys), put it in `OPENROUTER_API_KEY`, and keep `AI_MODEL=openrouter/free`. OpenRouter’s free router is OpenAI-compatible and may enforce provider/account rate limits; the app falls back safely if the provider is unavailable. To use MongoDB, start a local instance and set `MONGODB_URI` in `.env` before running `npm run seed`.

Useful commands:

```bash
npm test
npm run build
npm run start -w apps/server
```

## API examples

Health:

```bash
curl http://localhost:4000/api/health
```

Grounded FAQ:

```bash
curl -X POST http://localhost:4000/api/chat \
  -H 'Content-Type: application/json' \
  -d '{"question":"What time is check-in?"}'
```

Missing availability details:

```bash
curl -X POST http://localhost:4000/api/chat \
  -H 'Content-Type: application/json' \
  -d '{"question":"Do you have rooms available?"}'
```

Deterministic availability:

```bash
curl -X POST http://localhost:4000/api/availability \
  -H 'Content-Type: application/json' \
  -d '{"checkIn":"2026-10-10","checkOut":"2026-10-12","adults":3}'
```

## AI and deterministic decisions

| Capability | Implementation | Reason |
|---|---|---|
| Natural-language FAQ phrasing | Optional server-side LLM | Helps understand varied questions and write natural responses |
| Hotel facts | MongoDB retrieval | Facts must be authoritative and inspectable |
| Dates and guest count | Zod + deterministic validation | Models should not decide whether dates are valid |
| Room capacity matching | Deterministic service | Repeatable business rule |
| Availability | Mock inventory service | Never hallucinate inventory or promise a room |
| Unsupported questions | Grounded fallback | Avoids inventing hotel policy |

By default, the server calls OpenRouter’s free `openrouter/free` model router with a short grounded prompt. You can use another OpenAI-compatible provider by changing `AI_API_URL`, `AI_MODEL`, and the server-side key. If the call times out, returns a non-2xx response, or produces unusable output, the service returns a deterministic response from the retrieved facts.

## Security choices

Implemented for this assignment:

- LLM credentials stay server-side in environment variables.
- React calls Express; it never calls the model directly.
- Helmet security headers and strict configurable CORS.
- Request body size limit, question/history limits, and Zod validation.
- Rate limiting on chat and availability routes.
- Mongoose models use controlled query shapes rather than user-provided MongoDB operators.
- Request IDs and safe public error responses; raw stack traces and provider errors are not exposed.
- Provider timeout and graceful fallback.
- Availability is read-only and deterministic.

Before production, add an API gateway/WAF, bot protection, distributed Redis rate limiting, authentication for booking actions, audit logging, monitoring, a durable conversation policy, secret rotation, and a real hotel inventory integration. Do not use this demo as a reservation system without those controls.

## Evaluation scenarios

The backend suite covers eight meaningful flows: healthy service, normal FAQ, unsupported question fallback, missing availability fields, valid availability, invalid dates, availability through chat, and malformed request validation. The frontend suite covers the initial accessible chat and availability controls.

Manual scenarios to demonstrate in an interview:

1. Ask “What time is check-in?” and show the grounded response.
2. Ask “Does the hotel have a swimming pool?” and show amenity data.
3. Ask “Which room is suitable for three guests?” and show compatible rooms.
4. Ask for availability without dates and show clarification.
5. Submit checkout before check-in and show validation.
6. Submit 10–12 October 2026 for three guests and show two room types.
7. Submit 24–27 December 2026 and show no availability.
8. Ask a follow-up such as “What about breakfast?” in the same conversation.
9. Ask an unsupported question and show the safe fallback.
10. Temporarily configure a failing AI endpoint and show deterministic fallback behavior.

## Interview explanation

**Why MERN?** It keeps the guest-facing product and API in one JavaScript ecosystem, while MongoDB suits document-shaped facts and room content. It also leaves a clear path to an admin content workflow.

**Why is availability not AI-generated?** A model can interpret intent, but inventory is a business-critical fact. Deterministic validation and lookup are testable, explainable, and safe.

**How is hallucination reduced?** The model receives only selected hotel facts, the output is bounded, unsupported questions receive a fallback, and the model cannot write inventory or create bookings.

**What would be measured?** Grounded answer rate, fallback rate, availability completion rate, tool-call accuracy, response latency, error rate, and guest satisfaction or successful self-service rate.

**What would improve next?** Replace the mock inventory with a hotel PMS integration, add authenticated booking handoff, add retrieval quality evaluation, distributed rate limiting, observability dashboards, content management, and human escalation.

## AI tools used

AI assistance was used during development for planning, code drafting, test design, and documentation. All generated code was manually reviewed and verified with automated tests and local integration checks. The optional runtime LLM is disabled unless explicitly configured by the operator.
