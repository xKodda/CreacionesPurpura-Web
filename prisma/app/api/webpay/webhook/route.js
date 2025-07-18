"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
exports.GET = GET;
const server_1 = require("next/server");
const prisma_1 = __importDefault(require("@/lib/prisma"));
// Webhook para recibir confirmaciones de WebPay
function POST(req) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const body = yield req.json();
            console.log('🔔 Webhook WebPay recibido:', body);
            // Extraer datos del webhook
            const { token_ws, buy_order, amount, status, response_code, authorization_code, payment_type_code, installments_number, installments_amount, transaction_date } = body;
            // Validar datos requeridos
            if (!token_ws || !buy_order || !status) {
                console.error('❌ Webhook WebPay: Datos incompletos');
                return server_1.NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
            }
            // Buscar la orden por el buy_order (webpayOrderId)
            const order = yield prisma_1.default.order.findFirst({
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
                return server_1.NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 });
            }
            // Determinar el nuevo estado basado en la respuesta de WebPay
            let newStatus = 'pending';
            if (status === 'AUTHORIZED' && response_code === 0) {
                newStatus = 'paid';
            }
            else if (status === 'FAILED' || response_code !== 0) {
                newStatus = 'cancelled';
            }
            // Actualizar el estado de la orden
            const updatedOrder = yield prisma_1.default.order.update({
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
                yield prisma_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    for (const item of order.items) {
                        const product = yield tx.product.findUnique({
                            where: { id: item.productId }
                        });
                        if (product) {
                            const restoredStock = product.stock + item.quantity;
                            yield tx.product.update({
                                where: { id: item.productId },
                                data: { stock: restoredStock }
                            });
                            // Registrar restauración en historial
                            yield tx.stockHistory.create({
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
                }));
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
            return server_1.NextResponse.json({
                success: true,
                message: 'Webhook procesado correctamente',
                orderId: order.id,
                status: newStatus
            });
        }
        catch (error) {
            console.error('❌ Error procesando webhook WebPay:', error);
            return server_1.NextResponse.json({
                error: 'Error interno del servidor'
            }, { status: 500 });
        }
    });
}
// GET para verificar que el webhook está funcionando
function GET() {
    return __awaiter(this, void 0, void 0, function* () {
        return server_1.NextResponse.json({
            message: 'Webhook WebPay está funcionando',
            timestamp: new Date().toISOString()
        });
    });
}
