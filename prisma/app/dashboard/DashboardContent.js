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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DashboardContent;
const react_1 = require("react");
const react_2 = require("next-auth/react");
const lucide_react_1 = require("lucide-react");
const ImageUpload_1 = __importDefault(require("@/components/ImageUpload"));
const ProductContext_1 = require("@/contexts/ProductContext");
const InventoryAlerts_1 = __importDefault(require("@/components/InventoryAlerts"));
const StockHistory_1 = __importDefault(require("@/components/StockHistory"));
const react_3 = require("@headlessui/react");
function DashboardContent() {
    var _a;
    // Estado para el formulario de producto
    const [form, setForm] = (0, react_1.useState)({
        name: "",
        description: "",
        price: "",
        stock: "",
        imageUrl: "",
        categoryId: "",
    });
    const [formError, setFormError] = (0, react_1.useState)("");
    const [formSuccess, setFormSuccess] = (0, react_1.useState)("");
    const [formLoading, setFormLoading] = (0, react_1.useState)(false);
    const { products, categories, loading: productsLoading, error: productsError, refreshProducts, refreshCategories } = (0, ProductContext_1.useProductContext)();
    // Estado para la edición de productos
    const [editModalOpen, setEditModalOpen] = (0, react_1.useState)(false);
    const [productToEdit, setProductToEdit] = (0, react_1.useState)(null);
    const [editForm, setEditForm] = (0, react_1.useState)({ name: '', description: '', price: '', stock: '', imageUrl: '', categoryId: '' });
    const [editLoading, setEditLoading] = (0, react_1.useState)(false);
    const [editError, setEditError] = (0, react_1.useState)('');
    const [editSuccess, setEditSuccess] = (0, react_1.useState)('');
    // Estado para el modal de agregar producto
    const [addModalOpen, setAddModalOpen] = (0, react_1.useState)(false);
    // Estado para eliminar productos
    const [deleteModalOpen, setDeleteModalOpen] = (0, react_1.useState)(false);
    const [productToDelete, setProductToDelete] = (0, react_1.useState)(null);
    const [deleteLoading, setDeleteLoading] = (0, react_1.useState)(false);
    const [deleteError, setDeleteError] = (0, react_1.useState)('');
    // Estado para crear categorías
    const [categoryModalOpen, setCategoryModalOpen] = (0, react_1.useState)(false);
    const [categoryForm, setCategoryForm] = (0, react_1.useState)({ name: '', description: '' });
    const [categoryLoading, setCategoryLoading] = (0, react_1.useState)(false);
    const [categoryError, setCategoryError] = (0, react_1.useState)('');
    const [categorySuccess, setCategorySuccess] = (0, react_1.useState)('');
    // Estado para las pestañas del dashboard
    const [activeTab, setActiveTab] = (0, react_1.useState)('products');
    // Pre-cargar datos al abrir modal de edición
    (0, react_1.useEffect)(() => {
        var _a, _b;
        if (productToEdit) {
            setEditForm({
                name: productToEdit.name || '',
                description: productToEdit.description || '',
                price: ((_a = productToEdit.price) === null || _a === void 0 ? void 0 : _a.toString()) || '',
                stock: ((_b = productToEdit.stock) === null || _b === void 0 ? void 0 : _b.toString()) || '',
                imageUrl: productToEdit.imageUrl || '',
                categoryId: productToEdit.categoryId || '',
            });
            setEditError('');
            setEditSuccess('');
        }
    }, [productToEdit]);
    // useEffect para cargar categorías si no están disponibles
    (0, react_1.useEffect)(() => {
        if (categories.length === 0) {
            refreshCategories();
        }
    }, [categories.length, refreshCategories]);
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => (Object.assign(Object.assign({}, prev), { [name]: value })));
        setFormError("");
        setFormSuccess("");
    };
    const handleProductSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        setFormError("");
        setFormSuccess("");
        setFormLoading(true);
        // Validación básica
        if (!form.name.trim() || !form.price || !form.stock || !form.categoryId) {
            setFormError("Nombre, precio, stock y categoría son obligatorios.");
            setFormLoading(false);
            return;
        }
        if (isNaN(Number(form.price)) || isNaN(Number(form.stock))) {
            setFormError("Precio y stock deben ser números válidos.");
            setFormLoading(false);
            return;
        }
        // Llamada al endpoint API
        const res = yield fetch("/api/productos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                name: form.name,
                description: form.description,
                price: Number(form.price),
                stock: Number(form.stock),
                imageUrl: form.imageUrl,
                categoryId: form.categoryId,
            }),
        });
        setFormLoading(false);
        if (res.ok) {
            setForm({ name: "", description: "", price: "", stock: "", imageUrl: "", categoryId: "" });
            setFormSuccess("¡Producto creado exitosamente!");
            setAddModalOpen(false);
            // Recargar productos
            refreshProducts();
        }
        else {
            setFormError("Error al crear el producto. Intenta nuevamente.");
        }
    });
    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditForm((prev) => (Object.assign(Object.assign({}, prev), { [name]: value })));
        setEditError('');
        setEditSuccess('');
    };
    const handleEditSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        setEditError('');
        setEditSuccess('');
        setEditLoading(true);
        if (!productToEdit) {
            setEditError('No hay producto seleccionado para editar.');
            setEditLoading(false);
            return;
        }
        if (!editForm.name.trim() || !editForm.price || !editForm.stock || !editForm.categoryId) {
            setEditError('Nombre, precio, stock y categoría son obligatorios.');
            setEditLoading(false);
            return;
        }
        if (isNaN(Number(editForm.price)) || isNaN(Number(editForm.stock))) {
            setEditError('Precio y stock deben ser números válidos.');
            setEditLoading(false);
            return;
        }
        // Llamada al endpoint API para actualizar
        const res = yield fetch(`/api/productos/${productToEdit.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                name: editForm.name,
                description: editForm.description,
                price: Number(editForm.price),
                stock: Number(editForm.stock),
                imageUrl: editForm.imageUrl,
                categoryId: editForm.categoryId,
            }),
        });
        setEditLoading(false);
        if (res.ok) {
            setEditSuccess('¡Producto actualizado exitosamente!');
            // Recargar productos
            refreshProducts();
            setTimeout(() => {
                setEditModalOpen(false);
                setProductToEdit(null);
            }, 1000);
        }
        else {
            setEditError('Error al actualizar el producto. Intenta nuevamente.');
        }
    });
    const handleDelete = () => __awaiter(this, void 0, void 0, function* () {
        if (!productToDelete)
            return;
        setDeleteLoading(true);
        setDeleteError('');
        try {
            const res = yield fetch(`/api/productos/${productToDelete.id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (res.ok) {
                refreshProducts();
                setDeleteModalOpen(false);
                setProductToDelete(null);
            }
            else {
                setDeleteError('Error al eliminar el producto. Intenta nuevamente.');
            }
        }
        catch (error) {
            setDeleteError('Error de conexión. Intenta nuevamente.');
        }
        finally {
            setDeleteLoading(false);
        }
    });
    const confirmDelete = (product) => {
        setProductToDelete(product);
        setDeleteModalOpen(true);
    };
    const handleCategoryFormChange = (e) => {
        const { name, value } = e.target;
        setCategoryForm((prev) => (Object.assign(Object.assign({}, prev), { [name]: value })));
        setCategoryError('');
        setCategorySuccess('');
    };
    const handleImageUpload = (imageUrl) => {
        setForm(prev => (Object.assign(Object.assign({}, prev), { imageUrl })));
    };
    const handleEditImageUpload = (imageUrl) => {
        setEditForm(prev => (Object.assign(Object.assign({}, prev), { imageUrl })));
    };
    const handleCategorySubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        setCategoryError('');
        setCategorySuccess('');
        setCategoryLoading(true);
        if (!categoryForm.name.trim()) {
            setCategoryError('El nombre de la categoría es obligatorio.');
            setCategoryLoading(false);
            return;
        }
        try {
            const res = yield fetch('/api/categorias', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(categoryForm),
            });
            if (res.ok) {
                refreshCategories();
                setCategoryForm({ name: '', description: '' });
                setCategorySuccess('¡Categoría creada exitosamente!');
                setTimeout(() => setCategoryModalOpen(false), 1000);
            }
            else {
                setCategoryError('Error al crear la categoría. Intenta nuevamente.');
            }
        }
        catch (error) {
            setCategoryError('Error de conexión. Intenta nuevamente.');
        }
        finally {
            setCategoryLoading(false);
        }
    });
    // Agrupar productos por categoría
    const productsByCategory = categories.map((cat) => (Object.assign(Object.assign({}, cat), { products: products.filter((p) => { var _a; return ((_a = p.category) === null || _a === void 0 ? void 0 : _a.id) === cat.id; }) })));
    const [openCategory, setOpenCategory] = (0, react_1.useState)(((_a = categories[0]) === null || _a === void 0 ? void 0 : _a.id) || null);
    return (<div className="min-h-screen bg-gradient-to-br from-brand-fondo via-white to-brand-fondoSec flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 mb-8 relative">
        <button onClick={() => (0, react_2.signOut)({ callbackUrl: "/login" })} className="absolute top-6 right-6 bg-brand-fondoSec text-brand-principal border border-brand-acento rounded-lg px-4 py-2 text-sm font-medium hover:bg-brand-acento hover:text-white transition-colors shadow-sm">
          Cerrar sesión
        </button>
        <div className="flex items-center mb-6">
          <lucide_react_1.User className="h-8 w-8 text-brand-acento mr-3"/>
          <h1 className="text-2xl font-bold text-brand-principal">Panel de Administración</h1>
        </div>
        <p className="text-brand-principal mb-4">
          ¡Bienvenida, Karen! <span role="img" aria-label="saludo">👋</span> Aquí podrás gestionar productos, ver estadísticas y administrar tu tienda.
        </p>
        
        {/* Pestañas del dashboard */}
        <div className="flex space-x-1 mb-6 bg-brand-fondoSec rounded-lg p-1">
          <button onClick={() => setActiveTab('products')} className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${activeTab === 'products'
            ? 'bg-white text-brand-principal shadow-sm'
            : 'text-brand-principal hover:bg-white/50'}`}>
            <lucide_react_1.PlusCircle className="w-4 h-4"/>
            Productos
          </button>
          <button onClick={() => setActiveTab('inventory')} className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${activeTab === 'inventory'
            ? 'bg-white text-brand-principal shadow-sm'
            : 'text-brand-principal hover:bg-white/50'}`}>
            <lucide_react_1.BarChart3 className="w-4 h-4"/>
            Inventario
          </button>
          <button onClick={() => setActiveTab('history')} className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${activeTab === 'history'
            ? 'bg-white text-brand-principal shadow-sm'
            : 'text-brand-principal hover:bg-white/50'}`}>
            <lucide_react_1.History className="w-4 h-4"/>
            Historial
          </button>
        </div>

        {/* Contenido de las pestañas */}
        {activeTab === 'products' && (<>
            {/* Botón agregar producto */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-3">
                <button onClick={() => setAddModalOpen(true)} className="flex items-center gap-2 bg-brand-acento text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-brand-principal transition-colors">
                  <lucide_react_1.PlusCircle className="w-5 h-5"/> Agregar producto
                </button>
                <button onClick={() => setCategoryModalOpen(true)} className="flex items-center gap-2 bg-brand-fondoSec text-brand-principal border border-brand-acento px-4 py-2 rounded-lg font-semibold shadow hover:bg-brand-acento hover:text-white transition-colors">
                  <lucide_react_1.PlusCircle className="w-5 h-5"/> Nueva categoría
                </button>
              </div>
              <div className="text-sm text-brand-principal">
                {categories.length} categorías disponibles
              </div>
            </div>
          </>)}

        {/* Contenido de las pestañas */}
        {activeTab === 'products' && (<div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 mb-8 mt-8">
            <h2 className="text-xl font-bold text-brand-principal mb-4">Productos registrados</h2>
            {productsLoading ? (<div className="text-brand-principal animate-pulse text-center py-8">Cargando productos...</div>) : productsError ? (<div className="text-red-500 text-center py-8">{productsError}</div>) : products.length === 0 ? (<div className="text-brand-principal text-center py-8">No hay productos registrados.</div>) : (<div className="space-y-4">
                {productsByCategory.map((cat) => (<div key={cat.id} className="border rounded-lg shadow-sm">
                    <button className={`w-full flex items-center px-4 py-3 bg-brand-fondoSec hover:bg-brand-fondoSec/80 transition-colors rounded-t-lg focus:outline-none ${openCategory === cat.id ? 'border-b' : ''}`} onClick={() => setOpenCategory(openCategory === cat.id ? null : cat.id)} aria-expanded={openCategory === cat.id}>
                      <span className="font-semibold text-brand-principal flex-1 text-left">{cat.name}</span>
                      <span className="text-xs text-brand-principal mr-2">{cat.products.length} productos</span>
                      <svg className={`w-5 h-5 transition-transform ${openCategory === cat.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </button>
                    {openCategory === cat.id && (<div className="p-4 bg-white rounded-b-lg">
                        {cat.products.length === 0 ? (<div className="text-brand-principal text-center py-4">No hay productos en esta categoría.</div>) : (<div className="overflow-x-auto md:overflow-x-visible">
                            <table className="min-w-full text-sm text-left table-auto">
                              <thead>
                                <tr className="bg-brand-fondoSec">
                                  <th className="px-2 py-2 font-semibold text-brand-principal w-14">Imagen</th>
                                  <th className="px-2 py-2 font-semibold text-brand-principal whitespace-normal">Nombre</th>
                                  <th className="px-2 py-2 font-semibold text-brand-principal w-24">Precio</th>
                                  <th className="px-2 py-2 font-semibold text-brand-principal w-16">Stock</th>
                                  <th className="px-2 py-2 font-semibold text-brand-principal w-20">Estado</th>
                                  <th className="px-2 py-2 font-semibold text-brand-principal whitespace-normal">Categoría</th>
                                  <th className="px-2 py-2 font-semibold text-brand-principal w-20 text-center">Destacado</th>
                                  <th className="px-2 py-2 font-semibold text-brand-principal w-20 text-center">Acciones</th>
                                </tr>
                              </thead>
                              <tbody>
                                {cat.products.map((p) => (<tr key={p.id} className="border-b last:border-0 hover:bg-brand-fondoSec/60 transition-colors">
                                    <td className="px-2 py-2">
                                      {p.imageUrl ? (<img src={p.imageUrl} alt={p.name} className="h-10 w-10 object-cover rounded-lg border mx-auto"/>) : (<div className="h-10 w-10 bg-gray-100 rounded-lg border flex items-center justify-center mx-auto">
                                          <span className="text-xs text-gray-400">Sin imagen</span>
                                        </div>)}
                                    </td>
                                    <td className="px-2 py-2 text-brand-principal font-medium break-words max-w-[160px] whitespace-normal">{p.name}</td>
                                    <td className="px-2 py-2">${p.price.toLocaleString("es-CL")}</td>
                                    <td className="px-2 py-2">{p.stock}</td>
                                    <td className="px-2 py-2">
                                      {p.active ? (<span className="inline-block px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold">Activo</span>) : (<span className="inline-block px-2 py-1 rounded bg-gray-200 text-gray-500 text-xs font-semibold">Inactivo</span>)}
                                    </td>
                                    <td className="px-2 py-2 break-words max-w-[120px] whitespace-normal">{cat.name}</td>
                                    <td className="px-2 py-2 text-center">
                                      <react_3.Switch checked={p.featured} onChange={(value) => __awaiter(this, void 0, void 0, function* () {
                                    // Actualizar el campo 'featured' vía API
                                    try {
                                        yield fetch(`/api/productos/${p.id}`, {
                                            method: 'PUT',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify(Object.assign(Object.assign({}, p), { featured: value })),
                                        });
                                        refreshProducts();
                                    }
                                    catch (err) {
                                        alert('Error al actualizar destacado');
                                    }
                                })} className={`${p.featured ? 'bg-brand-acento' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}>
                                        <span className="sr-only">Marcar como destacado</span>
                                        <span className={`${p.featured ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}/>
                                      </react_3.Switch>
                                    </td>
                                    <td className="px-2 py-2 text-center">
                                      <div className="flex gap-2 justify-center">
                                        <button className="p-2 bg-brand-acento text-white rounded-lg hover:bg-brand-principal transition-colors shadow-sm" onClick={() => { setProductToEdit(p); setEditModalOpen(true); }} title="Editar producto">
                                          <lucide_react_1.Edit2 className="w-4 h-4"/>
                                        </button>
                                        <button className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-sm" onClick={() => confirmDelete(p)} title="Eliminar producto">
                                          <lucide_react_1.Trash2 className="w-4 h-4"/>
                                        </button>
                                      </div>
                                    </td>
                                  </tr>))}
                              </tbody>
                            </table>
                          </div>)}
                      </div>)}
                  </div>))}
              </div>)}
          </div>)}

        {activeTab === 'inventory' && (<div className="w-full max-w-6xl">
            <InventoryAlerts_1.default />
          </div>)}

        {activeTab === 'history' && (<div className="w-full max-w-6xl">
            <StockHistory_1.default />
          </div>)}
      </div>

      {/* Modal agregar producto */}
      {addModalOpen && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg relative animate-fadeIn max-h-[90vh] flex flex-col">
            <div className="p-8 pb-4 flex-shrink-0">
              <button className="absolute top-4 right-4 text-brand-acento hover:text-brand-principal text-xl font-bold" onClick={() => setAddModalOpen(false)} aria-label="Cerrar">
                ×
              </button>
              <h3 className="text-xl font-bold text-brand-principal mb-4">Agregar producto</h3>
            </div>
            <div className="px-8 pb-8 overflow-y-auto flex-1">
              <form onSubmit={handleProductSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-principal mb-1">Nombre *</label>
                  <input type="text" name="name" value={form.name} onChange={handleFormChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-acento border-gray-300 text-brand-principal" required/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-principal mb-1">Descripción</label>
                  <textarea name="description" value={form.description} onChange={handleFormChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-acento border-gray-300 text-brand-principal" rows={2}/>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-brand-principal mb-1">Precio *</label>
                    <input type="number" name="price" value={form.price} onChange={handleFormChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-acento border-gray-300 text-brand-principal" required/>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-brand-principal mb-1">Stock *</label>
                    <input type="number" name="stock" value={form.stock} onChange={handleFormChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-acento border-gray-300 text-brand-principal" required/>
                  </div>
                </div>
                
                <ImageUpload_1.default onImageUpload={handleImageUpload} currentImage={form.imageUrl}/>
                
                <div>
                  <label className="block text-sm font-medium text-brand-principal mb-1">Categoría *</label>
                  <select name="categoryId" value={form.categoryId || ''} onChange={e => setForm(f => (Object.assign(Object.assign({}, f), { categoryId: e.target.value })))} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-acento border-gray-300 text-brand-principal" required>
                    <option value="">Selecciona una categoría</option>
                    {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                  </select>
                </div>
                {formError && <p className="text-red-500 text-sm text-center">{formError}</p>}
                {formSuccess && <p className="text-green-600 text-sm text-center font-semibold">{formSuccess}</p>}
                <button type="submit" className="w-full bg-brand-acento text-white py-3 px-6 rounded-lg hover:bg-brand-principal transition-colors shadow-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center" disabled={formLoading}>
                  {formLoading ? (<>
                      <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-brand-principal mr-2"></span>
                      Creando...
                    </>) : ("Agregar producto")}
                </button>
              </form>
            </div>
          </div>
        </div>)}

      {/* Modal de edición */}
      {editModalOpen && productToEdit && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg relative animate-fadeIn">
            <button className="absolute top-4 right-4 text-brand-acento hover:text-brand-principal text-xl font-bold" onClick={() => { setEditModalOpen(false); setProductToEdit(null); }} aria-label="Cerrar">
              ×
            </button>
            <h3 className="text-xl font-bold text-brand-principal mb-4">Editar producto</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-brand-principal mb-1">Nombre *</label>
                <input type="text" name="name" value={editForm.name} onChange={handleEditFormChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-acento border-gray-300 text-brand-principal" required/>
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-principal mb-1">Descripción</label>
                <textarea name="description" value={editForm.description} onChange={handleEditFormChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-acento border-gray-300 text-brand-principal" rows={2}/>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-brand-principal mb-1">Precio *</label>
                  <input type="number" name="price" value={editForm.price} onChange={handleEditFormChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-acento border-gray-300 text-brand-principal" required/>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-brand-principal mb-1">Stock *</label>
                  <input type="number" name="stock" value={editForm.stock} onChange={handleEditFormChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-acento border-gray-300 text-brand-principal" required/>
                </div>
              </div>

              <ImageUpload_1.default onImageUpload={handleEditImageUpload} currentImage={editForm.imageUrl}/>

              <div>
                <label className="block text-sm font-medium text-brand-principal mb-1">Categoría *</label>
                <select name="categoryId" value={editForm.categoryId || ''} onChange={e => setEditForm(f => (Object.assign(Object.assign({}, f), { categoryId: e.target.value })))} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-acento border-gray-300 text-brand-principal" required>
                  <option value="">Selecciona una categoría</option>
                  {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                </select>
              </div>
              {editError && <p className="text-red-500 text-sm text-center">{editError}</p>}
              {editSuccess && <p className="text-green-600 text-sm text-center font-semibold">{editSuccess}</p>}
              <button type="submit" className="w-full bg-brand-acento text-white py-3 px-6 rounded-lg hover:bg-brand-principal transition-colors shadow-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center" disabled={editLoading}>
                {editLoading ? (<>
                    <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-brand-principal mr-2"></span>
                    Guardando...
                  </>) : ("Guardar cambios")}
              </button>
            </form>
          </div>
        </div>)}

      {/* Modal de confirmación de eliminación */}
      {deleteModalOpen && productToDelete && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative animate-fadeIn">
            <button className="absolute top-4 right-4 text-brand-acento hover:text-brand-principal text-xl font-bold" onClick={() => { setDeleteModalOpen(false); setProductToDelete(null); }} aria-label="Cerrar">
              ×
            </button>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <lucide_react_1.Trash2 className="w-8 h-8 text-red-500"/>
              </div>
              <h3 className="text-xl font-bold text-brand-principal mb-2">¿Eliminar producto?</h3>
              <p className="text-gray-600 mb-6">
                ¿Estás seguro de que quieres eliminar <strong>&quot;{productToDelete.name}&quot;</strong>? 
                Esta acción no se puede deshacer.
              </p>
              {deleteError && <p className="text-red-500 text-sm mb-4">{deleteError}</p>}
              <div className="flex gap-3 justify-center">
                <button className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-semibold" onClick={() => { setDeleteModalOpen(false); setProductToDelete(null); }} disabled={deleteLoading}>
                  Cancelar
                </button>
                <button className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2" onClick={handleDelete} disabled={deleteLoading}>
                  {deleteLoading ? (<>
                      <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                      Eliminando...
                    </>) : ("Sí, eliminar")}
                </button>
              </div>
            </div>
          </div>
        </div>)}

      {/* Modal de creación de categoría */}
      {categoryModalOpen && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative animate-fadeIn">
            <button className="absolute top-4 right-4 text-brand-acento hover:text-brand-principal text-xl font-bold" onClick={() => setCategoryModalOpen(false)} aria-label="Cerrar">
              ×
            </button>
            <h3 className="text-xl font-bold text-brand-principal mb-4">Nueva categoría</h3>
            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-brand-principal mb-1">Nombre *</label>
                <input type="text" name="name" value={categoryForm.name} onChange={handleCategoryFormChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-acento border-gray-300 text-brand-principal" required/>
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-principal mb-1">Descripción</label>
                <textarea name="description" value={categoryForm.description} onChange={handleCategoryFormChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-acento border-gray-300 text-brand-principal" rows={2}/>
              </div>
              {categoryError && <p className="text-red-500 text-sm text-center">{categoryError}</p>}
              {categorySuccess && <p className="text-green-600 text-sm text-center font-semibold">{categorySuccess}</p>}
              <button type="submit" className="w-full bg-brand-acento text-white py-3 px-6 rounded-lg hover:bg-brand-principal transition-colors shadow-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center" disabled={categoryLoading}>
                {categoryLoading ? (<>
                    <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-brand-principal mr-2"></span>
                    Creando...
                  </>) : ("Crear categoría")}
              </button>
            </form>
          </div>
        </div>)}
    </div>);
}
