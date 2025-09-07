# 🚀 Aurence Deployment Guide

## Prerequisites for Vercel Deployment

### 1. Set up Cloud Database (Required)

**Option A: PlanetScale (Recommended - Free)**
1. Go to [planetscale.com](https://planetscale.com)
2. Sign up for free account
3. Create new database called "aurence"
4. Get connection string from "Connect" tab
5. Copy the connection string

**Option B: Supabase (Alternative)**
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → Database
4. Copy the connection string

### 2. Environment Variables for Vercel

In your Vercel dashboard, add these environment variables:

```
DATABASE_URL=mysql://username:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=production
```

### 3. Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel

# Follow prompts:
# - Link to existing project or create new
# - Deploy to production
```

### 4. Run Database Migrations

After deployment, run:
```bash
vercel env pull .env.local
npx prisma db push
npx prisma db seed
```

## What Works After Deployment

✅ **Authentication** - Login/signup/logout  
✅ **User Profiles** - Brand and creator profiles  
✅ **Database** - Persistent data storage  
✅ **API Routes** - All backend functionality  
✅ **Responsive Design** - Works on mobile/desktop  

## What Still Needs Work

❌ **File Uploads** - Need to add cloud storage (AWS S3, Cloudinary)  
❌ **Email Notifications** - Need email service (SendGrid, Resend)  
❌ **Payment Processing** - Need Stripe integration  
❌ **Real-time Features** - Need WebSocket or Pusher  

## Testing Your Deployment

1. **Visit your Vercel URL**
2. **Sign up** as a new user
3. **Login** with demo accounts:
   - Brand: `brand@example.com` / `password123`
   - Creator: `creator@example.com` / `password123`
4. **Test all features** work properly

## Troubleshooting

**Database Connection Issues:**
- Check DATABASE_URL format
- Ensure database is accessible from Vercel
- Run `npx prisma db push` to sync schema

**Authentication Issues:**
- Verify JWT_SECRET is set
- Check cookie settings in production

**Build Errors:**
- Check all imports are correct
- Verify environment variables are set
- Check Prisma client generation
