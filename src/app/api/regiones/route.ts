import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const regiones = await prisma.region.findMany({
      orderBy: { name: 'asc' },
      include: {
        comunas: { orderBy: { name: 'asc' } }
      }
    });
    return NextResponse.json({ regiones });
  } catch (error) {
    console.error('Error obteniendo regiones:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
} 