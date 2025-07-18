import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import prisma from '@/lib/prisma';
import EmailService from '@/services/email';

// Actualizar estado de una orden
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status, webpayToken, webpayResponse } = body;

    // Validar estado válido
    const validStatuses = ['pending', 'paid', 'cancelled', 'shipped', 'delivered'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ 
        error: `Estado inválido. Estados válidos: ${validStatuses.join(', ')}` 
      }, { status: 400 });
    }

    // Obtener usuario
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Verificar que la orden existe y pertenece al usuario
    const existingOrder = await prisma.order.findFirst({
      where: {
        id: id,
        userId: user.id
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!existingOrder) {
      return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 });
    }

    // Guardar el estado anterior para comparar
    const previousStatus = existingOrder.status;

    // Actualizar la orden
    const updatedOrder = await prisma.order.update({
      where: { id: id },
      data: {
        status: status || existingOrder.status,
        updatedAt: new Date(),
        // Actualizar datos de WebPay si se proporcionan
        ...(webpayToken && { webpayToken }),
        ...(webpayResponse && {
          webpayStatus: webpayResponse.status,
          webpayResponseCode: webpayResponse.response_code,
          webpayAuthorizationCode: webpayResponse.authorization_code,
          webpayPaymentType: webpayResponse.payment_type_code,
          webpayInstallments: webpayResponse.installments_number,
          webpayTransactionDate: new Date()
        })
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    // Si el estado cambió a 'paid' y antes no estaba pagada, enviar email
    if (status === 'paid' && previousStatus !== 'paid') {
      try {
        const emailData = {
          orderId: updatedOrder.id,
          customerName: updatedOrder.customerName || 'Cliente',
          customerEmail: updatedOrder.customerEmail || '',
          total: updatedOrder.total,
          items: updatedOrder.items.map(item => ({
            name: item.product.name,
            quantity: item.quantity,
            price: item.price
          })),
          shippingAddress: updatedOrder.shippingAddress || '',
          shippingRegion: updatedOrder.shippingRegion || '',
          shippingComuna: updatedOrder.shippingComuna || '',
          orderDate: updatedOrder.createdAt.toLocaleDateString('es-CL')
        };

        console.log('📧 Enviando email de confirmación para orden:', updatedOrder.id);
        
        const emailResult = await EmailService.sendOrderConfirmation(emailData);
        
        if (emailResult.success) {
          console.log('✅ Email de confirmación enviado exitosamente');
        } else {
          console.warn('⚠️ Error enviando email de confirmación:', emailResult.error);
        }
      } catch (emailError) {
        console.error('❌ Error en el proceso de envío de email:', emailError);
        // No fallar la actualización de la orden por un error de email
      }
    }

    // Si el estado cambió a 'cancelled', restaurar stock
    if (status === 'cancelled' && previousStatus !== 'cancelled') {
      await prisma.$transaction(async (tx) => {
        for (const item of existingOrder.items) {
          const product = await tx.product.findUnique({
            where: { id: item.productId }
          });

          if (product) {
            const restoredStock = product.stock + item.quantity;
            
            await tx.product.update({
              where: { id: item.productId },
              data: { stock: restoredStock }
            });

            // Registrar restauración en historial
            await tx.stockHistory.create({
              data: {
                productId: item.productId,
                change: item.quantity,
                previousStock: product.stock,
                newStock: restoredStock,
                reason: 'Cancelación de orden',
                notes: `Orden ${id} cancelada`,
                createdBy: session.user.email
              }
            });
          }
        }
      });
    }

    console.log(`✅ Orden ${id} actualizada a estado: ${status}`);

    return NextResponse.json({
      success: true,
      order: updatedOrder
    });

  } catch (error) {
    console.error('❌ Error actualizando orden:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 });
  }
}

// Obtener una orden específica
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;

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
        id: id,
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
      order
    });

  } catch (error) {
    console.error('❌ Error obteniendo orden:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 });
  }
} 