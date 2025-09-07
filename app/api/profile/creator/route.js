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

    const { bio, niche, socials, followerCount, profilePicture } = await request.json();

    // Check if user is a creator
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== 'CREATOR') {
      return NextResponse.json({ error: 'User must be a creator' }, { status: 400 });
    }

    // Create or update creator profile
    const creatorProfile = await prisma.creatorProfile.upsert({
      where: { userId },
      update: {
        bio,
        niche,
        socials,
        followerCount,
        profilePicture,
        isComplete: true,
      },
      create: {
        userId,
        bio,
        niche,
        socials,
        followerCount,
        profilePicture,
        isComplete: true,
      },
    });

    return NextResponse.json({ 
      message: 'Creator profile created successfully',
      profile: creatorProfile 
    }, { status: 201 });

  } catch (error) {
    console.error('Creator profile creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
