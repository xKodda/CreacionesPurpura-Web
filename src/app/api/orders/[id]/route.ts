import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import prisma from '@/lib/prisma';
import EmailService from '@/services/email';

// Actualizar orden específica
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id: orderId } = await params;
    const body = await req.json();
    const { 
      status, 
      webpayToken, 
      webpayOrderId,
      webpayStatus,
      webpayResponseCode,
      webpayAuthorizationCode,
      webpayPaymentType,
      webpayInstallments,
      webpayTransactionDate,
      notes 
    } = body;

    // Obtener usuario
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Verificar que la orden pertenece al usuario
    const existingOrder = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: user.id
      }
    });

    if (!existingOrder) {
      return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 });
    }

    // Actualizar la orden
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: status || existingOrder.status,
        webpayToken: webpayToken || existingOrder.webpayToken,
        webpayOrderId: webpayOrderId || existingOrder.webpayOrderId,
        webpayStatus: webpayStatus || existingOrder.webpayStatus,
        webpayResponseCode: webpayResponseCode || existingOrder.webpayResponseCode,
        webpayAuthorizationCode: webpayAuthorizationCode || existingOrder.webpayAuthorizationCode,
        webpayPaymentType: webpayPaymentType || existingOrder.webpayPaymentType,
        webpayInstallments: webpayInstallments || existingOrder.webpayInstallments,
        webpayTransactionDate: webpayTransactionDate || existingOrder.webpayTransactionDate,
        notes: notes || existingOrder.notes,
        updatedAt: new Date()
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    console.log('✅ Orden actualizada exitosamente:', orderId);

    return NextResponse.json({
      success: true,
      order: {
        id: updatedOrder.id,
        status: updatedOrder.status,
        total: updatedOrder.total,
        webpayToken: updatedOrder.webpayToken,
        webpayOrderId: updatedOrder.webpayOrderId,
        updatedAt: updatedOrder.updatedAt
      }
    });

  } catch (error) {
    console.error('❌ Error actualizando orden:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 });
  }
}

// Obtener orden específica
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id: orderId } = await params;

    // Obtener usuario
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Obtener la orden
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: user.id
      },
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
      }
    });

    if (!order) {
      return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      order
    });

  } catch (error) {
    console.error('❌ Error obteniendo orden:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 });
  }
} 