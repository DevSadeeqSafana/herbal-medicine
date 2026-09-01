# Cosmopolitan University Herbal Medicine Certificate Programmes

A comprehensive web application for managing herbal medicine certificate programme registrations at Cosmopolitan University Abuja in partnership with Zee's Herbal Pharmacy.

## Features

- 🌿 **Green/Leafy Theme** - Beautiful herbal-inspired design
- 📚 **Dynamic Programmes** - Database-driven programme listings
- 💳 **Credo Payment Integration** - Secure payment processing
- 📝 **Registration System** - Complete student registration workflow
- ✅ **Form Validation** - Robust validation with Zod and Formik
- 📱 **Responsive Design** - Mobile-friendly interface
- 🔔 **Toast Notifications** - User feedback with React Toastify
- 🗄️ **MySQL Database** - Powered by Prisma ORM

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: MySQL with Prisma ORM
- **Styling**: Tailwind CSS
- **Forms**: Formik with Zod validation
- **Data Fetching**: TanStack Query (React Query)
- **Notifications**: React Toastify
- **Payment**: Credo Payment Gateway
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+ installed
- MySQL database server
- npm or yarn package manager

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="mysql://username:password@localhost:3306/cosmopolitan_herbal"

# Credo Payment Gateway
NEXT_PUBLIC_CREDO_PUBLIC_KEY="your_credo_public_key"
CREDO_SECRET_KEY="your_credo_secret_key"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Replace the following:**
- `username`: Your MySQL username
- `password`: Your MySQL password
- `cosmopolitan_herbal`: Your database name
- `your_credo_public_key`: Your Credo public key
- `your_credo_secret_key`: Your Credo secret key

### 3. Setup Database

Create the MySQL database:

```bash
mysql -u root -p
CREATE DATABASE cosmopolitan_herbal;
exit;
```

Generate Prisma Client and push schema to database:

```bash
npm run prisma:generate
npm run prisma:push
```

### 4. Seed Database with Sample Programmes

```bash
npm run prisma:seed
```

This will create 5 sample herbal medicine programmes:
- Certificate in Herbal Medicine Fundamentals
- Advanced Certificate in Phytotherapy
- Certificate in Traditional African Medicine
- Professional Diploma in Herbal Medicine Practice
- Short Course: Herbal Medicine for Home Use

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
medical/
├── app/                          # Next.js App Router
│   ├── about/                    # About page
│   ├── api/                      # API routes
│   │   ├── contact/              # Contact form endpoint
│   │   ├── payment/              # Payment endpoints
│   │   ├── programmes/           # Programme endpoints
│   │   └── register/             # Registration endpoint
│   ├── contact/                  # Contact page
│   ├── payment/                  # Payment verification page
│   ├── programmes/               # Programmes listing & detail pages
│   ├── register/                 # Registration page
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   └── providers.tsx            # React Query provider
├── components/                   # Reusable components
│   ├── Footer.tsx
│   ├── Header.tsx
│   └── MainLayout.tsx
├── lib/                         # Utilities and helpers
│   ├── credo.ts                # Credo payment integration
│   ├── prisma.ts               # Prisma client
│   └── validations.ts          # Zod schemas
├── prisma/                      # Prisma configuration
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Database seeding script
├── types/                       # TypeScript type definitions
│   └── index.ts
└── public/                      # Static assets
```

## Pages

### 1. Home (`/`)
- Hero section with call-to-action
- MOU between Cosmopolitan University and Zee's Herbal Pharmacy
- About Zee's Herbal Pharmacy
- Importance of Herbal Medicine
- History and Cultural Heritage

### 2. About (`/about`)
- University information
- Vision and Mission
- Partnership details
- Why choose our programmes

### 3. Programmes (`/programmes`)
- Dynamic list of all active programmes
- Programme cards with key information
- Filter and search capabilities

### 4. Programme Detail (`/programmes/[id]`)
- Detailed programme information
- Full curriculum
- Entry requirements
- Enroll button

### 5. Contact (`/contact`)
- Contact form with validation
- Contact information (address, phone, email)
- Office hours
- Map placeholder

### 6. Register (`/register`)
- Multi-step registration form
- Personal information
- Address information
- Educational background
- Programme selection
- Form validation with Zod
- Payment integration

### 7. Payment Verification (`/payment/verify`)
- Payment status checking
- Success/failure messages
- Transaction details

## API Endpoints

### Programmes
- `GET /api/programmes` - Get all active programmes
- `GET /api/programmes/[id]` - Get single programme

### Registration
- `POST /api/register` - Create new registration

### Payment
- `POST /api/payment/initialize` - Initialize Credo payment
- `GET /api/payment/verify?ref=[transactionRef]` - Verify payment

### Contact
- `POST /api/contact` - Submit contact form

## Database Schema

### Programme
- Programme information (name, description, duration, price)
- Curriculum (JSON string)
- Active status

### Registration
- Student personal information
- Address details
- Educational background
- Payment status
- Linked to Programme

### Payment
- Amount and currency
- Transaction references
- Payment status
- Credo integration fields
- Linked to Registration

## Payment Integration

The application uses Credo Payment Gateway for processing payments:

1. User completes registration form
2. Registration record created in database
3. Payment initialized with Credo API
4. User redirected to Credo checkout
5. After payment, user redirected back to verify page
6. Payment verified with Credo API
7. Registration and payment status updated

### Testing Payments

For testing, use Credo's test credentials and test card numbers available in their documentation.

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

npm run prisma:generate  # Generate Prisma Client
npm run prisma:push      # Push schema to database
npm run prisma:seed      # Seed database with sample data
```

## Customization

### Update Contact Information

Edit the contact details in:
- `components/Footer.tsx`
- `app/contact/page.tsx`

### Modify Theme Colors

Edit Tailwind configuration in `tailwind.config.ts`:
```typescript
colors: {
  primary: {
    // Customize green shades
  }
}
```

### Add Programme Images

Place images in `public/images/programmes/` and update the `imageUrl` field in the database.

### Configure Email Notifications

To implement email notifications:
1. Install nodemailer: `npm install nodemailer`
2. Configure SMTP settings in `.env.local`
3. Add email sending logic in `/api/register` and `/api/contact`

## Production Deployment

### Environment Variables

Ensure all production environment variables are set:
- `DATABASE_URL` - Production MySQL connection string
- `CREDO_SECRET_KEY` - Production Credo secret key
- `NEXT_PUBLIC_CREDO_PUBLIC_KEY` - Production Credo public key
- `NEXT_PUBLIC_APP_URL` - Production app URL

### Database Migration

```bash
npm run prisma:push
npm run prisma:seed  # Optional: seed with initial data
```

### Build and Start

```bash
npm run build
npm run start
```

## Security Considerations

- Never commit `.env.local` or environment variables
- Keep Credo secret keys secure
- Implement rate limiting on API routes
- Add CSRF protection for forms
- Validate all user inputs server-side
- Use HTTPS in production

## Future Enhancements

- [ ] Admin dashboard for programme management
- [ ] Student portal for tracking progress
- [ ] Email notifications for registration/payment
- [ ] PDF certificate generation
- [ ] Online learning modules
- [ ] Student testimonials section
- [ ] Blog/news section
- [ ] Multi-language support
- [ ] Advanced search and filtering
- [ ] Analytics dashboard

## Support

For questions or issues:
- Email: info@cosmopolitanuni.edu.ng
- Phone: +234 XXX XXX XXXX

## License

© 2024 Cosmopolitan University Abuja. All rights reserved.

---

Built with ❤️ for herbal medicine education in Nigeria
