"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
exports.default = RootLayout;
const google_1 = require("next/font/google");
require("./globals.css");
const Header_1 = __importDefault(require("@/components/Header"));
const Footer_1 = __importDefault(require("@/components/Footer"));
const ScrollToTop_1 = __importDefault(require("@/components/ScrollToTop"));
const CartContext_1 = require("@/contexts/CartContext");
const ProductContext_1 = require("@/contexts/ProductContext");
const SessionWrapper_1 = __importDefault(require("./SessionWrapper"));
const inter = (0, google_1.Inter)({ subsets: ["latin"] });
exports.metadata = {
    title: "Creaciones Púrpura - Tienda Online 2025",
    description: "Tienda online de papelería, cotillón y manualidades. Envíos a todo Chile. Compra fácil, rápida y segura.",
    icons: {
        icon: '/IconWeb.svg',
        shortcut: '/IconWeb.svg',
        apple: '/IconWeb.svg',
    },
};
function RootLayout({ children, }) {
    return (<html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/IconWeb.svg" type="image/svg+xml"/>
        <link rel="shortcut icon" href="/IconWeb.svg" type="image/svg+xml"/>
        <link rel="apple-touch-icon" href="/IconWeb.svg"/>
      </head>
      <body className={inter.className}>
        <SessionWrapper_1.default>
          <ProductContext_1.ProductProvider>
            <CartContext_1.CartProvider>
              <div className="min-h-screen flex flex-col">
                <Header_1.default />
                <main className="flex-1">
                  {children}
                </main>
                <Footer_1.default />
                <ScrollToTop_1.default />
              </div>
            </CartContext_1.CartProvider>
          </ProductContext_1.ProductProvider>
        </SessionWrapper_1.default>
      </body>
    </html>);
}
