// Script final para probar WebPay con URL corregida
console.log('🎯 Prueba final de WebPay con URL corregida...\n');

async function testFinalWebPay() {
  try {
    // 1. Crear transacción real
    console.log('1️⃣ Creando transacción real...');
    
    const response = await fetch('https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Tbk-Api-Key-Id': '597055555532',
        'Tbk-Api-Key-Secret': '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C',
      },
      body: JSON.stringify({
        buy_order: 'FINAL_TEST_' + Date.now(),
        session_id: 'session_' + Date.now(),
        amount: 15990,
        return_url: 'http://localhost:3000/checkout/success'
      })
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${await response.text()}`);
    }

    const webpayData = await response.json();
    console.log('✅ Transacción creada:', webpayData);

    if (webpayData.token && webpayData.url) {
      // 2. Construir URL correcta
      const correctUrl = `${webpayData.url}?token_ws=${webpayData.token}`;
      
      console.log('\n2️⃣ URL corregida:');
      console.log(`🔗 ${correctUrl}`);
      console.log(`🔑 Token: ${webpayData.token}`);

      // 3. Probar la URL corregida
      console.log('\n3️⃣ Probando URL corregida...');
      try {
        const pageResponse = await fetch(correctUrl, {
          method: 'GET',
          redirect: 'manual'
        });
        
        console.log(`📊 Status: ${pageResponse.status} ${pageResponse.statusText}`);
        
        if (pageResponse.status === 200) {
          console.log('✅ Página accesible');
          const contentType = pageResponse.headers.get('content-type');
          console.log(`📄 Content-Type: ${contentType}`);
          
          if (contentType && contentType.includes('text/html')) {
            console.log('📝 Es una página HTML');
            
            // Leer el contenido
            try {
              const htmlContent = await pageResponse.text();
              
              if (htmlContent.includes('tarjeta') || htmlContent.includes('card') || htmlContent.includes('pago') || htmlContent.includes('payment')) {
                console.log('💳 ¡Es la página de pago!');
              } else if (htmlContent.includes('error') || htmlContent.includes('Error')) {
                console.log('❌ Página de error');
              } else if (htmlContent.includes('form') && htmlContent.includes('input')) {
                console.log('📝 Formulario de pago detectado');
                console.log('💳 ¡Debería ser la página donde ingresas la tarjeta!');
              } else {
                console.log('⚠️ Contenido no identificado');
                console.log('📄 Primeros 300 caracteres:', htmlContent.substring(0, 300));
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

      console.log('\n4️⃣ 🎯 URL FINAL para probar en el navegador:');
      console.log(`🔗 ${correctUrl}`);
      
      console.log('\n💡 Instrucciones:');
      console.log('   1. Copia la URL de arriba');
      console.log('   2. Pégalo en tu navegador');
      console.log('   3. Deberías ver la página de pago de WebPay');
      console.log('   4. Usa una tarjeta de prueba:');
      console.log('      - Visa: 4051885600446623');
      console.log('      - Mastercard: 5186059559590568');
      console.log('      - Cualquier fecha futura');
      console.log('      - Cualquier CVV de 3 dígitos');

    } else {
      console.log('❌ No se pudo crear la transacción');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testFinalWebPay()
  .then(() => {
    console.log('\n🎉 Prueba final completada');
  })
  .catch((error) => {
    console.error('❌ Error en la prueba:', error);
  }); 