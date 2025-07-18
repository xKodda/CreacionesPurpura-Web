'use client';

import { ShoppingCart } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface AnimatedCartIconProps {
  itemCount?: number;
  onClick?: () => void;
}

export default function AnimatedCartIcon({ itemCount = 0, onClick }: AnimatedCartIconProps) {
  const controls = useAnimation();
  const prevCount = useRef(itemCount);

  useEffect(() => {
    if (itemCount > 0 && itemCount !== prevCount.current) {
      controls.start({ scale: [1, 1.2, 0.95, 1.1, 1], transition: { duration: 0.5 } });
      prevCount.current = itemCount;
    }
  }, [itemCount, controls]);

  return (
    <motion.div
      className="relative cursor-pointer"
      onClick={onClick}
      animate={controls}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
    >
      <ShoppingCart className="w-7 h-7 text-purple-600" />
      {itemCount > 0 && (
        <motion.span
          key={itemCount}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow"
        >
          {itemCount > 99 ? '99+' : itemCount}
        </motion.span>
      )}
    </motion.div>
  );
} 