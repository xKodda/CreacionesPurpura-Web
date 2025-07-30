"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { CheckCircle, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validaciones
    if (!name.trim()) {
      setError("El nombre es obligatorio");
      return;
    }

    if (!email.trim()) {
      setError("El correo electrónico es obligatorio");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al registrar usuario");
      }

      setSuccess(true);
      
      // Auto login después del registro exitoso
      setTimeout(async () => {
        const loginRes = await signIn("credentials", {
          redirect: false,
          email: email.trim().toLowerCase(),
          password,
        });

        if (loginRes?.ok) {
          router.push("/");
        } else {
          router.push("/login");
        }
      }, 1500);

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Error al registrar usuario";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-fondo">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative">
        {success && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-brand-fondoSec border-2 border-brand-acento rounded-2xl z-10 animate-toast-in shadow-lg">
            <CheckCircle className="h-10 w-10 text-brand-acento mb-2" />
            <span className="text-brand-principal font-semibold text-lg text-center">¡Registro exitoso! Iniciando sesión...</span>
          </div>
        )}
        
        <h1 className="text-2xl font-bold text-brand-principal mb-6 text-center">Crear Cuenta</h1>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-brand-principal mb-1">
              Nombre completo
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-acento border-gray-300 text-brand-principal"
              placeholder="Tu nombre completo"
              autoComplete="name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-brand-principal mb-1">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-acento border-gray-300 text-brand-principal"
              placeholder="tu@email.com"
              autoComplete="email"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-brand-principal mb-1">
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-acento border-gray-300 text-brand-principal pr-12"
                placeholder="••••••••"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-brand-principal"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-brand-principal mb-1">
              Confirmar contraseña
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-acento border-gray-300 text-brand-principal pr-12"
                placeholder="••••••••"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-brand-principal"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          
          <button
            type="submit"
            className="w-full bg-brand-acento text-white py-3 px-6 rounded-lg hover:bg-brand-principal transition-colors shadow-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-brand-principal mr-2"></span>
                Creando cuenta...
              </>
            ) : (
              "Crear Cuenta"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login" className="text-brand-acento hover:text-brand-principal font-medium">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 