// Script para probar redirección a WebPay
console.log('🧪 Probando redirección a WebPay...\n');

async function testRedirect() {
  try {
    // 1. Crear transacción
    console.log('1️⃣ Creando transacción...');
    const paymentData = {
      amount: 15990,
      currency: 'CLP',
      orderId: 'TEST_REDIRECT_' + Date.now(),
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

    if (webpayResponse.success && webpayResponse.url) {
      console.log('\n2️⃣ URL de WebPay generada:');
      console.log(`🔗 ${webpayResponse.url}`);
      console.log(`🔑 Token: ${webpayResponse.token}`);

      // 3. Probar diferentes formatos de URL
      console.log('\n3️⃣ Probando diferentes formatos de URL...');
      
      const urlVariations = [
        webpayResponse.url,
        `${webpayResponse.url}?token_ws=${webpayResponse.token}`,
        webpayResponse.url.replace('/webpayserver/initTransaction', '/webpayserver/initTransaction'),
        `https://webpay3gint.transbank.cl/webpayserver/initTransaction?token_ws=${webpayResponse.token}`
      ];

      for (let i = 0; i < urlVariations.length; i++) {
        const url = urlVariations[i];
        console.log(`\n   Probando variación ${i + 1}: ${url}`);
        
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
              console.log('   📝 Es una página HTML (correcto)');
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

      console.log('\n4️⃣ Instrucciones para probar en el navegador:');
      console.log('   📝 Copia y pega esta URL en tu navegador:');
      console.log(`   🔗 ${webpayResponse.url}?token_ws=${webpayResponse.token}`);
      console.log('\n   💡 Si no funciona, prueba:');
      console.log('   - Abrir en una ventana nueva');
      console.log('   - Deshabilitar bloqueadores de popups');
      console.log('   - Verificar que no haya errores en la consola del navegador');

    } else {
      console.log('❌ No se pudo crear la transacción');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testRedirect()
  .then(() => {
    console.log('\n🎉 Prueba de redirección completada');
  })
  .catch((error) => {
    console.error('❌ Error en la prueba:', error);
  }); 