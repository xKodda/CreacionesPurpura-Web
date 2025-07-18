"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Footer;
const link_1 = __importDefault(require("next/link"));
const lucide_react_1 = require("lucide-react");
function Footer() {
    return (<footer className="bg-brand-principal text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-brand-acento mb-4">Creaciones Púrpura</h3>
            <p className="text-brand-fondoSec mb-4">
              Tienda online de papelería, cotillón y manualidades. Calidad, variedad y envíos a todo Chile.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/creacionespurpura.papeleria/" className="text-brand-fondoDest hover:text-brand-acento transition-colors" aria-label="Instagram">
                <lucide_react_1.Instagram className="h-6 w-6"/>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <link_1.default href="/productos" className="text-brand-fondoSec hover:text-brand-acento transition-colors">
                  Productos
                </link_1.default>
              </li>
              <li>
                <link_1.default href="/categorias" className="text-brand-fondoSec hover:text-brand-acento transition-colors">
                  Categorías
                </link_1.default>
              </li>
              <li>
                <link_1.default href="/ofertas" className="text-brand-fondoSec hover:text-brand-acento transition-colors">
                  Ofertas
                </link_1.default>
              </li>
              <li>
                <link_1.default href="/nuevos" className="text-brand-fondoSec hover:text-brand-acento transition-colors">
                  Nuevos Productos
                </link_1.default>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contacto</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <lucide_react_1.Phone className="h-4 w-4 text-brand-acento"/>
                <span className="text-brand-fondoSec">+56 9 1234 5678</span>
              </div>
              <div className="flex items-center space-x-2">
                <lucide_react_1.Mail className="h-4 w-4 text-brand-acento"/>
                <span className="text-brand-fondoSec">contacto@creacionespurpura.cl</span>
              </div>
              <div className="flex items-center space-x-2">
                <lucide_react_1.MapPin className="h-4 w-4 text-brand-acento"/>
                <span className="text-brand-fondoSec">Santiago, Chile</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-brand-detalle pt-6 text-center relative">
          <p className="text-brand-fondoDest">
            © 2025 Creaciones Púrpura. Todos los derechos reservados.
          </p>
          <p className="text-brand-fondoSec text-xs mt-1">
            Desarrollado por{' '}
            <a href="https://clikium.cl/" target="_blank" rel="noopener noreferrer" className="font-bold text-brand-acento hover:underline transition-colors">
              Clikium
            </a>
          </p>
          <link_1.default href="/login" className="hidden md:inline-block absolute right-0 top-1/2 -translate-y-1/2 text-xs text-brand-fondoSec opacity-50 hover:opacity-90 hover:text-brand-acento transition-all" tabIndex={-1} aria-label="Acceso administrador">
            Iniciar sesión
          </link_1.default>
        </div>
      </div>
    </footer>);
}
