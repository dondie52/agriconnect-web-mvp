# Environment Variables Setup

## Important: Restart Required

**Create React App only reads environment variables when the dev server starts.**

After updating `.env` file, you **MUST**:
1. Stop the React dev server (Ctrl+C)
2. Restart it with `npm start`

## Environment Variables

The following environment variables are required:

```bash
REACT_APP_API_URL=https://agriconnect-web-mvp.onrender.com/api
REACT_APP_SUPABASE_URL=https://dbrazdspyhfegbicuubq.supabase.co
REACT_APP_SUPABASE_ANON_KEY=<your real anon key>
```

## Verification

After restarting, check the browser console. You should see:
```
🔗 API Configuration: {
  API_URL: "https://agriconnect-web-mvp.onrender.com/api",
  ...
}
```

If you still see `localhost:5000`, the environment variable is not being read. Check:
1. The `.env` file is in the `frontend/` directory
2. Variable names start with `REACT_APP_`
3. The dev server was restarted after changes
