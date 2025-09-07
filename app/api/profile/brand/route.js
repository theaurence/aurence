import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request) {
  try {
    // Get token from cookie
    const token = request.cookies.get('authToken')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    const { companyName, description, industry, budgetRange, logo } = await request.json();

    // Check if user is a brand
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== 'BRAND') {
      return NextResponse.json({ error: 'User must be a brand' }, { status: 400 });
    }

    // Create or update brand profile
    const brandProfile = await prisma.brandProfile.upsert({
      where: { userId },
      update: {
        companyName,
        description,
        industry,
        budgetRange,
        logo,
        isComplete: true,
      },
      create: {
        userId,
        companyName,
        description,
        industry,
        budgetRange,
        logo,
        isComplete: true,
      },
    });

    return NextResponse.json({ 
      message: 'Brand profile created successfully',
      profile: brandProfile 
    }, { status: 201 });

  } catch (error) {
    console.error('Brand profile creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
