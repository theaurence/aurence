#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Aurence Deployment Script');
console.log('============================\n');

// Check if .env.local exists
const envPath = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found!');
  console.log('Please create .env.local with your database URL and JWT secret.');
  console.log('See DEPLOYMENT.md for instructions.\n');
  process.exit(1);
}

// Check if DATABASE_URL is set
const envContent = fs.readFileSync(envPath, 'utf8');
if (!envContent.includes('DATABASE_URL=')) {
  console.log('❌ DATABASE_URL not found in .env.local!');
  console.log('Please add your cloud database URL.\n');
  process.exit(1);
}

console.log('✅ Environment variables found');
console.log('✅ Database configuration ready\n');

try {
  console.log('📦 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  console.log('🗄️  Pushing database schema...');
  execSync('npx prisma db push', { stdio: 'inherit' });
  
  console.log('🌱 Seeding database...');
  execSync('npx prisma db seed', { stdio: 'inherit' });
  
  console.log('\n✅ Database setup complete!');
  console.log('🚀 Ready for deployment to Vercel!');
  console.log('\nNext steps:');
  console.log('1. Run: vercel');
  console.log('2. Add environment variables in Vercel dashboard');
  console.log('3. Deploy to production');
  
} catch (error) {
  console.error('❌ Deployment preparation failed:', error.message);
  process.exit(1);
}
