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
            const { searchParams } = new URL(req.url);
            const productId = searchParams.get('productId');
            const limit = parseInt(searchParams.get('limit') || '50');
            const page = parseInt(searchParams.get('page') || '1');
            const skip = (page - 1) * limit;
            // Construir la consulta base
            const whereClause = productId ? { productId } : {};
            // Obtener historial de stock
            const history = yield prisma_1.default.stockHistory.findMany({
                where: whereClause,
                include: {
                    product: {
                        include: {
                            category: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip,
                take: limit
            });
            // Obtener total de registros para paginación
            const total = yield prisma_1.default.stockHistory.count({
                where: whereClause
            });
            return server_1.NextResponse.json({
                history,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            });
        }
        catch (error) {
            console.error('Error obteniendo historial de stock:', error);
            return server_1.NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
        }
    });
}
