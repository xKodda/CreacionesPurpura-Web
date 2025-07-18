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
exports.GET = GET;
exports.PUT = PUT;
exports.DELETE = DELETE;
const server_1 = require("next/server");
const next_1 = require("next-auth/next");
const authOptions_1 = require("@/lib/authOptions");
const prisma_1 = __importDefault(require("@/lib/prisma"));
function GET(req, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = yield context.params;
        try {
            const product = yield prisma_1.default.product.findUnique({
                where: { id },
                include: {
                    category: true,
                },
            });
            if (!product)
                return server_1.NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
            return server_1.NextResponse.json(product);
        }
        catch (_a) {
            return server_1.NextResponse.json({ error: 'Error al obtener el producto' }, { status: 500 });
        }
    });
}
function PUT(req, context) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const session = yield (0, next_1.getServerSession)(authOptions_1.authOptions);
        if (!session)
            return server_1.NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        const { id } = yield context.params;
        const data = yield req.json();
        try {
            // Obtener el producto actual para comparar stock
            const currentProduct = yield prisma_1.default.product.findUnique({
                where: { id }
            });
            if (!currentProduct) {
                return server_1.NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
            }
            // Calcular el cambio en stock
            const stockChange = parseInt(data.stock) - currentProduct.stock;
            const updated = yield prisma_1.default.product.update({
                where: { id },
                data: {
                    name: data.name,
                    description: data.description,
                    price: parseInt(data.price),
                    stock: parseInt(data.stock),
                    imageUrl: data.imageUrl,
                    categoryId: data.categoryId,
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
                yield prisma_1.default.stockHistory.create({
                    data: {
                        productId: id,
                        change: stockChange,
                        previousStock: currentProduct.stock,
                        newStock: parseInt(data.stock),
                        reason: stockChange > 0 ? 'Reposición manual' : 'Ajuste manual',
                        notes: `Actualizado por ${(_a = session.user) === null || _a === void 0 ? void 0 : _a.email}`,
                        createdBy: ((_b = session.user) === null || _b === void 0 ? void 0 : _b.email) || 'Sistema',
                    }
                });
            }
            return server_1.NextResponse.json(updated);
        }
        catch (error) {
            console.error('Error actualizando producto:', error);
            return server_1.NextResponse.json({ error: 'Error al actualizar el producto' }, { status: 500 });
        }
    });
}
function DELETE(req, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const session = yield (0, next_1.getServerSession)(authOptions_1.authOptions);
        if (!session)
            return server_1.NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        const { id } = yield context.params;
        try {
            yield prisma_1.default.product.delete({ where: { id } });
            return server_1.NextResponse.json({ success: true });
        }
        catch (_a) {
            return server_1.NextResponse.json({ error: 'Error al eliminar el producto' }, { status: 500 });
        }
    });
}
