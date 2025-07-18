import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  
  try {
    // Incrementar vistas y actualizar última vista
    const product = await prisma.product.update({
      where: { id },
      data: {
        views: {
          increment: 1
        },
        lastViewed: new Date()
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({ success: true, views: product.views });
  } catch (error) {
    console.error('Error incrementando vistas:', error);
    return NextResponse.json({ error: 'Error al actualizar vistas' }, { status: 500 });
  }
} 