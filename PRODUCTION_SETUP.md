# 🚀 Guía de Configuración para Producción

## 📋 Checklist de Preparación

### 1. Limpieza de Archivos de Prueba
```bash
# Ejecutar script de limpieza
node scripts/cleanupForProduction.js
```

### 2. Variables de Entorno (.env)
```env
# Base de datos de producción
DATABASE_URL="postgresql://usuario:password@host:puerto/database"

# NextAuth
NEXTAUTH_SECRET=tu_secret_muy_seguro_aqui
NEXTAUTH_URL=https://tudominio.com

# SendGrid (email)
SENDGRID_API_KEY=tu_api_key_de_sendgrid_produccion
FROM_EMAIL=noreply@tudominio.com
FROM_NAME=Creaciones Púrpura

# WebPay Producción
NEXT_PUBLIC_WEBPAY_ENVIRONMENT=production
NEXT_PUBLIC_WEBPAY_BASE_URL=https://webpay3g.transbank.cl
NEXT_PUBLIC_WEBPAY_COMMERCE_CODE=tu_commerce_code_produccion
NEXT_PUBLIC_WEBPAY_API_KEY=tu_api_key_produccion
```

### 3. Configuración de WebPay
- ✅ Cambiar `NEXT_PUBLIC_WEBPAY_ENVIRONMENT` a `production`
- ✅ Cambiar `NEXT_PUBLIC_WEBPAY_BASE_URL` a `https://webpay3g.transbank.cl`
- ✅ Usar `NEXT_PUBLIC_WEBPAY_COMMERCE_CODE` de producción
- ✅ Usar `NEXT_PUBLIC_WEBPAY_API_KEY` de producción

### 4. Base de Datos
```bash
# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate deploy

# Verificar conexión
npx prisma db push
```

### 5. Build de Producción
```bash
# Instalar dependencias
npm install

# Build de producción
npm run build

# Verificar build
npm start
```

## 🔒 Seguridad

### Variables Sensibles
- ❌ **NUNCA** subir `.env` al repositorio
- ✅ Usar variables de entorno del servidor
- ✅ Configurar `.gitignore` correctamente

### WebPay
- ✅ Usar credenciales de producción
- ✅ Configurar webhook de producción
- ✅ Verificar URLs de retorno

## 📊 Monitoreo

### Logs
- Configurar logging de errores
- Monitorear transacciones WebPay
- Verificar emails enviados

### Base de Datos
- Monitorear conexiones
- Verificar rendimiento
- Backup regular

## 🚀 Deployment

### Vercel (Recomendado)
1. Conectar repositorio
2. Configurar variables de entorno
3. Deploy automático

### Otros Servicios
- Netlify
- Railway
- Heroku
- AWS

## 📞 Soporte

### Contactos Importantes
- **WebPay/Transbank:** Soporte técnico Transbank
- **Base de Datos:** Soporte de tu proveedor
- **Hosting:** Soporte de tu plataforma

### Documentación
- [WebPay Plus](https://www.transbankdevelopers.cl/documentacion/webpay-plus)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Production](https://www.prisma.io/docs/guides/deployment)

## ✅ Verificación Final

Antes de hacer público:
- [ ] Todos los archivos de prueba eliminados
- [ ] Variables de entorno configuradas
- [ ] WebPay en modo producción
- [ ] Base de datos migrada
- [ ] Build exitoso
- [ ] Funcionalidad de pago probada
- [ ] Emails funcionando
- [ ] SSL configurado
- [ ] Dominio configurado

---

**¡Listo para producción! 🎉** 