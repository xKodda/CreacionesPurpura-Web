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
const server_1 = require("next/server");
const next_1 = require("next-auth/next");
const authOptions_1 = require("@/lib/authOptions");
const prisma_1 = __importDefault(require("@/lib/prisma"));
function GET(req) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const session = yield (0, next_1.getServerSession)(authOptions_1.authOptions);
            if (!((_a = session === null || session === void 0 ? void 0 : session.user) === null || _a === void 0 ? void 0 : _a.email)) {
                return server_1.NextResponse.json({ error: 'No autorizado' }, { status: 401 });
            }
            // Obtener productos con stock bajo
            const lowStockProducts = yield prisma_1.default.product.findMany({
                where: {
                    active: true,
                    stock: {
                        lte: prisma_1.default.product.fields.minStock
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
            const topViewedProducts = yield prisma_1.default.product.findMany({
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
            const outOfStockProducts = yield prisma_1.default.product.findMany({
                where: {
                    active: true,
                    stock: 0
                },
                include: {
                    category: true,
                }
            });
            // Estadísticas generales
            const totalProducts = yield prisma_1.default.product.count({
                where: { active: true }
            });
            const totalLowStock = lowStockProducts.length;
            const totalOutOfStock = outOfStockProducts.length;
            const totalValue = yield prisma_1.default.product.aggregate({
                where: { active: true },
                _sum: {
                    price: true
                }
            });
            return server_1.NextResponse.json({
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
        }
        catch (error) {
            console.error('Error obteniendo alertas de inventario:', error);
            return server_1.NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
        }
    });
}
