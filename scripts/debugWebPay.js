// Script de diagnóstico para WebPay
console.log('🔍 Diagnóstico de WebPay...\n');

// Simular el proceso completo de pago
async function debugWebPay() {
  try {
    console.log('1️⃣ Simulando datos de pago...');
    const paymentData = {
      amount: 15990,
      currency: 'CLP',
      orderId: 'DEBUG_ORDER_' + Date.now(),
      customer: {
        name: 'Test User',
        email: 'test@example.com',
        phone: '+56912345678'
      },
      items: [
        {
          name: 'Producto de prueba',
          quantity: 1,
          price: 15990
        }
      ],
      returnUrl: 'http://localhost:3000/checkout/success',
      cancelUrl: 'http://localhost:3000/checkout/cancel'
    };

    console.log('📋 Datos de pago:', JSON.stringify(paymentData, null, 2));

    console.log('\n2️⃣ Llamando al endpoint de WebPay...');
    const response = await fetch('http://localhost:3000/api/webpay/create-transaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData)
    });

    console.log(`📊 Status de respuesta: ${response.status} ${response.statusText}`);
    console.log(`📊 Headers:`, Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`❌ Error en respuesta: ${errorText}`);
      return;
    }

    const webpayResponse = await response.json();
    console.log('✅ Respuesta de WebPay:', JSON.stringify(webpayResponse, null, 2));

    if (webpayResponse.success && webpayResponse.url) {
      console.log('\n3️⃣ Verificando URL de WebPay...');
      console.log(`🔗 URL generada: ${webpayResponse.url}`);
      console.log(`🔑 Token generado: ${webpayResponse.token}`);

      // Verificar si la URL es accesible
      console.log('\n4️⃣ Probando acceso a la URL de WebPay...');
      try {
        const webpayPageResponse = await fetch(webpayResponse.url, {
          method: 'GET',
          redirect: 'manual' // No seguir redirecciones automáticamente
        });
        
        console.log(`📊 Status de página WebPay: ${webpayPageResponse.status} ${webpayPageResponse.statusText}`);
        
        if (webpayPageResponse.status === 200) {
          console.log('✅ Página de WebPay accesible');
        } else if (webpayPageResponse.status >= 300 && webpayPageResponse.status < 400) {
          console.log('✅ Redirección detectada (normal para WebPay)');
          console.log(`📍 Location: ${webpayPageResponse.headers.get('location')}`);
        } else {
          console.log('❌ Problema accediendo a la página de WebPay');
        }
      } catch (webpayError) {
        console.log('❌ Error accediendo a WebPay:', webpayError.message);
      }

      console.log('\n5️⃣ Simulando redirección...');
      console.log('🔄 En el navegador, esto redirigiría a:', webpayResponse.url);
      console.log('💡 Si no funciona, verifica:');
      console.log('   - Que el servidor esté corriendo en localhost:3000');
      console.log('   - Que no haya bloqueadores de popups');
      console.log('   - Que las credenciales de WebPay sean correctas');

    } else {
      console.log('❌ Respuesta de WebPay inválida');
      console.log('   - success:', webpayResponse.success);
      console.log('   - url:', webpayResponse.url);
      console.log('   - error:', webpayResponse.error);
    }

  } catch (error) {
    console.error('❌ Error durante el diagnóstico:', error);
  }
}

// Verificar configuración
console.log('📋 Configuración actual:');
console.log('   - Ambiente:', process.env.NEXT_PUBLIC_WEBPAY_ENVIRONMENT || 'integration');
console.log('   - Base URL:', process.env.NEXT_PUBLIC_WEBPAY_BASE_URL || 'https://webpay3gint.transbank.cl');
console.log('   - Commerce Code:', process.env.NEXT_PUBLIC_WEBPAY_COMMERCE_CODE || '597055555532');
console.log('   - API Key:', process.env.NEXT_PUBLIC_WEBPAY_API_KEY ? 'Configurado' : 'No configurado');

debugWebPay()
  .then(() => {
    console.log('\n🎉 Diagnóstico completado');
  })
  .catch((error) => {
    console.error('❌ Error en diagnóstico:', error);
  }); 