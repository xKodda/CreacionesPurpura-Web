# Creaciones Púrpura - E-commerce

Un sitio web de e-commerce moderno construido con Next.js 15, TypeScript y Tailwind CSS, diseñado para vender productos de papelería, cotillón y manualidades en Chile.

## 🚀 Características

### MVP (Funcionalidades Básicas)
- ✅ **Layout Responsivo**: Header y footer con navegación completa
- ✅ **Página Principal**: Hero section y grid de productos destacados
- ✅ **Catálogo de Productos**: Grid de productos con filtros y ordenamiento
- ✅ **Carrito de Compras**: Funcionalidad básica de carrito
- ✅ **Página de Contacto**: Formulario de contacto y información
- ✅ **Página de Categorías**: Organización de productos por categorías
- ✅ **Diseño Moderno**: UI/UX con Tailwind CSS y componentes interactivos

### Componentes Principales
- **Header**: Navegación, logo, carrito y menú móvil
- **Footer**: Información de contacto y enlaces útiles
- **ProductCard**: Tarjeta de producto con badges, wishlist y quick add
- **Layout**: Estructura base con header y footer

### Rutas Implementadas
- `/` - Página principal con hero y productos destacados
- `/productos` - Catálogo completo con filtros
- `/categorias` - Organización por categorías
- `/carrito` - Carrito de compras
- `/contacto` - Formulario de contacto

## 🛠️ Tecnologías

- **Next.js 15** - Framework de React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de CSS utility-first
- **Lucide React** - Iconos modernos
- **Headless UI** - Componentes de UI accesibles

## 📦 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd creacionespurpura-web
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

## 🏗️ Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── carrito/           # Página del carrito
│   │   ├── carrito-page.tsx  # Componente principal del carrito
│   │   └── page.tsx          # Página que importa el componente
│   ├── categorias/        # Página de categorías
│   │   ├── categorias-page.tsx  # Componente principal de categorías
│   │   └── page.tsx           # Página que importa el componente
│   ├── contacto/          # Página de contacto
│   │   ├── contacto-page.tsx  # Componente principal de contacto
│   │   └── page.tsx          # Página que importa el componente
│   ├── productos/         # Página de productos
│   │   ├── productos-page.tsx  # Componente principal de productos
│   │   └── page.tsx          # Página que importa el componente
│   ├── globals.css        # Estilos globales
│   ├── home-page.tsx      # Componente principal de la página de inicio
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página principal que importa home-page
├── components/            # Componentes reutilizables
│   ├── Header.tsx         # Header con navegación
│   ├── Footer.tsx         # Footer con información
│   └── ProductCard.tsx    # Tarjeta de producto
└── data/                  # Datos de ejemplo
    └── products.ts        # Productos y categorías
```

## 🎨 Diseño

El proyecto utiliza un diseño moderno con:
- **Paleta de colores**: Púrpura como color principal
- **Tipografía**: Inter para mejor legibilidad
- **Responsive**: Diseño adaptativo para móviles y desktop
- **Accesibilidad**: Componentes accesibles con Headless UI

## 📱 Funcionalidades del MVP

### Productos
- Grid responsivo de productos
- Filtros por categoría (Papelería, Cotillón)
- Ordenamiento por precio y nombre
- Vista de lista y grid
- Badges para productos nuevos y en oferta

### Carrito
- Agregar, quitar y actualizar productos
- Resumen de compra
- Checkout con WebPay

## 📞 Contacto

- **Email**: contacto@creacionespurpura.cl
- **Teléfono**: +56 9 1234 5678
- **Dirección**: Santiago, Chile

---

Desarrollado con ❤️ para Creaciones Púrpura
© 2025 Creaciones Púrpura. Todos los derechos reservados.
