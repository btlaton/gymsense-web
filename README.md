# GymSense Web

Marketing website and checkout redirect pages for GymSense.

## Features

- 🏠 **Landing Page** - Marketing homepage (coming soon)
- ✅ **Checkout Success** - Payment confirmation page with purchase details
- ❌ **Checkout Cancel** - Payment cancelled/failed page with helpful FAQ

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This project is deployed on Vercel.

### Environment Variables

Set these in your Vercel project settings:

| Variable | Description |
|----------|-------------|
| `STRIPE_SECRET_KEY` | Platform Stripe secret key (for fetching session details) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |

## Routes

| Path | Description |
|------|-------------|
| `/` | Landing page |
| `/checkout/success` | Payment success page |
| `/checkout/cancel` | Payment cancelled page |

## Tech Stack

- **Next.js 14** - React framework
- **Tailwind CSS** - Styling
- **Stripe** - Payment processing
- **Vercel** - Hosting

