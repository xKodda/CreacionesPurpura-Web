import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import prisma from '@/lib/prisma';

// Crear nueva orden
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const { 
      items, 
      total, 
      customerData, 
      webpayOrderId,
      status = 'pending' 
    } = body;

    // Validar datos requeridos
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Items de la orden son requeridos' }, { status: 400 });
    }

    if (!total || total <= 0) {
      return NextResponse.json({ error: 'Total de la orden debe ser mayor a 0' }, { status: 400 });
    }

    if (!customerData) {
      return NextResponse.json({ error: 'Datos del cliente son requeridos' }, { status: 400 });
    }

    // Obtener usuario
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Verificar stock disponible
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });

      if (!product) {
        return NextResponse.json({ 
          error: `Producto ${item.name} no encontrado` 
        }, { status: 404 });
      }

      if (product.stock < item.quantity) {
        return NextResponse.json({ 
          error: `Stock insuficiente para ${product.name}. Disponible: ${product.stock}` 
        }, { status: 400 });
      }
    }

    // Crear la orden con transacción
    const order = await prisma.$transaction(async (tx) => {
      // Crear la orden con datos del cliente
      const newOrder = await tx.order.create({
        data: {
          userId: user.id,
          total: total,
          status: status,
          // Datos del cliente
          customerName: customerData.name,
          customerEmail: customerData.email,
          customerPhone: customerData.phone,
          shippingAddress: customerData.address,
          shippingRegion: customerData.region,
          shippingComuna: customerData.comuna,
          shippingPostalCode: customerData.postalCode,
          // Datos de WebPay
          webpayOrderId: webpayOrderId || null,
          items: {
            create: items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price
            }))
          }
        },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });

      // Actualizar stock de productos
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId }
        });

        if (product) {
          const newStock = product.stock - item.quantity;
          
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: newStock }
          });

          // Registrar cambio en historial
          await tx.stockHistory.create({
            data: {
              productId: item.productId,
              change: -item.quantity,
              previousStock: product.stock,
              newStock: newStock,
              reason: 'Venta',
              notes: `Orden ${newOrder.id}`,
              createdBy: session.user.email
            }
          });
        }
      }

      return newOrder;
    });

    console.log('✅ Orden creada exitosamente:', order.id);

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        total: order.total,
        status: order.status,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        items: order.items,
        createdAt: order.createdAt
      }
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Error creando orden:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 });
  }
}

// Obtener órdenes del usuario
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');

    const skip = (page - 1) * limit;

    // Obtener usuario
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Construir filtros
    const whereClause: any = { userId: user.id };
    if (status) {
      whereClause.status = status;
    }

    // Obtener órdenes
    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    });

    // Obtener total para paginación
    const total = await prisma.order.count({
      where: whereClause
    });

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('❌ Error obteniendo órdenes:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 });
  }
} 