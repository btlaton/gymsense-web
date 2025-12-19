# Domain Migration: Squarespace → Vercel

This guide walks through transferring `gymsense.io` from Squarespace to Vercel.

## Prerequisites

- [ ] Vercel account (sign up at vercel.com)
- [ ] Access to Squarespace domain settings
- [ ] Access to domain registrar email (for transfer authorization)

---

## Phase 1: Deploy to Vercel (Do This First!)

### Step 1: Initialize Git Repository

```bash
cd /Users/brianlaton/developer/gymsense-web
git init
git add .
git commit -m "Initial commit: checkout success/cancel pages"
```

### Step 2: Push to GitHub

Create a new repository on GitHub (e.g., `gymsense-web`), then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/gymsense-web.git
git branch -M main
git push -u origin main
```

### Step 3: Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select your `gymsense-web` repository
4. Configure:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
5. Add Environment Variables:
   | Name | Value |
   |------|-------|
   | `STRIPE_SECRET_KEY` | Your platform Stripe secret key |
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://ldwwiiiskujewcluclbx.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
6. Click "Deploy"

### Step 4: Test on Preview URL

After deployment, Vercel gives you a URL like:
```
https://gymsense-web-xxx.vercel.app
```

Test the pages:
- `https://gymsense-web-xxx.vercel.app/` - Landing page
- `https://gymsense-web-xxx.vercel.app/checkout/success` - Success page
- `https://gymsense-web-xxx.vercel.app/checkout/cancel` - Cancel page

---

## Phase 2: Transfer Domain to Vercel

### Option A: Full Domain Transfer (Recommended)

This moves the domain completely to Vercel as both registrar and DNS.

#### Step 1: Unlock Domain at Squarespace

1. Log into Squarespace
2. Go to **Settings → Domains → gymsense.io**
3. Click **Advanced Settings**
4. Turn off **Domain Lock**
5. Click **Transfer Away** or **Get Authorization Code**
6. Save the authorization/EPP code (you'll need this)

#### Step 2: Initiate Transfer in Vercel

1. Go to your Vercel dashboard
2. Click **Settings → Domains**
3. Click **Add** and enter `gymsense.io`
4. Select **Transfer In**
5. Enter the authorization code from Squarespace
6. Pay the transfer fee (~$15/year, includes 1 year renewal)
7. Confirm via email (check domain registrar email)

#### Step 3: Wait for Transfer

- Transfers typically take 5-7 days
- You'll receive email updates
- Domain continues working during transfer

#### Step 4: Verify and Configure

Once transferred:
1. Go to Vercel → Settings → Domains
2. Click on `gymsense.io`
3. Verify it shows "Valid Configuration"
4. Add `www.gymsense.io` as a redirect to `gymsense.io`

---

### Option B: Keep Squarespace as Registrar (DNS Only)

If you want to keep Squarespace as registrar but use Vercel for hosting:

#### Step 1: Get Vercel's DNS Records

In Vercel, add the domain and Vercel will show you required DNS records:
```
A Record:     76.76.21.21
CNAME Record: cname.vercel-dns.com
```

#### Step 2: Update DNS at Squarespace

1. Log into Squarespace
2. Go to **Settings → Domains → gymsense.io → DNS Settings**
3. Remove existing records
4. Add:
   | Type | Host | Value | TTL |
   |------|------|-------|-----|
   | A | @ | 76.76.21.21 | 3600 |
   | CNAME | www | cname.vercel-dns.com | 3600 |

5. Save changes

#### Step 3: Verify in Vercel

1. Go back to Vercel → Settings → Domains
2. Wait for verification (can take up to 48 hours)
3. Once verified, SSL certificate is automatically provisioned

---

## Phase 3: Update Checkout URLs

After the domain is live, update the checkout redirect URLs in your apps.

### Update Edge Function

In `gymsense-v1/supabase/functions/create-guest-checkout/index.ts`, the URLs should be:

```typescript
success_url: 'https://gymsense.io/checkout/success?session_id={CHECKOUT_SESSION_ID}',
cancel_url: 'https://gymsense.io/checkout/cancel',
```

### Update Test Scripts

Search and replace in test scripts:
```bash
# From
https://pay.gymsense.app/success

# To
https://gymsense.io/checkout/success
```

### Update GuestCheckoutQR Component

The QR code checkout URLs in the Pro app should point to:
```typescript
successUrl: 'https://gymsense.io/checkout/success?session_id={CHECKOUT_SESSION_ID}',
cancelUrl: 'https://gymsense.io/checkout/cancel',
```

---

## Verification Checklist

After migration is complete:

- [ ] `gymsense.io` loads the landing page
- [ ] `gymsense.io/checkout/success` shows success page
- [ ] `gymsense.io/checkout/cancel` shows cancel page
- [ ] SSL certificate is valid (green padlock)
- [ ] `www.gymsense.io` redirects to `gymsense.io`
- [ ] Test a real checkout flow end-to-end

---

## Rollback Plan

If something goes wrong:

1. **DNS not propagated yet**: Wait up to 48 hours
2. **Wrong DNS records**: Update at registrar (Vercel or Squarespace)
3. **Transfer stuck**: Contact Vercel support at support@vercel.com

---

## Timeline Summary

| Step | Duration |
|------|----------|
| Deploy to Vercel | 5 minutes |
| Test preview URL | 10 minutes |
| Initiate domain transfer | 10 minutes |
| Transfer completion | 5-7 days |
| DNS propagation | Up to 48 hours |
| **Total** | **~1 week** |

---

## Support

- **Vercel**: [vercel.com/support](https://vercel.com/support)
- **Squarespace**: [support.squarespace.com](https://support.squarespace.com)
- **Stripe**: [support.stripe.com](https://support.stripe.com)

