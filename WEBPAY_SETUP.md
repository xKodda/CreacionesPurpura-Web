# Configuración de WebPay y Email para Creaciones Púrpura

## 📋 Descripción

Este documento explica cómo configurar la integración con WebPay (Transbank) y el sistema de emails para el procesamiento de pagos en la tienda online Creaciones Púrpura.

## 🚀 Configuración Actual

### Estado: Sandbox/Integración
Actualmente el sistema está configurado para usar el **entorno de integración** de WebPay para pruebas reales.

### Archivos de Integración
- `src/services/webpay.ts` - Servicio principal de WebPay
- `src/services/email.ts` - Servicio de emails con SendGrid
- `src/app/checkout/checkout-page.tsx` - Página de checkout
- `src/app/checkout/success/page.tsx` - Página de éxito
- `src/app/checkout/cancel/page.tsx` - Página de cancelación
- `src/app/api/orders/` - APIs para manejo de órdenes
- `src/app/api/webpay/webhook/` - Webhook para confirmaciones

## ⚙️ Configuración para Pruebas (Sandbox)

### 1. Variables de Entorno

Crear un archivo `.env.local` en la raíz del proyecto:

```env
# WebPay Sandbox Configuration
NEXT_PUBLIC_WEBPAY_COMMERCE_CODE=597055555532
NEXT_PUBLIC_WEBPAY_API_KEY=579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C
NEXT_PUBLIC_WEBPAY_ENVIRONMENT=integration
NEXT_PUBLIC_WEBPAY_BASE_URL=https://webpay3gint.transbank.cl

# SendGrid Email Configuration
SENDGRID_API_KEY=tu_sendgrid_api_key
FROM_EMAIL=noreply@creacionespurpura.cl
FROM_NAME=Creaciones Púrpura
```

### 2. Tarjetas de Prueba WebPay

Para probar el flujo completo, usa estas tarjetas:

- **Visa**: `4051885600446623`
- **Mastercard**: `5186059559590568`
- **Fecha**: Cualquier fecha futura
- **CVV**: Cualquier número de 3 dígitos

### 3. Configurar SendGrid

1. **Crear cuenta en SendGrid**: [sendgrid.com](https://sendgrid.com)
2. **Obtener API Key**: Dashboard → Settings → API Keys
3. **Verificar dominio** (opcional): Para mejor deliverability
4. **Configurar remitente**: Usar `noreply@creacionespurpura.cl`

## 🔧 Configuración para Producción

### 1. Variables de Entorno de Producción

```env
# WebPay Production Configuration
NEXT_PUBLIC_WEBPAY_COMMERCE_CODE=tu_codigo_comercio_real
NEXT_PUBLIC_WEBPAY_API_KEY=tu_api_key_real
NEXT_PUBLIC_WEBPAY_ENVIRONMENT=production
NEXT_PUBLIC_WEBPAY_BASE_URL=https://webpay3g.transbank.cl

# SendGrid Production
SENDGRID_API_KEY=tu_sendgrid_api_key_produccion
FROM_EMAIL=contacto@creacionespurpura.cl
FROM_NAME=Creaciones Púrpura
```

### 2. Obtener Credenciales de WebPay

1. **Registrarse en Transbank**: Crear una cuenta en [Transbank](https://www.transbank.cl/)
2. **Solicitar integración WebPay**: Contactar a Transbank para obtener:
   - Código de comercio
   - API Key
   - Documentación técnica

### 3. Configurar URLs de Retorno

En el servicio `webpay.ts`, actualizar las URLs de retorno:

```typescript
returnUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success`,
cancelUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/cancel`
```

## 🔧 Funcionalidades Implementadas

### ✅ Completadas (Fase 1)
- [x] Servicio de WebPay con llamadas reales y simulación
- [x] Página de checkout con formulario de datos
- [x] Integración con el carrito de compras
- [x] APIs para crear y actualizar órdenes
- [x] Páginas de éxito y cancelación
- [x] Validación de datos de pago
- [x] Manejo de errores
- [x] Webhook para confirmación de pagos
- [x] Actualización automática de stock
- [x] Email de confirmación con SendGrid
- [x] Configuración de sandbox para pruebas

### 🔄 Pendientes para Producción
- [ ] Configurar credenciales reales de WebPay
- [ ] Configurar SSL/HTTPS
- [ ] Implementar webhooks para confirmación
- [ ] Agregar logging de transacciones
- [ ] Implementar manejo de errores específicos de WebPay

## 📱 Flujo de Pago Completo

1. **Usuario agrega productos al carrito**
2. **Navega a `/checkout`**
3. **Completa formulario de datos personales**
4. **Sistema crea orden en base de datos**
5. **Hace clic en "Pagar con WebPay"**
6. **Es redirigido a WebPay (sandbox o producción)**
7. **Completa el pago con tarjeta de prueba**
8. **Es redirigido de vuelta a la tienda**
9. **Sistema confirma transacción y actualiza orden**
10. **Se envía email de confirmación**
11. **Ve confirmación de éxito o cancelación**

## 🛡️ Seguridad

### Implementado
- Validación de datos del formulario
- Sanitización de inputs
- Manejo seguro de tokens
- URLs de retorno configuradas
- Transacciones de base de datos
- Validación de stock en tiempo real

### Recomendaciones para Producción
- Usar HTTPS obligatorio
- Implementar rate limiting
- Validar IPs de WebPay
- Logging de todas las transacciones
- Backup de datos de transacciones
- Monitoreo de emails

## 🧪 Testing

### Modo Sandbox
El sistema actual funciona con WebPay sandbox que:
- Permite usar tarjetas de prueba reales
- Simula el flujo completo de pago
- No genera cargos reales
- Permite probar todos los escenarios

### Comandos de Prueba
```bash
# Probar el flujo completo
npm run dev
# Navegar a /productos
# Agregar productos al carrito
# Ir a /checkout
# Completar el proceso con tarjetas de prueba
```

### Verificar Funcionalidad
1. **Crear orden**: Verificar que se guarda en base de datos
2. **Procesar pago**: Usar tarjetas de prueba
3. **Confirmar transacción**: Verificar webhook
4. **Email de confirmación**: Verificar envío
5. **Actualización de stock**: Verificar descuento

## 📞 Soporte

Para configurar WebPay en producción:
1. Contactar a Transbank para obtener credenciales
2. Revisar la documentación oficial de WebPay
3. Configurar las variables de entorno
4. Probar en ambiente de staging
5. Desplegar a producción

Para configurar SendGrid:
1. Crear cuenta en SendGrid
2. Obtener API Key
3. Configurar remitente
4. Probar envío de emails

## 🔗 Enlaces Útiles

- [Documentación oficial de WebPay](https://www.transbankdevelopers.cl/)
- [Portal de desarrolladores Transbank](https://www.transbankdevelopers.cl/documentacion/webpay)
- [Herramientas de testing WebPay](https://www.transbankdevelopers.cl/documentacion/webpay#ambiente-de-integracion)
- [SendGrid Documentation](https://sendgrid.com/docs/)
- [SendGrid API Reference](https://sendgrid.com/docs/api-reference/) 