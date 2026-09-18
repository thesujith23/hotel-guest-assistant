# Free AI setup with OpenRouter

This project supports OpenRouter’s free model router through the existing server-side AI adapter.

## 1. Create a free API key

Open [OpenRouter Keys](https://openrouter.ai/settings/keys), sign in, create a key, and copy it. Do not paste it into the React app or commit it to GitHub.

OpenRouter documents free-model limits. At the time of writing, free models are limited to approximately 20 requests per minute and 50 requests per day for accounts without purchased credits. These limits can change, so treat this as a development/demo provider rather than a production SLA.

## 2. Add the key locally

From the project root:

```bash
cp .env.example .env
```

Edit `.env` and set:

```env
OPENROUTER_API_KEY=your_key_here
AI_MODEL=openrouter/free
AI_API_URL=https://openrouter.ai/api/v1/chat/completions
```

Never commit `.env`. It is already excluded by `.gitignore`.

## 3. Start the app

```bash
npm run dev
```

Open `http://localhost:5173` and ask:

```text
What time is check-in?
```

The browser calls Express. Express retrieves trusted hotel facts and calls OpenRouter. The browser never sees `OPENROUTER_API_KEY`.

## 4. How to demonstrate it

Use the browser Network tab and show that the request goes to:

```text
http://localhost:4000/api/chat
```

There must be no request from the browser directly to `openrouter.ai` and no API key in the frontend bundle. The OpenRouter call is made inside `apps/server/src/services/aiService.js`.

## 5. What happens when the free provider fails

The application has a safe fallback. If the key is missing, the provider times out, OpenRouter returns an error, or the model response is invalid, the API returns a deterministic answer from the hotel facts. Availability never depends on the model.

This is the interview explanation:

> “The LLM is used for natural-language phrasing over retrieved hotel facts. Dates, guest counts, room matching, and inventory remain deterministic. The provider is optional so the product still works during quota exhaustion or provider failure, and a free-tier provider is suitable for this assignment demo but not a production SLA.”
