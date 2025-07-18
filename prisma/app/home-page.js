"use strict";
'use client';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HomePage;
const AnimatedProductCard_1 = __importDefault(require("@/components/AnimatedProductCard"));
const lucide_react_1 = require("lucide-react");
const link_1 = __importDefault(require("next/link"));
const AnimatedHero_1 = __importDefault(require("@/components/AnimatedHero"));
const AnimatedFeatures_1 = __importDefault(require("@/components/AnimatedFeatures"));
const react_1 = require("react");
const react_2 = require("swiper/react");
const modules_1 = require("swiper/modules");
require("swiper/css");
require("swiper/css/free-mode");
require("swiper/css/navigation");
const useProducts_1 = require("@/hooks/useProducts");
function HomePage() {
    const { products, featuredProducts, newProducts, loading, error } = (0, useProducts_1.useProducts)();
    const [isDesktop, setIsDesktop] = (0, react_1.useState)(false);
    const prevRef = (0, react_1.useRef)(null);
    const nextRef = (0, react_1.useRef)(null);
    // Por ahora no hay productos en oferta, así que usamos un array vacío
    const saleProducts = [];
    (0, react_1.useEffect)(() => {
        const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
        checkDesktop();
        window.addEventListener('resize', checkDesktop);
        return () => window.removeEventListener('resize', checkDesktop);
    }, []);
    return (<div className="min-h-screen bg-brand-fondo">
      {/* Hero Section */}
      <AnimatedHero_1.default />

      {/* Swiper de productos destacados justo debajo del hero */}
      <section className="py-16 bg-brand-fondoSec">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-brand-principal">Productos Destacados</h2>
            <link_1.default href="/productos" className="flex items-center text-brand-acento hover:text-brand-principal font-semibold">
              Ver todos <lucide_react_1.ArrowRight className="ml-2 h-4 w-4"/>
            </link_1.default>
          </div>
          <div className="relative">
            <react_2.Swiper modules={[modules_1.Navigation, modules_1.Autoplay]} spaceBetween={24} slidesPerView={1} breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 24 },
            1024: { slidesPerView: 3, spaceBetween: 32 },
        }} loop={true} navigation={isDesktop ? { prevEl: prevRef.current, nextEl: nextRef.current } : false} autoplay={{ delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true }} speed={900} className="w-full" style={{ padding: '0 2.5rem' }} onInit={(swiper) => {
            // @ts-ignore
            swiper.params.navigation.prevEl = prevRef.current;
            // @ts-ignore
            swiper.params.navigation.nextEl = nextRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
        }}>
              {featuredProducts.map((product) => (<react_2.SwiperSlide key={product.id} className="flex justify-center">
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <AnimatedProductCard_1.default product={product}/>
                  </div>
                </react_2.SwiperSlide>))}
            </react_2.Swiper>
            {/* Flechas solo en desktop */}
            {isDesktop && (<>
                <button ref={prevRef} className="swiper-prev hidden md:flex items-center justify-center w-10 h-10 bg-white rounded-full shadow absolute left-0 top-1/2 -translate-y-1/2 z-10" aria-label="Anterior" type="button">
                  <lucide_react_1.ArrowRight className="h-5 w-5 rotate-180 text-brand-acento"/>
                </button>
                <button ref={nextRef} className="swiper-next hidden md:flex items-center justify-center w-10 h-10 bg-white rounded-full shadow absolute right-0 top-1/2 -translate-y-1/2 z-10" aria-label="Siguiente" type="button">
                  <lucide_react_1.ArrowRight className="h-5 w-5 text-brand-acento"/>
                </button>
              </>)}
          </div>
        </div>
      </section>

      {/* New Products */}
      {newProducts.length > 0 && (<section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-brand-principal">Nuevos Productos</h2>
              <link_1.default href="/nuevos" className="flex items-center text-brand-acento hover:text-brand-principal font-semibold">
                Ver todos <lucide_react_1.ArrowRight className="ml-2 h-4 w-4"/>
              </link_1.default>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newProducts.map((product) => (<div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <AnimatedProductCard_1.default product={product}/>
                </div>))}
            </div>
          </div>
        </section>)}

      {/* Sale Products */}
      {saleProducts.length > 0 && (<section className="py-16 bg-brand-fondoSec">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-brand-principal">Ofertas Especiales</h2>
              <link_1.default href="/ofertas" className="flex items-center text-brand-acento hover:text-brand-principal font-semibold">
                Ver todas <lucide_react_1.ArrowRight className="ml-2 h-4 w-4"/>
              </link_1.default>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {saleProducts.map((product) => (<div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <AnimatedProductCard_1.default product={product}/>
                </div>))}
            </div>
          </div>
        </section>)}

      {/* Features Section */}
      <AnimatedFeatures_1.default />
    </div>);
}
