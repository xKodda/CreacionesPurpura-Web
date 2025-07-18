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
const next_1 = require("next-auth/next");
const authOptions_1 = require("@/lib/authOptions");
const prisma_1 = __importDefault(require("@/lib/prisma"));
// Crear nueva orden
function POST(req) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const session = yield (0, next_1.getServerSession)(authOptions_1.authOptions);
            if (!((_a = session === null || session === void 0 ? void 0 : session.user) === null || _a === void 0 ? void 0 : _a.email)) {
                return server_1.NextResponse.json({ error: 'No autorizado' }, { status: 401 });
            }
            const body = yield req.json();
            const { items, total, customerData, webpayOrderId, status = 'pending' } = body;
            // Validar datos requeridos
            if (!items || !Array.isArray(items) || items.length === 0) {
                return server_1.NextResponse.json({ error: 'Items de la orden son requeridos' }, { status: 400 });
            }
            if (!total || total <= 0) {
                return server_1.NextResponse.json({ error: 'Total de la orden debe ser mayor a 0' }, { status: 400 });
            }
            if (!customerData) {
                return server_1.NextResponse.json({ error: 'Datos del cliente son requeridos' }, { status: 400 });
            }
            // Obtener usuario
            const user = yield prisma_1.default.user.findUnique({
                where: { email: session.user.email }
            });
            if (!user) {
                return server_1.NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
            }
            // Verificar stock disponible
            for (const item of items) {
                const product = yield prisma_1.default.product.findUnique({
                    where: { id: item.productId }
                });
                if (!product) {
                    return server_1.NextResponse.json({
                        error: `Producto ${item.name} no encontrado`
                    }, { status: 404 });
                }
                if (product.stock < item.quantity) {
                    return server_1.NextResponse.json({
                        error: `Stock insuficiente para ${product.name}. Disponible: ${product.stock}`
                    }, { status: 400 });
                }
            }
            // Crear la orden con transacción
            const order = yield prisma_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                // Crear la orden con datos del cliente
                const newOrder = yield tx.order.create({
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
                    const product = yield tx.product.findUnique({
                        where: { id: item.productId }
                    });
                    if (product) {
                        const newStock = product.stock - item.quantity;
                        yield tx.product.update({
                            where: { id: item.productId },
                            data: { stock: newStock }
                        });
                        // Registrar cambio en historial
                        yield tx.stockHistory.create({
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
            }));
            console.log('✅ Orden creada exitosamente:', order.id);
            return server_1.NextResponse.json({
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
        }
        catch (error) {
            console.error('❌ Error creando orden:', error);
            return server_1.NextResponse.json({
                error: 'Error interno del servidor'
            }, { status: 500 });
        }
    });
}
// Obtener órdenes del usuario
function GET(req) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const session = yield (0, next_1.getServerSession)(authOptions_1.authOptions);
            if (!((_a = session === null || session === void 0 ? void 0 : session.user) === null || _a === void 0 ? void 0 : _a.email)) {
                return server_1.NextResponse.json({ error: 'No autorizado' }, { status: 401 });
            }
            const { searchParams } = new URL(req.url);
            const status = searchParams.get('status');
            const limit = parseInt(searchParams.get('limit') || '10');
            const page = parseInt(searchParams.get('page') || '1');
            const skip = (page - 1) * limit;
            // Obtener usuario
            const user = yield prisma_1.default.user.findUnique({
                where: { email: session.user.email }
            });
            if (!user) {
                return server_1.NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
            }
            // Construir filtros
            const whereClause = { userId: user.id };
            if (status) {
                whereClause.status = status;
            }
            // Obtener órdenes
            const orders = yield prisma_1.default.order.findMany({
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
            const total = yield prisma_1.default.order.count({
                where: whereClause
            });
            return server_1.NextResponse.json({
                orders,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            });
        }
        catch (error) {
            console.error('❌ Error obteniendo órdenes:', error);
            return server_1.NextResponse.json({
                error: 'Error interno del servidor'
            }, { status: 500 });
        }
    });
}
