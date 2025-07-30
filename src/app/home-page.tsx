'use client';

import AnimatedProductCard from '@/components/AnimatedProductCard';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import AnimatedHero from '@/components/AnimatedHero';
import AnimatedFeatures from '@/components/AnimatedFeatures';
import { useRef, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import { useProducts } from '@/hooks/useProducts';

export default function HomePage() {
  const { products, featuredProducts, newProducts, loading, error } = useProducts();
  const [isDesktop, setIsDesktop] = useState(false);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  
  // Por ahora no hay productos en oferta, así que usamos un array vacío
  const saleProducts: any[] = [];
  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  return (
    <div className="min-h-screen bg-brand-fondo">
      {/* Hero Section */}
      <AnimatedHero />

      {/* Swiper de productos destacados justo debajo del hero */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-brand-fondoSec">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-brand-principal">Productos Destacados</h2>
              <Link 
                href="/productos" 
                className="flex items-center text-brand-acento hover:text-brand-principal font-semibold"
              >
                Ver todos <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            <div className="relative">
              <Swiper
                modules={[Navigation, Autoplay]}
                spaceBetween={24}
                slidesPerView={1}
                breakpoints={{
                  640: { slidesPerView: 2, spaceBetween: 24 },
                  1024: { slidesPerView: 3, spaceBetween: 32 },
                }}
                loop={true}
                navigation={isDesktop ? { prevEl: prevRef.current, nextEl: nextRef.current } : false}
                autoplay={{ delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true }}
                speed={900}
                className="w-full"
                style={{ padding: '0 2.5rem' }}
                onInit={(swiper) => {
                  // @ts-ignore
                  swiper.params.navigation.prevEl = prevRef.current;
                  // @ts-ignore
                  swiper.params.navigation.nextEl = nextRef.current;
                  swiper.navigation.init();
                  swiper.navigation.update();
                }}
              >
                {featuredProducts.map((product) => (
                  <SwiperSlide key={product.id} className="flex justify-center">
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                      <AnimatedProductCard product={product} />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              {/* Flechas solo en desktop */}
              {isDesktop && (
                <>
                  <button
                    ref={prevRef}
                    className="swiper-prev hidden md:flex items-center justify-center w-10 h-10 bg-white rounded-full shadow absolute left-0 top-1/2 -translate-y-1/2 z-10"
                    aria-label="Anterior"
                    type="button"
                  >
                    <ArrowRight className="h-5 w-5 rotate-180 text-brand-acento" />
                  </button>
                  <button
                    ref={nextRef}
                    className="swiper-next hidden md:flex items-center justify-center w-10 h-10 bg-white rounded-full shadow absolute right-0 top-1/2 -translate-y-1/2 z-10"
                    aria-label="Siguiente"
                    type="button"
                  >
                    <ArrowRight className="h-5 w-5 text-brand-acento" />
                  </button>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* New Products */}
      {newProducts.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-brand-principal">Nuevos Productos</h2>
              <Link 
                href="/nuevos" 
                className="flex items-center text-brand-acento hover:text-brand-principal font-semibold"
              >
                Ver todos <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <AnimatedProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sale Products */}
      {saleProducts.length > 0 && (
        <section className="py-16 bg-brand-fondoSec">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-brand-principal">Ofertas Especiales</h2>
              <Link 
                href="/ofertas" 
                className="flex items-center text-brand-acento hover:text-brand-principal font-semibold"
              >
                Ver todas <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {saleProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <AnimatedProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <AnimatedFeatures />
    </div>
  );
} 