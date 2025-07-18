"use strict";
'use client';
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
exports.default = InventoryAlerts;
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
function InventoryAlerts() {
    const [data, setData] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        fetchInventoryData();
    }, []);
    const fetchInventoryData = () => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            const response = yield fetch('/api/inventory/alerts');
            if (!response.ok) {
                throw new Error('Error al cargar datos de inventario');
            }
            const inventoryData = yield response.json();
            setData(inventoryData);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        }
        finally {
            setLoading(false);
        }
    });
    if (loading) {
        return (<div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>);
    }
    if (error) {
        return (<div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <lucide_react_1.AlertTriangle className="h-5 w-5 text-red-500 mr-2"/>
          <span className="text-red-700">{error}</span>
        </div>
      </div>);
    }
    if (!data)
        return null;
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP'
        }).format(amount);
    };
    return (<div className="space-y-6">
      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <lucide_react_1.Package className="h-8 w-8 text-blue-500 mr-3"/>
            <div>
              <p className="text-sm text-gray-600">Total Productos</p>
              <p className="text-2xl font-bold text-gray-900">{data.stats.totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <lucide_react_1.AlertTriangle className="h-8 w-8 text-yellow-500 mr-3"/>
            <div>
              <p className="text-sm text-gray-600">Stock Bajo</p>
              <p className="text-2xl font-bold text-yellow-600">{data.stats.totalLowStock}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <lucide_react_1.AlertTriangle className="h-8 w-8 text-red-500 mr-3"/>
            <div>
              <p className="text-sm text-gray-600">Sin Stock</p>
              <p className="text-2xl font-bold text-red-600">{data.stats.totalOutOfStock}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <lucide_react_1.TrendingUp className="h-8 w-8 text-green-500 mr-3"/>
            <div>
              <p className="text-sm text-gray-600">Valor Total</p>
              <p className="text-lg font-bold text-green-600">{formatCurrency(data.stats.totalValue)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alertas de stock bajo */}
      {data.alerts.lowStock.length > 0 && (<div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <lucide_react_1.AlertTriangle className="h-5 w-5 text-yellow-500 mr-2"/>
            Productos con Stock Bajo
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock Actual
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock Mínimo
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.alerts.lowStock.map((product) => {
                var _a;
                return (<tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {((_a = product.category) === null || _a === void 0 ? void 0 : _a.name) || 'Sin categoría'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.minStock}
                    </td>
                  </tr>);
            })}
              </tbody>
            </table>
          </div>
        </div>)}

      {/* Productos sin stock */}
      {data.alerts.outOfStock.length > 0 && (<div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <lucide_react_1.AlertTriangle className="h-5 w-5 text-red-500 mr-2"/>
            Productos Sin Stock
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vistas
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.alerts.outOfStock.map((product) => {
                var _a;
                return (<tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {((_a = product.category) === null || _a === void 0 ? void 0 : _a.name) || 'Sin categoría'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.views}
                    </td>
                  </tr>);
            })}
              </tbody>
            </table>
          </div>
        </div>)}

      {/* Productos más vistos */}
      {data.alerts.topViewed.length > 0 && (<div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <lucide_react_1.Eye className="h-5 w-5 text-blue-500 mr-2"/>
            Productos Más Vistos
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vistas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.alerts.topViewed.map((product) => {
                var _a;
                return (<tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {((_a = product.category) === null || _a === void 0 ? void 0 : _a.name) || 'Sin categoría'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-semibold">
                      {product.views}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.stock}
                    </td>
                  </tr>);
            })}
              </tbody>
            </table>
          </div>
        </div>)}

      {data.alerts.lowStock.length === 0 && data.alerts.outOfStock.length === 0 && (<div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <lucide_react_1.TrendingUp className="h-8 w-8 text-green-500 mr-2"/>
            <span className="text-lg font-semibold text-green-800">¡Excelente!</span>
          </div>
          <p className="text-green-700">No hay alertas de inventario. Todo está bajo control.</p>
        </div>)}
    </div>);
}
