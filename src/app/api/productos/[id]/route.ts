import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    const product = await prisma.product.findUnique({ 
      where: { id },
      include: {
        category: true,
      },
    });
    if (!product) return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: 'Error al obtener el producto' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  const { id } = await context.params;
  const data = await req.json();
  
  try {
    // Obtener el producto actual para comparar stock
    const currentProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!currentProduct) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    // Calcular el cambio en stock
    const stockChange = parseInt(data.stock) - currentProduct.stock;

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        price: parseInt(data.price),
        stock: parseInt(data.stock),
        imageUrl: data.imageUrl,
        categoryId: data.categoryId,
        featured: data.featured !== undefined ? Boolean(data.featured) : currentProduct.featured,
        minStock: data.minStock ? parseInt(data.minStock) : 5,
        maxStock: data.maxStock ? parseInt(data.maxStock) : null,
        sku: data.sku || null,
        barcode: data.barcode || null,
        weight: data.weight ? parseFloat(data.weight) : null,
        dimensions: data.dimensions || null,
      },
      include: {
        category: true,
      },
    });

    // Registrar el cambio en el historial si hubo cambio de stock
    if (stockChange !== 0) {
      await prisma.stockHistory.create({
        data: {
          productId: id,
          change: stockChange,
          previousStock: currentProduct.stock,
          newStock: parseInt(data.stock),
          reason: stockChange > 0 ? 'Reposición manual' : 'Ajuste manual',
          notes: `Actualizado por ${session.user?.email}`,
          createdBy: session.user?.email || 'Sistema',
        }
      });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error actualizando producto:', error);
    return NextResponse.json({ error: 'Error al actualizar el producto' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  const { id } = await context.params;
  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Error al eliminar el producto' }, { status: 500 });
  }
} 