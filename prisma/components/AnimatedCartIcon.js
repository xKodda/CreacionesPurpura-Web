"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AnimatedCartIcon;
const lucide_react_1 = require("lucide-react");
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
function AnimatedCartIcon({ itemCount = 0, onClick }) {
    const controls = (0, framer_motion_1.useAnimation)();
    const prevCount = (0, react_1.useRef)(itemCount);
    (0, react_1.useEffect)(() => {
        if (itemCount > 0 && itemCount !== prevCount.current) {
            controls.start({ scale: [1, 1.2, 0.95, 1.1, 1], transition: { duration: 0.5 } });
            prevCount.current = itemCount;
        }
    }, [itemCount, controls]);
    return (<framer_motion_1.motion.div className="relative cursor-pointer" onClick={onClick} animate={controls} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
      <lucide_react_1.ShoppingCart className="w-7 h-7 text-purple-600"/>
      {itemCount > 0 && (<framer_motion_1.motion.span key={itemCount} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }} className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow">
          {itemCount > 99 ? '99+' : itemCount}
        </framer_motion_1.motion.span>)}
    </framer_motion_1.motion.div>);
}
