# Prisma Studio Security Setup

This project includes password protection for Prisma Studio to prevent unauthorized access to your database.

## How It Works

The secure Prisma Studio setup uses HTTP Basic Authentication to protect access. It creates a reverse proxy that:
1. Starts Prisma Studio on port 5555 (localhost only)
2. Creates a password-protected proxy on port 5556
3. Requires authentication before granting access

## Setup

### 1. Set Your Password

Edit your `.env` file and set a strong password:

```env
PRISMA_STUDIO_PASSWORD=your_secure_password_here
```

**IMPORTANT:** Change the default password immediately!

### 2. Usage

#### Secure Access (Recommended)
```bash
npm run studio
```

This will start Prisma Studio with password protection on `http://localhost:5556`

When you visit the URL in your browser:
- Username: (enter any username)
- Password: Your PRISMA_STUDIO_PASSWORD from .env

#### Unsafe Access (Not Recommended)
```bash
npm run studio:unsafe
```

This starts Prisma Studio without any protection on `http://localhost:5555`

**⚠️ WARNING:** Only use this if you're certain no one else can access your machine.

## Security Best Practices

### ✅ DO:
- Change the default password in `.env`
- Use a strong, unique password
- Keep Prisma Studio running on localhost only
- Only use Prisma Studio in development
- Close Prisma Studio when not in use (Ctrl+C)

### ❌ DON'T:
- Use the default password
- Expose Prisma Studio to the internet
- Share your PRISMA_STUDIO_PASSWORD
- Run Prisma Studio in production
- Commit `.env` file to version control

## Production Deployment

**NEVER run Prisma Studio in production environments.**

For production database management:
1. Use your hosting provider's database tools (e.g., Vercel Postgres Dashboard)
2. Create custom admin routes within your Next.js app with proper authentication
3. Use database management tools with proper security (TablePlus, DataGrip, etc.)

## Troubleshooting

### "Cannot connect to Prisma Studio"
- Wait a few seconds after starting - Prisma Studio takes time to initialize
- Check if port 5555 or 5556 is already in use
- Ensure your DATABASE_URL in `.env` is correct

### "Authentication required" keeps appearing
- Check that your password in `.env` matches what you're entering
- Ensure `.env` file is in the project root
- Restart the secure studio: Stop with Ctrl+C and run `npm run studio` again

### Password not working
- Verify `PRISMA_STUDIO_PASSWORD` is set correctly in `.env`
- No quotes needed around the password value
- Restart the server after changing `.env`

## Technical Details

- **Proxy Port:** 5556 (secured with password)
- **Prisma Studio Port:** 5555 (direct access, not exposed)
- **Authentication:** HTTP Basic Authentication
- **Transport:** HTTP (localhost only, SSL not needed)

---

**Remember:** This is basic password protection suitable for local development only. Never expose this setup to the internet or use it in production environments.
