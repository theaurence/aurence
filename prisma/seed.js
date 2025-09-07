import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);

  // Clear existing data
  await prisma.message.deleteMany();
  await prisma.application.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.creatorProfile.deleteMany();
  await prisma.brandProfile.deleteMany();
  await prisma.user.deleteMany();

  // Create brand user with profile
  const brandUser = await prisma.user.create({
    data: {
      name: 'Sarah Johnson',
      email: 'brand@example.com',
      passwordHash,
      role: 'BRAND',
    },
  });

  await prisma.brandProfile.create({
    data: {
      userId: brandUser.id,
      companyName: 'GlowSkin Co.',
      description: 'Premium skincare brand focused on natural ingredients',
      industry: 'Beauty & Skincare',
      budgetRange: '$1,000 - $5,000',
      isComplete: true,
    },
  });

  // Create creator user with profile
  const creatorUser = await prisma.user.create({
    data: {
      name: 'Alex Rivera',
      email: 'creator@example.com',
      passwordHash,
      role: 'CREATOR',
    },
  });

  await prisma.creatorProfile.create({
    data: {
      userId: creatorUser.id,
      bio: 'Lifestyle content creator passionate about beauty, wellness, and sustainable living',
      niche: 'Lifestyle & Beauty',
      socials: JSON.stringify({
        instagram: '@alexrivera',
        tiktok: '@alexrivera',
        youtube: 'Alex Rivera'
      }),
      followerCount: 50000,
      isComplete: true,
    },
  });

  // Create sample campaigns
  const campaign1 = await prisma.campaign.create({
    data: {
      title: 'Summer Skincare Launch',
      description: 'Promote our new summer skincare collection featuring SPF protection and hydrating serums. Looking for creators who can showcase the products in their daily routine.',
      budget: 2500,
      category: 'Beauty & Skincare',
      deadline: new Date('2024-08-15'),
      status: 'ACTIVE',
      brandId: brandUser.id,
    },
  });

  const campaign2 = await prisma.campaign.create({
    data: {
      title: 'Wellness Wednesday Series',
      description: 'Create content around wellness and self-care routines. We want authentic stories about mental health and wellness practices.',
      budget: 1500,
      category: 'Health & Wellness',
      deadline: new Date('2024-07-30'),
      status: 'ACTIVE',
      brandId: brandUser.id,
    },
  });

  // Create sample application
  await prisma.application.create({
    data: {
      creatorId: creatorUser.id,
      campaignId: campaign1.id,
      status: 'PENDING',
      message: 'Hi! I\'d love to collaborate on your summer skincare launch. I have a strong following in the beauty space and can create authentic content showcasing your products.',
    },
  });

  // Create sample messages
  await prisma.message.create({
    data: {
      senderId: brandUser.id,
      receiverId: creatorUser.id,
      content: 'Hi Alex! Thanks for your interest in our summer campaign. We\'d love to learn more about your content style.',
    },
  });

  await prisma.message.create({
    data: {
      senderId: creatorUser.id,
      receiverId: brandUser.id,
      content: 'Thank you for reaching out! I typically create lifestyle content with a focus on natural beauty and wellness. I can share some examples of my recent work.',
    },
  });

  console.log('Seed data created successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });


