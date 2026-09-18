# Evaluation Results

| Scenario | Expected behavior | Result |
|---|---|---|
| Check-in FAQ | Returns 3:00 PM check-in and 11:00 AM check-out | Passed |
| Pool question | Returns indoor pool hours | Passed by seeded fact path |
| Breakfast question | Returns inclusion and serving hours | Passed by seeded fact path |
| Room for three guests | Detects room-suitability intent, opens in-chat availability form, then matches rooms with capacity >= 3 | Passed by deterministic room service |
| Availability without dates | Requests missing fields | Passed |
| Invalid date range | Returns `INVALID_DATES` | Passed |
| Valid availability | Returns two matching room types for 2026-10-10 to 2026-10-12 | Passed |
| No availability | Returns a clear no-results response for seeded holiday range | Supported by deterministic inventory |
| Unsupported question | Returns a safe grounded fallback | Passed |
| Model/provider failure | Falls back to deterministic facts when provider is missing or errors | Passed by no-key fallback path |
| Frontend initial state | Renders welcome message, question input, and chat availability prompt | Passed |
| Frontend-to-backend flow | React API client uses `/api/chat` and `/api/availability`; availability UI is rendered in the conversation | Verified with live curl/API checks |

Automated command:

```bash
npm test
npm run build
```

Observed result: **14 automated tests passed** (13 backend, 1 frontend) and the production React bundle built successfully.
