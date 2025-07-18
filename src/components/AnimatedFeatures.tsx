'use client';

import { motion } from 'framer-motion';
import { Star, Truck, Palette } from 'lucide-react';

const features = [
  {
    icon: Star,
    title: 'Calidad Premium',
    description: 'Productos de la más alta calidad para tus manualidades y fiestas',
    color: 'purple'
  },
  {
    icon: Truck,
    title: 'Envío Rápido',
    description: 'Recibe tus productos en tiempo récord para no perder la creatividad',
    color: 'blue'
  },
  {
    icon: Palette,
    title: 'Variedad Completa',
    description: 'Desde papelería hasta cotillón, tenemos todo lo que necesitas',
    color: 'green'
  }
];

const colorClasses = {
  purple: 'bg-purple-100 text-purple-600',
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600'
};

export default function AnimatedFeatures() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="text-center group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -10 }}
            >
              <motion.div
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${colorClasses[feature.color as keyof typeof colorClasses]}`}
                whileHover={{ 
                  scale: 1.1,
                  rotate: 360,
                  transition: { duration: 0.6 }
                }}
              >
                <feature.icon className="h-8 w-8" />
              </motion.div>
              
              <motion.h3
                className="text-xl font-semibold mb-2"
                whileHover={{ color: '#7c3aed' }}
                transition={{ duration: 0.3 }}
              >
                {feature.title}
              </motion.h3>
              
              <motion.p
                className="text-gray-600"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                {feature.description}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 