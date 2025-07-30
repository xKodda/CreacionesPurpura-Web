import { NextRequest, NextResponse } from 'next/server';
import WebPayService from '@/services/webpay';

export async function POST(req: NextRequest) {
  try {
    const paymentData = await req.json();
    
    console.log('🚀 API: Creando transacción WebPay:', paymentData);
    
    // Validar datos de pago
    const validation = WebPayService.validatePaymentData(paymentData);
    if (!validation.valid) {
      return NextResponse.json({ 
        success: false, 
        error: `Errores de validación: ${validation.errors.join(', ')}` 
      }, { status: 400 });
    }

    // Crear transacción en WebPay
    const webpayResponse = await WebPayService.createTransaction(paymentData);
    
    console.log('✅ API: Respuesta de WebPay:', webpayResponse);
    
    return NextResponse.json(webpayResponse);
    
  } catch (error) {
    console.error('❌ API: Error creando transacción WebPay:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Error interno del servidor' 
    }, { status: 500 });
  }
} 