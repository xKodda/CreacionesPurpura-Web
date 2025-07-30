// Script para probar la URL correcta de WebPay
console.log('🧪 Probando URL correcta de WebPay...\n');

async function testCorrectURL() {
  try {
    // 1. Crear transacción
    console.log('1️⃣ Creando transacción...');
    const paymentData = {
      amount: 15990,
      currency: 'CLP',
      orderId: 'TEST_CORRECT_' + Date.now(),
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

    const response = await fetch('http://localhost:3000/api/webpay/create-transaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData)
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${await response.text()}`);
    }

    const webpayResponse = await response.json();
    console.log('✅ Transacción creada:', webpayResponse);

    if (webpayResponse.success && webpayResponse.token) {
      console.log('\n2️⃣ Probando URLs correctas de WebPay...');
      
      // URLs correctas según documentación de WebPay
      const correctURLs = [
        `https://webpay3gint.transbank.cl/webpayserver/init_transaction.cgi?token_ws=${webpayResponse.token}`,
        `https://webpay3gint.transbank.cl/webpayserver/initTransaction?token_ws=${webpayResponse.token}`,
        `https://webpay3gint.transbank.cl/webpayserver/init_transaction?token_ws=${webpayResponse.token}`,
        `https://webpay3gint.transbank.cl/webpayserver/initTransaction.cgi?token_ws=${webpayResponse.token}`
      ];

      for (let i = 0; i < correctURLs.length; i++) {
        const url = correctURLs[i];
        console.log(`\n   Probando URL ${i + 1}: ${url}`);
        
        try {
          const pageResponse = await fetch(url, {
            method: 'GET',
            redirect: 'manual'
          });
          
          console.log(`   Status: ${pageResponse.status} ${pageResponse.statusText}`);
          
          if (pageResponse.status === 200) {
            console.log('   ✅ Página accesible');
            const contentType = pageResponse.headers.get('content-type');
            console.log(`   📄 Content-Type: ${contentType}`);
            
            if (contentType && contentType.includes('text/html')) {
              console.log('   📝 Es una página HTML');
              
              // Intentar leer el contenido para ver si es la página de pago
              try {
                const htmlContent = await pageResponse.text();
                if (htmlContent.includes('tarjeta') || htmlContent.includes('card') || htmlContent.includes('pago') || htmlContent.includes('payment')) {
                  console.log('   💳 ¡Parece ser la página de pago!');
                } else if (htmlContent.includes('error') || htmlContent.includes('Error')) {
                  console.log('   ❌ Página de error detectada');
                } else {
                  console.log('   ⚠️ Página HTML pero contenido no identificado');
                }
              } catch (readError) {
                console.log('   ⚠️ No se pudo leer el contenido');
              }
            }
          } else if (pageResponse.status >= 300 && pageResponse.status < 400) {
            const location = pageResponse.headers.get('location');
            console.log(`   🔄 Redirección a: ${location}`);
          } else {
            console.log('   ❌ Problema con la URL');
          }
        } catch (error) {
          console.log(`   ❌ Error: ${error.message}`);
        }
      }

      console.log('\n3️⃣ URL recomendada para probar en el navegador:');
      console.log(`🔗 https://webpay3gint.transbank.cl/webpayserver/init_transaction.cgi?token_ws=${webpayResponse.token}`);
      
      console.log('\n💡 Si la página está en blanco, puede ser:');
      console.log('   - Token inválido o expirado');
      console.log('   - Problema con las credenciales de WebPay');
      console.log('   - URL incorrecta');
      console.log('   - Problema de CORS o configuración');

    } else {
      console.log('❌ No se pudo crear la transacción');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testCorrectURL()
  .then(() => {
    console.log('\n🎉 Prueba de URL correcta completada');
  })
  .catch((error) => {
    console.error('❌ Error en la prueba:', error);
  }); 