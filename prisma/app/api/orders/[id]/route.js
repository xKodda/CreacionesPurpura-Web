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
exports.PUT = PUT;
exports.GET = GET;
const server_1 = require("next/server");
const next_1 = require("next-auth/next");
const authOptions_1 = require("@/lib/authOptions");
const prisma_1 = __importDefault(require("@/lib/prisma"));
const email_1 = __importDefault(require("@/services/email"));
// Actualizar estado de una orden
function PUT(req_1, _a) {
    return __awaiter(this, arguments, void 0, function* (req, { params }) {
        var _b;
        try {
            const session = yield (0, next_1.getServerSession)(authOptions_1.authOptions);
            if (!((_b = session === null || session === void 0 ? void 0 : session.user) === null || _b === void 0 ? void 0 : _b.email)) {
                return server_1.NextResponse.json({ error: 'No autorizado' }, { status: 401 });
            }
            const { id } = yield params;
            const body = yield req.json();
            const { status, webpayToken, webpayResponse } = body;
            // Validar estado válido
            const validStatuses = ['pending', 'paid', 'cancelled', 'shipped', 'delivered'];
            if (status && !validStatuses.includes(status)) {
                return server_1.NextResponse.json({
                    error: `Estado inválido. Estados válidos: ${validStatuses.join(', ')}`
                }, { status: 400 });
            }
            // Obtener usuario
            const user = yield prisma_1.default.user.findUnique({
                where: { email: session.user.email }
            });
            if (!user) {
                return server_1.NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
            }
            // Verificar que la orden existe y pertenece al usuario
            const existingOrder = yield prisma_1.default.order.findFirst({
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
                return server_1.NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 });
            }
            // Guardar el estado anterior para comparar
            const previousStatus = existingOrder.status;
            // Actualizar la orden
            const updatedOrder = yield prisma_1.default.order.update({
                where: { id: id },
                data: Object.assign(Object.assign({ status: status || existingOrder.status, updatedAt: new Date() }, (webpayToken && { webpayToken })), (webpayResponse && {
                    webpayStatus: webpayResponse.status,
                    webpayResponseCode: webpayResponse.response_code,
                    webpayAuthorizationCode: webpayResponse.authorization_code,
                    webpayPaymentType: webpayResponse.payment_type_code,
                    webpayInstallments: webpayResponse.installments_number,
                    webpayTransactionDate: new Date()
                })),
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
                    const emailResult = yield email_1.default.sendOrderConfirmation(emailData);
                    if (emailResult.success) {
                        console.log('✅ Email de confirmación enviado exitosamente');
                    }
                    else {
                        console.warn('⚠️ Error enviando email de confirmación:', emailResult.error);
                    }
                }
                catch (emailError) {
                    console.error('❌ Error en el proceso de envío de email:', emailError);
                    // No fallar la actualización de la orden por un error de email
                }
            }
            // Si el estado cambió a 'cancelled', restaurar stock
            if (status === 'cancelled' && previousStatus !== 'cancelled') {
                yield prisma_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    for (const item of existingOrder.items) {
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
                                    reason: 'Cancelación de orden',
                                    notes: `Orden ${id} cancelada`,
                                    createdBy: session.user.email
                                }
                            });
                        }
                    }
                }));
            }
            console.log(`✅ Orden ${id} actualizada a estado: ${status}`);
            return server_1.NextResponse.json({
                success: true,
                order: updatedOrder
            });
        }
        catch (error) {
            console.error('❌ Error actualizando orden:', error);
            return server_1.NextResponse.json({
                error: 'Error interno del servidor'
            }, { status: 500 });
        }
    });
}
// Obtener una orden específica
function GET(req_1, _a) {
    return __awaiter(this, arguments, void 0, function* (req, { params }) {
        var _b;
        try {
            const session = yield (0, next_1.getServerSession)(authOptions_1.authOptions);
            if (!((_b = session === null || session === void 0 ? void 0 : session.user) === null || _b === void 0 ? void 0 : _b.email)) {
                return server_1.NextResponse.json({ error: 'No autorizado' }, { status: 401 });
            }
            const { id } = yield params;
            // Obtener usuario
            const user = yield prisma_1.default.user.findUnique({
                where: { email: session.user.email }
            });
            if (!user) {
                return server_1.NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
            }
            // Obtener la orden
            const order = yield prisma_1.default.order.findFirst({
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
                return server_1.NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 });
            }
            return server_1.NextResponse.json({
                order
            });
        }
        catch (error) {
            console.error('❌ Error obteniendo orden:', error);
            return server_1.NextResponse.json({
                error: 'Error interno del servidor'
            }, { status: 500 });
        }
    });
}
