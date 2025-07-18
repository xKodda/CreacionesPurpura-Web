"use strict";
'use client';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AnimatedHero;
const framer_motion_1 = require("framer-motion");
const link_1 = __importDefault(require("next/link"));
const useProducts_1 = require("@/hooks/useProducts");
const react_1 = require("react");
function AnimatedHero() {
    const { featuredProducts, loading } = (0, useProducts_1.useProducts)();
    const carouselRef = (0, react_1.useRef)(null);
    const [scrollIndex, setScrollIndex] = (0, react_1.useState)(0);
    const visibleCards = 4; // Cambia según el tamaño de pantalla si quieres
    const scrollTo = (dir) => {
        var _a;
        if (!carouselRef.current)
            return;
        const cardWidth = ((_a = carouselRef.current.firstElementChild) === null || _a === void 0 ? void 0 : _a.clientWidth) || 320;
        const scrollAmount = cardWidth * visibleCards;
        if (dir === 'left') {
            carouselRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            setScrollIndex((prev) => Math.max(prev - visibleCards, 0));
        }
        else {
            carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            setScrollIndex((prev) => prev + visibleCards);
        }
    };
    return (<section className="relative bg-gradient-to-r from-brand-acento to-brand-principal text-white overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0">
        <framer_motion_1.motion.div className="absolute top-0 left-0 w-full h-full" animate={{
            background: [
                "radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)",
                "radial-gradient(circle at 40% 80%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)",
                "radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)",
            ],
        }} transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
        }}/>
        {/* Overlay blanco semitransparente */}
        <div className="absolute inset-0 bg-white bg-opacity-30"/>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
        <div className="text-center">
          {/* Floating Elements */}
          <framer_motion_1.motion.div className="absolute top-10 left-10 w-4 h-4 bg-white rounded-full opacity-20" animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
        }} transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
        }}/>
          <framer_motion_1.motion.div className="absolute top-20 right-20 w-6 h-6 bg-white rounded-full opacity-30" animate={{
            y: [0, -30, 0],
            x: [0, -15, 0],
        }} transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
        }}/>
          <framer_motion_1.motion.div className="absolute bottom-20 left-20 w-3 h-3 bg-white rounded-full opacity-25" animate={{
            y: [0, -15, 0],
            x: [0, 8, 0],
        }} transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
        }}/>

          {/* Main Content */}
          <framer_motion_1.motion.h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
            Creaciones Púrpura
          </framer_motion_1.motion.h1>

          <framer_motion_1.motion.p className="text-lg md:text-2xl text-white mb-8 drop-shadow" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}>
            Papelería, cotillón y manualidades para todo Chile. Compra fácil, rápida y segura en 2025.
          </framer_motion_1.motion.p>

          <framer_motion_1.motion.div className="flex flex-col sm:flex-row gap-4 justify-center" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}>
            <framer_motion_1.motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <link_1.default href="/productos" className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-purple-50 transition-colors inline-block">
                Ver Productos
              </link_1.default>
            </framer_motion_1.motion.div>
            <framer_motion_1.motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <link_1.default href="/categorias" className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-purple-600 transition-colors inline-block">
                Explorar Categorías
              </link_1.default>
            </framer_motion_1.motion.div>
          </framer_motion_1.motion.div>

          {/* Scroll Indicator */}
          <framer_motion_1.motion.div className="absolute bottom-8 left-1/2 transform -translate-x-1/2" animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
            <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
              <framer_motion_1.motion.div className="w-1 h-3 bg-white rounded-full mt-2" animate={{ y: [0, 12, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}/>
            </div>
          </framer_motion_1.motion.div>
        </div>
      </div>

    </section>);
}
