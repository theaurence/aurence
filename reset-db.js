const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔄 Resetting database...');

try {
  // Remove existing database file
  const dbPath = path.join(__dirname, 'prisma', 'dev.db');
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    console.log('✅ Removed existing database file');
  }

  // Remove existing migrations
  const migrationsPath = path.join(__dirname, 'prisma', 'migrations');
  if (fs.existsSync(migrationsPath)) {
    fs.rmSync(migrationsPath, { recursive: true, force: true });
    console.log('✅ Removed existing migrations');
  }

  // Generate Prisma client
  console.log('🔧 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  // Create and apply migration
  console.log('📦 Creating and applying migration...');
  execSync('npx prisma migrate dev --name init', { stdio: 'inherit' });

  // Seed the database
  console.log('🌱 Seeding database...');
  execSync('npm run prisma:seed', { stdio: 'inherit' });

  console.log('🎉 Database reset complete!');
  console.log('🚀 You can now run: npm run dev');

} catch (error) {
  console.error('❌ Error resetting database:', error.message);
  process.exit(1);
}
