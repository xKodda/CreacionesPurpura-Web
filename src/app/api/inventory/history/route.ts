import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');

    const skip = (page - 1) * limit;

    // Construir la consulta base
    const whereClause = productId ? { productId } : {};

    // Obtener historial de stock
    const history = await prisma.stockHistory.findMany({
      where: whereClause,
      include: {
        product: {
          include: {
            category: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    });

    // Obtener total de registros para paginación
    const total = await prisma.stockHistory.count({
      where: whereClause
    });

    return NextResponse.json({
      history,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error obteniendo historial de stock:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
} 