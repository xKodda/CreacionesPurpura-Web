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
exports.POST = POST;
const server_1 = require("next/server");
const next_auth_1 = require("next-auth");
const authOptions_1 = require("@/lib/authOptions");
const prisma_1 = __importDefault(require("@/lib/prisma"));
function GET() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const categories = yield prisma_1.default.category.findMany({
                orderBy: { name: "asc" },
            });
            return server_1.NextResponse.json(categories);
        }
        catch (_a) {
            return server_1.NextResponse.json({ error: "Error al obtener categorías" }, { status: 500 });
        }
    });
}
function POST(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const session = yield (0, next_auth_1.getServerSession)(authOptions_1.authOptions);
        if (!session) {
            return server_1.NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }
        try {
            const { name, description } = yield req.json();
            if (!name) {
                return server_1.NextResponse.json({ error: "Nombre de categoría es obligatorio" }, { status: 400 });
            }
            const category = yield prisma_1.default.category.create({
                data: {
                    name,
                    description,
                },
            });
            return server_1.NextResponse.json(category, { status: 201 });
        }
        catch (_a) {
            return server_1.NextResponse.json({ error: "Error al crear categoría" }, { status: 500 });
        }
    });
}
