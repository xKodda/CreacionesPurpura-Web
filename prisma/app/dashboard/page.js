"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DashboardPage;
const react_1 = require("next-auth/react");
const navigation_1 = require("next/navigation");
const react_2 = require("react");
const DashboardContent_1 = __importDefault(require("./DashboardContent"));
function DashboardPage() {
    const { data: session, status } = (0, react_1.useSession)();
    const router = (0, navigation_1.useRouter)();
    (0, react_2.useEffect)(() => {
        if (status === "loading")
            return;
        if (!session) {
            router.push("/login");
        }
        else if (session.user.role !== "admin" && session.user.email !== "creacionespurpura.papeleria@gmail.com") {
            // Si no es admin, redirigir a home
            router.push("/");
        }
    }, [session, status, router]);
    if (status === "loading") {
        return (<div className="min-h-screen bg-gradient-to-br from-brand-fondo via-white to-brand-fondoSec flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-acento border-t-transparent mx-auto mb-4"></div>
          <p className="text-brand-principal">Cargando...</p>
        </div>
      </div>);
    }
    if (!session || (session.user.role !== "admin" && session.user.email !== "creacionespurpura.papeleria@gmail.com")) {
        return null;
    }
    return <DashboardContent_1.default />;
}
