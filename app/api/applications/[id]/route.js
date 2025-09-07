import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function PATCH(request, { params }) {
  try {
    // Get token from cookie
    const token = request.cookies.get('authToken')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    const { id } = params;
    const { action } = await request.json();

    if (!['accept', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Get the application
    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        campaign: true,
        creator: true,
      },
    });

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Check if user is the brand owner of the campaign
    if (application.campaign.brandId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Update application status
    const newStatus = action === 'accept' ? 'ACCEPTED' : 'REJECTED';
    
    const updatedApplication = await prisma.application.update({
      where: { id },
      data: { status: newStatus },
      include: {
        creator: {
          include: {
            creatorProfile: true,
          },
        },
        campaign: {
          include: {
            brand: {
              include: {
                brandProfile: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ 
      message: `Application ${action}ed successfully`,
      application: updatedApplication 
    });

  } catch (error) {
    console.error('Application update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
