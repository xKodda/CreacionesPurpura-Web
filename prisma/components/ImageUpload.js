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
exports.default = ImageUpload;
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
function ImageUpload({ onImageUpload, currentImage, className = "" }) {
    const [isUploading, setIsUploading] = (0, react_1.useState)(false);
    const [uploadError, setUploadError] = (0, react_1.useState)("");
    const [previewUrl, setPreviewUrl] = (0, react_1.useState)(currentImage || "");
    const fileInputRef = (0, react_1.useRef)(null);
    const handleFileSelect = (event) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        const file = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (!file)
            return;
        // Validar tipo de archivo
        if (!file.type.startsWith("image/")) {
            setUploadError("Solo se permiten archivos de imagen");
            return;
        }
        // Validar tamaño (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setUploadError("El archivo es demasiado grande. Máximo 5MB");
            return;
        }
        setIsUploading(true);
        setUploadError("");
        try {
            const formData = new FormData();
            formData.append("file", file);
            const response = yield fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            if (!response.ok) {
                const errorData = yield response.json();
                throw new Error(errorData.error || "Error al subir la imagen");
            }
            const data = yield response.json();
            setPreviewUrl(data.imageUrl);
            onImageUpload(data.imageUrl);
        }
        catch (error) {
            setUploadError(error instanceof Error ? error.message : "Error al subir la imagen");
        }
        finally {
            setIsUploading(false);
        }
    });
    const handleRemoveImage = () => {
        setPreviewUrl("");
        onImageUpload("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };
    const handleClick = () => {
        var _a;
        (_a = fileInputRef.current) === null || _a === void 0 ? void 0 : _a.click();
    };
    return (<div className={`space-y-3 ${className}`}>
      <label className="block text-sm font-medium text-brand-principal mb-1">
        Imagen del producto
      </label>
      
      {/* Preview de la imagen */}
      {previewUrl && (<div className="relative inline-block">
          <img src={previewUrl} alt="Preview" className="h-32 w-32 object-cover rounded-lg border-2 border-gray-200"/>
          <button type="button" onClick={handleRemoveImage} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors" title="Eliminar imagen">
            <lucide_react_1.X className="w-4 h-4"/>
          </button>
        </div>)}

      {/* Área de carga */}
      <div onClick={handleClick} className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${previewUrl
            ? "border-gray-300 bg-gray-50"
            : "border-brand-acento bg-brand-acento/5 hover:bg-brand-acento/10"}`}>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" disabled={isUploading}/>
        
        {isUploading ? (<div className="space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-acento border-t-transparent mx-auto"></div>
            <p className="text-sm text-brand-principal">Subiendo imagen...</p>
          </div>) : previewUrl ? (<div className="space-y-2">
            <lucide_react_1.Image className="w-8 h-8 text-gray-400 mx-auto"/>
            <p className="text-sm text-gray-600">Haz clic para cambiar la imagen</p>
          </div>) : (<div className="space-y-2">
            <lucide_react_1.Upload className="w-8 h-8 text-brand-acento mx-auto"/>
            <p className="text-sm text-brand-principal font-medium">
              Haz clic para subir una imagen
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, GIF hasta 5MB
            </p>
          </div>)}
      </div>

      {/* Mensaje de error */}
      {uploadError && (<p className="text-red-500 text-sm text-center">{uploadError}</p>)}
    </div>);
}
