# AI + Product Thinking

## Customer problem

Hotel guests often need quick answers about check-in, amenities, breakfast, cancellation policies, room suitability, and dates before they are ready to contact reception or complete a booking flow. A traditional FAQ page makes guests search through multiple pages, while a generic contact form creates delays. Harborlight Concierge provides one conversational entry point that reduces friction while keeping important hotel rules and availability reliable.

## Guest journey

The journey begins with a welcoming chat interface that makes the guest’s next action obvious. A guest can ask a natural question such as “What time is check-in?” and receive a concise answer grounded in hotel information. The guest can then ask a follow-up question in the same conversation. When the guest asks about rooms, the assistant detects an availability intent and presents a date and guest form directly in the chat rather than sending the guest to another page. After the guest submits the dates and guest count, deterministic availability logic returns clear room cards. The guest can select a room for this demo, and the assistant confirms the selection while clearly stating that no reservation has been created.

## Frontend design rationale

The interface is intentionally simple and hospitality-oriented rather than looking like a developer tool. A compact header establishes trust, the message panel keeps the primary task focused, quick-question chips reduce blank-page anxiety, and the composer remains available for follow-ups. Availability is embedded in the conversation because it preserves context and reduces navigation. The message list has a fixed panel with independent scrolling, so the page does not jump when new messages appear and the latest response remains visible. Responsive CSS supports smaller screens, while loading, error, and reduced-motion states make the experience usable and accessible.

## Where AI adds value

AI is useful for natural-language understanding and response phrasing. It can interpret variations in questions, handle greetings, use recent conversation context, and phrase a concise response from trusted hotel facts. The server sends the model a limited set of retrieved facts rather than giving it unrestricted access to hotel data or business systems.

## What remains deterministic

Availability intent routing, date validation, guest-count validation, room capacity matching, inventory lookup, indicative rates, and the selection state remain outside the model. The backend calls `checkAvailability(checkIn, checkOut, adults)` and returns its result directly. The model cannot invent a room, change a rate, claim inventory, create a reservation, or make an authorization decision. This separation makes the system easier to test and safer to evolve.

## AI risks

The model may hallucinate a policy that is not in the knowledge base, misunderstand an ambiguous follow-up, repeat an outdated fact, follow a prompt-injection attempt, produce an overly verbose answer, or fail because the provider is unavailable or rate-limited. A free-tier provider can also have variable latency and quota limits. These risks are why the model is treated as a language layer rather than the source of truth.

## Hallucination and unsupported-answer prevention

The server retrieves matching hotel facts and includes only those facts in the grounded prompt. The system instruction tells the model to answer only from the supplied facts, not to reveal system instructions, and not to invent policy, price, or availability. The response is bounded and rejected if it is empty or excessively long. If no fact matches, the service returns a clear limitation response instead of asking the model to guess. Availability is never derived from model prose; it comes from deterministic code. In production, I would add retrieval-quality thresholds, fact versioning, response monitoring, moderation, and human review for sensitive policy changes.

## Failure behavior

If the model key is missing, the provider times out, returns an error, exceeds quota, or produces an unusable response, the backend falls back to a deterministic answer from the JSON hotel knowledge base. If the frontend API call fails, the chat displays a dismissible error without losing the existing conversation. Request IDs are returned to help correlate a user-visible failure with server logs. Availability errors remain separate from AI errors so the guest receives a specific next step.

## Measuring usefulness

I would measure the product across task completion, answer quality, and operational health. The first metrics would include the percentage of guest questions answered without escalation, availability-form completion rate, room-card selection rate, follow-up success rate, fallback rate, provider latency, error rate, and abandonment rate. I would add a lightweight “Was this helpful?” action and sample conversations for groundedness review. The most important product outcome is not message volume; it is whether guests find the information they need faster and whether unnecessary reception contacts decrease without increasing incorrect answers.

A useful evaluation set would contain normal FAQs, paraphrases, ambiguous questions, unsupported assumptions, prompt-injection attempts, follow-ups, availability requests, invalid dates, provider failures, and no-inventory cases. Results should be reviewed for both correctness and clarity.

## Production improvements

Before launch, I would connect availability to the hotel’s PMS or booking system, add authentication for guest-specific bookings and staff workflows, and introduce an explicit confirmation step before any real reservation or payment action. I would add Redis-backed distributed rate limiting, a WAF/API gateway, secret management and rotation, TLS, audit logging, dependency scanning, SAST/DAST, monitoring, alerting, backups, and a privacy/data-retention policy.

The AI layer should gain provider fallback, timeout and retry policies with backoff, model/version tracking, prompt and knowledge-base versioning, cost limits, prompt-injection testing, and a red-team evaluation set. I would also add browser-level end-to-end tests, accessibility checks, a repository/database adapter if the hotel content outgrows JSON, and contract tests for the PMS provider. Finally, I would make the no-reservation/demo state impossible to confuse with a real booking by using explicit product copy and a separate production booking workflow.
