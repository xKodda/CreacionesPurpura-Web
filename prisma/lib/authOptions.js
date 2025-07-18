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
exports.authOptions = void 0;
const credentials_1 = __importDefault(require("next-auth/providers/credentials"));
const client_1 = require("@prisma/client");
const bcryptjs_1 = require("bcryptjs");
const prisma = new client_1.PrismaClient();
exports.authOptions = {
    providers: [
        (0, credentials_1.default)({
            name: "Email y contraseña",
            credentials: {
                email: { label: "Correo", type: "email", placeholder: "correo@empresa.cl" },
                password: { label: "Contraseña", type: "password" },
            },
            authorize(credentials) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (!(credentials === null || credentials === void 0 ? void 0 : credentials.email) || !(credentials === null || credentials === void 0 ? void 0 : credentials.password)) {
                        throw new Error("Correo y contraseña requeridos");
                    }
                    // Buscar usuario por email
                    const user = yield prisma.user.findUnique({ where: { email: credentials.email } });
                    if (!user || !user.password) {
                        throw new Error("Usuario no autorizado");
                    }
                    // Comparar contraseña (en producción debe estar hasheada)
                    const isValid = yield (0, bcryptjs_1.compare)(credentials.password, user.password);
                    if (!isValid) {
                        throw new Error("Contraseña incorrecta");
                    }
                    return { id: user.id, name: user.name, email: user.email, role: user.role };
                });
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        jwt(_a) {
            return __awaiter(this, arguments, void 0, function* ({ token, user }) {
                if (user) {
                    token.role = user.role;
                }
                return token;
            });
        },
        session(_a) {
            return __awaiter(this, arguments, void 0, function* ({ session, token }) {
                if (token && session.user) {
                    session.user.role = token.role;
                }
                return session;
            });
        },
    },
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
