# LeadGen AI Agent

Generate lead generation assets for any business: ICP, persona, value prop, cold email sequence, LinkedIn DM, landing page copy, FAQs, SEO keywords, content ideas, snippets. Optional OpenAI integration; robust offline fallback works without any API key.

## Run locally

```bash
npm install
npm run dev
```

Build:

```bash
npm run build && npm start
```

## Environment (optional)

- `OPENAI_API_KEY` – if provided, the app will use OpenAI (default model `gpt-4o-mini`) to produce richer outputs.
- `OPENAI_MODEL` – override model id (optional).

Without an API key, a deterministic high-quality fallback generator is used.

## Deploy to Vercel

Once built and tested locally, deploy with the CLI (token assumed configured):

```bash
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-1d7ad93e
```

Production URL:

- https://agentic-1d7ad93e.vercel.app

## Security

No data is stored server-side. Requests are stateless; only the response is returned to the client.
