# Environment Variables Setup (Vite)

The frontend is built with **Vite**, so all environment variables must use the `VITE_` prefix and live in the `frontend/.env` file.

## Required values

Add the following to `frontend/.env` (replace the Supabase key with your real value):

```
VITE_API_URL=https://agriconnect-web-mvp.onrender.com/api
VITE_UPLOAD_URL=https://agriconnect-web-mvp.onrender.com/uploads
VITE_SUPABASE_URL=https://dbrazdspyhfegbicuubq.supabase.co
VITE_SUPABASE_ANON_KEY=<your real anon key>
```

## Local development reminder

After updating `.env`, restart the dev server so Vite picks up the new values:

```
npm run dev
```

You should see the API configuration logged in the browser console during development. If values are missing, double-check the `.env` file path and variable names.
