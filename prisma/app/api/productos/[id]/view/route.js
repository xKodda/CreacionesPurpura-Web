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
const server_1 = require("next/server");
const prisma_1 = __importDefault(require("@/lib/prisma"));
function POST(req, context) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = yield context.params;
        try {
            // Incrementar vistas y actualizar última vista
            const product = yield prisma_1.default.product.update({
                where: { id },
                data: {
                    views: {
                        increment: 1
                    },
                    lastViewed: new Date()
                },
                include: {
                    category: true,
                },
            });
            return server_1.NextResponse.json({ success: true, views: product.views });
        }
        catch (error) {
            console.error('Error incrementando vistas:', error);
            return server_1.NextResponse.json({ error: 'Error al actualizar vistas' }, { status: 500 });
        }
    });
}
