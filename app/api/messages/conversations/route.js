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

    // Get conversations (users who have sent or received messages)
    const conversations = await prisma.user.findMany({
      where: {
        OR: [
          {
            sentMessages: {
              some: {
                receiverId: userId,
              },
            },
          },
          {
            receivedMessages: {
              some: {
                senderId: userId,
              },
            },
          },
        ],
        NOT: {
          id: userId,
        },
      },
      include: {
        brandProfile: true,
        creatorProfile: true,
        sentMessages: {
          where: {
            receiverId: userId,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
        receivedMessages: {
          where: {
            senderId: userId,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });

    // Format conversations with last message
    const formattedConversations = conversations.map(user => {
      const sentMessage = user.sentMessages[0];
      const receivedMessage = user.receivedMessages[0];
      
      let lastMessage = null;
      if (sentMessage && receivedMessage) {
        lastMessage = sentMessage.createdAt > receivedMessage.createdAt ? sentMessage : receivedMessage;
      } else if (sentMessage) {
        lastMessage = sentMessage;
      } else if (receivedMessage) {
        lastMessage = receivedMessage;
      }

      return {
        id: user.id,
        name: user.role === 'BRAND' 
          ? (user.brandProfile?.companyName || user.name)
          : user.name,
        role: user.role,
        lastMessage: lastMessage,
      };
    });

    // Sort by last message time
    formattedConversations.sort((a, b) => {
      if (!a.lastMessage && !b.lastMessage) return 0;
      if (!a.lastMessage) return 1;
      if (!b.lastMessage) return -1;
      return new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt);
    });

    return NextResponse.json(formattedConversations);

  } catch (error) {
    console.error('Conversations fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
