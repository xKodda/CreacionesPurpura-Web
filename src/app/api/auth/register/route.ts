import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Validaciones
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 }
      );
    }

    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Ya existe una cuenta con este correo electrónico" },
        { status: 400 }
      );
    }

    // Verificar que no se esté intentando registrar como admin
    if (email.toLowerCase() === "creacionespurpura.papeleria@gmail.com") {
      return NextResponse.json(
        { message: "No se puede registrar con este correo electrónico" },
        { status: 400 }
      );
    }

    // Hash de la contraseña
    const hashedPassword = await hash(password, 10);

    // Crear el usuario con rol cliente por defecto
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase(),
        password: hashedPassword,
        role: "cliente", // Por defecto todos los usuarios registrados son clientes
      },
    });

    // No devolver la contraseña en la respuesta
    const { password: _password, ...userWithoutPassword } = user;

    return NextResponse.json(
      { 
        message: "Usuario registrado exitosamente",
        user: userWithoutPassword 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error en registro:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
} 