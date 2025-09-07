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

    // Get all active campaigns with brand info
    const campaigns = await prisma.campaign.findMany({
      where: {
        status: 'ACTIVE',
      },
      include: {
        brand: {
          include: {
            brandProfile: true,
          },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(campaigns);

  } catch (error) {
    console.error('Campaigns fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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

    const { title, description, budget, category, deadline } = await request.json();

    // Check if user is a brand
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== 'BRAND') {
      return NextResponse.json({ error: 'Only brands can create campaigns' }, { status: 403 });
    }

    // Create campaign
    const campaign = await prisma.campaign.create({
      data: {
        title,
        description,
        budget: parseInt(budget),
        category,
        deadline: deadline ? new Date(deadline) : null,
        brandId: userId,
      },
      include: {
        brand: {
          include: {
            brandProfile: true,
          },
        },
      },
    });

    return NextResponse.json({ 
      message: 'Campaign created successfully',
      campaign 
    }, { status: 201 });

  } catch (error) {
    console.error('Campaign creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
