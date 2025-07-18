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

    // Obtener productos con stock bajo
    const lowStockProducts = await prisma.product.findMany({
      where: {
        active: true,
        stock: {
          lte: prisma.product.fields.minStock
        }
      },
      include: {
        category: true,
      },
      orderBy: {
        stock: 'asc'
      }
    });

    // Obtener productos más vistos en los últimos 30 días
    const topViewedProducts = await prisma.product.findMany({
      where: {
        active: true,
        views: {
          gt: 0
        }
      },
      include: {
        category: true,
      },
      orderBy: {
        views: 'desc'
      },
      take: 10
    });

    // Obtener productos sin stock
    const outOfStockProducts = await prisma.product.findMany({
      where: {
        active: true,
        stock: 0
      },
      include: {
        category: true,
      }
    });

    // Estadísticas generales
    const totalProducts = await prisma.product.count({
      where: { active: true }
    });

    const totalLowStock = lowStockProducts.length;
    const totalOutOfStock = outOfStockProducts.length;
    const totalValue = await prisma.product.aggregate({
      where: { active: true },
      _sum: {
        price: true
      }
    });

    return NextResponse.json({
      alerts: {
        lowStock: lowStockProducts,
        outOfStock: outOfStockProducts,
        topViewed: topViewedProducts
      },
      stats: {
        totalProducts,
        totalLowStock,
        totalOutOfStock,
        totalValue: totalValue._sum.price || 0
      }
    });
  } catch (error) {
    console.error('Error obteniendo alertas de inventario:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
} 