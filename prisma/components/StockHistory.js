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
exports.default = StockHistory;
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
function StockHistory({ productId }) {
    const [data, setData] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const [currentPage, setCurrentPage] = (0, react_1.useState)(1);
    (0, react_1.useEffect)(() => {
        fetchStockHistory();
    }, [currentPage, productId]);
    const fetchStockHistory = () => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: '20'
            });
            if (productId) {
                params.append('productId', productId);
            }
            const response = yield fetch(`/api/inventory/history?${params}`);
            if (!response.ok) {
                throw new Error('Error al cargar historial de stock');
            }
            const historyData = yield response.json();
            setData(historyData);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        }
        finally {
            setLoading(false);
        }
    });
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-CL', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    const getChangeIcon = (change) => {
        if (change > 0) {
            return <lucide_react_1.TrendingUp className="h-4 w-4 text-green-500"/>;
        }
        else if (change < 0) {
            return <lucide_react_1.TrendingDown className="h-4 w-4 text-red-500"/>;
        }
        return <lucide_react_1.Package className="h-4 w-4 text-gray-500"/>;
    };
    const getChangeColor = (change) => {
        if (change > 0)
            return 'text-green-600';
        if (change < 0)
            return 'text-red-600';
        return 'text-gray-600';
    };
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
          <lucide_react_1.History className="h-5 w-5 text-red-500 mr-2"/>
          <span className="text-red-700">{error}</span>
        </div>
      </div>);
    }
    if (!data || data.history.length === 0) {
        return (<div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <div className="flex items-center justify-center mb-2">
          <lucide_react_1.History className="h-8 w-8 text-gray-400 mr-2"/>
          <span className="text-lg font-semibold text-gray-600">Sin historial</span>
        </div>
        <p className="text-gray-500">No hay registros de cambios de stock.</p>
      </div>);
    }
    return (<div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <lucide_react_1.History className="h-5 w-5 text-blue-500 mr-2"/>
        Historial de Stock
        {productId && <span className="ml-2 text-sm text-gray-500">(Producto específico)</span>}
      </h3>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Producto
              </th>
              {!productId && (<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>)}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cambio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock Anterior
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock Nuevo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Razón
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.history.map((item) => {
            var _a;
            return (<tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.product.name}
                </td>
                {!productId && (<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {((_a = item.product.category) === null || _a === void 0 ? void 0 : _a.name) || 'Sin categoría'}
                  </td>)}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getChangeIcon(item.change)}
                    <span className={`ml-2 text-sm font-semibold ${getChangeColor(item.change)}`}>
                      {item.change > 0 ? '+' : ''}{item.change}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.previousStock}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {item.newStock}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>
                    <div>{item.reason}</div>
                    {item.notes && (<div className="text-xs text-gray-400 mt-1">{item.notes}</div>)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(item.createdAt)}
                </td>
              </tr>);
        })}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {data.pagination.pages > 1 && (<div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Mostrando página {data.pagination.page} de {data.pagination.pages} 
            ({data.pagination.total} registros totales)
          </div>
          <div className="flex space-x-2">
            <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
              Anterior
            </button>
            <button onClick={() => setCurrentPage(Math.min(data.pagination.pages, currentPage + 1))} disabled={currentPage === data.pagination.pages} className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
              Siguiente
            </button>
          </div>
        </div>)}
    </div>);
}
