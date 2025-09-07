# 🚀 Aurence Marketplace Setup Guide

## Quick Setup (Recommended)

Since we're having some shell issues, here's a manual setup process:

### Step 1: Reset Database
```bash
# Remove existing database and migrations
rm -rf prisma/dev.db
rm -rf prisma/migrations

# Generate Prisma client
npx prisma generate

# Create and apply migration
npx prisma migrate dev --name init

# Seed the database
npm run prisma:seed
```

### Step 2: Start Development Server
```bash
npm run dev
```

### Step 3: Test the Application
1. Open http://localhost:3000
2. Sign up as a creator or brand
3. Complete onboarding
4. Explore the marketplace features

## Alternative: Use the Reset Script
```bash
node reset-db.js
```

## 🎯 What You'll Get

### For Creators:
- Browse and filter campaigns
- Apply to campaigns with custom messages
- Track application status
- Message with brands
- Manage profile and social media

### For Brands:
- Post new campaigns
- Review and manage applications
- Accept/reject creator applications
- Message with creators
- Track campaign performance

## 🔐 Test Accounts (After Seeding)
- **Brand**: brand@example.com / password123
- **Creator**: creator@example.com / password123

## 📱 Features Implemented
- ✅ Role-based authentication
- ✅ Profile management
- ✅ Campaign creation and browsing
- ✅ Application system
- ✅ Real-time messaging
- ✅ Responsive dark theme
- ✅ Complete API endpoints

## 🎨 Design
- Consistent dark theme throughout
- Modern SaaS layout
- Professional UI components
- Mobile-responsive design

The application is now a complete influencer-brand marketplace MVP ready for testing and further development!
