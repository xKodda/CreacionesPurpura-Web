#!/bin/bash

echo "🔧 Solucionando problema de Prisma..."

# Detener cualquier proceso de Node.js
echo "📋 Deteniendo procesos de Node.js..."
pkill -f "node" || true

# Limpiar caché de Next.js
echo "🧹 Limpiando caché de Next.js..."
rm -rf .next

# Limpiar directorio .prisma
echo "🧹 Limpiando directorio .prisma..."
rm -rf node_modules/.prisma

# Reinstalar dependencias de Prisma
echo "📦 Reinstalando dependencias de Prisma..."
npm install @prisma/client

# Generar cliente de Prisma
echo "⚙️ Generando cliente de Prisma..."
npx prisma generate

# Verificar que la base de datos esté sincronizada
echo "🔍 Verificando sincronización de base de datos..."
npx prisma db push

echo "✅ ¡Problema de Prisma solucionado!"
echo "🚀 Ahora puedes ejecutar: npm run dev" 