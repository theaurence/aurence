# ⚡ Quick Deploy Guide

## 🚨 IMPORTANT: Don't Deploy Yet!

Your current setup will **NOT work** on Vercel because:
- ❌ SQLite database won't work on serverless
- ❌ No cloud database configured
- ❌ Environment variables not set

## 🛠️ Quick Fix (5 minutes):

### Step 1: Get Free Cloud Database
1. Go to [planetscale.com](https://planetscale.com)
2. Sign up (free)
3. Create database "aurence"
4. Copy connection string

### Step 2: Create .env.local
```bash
# In your frontend folder, create .env.local:
DATABASE_URL="mysql://your-connection-string-here"
JWT_SECRET="your-super-secret-jwt-key"
NODE_ENV="development"
```

### Step 3: Update Database
```bash
cd frontend
npx prisma db push
npx prisma db seed
```

### Step 4: Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Step 5: Add Environment Variables in Vercel
- Go to your Vercel dashboard
- Project Settings → Environment Variables
- Add: DATABASE_URL, JWT_SECRET, NODE_ENV

## ✅ After This, Everything Will Work!

- ✅ Authentication
- ✅ Database persistence
- ✅ All API routes
- ✅ User profiles
- ✅ Collaboration features

## 🎯 What Your Friend Will See:

1. **Professional URL** like `https://aurence-xxx.vercel.app`
2. **Working login/signup** system
3. **Persistent data** (won't reset on refresh)
4. **Full platform** functionality

## 🚀 Ready to Deploy?

Run these commands:
```bash
cd frontend
npm run deploy:prepare
vercel
```

Then add environment variables in Vercel dashboard!

