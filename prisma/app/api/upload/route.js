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
const server_1 = require("next/server");
const next_auth_1 = require("next-auth");
const authOptions_1 = require("@/lib/authOptions");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const fs_1 = require("fs");
function POST(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const session = yield (0, next_auth_1.getServerSession)(authOptions_1.authOptions);
        if (!session) {
            return server_1.NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }
        try {
            const formData = yield req.formData();
            const file = formData.get("file");
            if (!file) {
                return server_1.NextResponse.json({ error: "No se proporcionó ningún archivo" }, { status: 400 });
            }
            // Validar tipo de archivo
            if (!file.type.startsWith("image/")) {
                return server_1.NextResponse.json({ error: "Solo se permiten archivos de imagen" }, { status: 400 });
            }
            // Validar tamaño (máximo 5MB)
            if (file.size > 5 * 1024 * 1024) {
                return server_1.NextResponse.json({ error: "El archivo es demasiado grande. Máximo 5MB" }, { status: 400 });
            }
            // Crear directorio si no existe
            const uploadDir = (0, path_1.join)(process.cwd(), "public", "uploads");
            if (!(0, fs_1.existsSync)(uploadDir)) {
                yield (0, promises_1.mkdir)(uploadDir, { recursive: true });
            }
            // Generar nombre único para el archivo
            const timestamp = Date.now();
            const randomString = Math.random().toString(36).substring(2, 15);
            const extension = file.name.split(".").pop();
            const fileName = `${timestamp}-${randomString}.${extension}`;
            const filePath = (0, path_1.join)(uploadDir, fileName);
            // Convertir File a Buffer y guardar
            const bytes = yield file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            yield (0, promises_1.writeFile)(filePath, buffer);
            // Devolver la URL relativa del archivo
            const imageUrl = `/uploads/${fileName}`;
            return server_1.NextResponse.json({
                success: true,
                imageUrl,
                fileName
            }, { status: 201 });
        }
        catch (error) {
            console.error("Error al subir archivo:", error);
            return server_1.NextResponse.json({ error: "Error al subir el archivo" }, { status: 500 });
        }
    });
}
