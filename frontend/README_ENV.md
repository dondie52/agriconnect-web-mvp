# Environment Variables Setup

## Important: Restart Required

**Vite only reads environment variables when the dev server starts.**

After updating `.env` file, you **MUST**:
1. Stop the Vite dev server (Ctrl+C)
2. Restart it with `npm run dev`

## Environment Variables

The following environment variables are required. Create a `.env` file in the `frontend/` directory:

```bash
VITE_API_URL=https://agriconnect-web-mvp.onrender.com/api
VITE_SUPABASE_URL=https://dbrazdspyhfegbicuubq.supabase.co
VITE_SUPABASE_ANON_KEY=<your real anon key>
```

**Note:** For production builds, use `.env.production` instead.

## Verification

After restarting, check the browser console. You should see:
```
API Configuration: {
  API_URL: "https://agriconnect-web-mvp.onrender.com/api",
  ...
}
```

If you still see `localhost:5000`, the environment variable is not being read. Check:
1. The `.env` file is in the `frontend/` directory
2. Variable names start with `VITE_` (not `REACT_APP_`)
3. The dev server was restarted after changes




