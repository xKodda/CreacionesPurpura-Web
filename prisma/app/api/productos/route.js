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
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
exports.GET = GET;
const server_1 = require("next/server");
const next_auth_1 = require("next-auth");
const authOptions_1 = require("@/lib/authOptions");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function POST(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const session = yield (0, next_auth_1.getServerSession)(authOptions_1.authOptions);
        if (!session) {
            return server_1.NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }
        try {
            const { name, description, price, stock, imageUrl, categoryId } = yield req.json();
            if (!name || !price || !stock || !categoryId) {
                return server_1.NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
            }
            const product = yield prisma.product.create({
                data: {
                    name,
                    description,
                    price,
                    stock,
                    imageUrl,
                    categoryId,
                },
                include: {
                    category: true,
                },
            });
            return server_1.NextResponse.json(product, { status: 201 });
        }
        catch (_a) {
            return server_1.NextResponse.json({ error: "Error al crear producto" }, { status: 500 });
        }
    });
}
function GET() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const products = yield prisma.product.findMany({
                include: {
                    category: true,
                    images: true,
                },
                orderBy: { createdAt: "desc" },
            });
            return server_1.NextResponse.json(products);
        }
        catch (_a) {
            return server_1.NextResponse.json({ error: "Error al obtener productos" }, { status: 500 });
        }
    });
}
