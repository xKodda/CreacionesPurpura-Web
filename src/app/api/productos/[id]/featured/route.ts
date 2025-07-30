import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import prisma from '@/lib/prisma';

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  
  const { id } = await context.params;
  const { featured } = await req.json();
  
  try {
    // Verificar que el producto existe
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    // Actualizar solo el campo featured
    const updated = await prisma.product.update({
      where: { id },
      data: {
        featured: Boolean(featured)
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error actualizando featured:', error);
    return NextResponse.json({ error: 'Error al actualizar el producto' }, { status: 500 });
  }
} 