"use strict";
"use client";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LoginPage;
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const react_2 = require("next-auth/react");
const lucide_react_1 = require("lucide-react");
function LoginPage() {
    const [email, setEmail] = (0, react_1.useState)("");
    const [password, setPassword] = (0, react_1.useState)("");
    const [error, setError] = (0, react_1.useState)("");
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [success, setSuccess] = (0, react_1.useState)(false);
    const router = (0, navigation_1.useRouter)();
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        setError("");
        setLoading(true);
        const res = yield (0, react_2.signIn)("credentials", {
            redirect: false,
            email,
            password,
        });
        setLoading(false);
        if (res === null || res === void 0 ? void 0 : res.ok) {
            setSuccess(true);
            setTimeout(() => {
                router.push("/dashboard");
            }, 1200);
        }
        else {
            setError("Correo o contraseña incorrectos, o usuario no autorizado.");
        }
    });
    return (<div className="min-h-screen flex items-center justify-center bg-brand-fondo">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative">
        {success && (<div className="absolute inset-0 flex flex-col items-center justify-center bg-brand-fondoSec border-2 border-brand-acento rounded-2xl z-10 animate-toast-in shadow-lg">
            <lucide_react_1.CheckCircle className="h-10 w-10 text-brand-acento mb-2"/>
            <span className="text-brand-principal font-semibold text-lg text-center">Bienvenida Karen, ingresando...</span>
          </div>)}
        <h1 className="text-2xl font-bold text-brand-principal mb-6 text-center">Iniciar Sesión</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-brand-principal mb-1">
              Correo electrónico
            </label>
            <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-acento border-gray-300 text-brand-principal" placeholder="correo@empresa.cl" autoComplete="username"/>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-brand-principal mb-1">
              Contraseña
            </label>
            <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-acento border-gray-300 text-brand-principal" placeholder="••••••••" autoComplete="current-password"/>
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button type="submit" className="w-full bg-brand-acento text-white py-3 px-6 rounded-lg hover:bg-brand-principal transition-colors shadow-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center" disabled={loading}>
            {loading ? (<>
                <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-brand-principal mr-2"></span>
                Ingresando...
              </>) : ("Iniciar Sesión")}
          </button>
        </form>
      </div>
    </div>);
}
