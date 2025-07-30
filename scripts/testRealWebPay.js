// Script para probar la API real de WebPay
console.log('🧪 Probando API real de WebPay...\n');

// Configuración manual para asegurar que use la API real
process.env.NEXT_PUBLIC_WEBPAY_ENVIRONMENT = 'integration';
process.env.NEXT_PUBLIC_WEBPAY_BASE_URL = 'https://webpay3gint.transbank.cl';
process.env.NEXT_PUBLIC_WEBPAY_COMMERCE_CODE = '597055555532';
process.env.NEXT_PUBLIC_WEBPAY_API_KEY = '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C';

async function testRealWebPay() {
  try {
    console.log('📋 Configuración forzada:');
    console.log('   - Ambiente:', process.env.NEXT_PUBLIC_WEBPAY_ENVIRONMENT);
    console.log('   - Base URL:', process.env.NEXT_PUBLIC_WEBPAY_BASE_URL);
    console.log('   - Commerce Code:', process.env.NEXT_PUBLIC_WEBPAY_COMMERCE_CODE);
    console.log('   - API Key:', process.env.NEXT_PUBLIC_WEBPAY_API_KEY ? 'Configurado' : 'No configurado');

    // 1. Llamar directamente a la API de WebPay
    console.log('\n1️⃣ Llamando directamente a la API de WebPay...');
    
    const paymentData = {
      buy_order: 'TEST_REAL_' + Date.now(),
      session_id: 'session_' + Date.now(),
      amount: 15990,
      return_url: 'http://localhost:3000/checkout/success'
    };

    console.log('📋 Datos enviados a WebPay:', JSON.stringify(paymentData, null, 2));

    const response = await fetch('https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Tbk-Api-Key-Id': '597055555532',
        'Tbk-Api-Key-Secret': '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C',
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

    const webpayData = await response.json();
    console.log('✅ Respuesta real de WebPay:', JSON.stringify(webpayData, null, 2));

    if (webpayData.token && webpayData.url) {
      console.log('\n2️⃣ Probando URL real de WebPay...');
      console.log(`🔗 URL generada: ${webpayData.url}`);
      console.log(`🔑 Token generado: ${webpayData.token}`);

      // 3. Probar la URL real
      console.log('\n3️⃣ Probando acceso a la URL real...');
      try {
        const pageResponse = await fetch(webpayData.url, {
          method: 'GET',
          redirect: 'manual'
        });
        
        console.log(`📊 Status de página: ${pageResponse.status} ${pageResponse.statusText}`);
        
        if (pageResponse.status === 200) {
          console.log('✅ Página accesible');
          const contentType = pageResponse.headers.get('content-type');
          console.log(`📄 Content-Type: ${contentType}`);
          
          if (contentType && contentType.includes('text/html')) {
            console.log('📝 Es una página HTML');
            
            // Leer el contenido para verificar
            try {
              const htmlContent = await pageResponse.text();
              if (htmlContent.includes('tarjeta') || htmlContent.includes('card') || htmlContent.includes('pago') || htmlContent.includes('payment')) {
                console.log('💳 ¡Es la página de pago!');
              } else if (htmlContent.includes('error') || htmlContent.includes('Error')) {
                console.log('❌ Página de error');
              } else {
                console.log('⚠️ Contenido no identificado');
                console.log('📄 Primeros 500 caracteres:', htmlContent.substring(0, 500));
              }
            } catch (readError) {
              console.log('⚠️ No se pudo leer el contenido');
            }
          }
        } else if (pageResponse.status >= 300 && pageResponse.status < 400) {
          const location = pageResponse.headers.get('location');
          console.log(`🔄 Redirección a: ${location}`);
        } else {
          console.log('❌ Problema con la URL');
        }
      } catch (webpayError) {
        console.log('❌ Error accediendo a WebPay:', webpayError.message);
      }

      console.log('\n4️⃣ URL para probar en el navegador:');
      console.log(`🔗 ${webpayData.url}`);

    } else {
      console.log('❌ Respuesta de WebPay inválida');
      console.log('   - token:', webpayData.token);
      console.log('   - url:', webpayData.url);
    }

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  }
}

testRealWebPay()
  .then(() => {
    console.log('\n🎉 Prueba de API real completada');
  })
  .catch((error) => {
    console.error('❌ Error en la prueba:', error);
  }); 