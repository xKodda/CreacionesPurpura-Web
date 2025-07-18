import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Webhook para recibir confirmaciones de WebPay
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('🔔 Webhook WebPay recibido:', body);

    // Extraer datos del webhook
    const {
      token_ws,
      buy_order,
      amount,
      status,
      response_code,
      authorization_code,
      payment_type_code,
      installments_number,
      installments_amount,
      transaction_date
    } = body;

    // Validar datos requeridos
    if (!token_ws || !buy_order || !status) {
      console.error('❌ Webhook WebPay: Datos incompletos');
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
    }

    // Buscar la orden por el buy_order (webpayOrderId)
    const order = await prisma.order.findFirst({
      where: {
        // Aquí necesitarías mapear el buy_order con tu orden
        // Por ahora, buscaremos por el ID que coincida
        id: buy_order
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!order) {
      console.error(`❌ Webhook WebPay: Orden no encontrada para buy_order: ${buy_order}`);
      return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 });
    }

    // Determinar el nuevo estado basado en la respuesta de WebPay
    let newStatus = 'pending';
    
    if (status === 'AUTHORIZED' && response_code === 0) {
      newStatus = 'paid';
    } else if (status === 'FAILED' || response_code !== 0) {
      newStatus = 'cancelled';
    }

    // Actualizar el estado de la orden
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        status: newStatus,
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

    // Si el pago falló, restaurar el stock
    if (newStatus === 'cancelled' && order.status !== 'cancelled') {
      await prisma.$transaction(async (tx) => {
        for (const item of order.items) {
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
                reason: 'Pago fallido WebPay',
                notes: `Webhook: ${buy_order} - ${status}`,
                createdBy: 'WebPay Webhook'
              }
            });
          }
        }
      });
    }

    // Log de la transacción
    console.log(`✅ Webhook WebPay procesado:`, {
      orderId: order.id,
      buyOrder: buy_order,
      token: token_ws,
      status: status,
      newOrderStatus: newStatus,
      amount: amount,
      responseCode: response_code
    });

    // Responder a WebPay
    return NextResponse.json({
      success: true,
      message: 'Webhook procesado correctamente',
      orderId: order.id,
      status: newStatus
    });

  } catch (error) {
    console.error('❌ Error procesando webhook WebPay:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 });
  }
}

// GET para verificar que el webhook está funcionando
export async function GET() {
  return NextResponse.json({
    message: 'Webhook WebPay está funcionando',
    timestamp: new Date().toISOString()
  });
} 