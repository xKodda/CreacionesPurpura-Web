'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default function ContactoPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ingresa un email válido';
    }

    if (!formData.subject) {
      newErrors.subject = 'Selecciona un asunto';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'El mensaje es requerido';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'El mensaje debe tener al menos 10 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 1. Añadir lógica para detectar campos válidos
  const isValid = (field: keyof FormData) => {
    if (!formData[field]) return false;
    if (field === 'name') return formData.name.trim().length >= 2;
    if (field === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    if (field === 'subject') return !!formData.subject;
    if (field === 'message') return formData.message.trim().length >= 10;
    return false;
  };

  // 2. En handleSubmit, enfocar el primer campo con error
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Enfocar el primer campo con error
      const firstError = Object.keys(errors)[0];
      if (firstError) {
        const el = document.getElementById(firstError);
        if (el) el.focus();
      }
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulación de envío del formulario
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Formulario enviado:', formData);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setErrors({});
      
      // Resetear el estado después de 5 segundos
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
      
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  return (
    <div className="min-h-screen bg-brand-fondo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-brand-principal mb-4">Contáctanos</h1>
          <p className="text-lg text-brand-principal max-w-2xl mx-auto">
            ¿Tienes alguna pregunta sobre nuestros productos? ¿Necesitas ayuda con tu pedido? 
            Estamos aquí para ayudarte con la mejor atención al cliente.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-brand-principal mb-6">Información de Contacto</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4 p-6 bg-brand-fondoSec rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="bg-brand-acento p-3 rounded-full">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-principal">Teléfono</h3>
                    <p className="text-brand-principal">+56 9 1234 5678</p>
                    <p className="text-sm text-gray-500">Lunes a Viernes, 9:00 a 18:00 hrs</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-6 bg-brand-fondoSec rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="bg-brand-acento p-3 rounded-full">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-principal">Email</h3>
                    <p className="text-brand-principal">contacto@creacionespurpura.cl</p>
                    <p className="text-sm text-gray-500">Respondemos en menos de 24 horas</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-6 bg-brand-fondoSec rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="bg-brand-acento p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-principal">Dirección</h3>
                    <p className="text-brand-principal">
                      Santiago, Chile<br />
                      <span className="text-sm text-gray-500">Envíos a todo Chile</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-6 bg-brand-fondoSec rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="bg-brand-acento p-3 rounded-full">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-principal">Horarios de Atención</h3>
                    <p className="text-brand-principal">
                      Lunes - Viernes: 9:00 AM - 6:00 PM<br />
                      Sábado: 10:00 AM - 4:00 PM<br />
                      Domingo: Cerrado
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-brand-fondoSec rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-brand-principal mb-4">Preguntas Frecuentes</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-brand-acento pl-4">
                  <h4 className="font-semibold text-brand-principal mb-1">¿Cuánto tiempo tarda el envío?</h4>
                  <p className="text-brand-principal text-sm">El envío tarda entre 3-5 días hábiles en todo Chile.</p>
                </div>
                <div className="border-l-4 border-brand-acento pl-4">
                  <h4 className="font-semibold text-brand-principal mb-1">¿Qué métodos de pago aceptan?</h4>
                  <p className="text-brand-principal text-sm">Aceptamos WebPay, tarjetas de crédito, débito y transferencias bancarias.</p>
                </div>
                <div className="border-l-4 border-brand-acento pl-4">
                  <h4 className="font-semibold text-brand-principal mb-1">¿Tienen envío gratis?</h4>
                  <p className="text-brand-principal text-sm">Sí, todos nuestros envíos son gratuitos a todo Chile.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-brand-fondoSec rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-brand-principal mb-6">Envíanos un Mensaje</h2>
            
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-green-800">¡Mensaje enviado exitosamente! Te responderemos pronto.</span>
                </div>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-red-800">Error al enviar el mensaje. Inténtalo de nuevo.</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-brand-principal mb-2">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-acento ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  } text-brand-principal`}
                  placeholder="Tu nombre completo"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-brand-principal mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-acento ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } text-brand-principal`}
                  placeholder="tu@email.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-brand-principal mb-2">
                  Asunto *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-acento ${
                    errors.subject ? 'border-red-500' : 'border-gray-300'
                  } text-brand-principal`}
                >
                  <option value="">Selecciona un asunto</option>
                  <option value="consulta-producto">Consulta sobre producto</option>
                  <option value="problema-pedido">Problema con mi pedido</option>
                  <option value="devolucion">Devolución o cambio</option>
                  <option value="sugerencia">Sugerencia</option>
                  <option value="otro">Otro</option>
                </select>
                {errors.subject && (
                  <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-brand-principal mb-2">
                  Mensaje *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-acento ${
                    errors.message ? 'border-red-500' : 'border-gray-300'
                  } text-brand-principal`}
                  placeholder="Escribe tu mensaje aquí..."
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-acento text-white py-3 px-6 rounded-lg hover:bg-brand-principal transition-colors shadow-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Mensaje
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 