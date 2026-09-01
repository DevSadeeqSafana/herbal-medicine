# Quick Setup Guide

Follow these steps to get the Cosmopolitan University Herbal Medicine website up and running.

## Step 1: Configure Environment Variables

1. Open the `.env.local` file in the root directory
2. Update the following variables:

```env
# Update with your MySQL credentials
DATABASE_URL="mysql://your_username:your_password@localhost:3306/cosmopolitan_herbal"

# Get these from your Credo account at https://credocentral.com
NEXT_PUBLIC_CREDO_PUBLIC_KEY="your_credo_public_key_here"
CREDO_SECRET_KEY="your_credo_secret_key_here"

# Update for production deployment
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Step 2: Setup MySQL Database

### Option A: Using MySQL Command Line

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE cosmopolitan_herbal;

# Exit MySQL
exit;
```

### Option B: Using MySQL Workbench or phpMyAdmin

1. Open your MySQL GUI tool
2. Create a new database named `cosmopolitan_herbal`
3. Note the connection credentials (host, username, password)

## Step 3: Initialize Database Schema

```bash
# Generate Prisma Client
npm run prisma:generate

# Push schema to database (creates tables)
npm run prisma:push
```

You should see output confirming tables were created:
- ✓ programmes
- ✓ registrations
- ✓ payments

## Step 4: Seed Database with Sample Data

```bash
npm run prisma:seed
```

This creates 5 sample herbal medicine programmes. You should see:
```
Starting database seeding...
Created programme: Certificate in Herbal Medicine Fundamentals
Created programme: Advanced Certificate in Phytotherapy
Created programme: Certificate in Traditional African Medicine
Created programme: Professional Diploma in Herbal Medicine Practice
Created programme: Short Course: Herbal Medicine for Home Use
Database seeding completed successfully!
```

## Step 5: Start Development Server

```bash
npm run dev
```

Open your browser to: [http://localhost:3000](http://localhost:3000)

## Verify Everything Works

### Test Pages:
1. **Home** - [http://localhost:3000](http://localhost:3000)
   - Should show hero section, MOU, and herbal medicine information

2. **Programmes** - [http://localhost:3000/programmes](http://localhost:3000/programmes)
   - Should display 5 seeded programmes

3. **About** - [http://localhost:3000/about](http://localhost:3000/about)
   - University and partnership information

4. **Contact** - [http://localhost:3000/contact](http://localhost:3000/contact)
   - Contact form (test by submitting)

5. **Register** - [http://localhost:3000/register](http://localhost:3000/register)
   - Registration form with validation

## Troubleshooting

### Issue: Database Connection Error

**Error**: `Can't reach database server at localhost:3306`

**Solution**:
1. Verify MySQL is running: `mysql --version`
2. Check connection credentials in `.env.local`
3. Ensure database exists: `SHOW DATABASES;`

### Issue: Prisma Client Not Generated

**Error**: `@prisma/client did not initialize yet`

**Solution**:
```bash
npm run prisma:generate
```

### Issue: Tables Not Created

**Error**: `Table 'cosmopolitan_herbal.programmes' doesn't exist`

**Solution**:
```bash
npm run prisma:push
```

### Issue: No Programmes Showing

**Solution**: Seed the database
```bash
npm run prisma:seed
```

### Issue: Payment Not Working

**Cause**: Credo API keys not configured or invalid

**Solution**:
1. Sign up at [https://credocentral.com](https://credocentral.com)
2. Get your API keys from dashboard
3. Update `.env.local` with correct keys
4. Restart development server

## Next Steps

### 1. Customize Content

Edit these files to customize content:
- `app/page.tsx` - Home page content
- `app/about/page.tsx` - About page
- `components/Footer.tsx` - Footer contact info
- `app/contact/page.tsx` - Contact information

### 2. Add More Programmes

You can add programmes through:
- Database directly (MySQL)
- Create an admin panel (future enhancement)
- Update `prisma/seed.ts` and re-run seed

### 3. Configure Email Notifications

To send email confirmations:
1. Install nodemailer: `npm install nodemailer @types/nodemailer`
2. Add SMTP settings to `.env.local`:
   ```env
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT="587"
   SMTP_USER="your-email@gmail.com"
   SMTP_PASS="your-app-password"
   ```
3. Implement email sending in API routes

### 4. Add Programme Images

1. Create folder: `public/images/programmes/`
2. Add images (e.g., `fundamentals.jpg`, `phytotherapy.jpg`)
3. Update database records with image paths

### 5. Deploy to Production

Popular hosting options:
- **Vercel** (recommended for Next.js)
  - Connect GitHub repo
  - Add environment variables
  - Deploy automatically

- **Netlify**
- **Railway** (includes database)
- **DigitalOcean App Platform**

## Common Commands Reference

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build production
npm run start            # Start production server

# Database
npm run prisma:generate  # Generate Prisma Client
npm run prisma:push      # Update database schema
npm run prisma:seed      # Seed database
npx prisma studio        # Open Prisma Studio (GUI)

# Code Quality
npm run lint             # Run linter
```

## Need Help?

If you encounter issues not covered here:

1. Check the main [README.md](./README.md) for detailed documentation
2. Review Prisma logs for database issues
3. Check browser console for frontend errors
4. Review server logs in terminal for API errors

## Production Checklist

Before deploying to production:

- [ ] Update all environment variables for production
- [ ] Use production Credo API keys
- [ ] Set correct `NEXT_PUBLIC_APP_URL`
- [ ] Remove or secure database seed script
- [ ] Enable HTTPS
- [ ] Set up proper error logging
- [ ] Configure email notifications
- [ ] Add rate limiting to API routes
- [ ] Implement backup strategy for database
- [ ] Test all payment flows thoroughly
- [ ] Update contact information to real values

---

Happy coding! 🌿✨
