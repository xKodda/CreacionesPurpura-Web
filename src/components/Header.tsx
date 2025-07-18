'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import AnimatedCartIcon from './AnimatedCartIcon';
import { useCart } from '@/contexts/CartContext';
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { state } = useCart();
  const { data: session, status } = useSession();

  // Cierra el menú de usuario si se hace click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  return (
    <header className="bg-brand-fondo shadow-sm border-b border-brand-detalle sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center group/logo">
            <Image
              src="/creacionPurpuraLogo.png"
              alt="Creaciones Púrpura"
              width={150}
              height={40}
              className="h-10 w-auto transition-all duration-300 group-hover/logo:drop-shadow-lg group-hover/logo:-rotate-3"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-brand-principal hover:text-brand-acento transition-colors">
              Inicio
            </Link>
            <Link href="/productos" className="text-brand-principal hover:text-brand-acento transition-colors">
              Productos
            </Link>
            <Link href="/categorias" className="text-brand-principal hover:text-brand-acento transition-colors">
              Categorías
            </Link>
            <Link href="/contacto" className="text-brand-principal hover:text-brand-acento transition-colors">
              Contacto
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {/* Desktop: menú usuario visible arriba a la derecha */}
            {status === "authenticated" && session?.user && session.user.email === "creacionespurpura.papeleria@gmail.com" && (
              <div className="relative hidden md:block" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen((open) => !open)}
                  className="flex items-center gap-2 bg-brand-fondoSec px-3 py-1 rounded-lg border border-brand-acento text-brand-principal text-xs font-medium hover:bg-brand-acento/10 transition-all focus:outline-none focus:ring-2 focus:ring-brand-acento"
                  aria-haspopup="true"
                  aria-expanded={isUserMenuOpen}
                >
                  <span className="font-semibold">{session.user.name || session.user.email}</span>
                  <svg className={`w-4 h-4 ml-1 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </button>
                {/* Menú desplegable */}
                <div
                  className={`absolute right-0 mt-2 w-48 bg-white border border-brand-acento rounded-lg shadow-lg z-50 transition-all duration-200 origin-top opacity-0 scale-y-95 pointer-events-none ${isUserMenuOpen ? 'opacity-100 scale-y-100 pointer-events-auto' : ''}`}
                  style={{ minWidth: '180px' }}
                >
                  <Link
                    href="/dashboard"
                    className="block px-4 py-3 text-brand-principal hover:bg-brand-fondoSec hover:text-brand-acento font-medium transition-colors rounded-t-lg"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Panel de administración
                  </Link>
                  <button
                    onClick={() => { setIsUserMenuOpen(false); signOut({ callbackUrl: "/login" }); }}
                    className="w-full text-left px-4 py-3 text-brand-acento hover:bg-brand-fondoSec hover:text-brand-principal font-medium transition-colors rounded-b-lg border-t border-brand-fondoSec"
                  >
                    Salir
                  </button>
                </div>
              </div>
            )}
            {/* Otros usuarios (no Karen) en desktop */}
            {status === "authenticated" && session?.user && session.user.email !== "creacionespurpura.papeleria@gmail.com" && (
              <div className="flex items-center gap-2 bg-brand-fondoSec px-3 py-1 rounded-lg border border-brand-acento text-brand-principal text-xs font-medium hidden md:flex">
                <span className="hidden sm:inline">{session.user.name || session.user.email}</span>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="ml-2 text-brand-acento hover:text-brand-principal font-bold text-xs"
                  title="Cerrar sesión"
                >
                  Salir
                </button>
              </div>
            )}
            {/* Login link visible solo si no hay sesión */}
            {status === "unauthenticated" && (
              <Link href="/login" className="text-xs text-brand-principal opacity-40 hover:opacity-90 hover:text-brand-acento transition-all font-medium mr-2 hidden md:inline" tabIndex={-1} aria-label="Acceso administrador">
                Iniciar sesión
              </Link>
            )}
            <Link href="/carrito" id="cart-icon">
              <AnimatedCartIcon itemCount={state.itemCount} />
            </Link>
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-brand-principal hover:text-brand-acento transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-brand-detalle">
              <Link 
                href="/" 
                className="block px-3 py-2 text-brand-principal hover:text-brand-acento transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link 
                href="/productos" 
                className="block px-3 py-2 text-brand-principal hover:text-brand-acento transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Productos
              </Link>
              <Link 
                href="/categorias" 
                className="block px-3 py-2 text-brand-principal hover:text-brand-acento transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Categorías
              </Link>
              <Link 
                href="/contacto" 
                className="block px-3 py-2 text-brand-principal hover:text-brand-acento transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contacto
              </Link>
              {/* Menú usuario Karen solo en mobile */}
              {status === "authenticated" && session?.user && session.user.email === "creacionespurpura.papeleria@gmail.com" && (
                <div className="mt-4 border-t border-brand-fondoSec pt-2">
                  <button
                    onClick={() => window.location.href = '/dashboard'}
                    className="block w-full text-left px-3 py-2 text-brand-principal hover:bg-brand-fondoSec hover:text-brand-acento font-medium rounded"
                  >
                    Panel de administración
                  </button>
                  <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="block w-full text-left px-3 py-2 text-brand-acento hover:bg-brand-fondoSec hover:text-brand-principal font-medium rounded mt-1"
                  >
                    Salir
                  </button>
                </div>
              )}
              {/* Otros usuarios (no Karen) en mobile */}
              {status === "authenticated" && session?.user && session.user.email !== "creacionespurpura.papeleria@gmail.com" && (
                <div className="mt-4 border-t border-brand-fondoSec pt-2">
                  <span className="block px-3 py-2 text-brand-principal font-medium">{session.user.name || session.user.email}</span>
                  <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="block w-full text-left px-3 py-2 text-brand-acento hover:bg-brand-fondoSec hover:text-brand-principal font-medium rounded mt-1"
                  >
                    Salir
                  </button>
                </div>
              )}
              {/* Login link solo si no hay sesión */}
              {status === "unauthenticated" && (
                <Link href="/login" className="block px-3 py-2 text-xs text-brand-principal opacity-40 hover:opacity-90 hover:text-brand-acento transition-all font-medium mt-2" tabIndex={-1} aria-label="Acceso administrador">
                  Iniciar sesión
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
} 