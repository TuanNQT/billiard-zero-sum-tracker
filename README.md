## Run Locally

**Prerequisites:** Node.js 20+

1. Install dependencies:
   `npm install`
2. Create `.env.local` and set:
   `VITE_GEMINI_API_KEY=your_key_here`
3. Run the app:
   `npm run dev`

## Security Note

- This is a client-side app, so any browser-usable API key can still be exposed to end users.
- Restrict the Gemini key by referrer/domain and quota in Google Cloud.
- For stronger protection, move AI commentary behind your own backend proxy.
