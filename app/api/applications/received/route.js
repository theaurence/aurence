import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function GET(request) {
  try {
    // Get token from cookie
    const token = request.cookies.get('authToken')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    // Get applications for user's campaigns
    const applications = await prisma.application.findMany({
      where: {
        campaign: {
          brandId: userId,
        },
      },
      include: {
        creator: {
          include: {
            creatorProfile: true,
          },
        },
        campaign: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(applications);

  } catch (error) {
    console.error('Received applications fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
