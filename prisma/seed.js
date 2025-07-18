"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var regiones, _i, regiones_1, region, createdRegion, _a, _b, comuna;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    regiones = [
                        {
                            name: 'Región de Arica y Parinacota',
                            comunas: ['Arica', 'Camarones', 'Putre', 'General Lagos']
                        },
                        {
                            name: 'Región de Tarapacá',
                            comunas: ['Iquique', 'Alto Hospicio', 'Pozo Almonte', 'Camiña', 'Colchane', 'Huara', 'Pica']
                        },
                        {
                            name: 'Región de Antofagasta',
                            comunas: ['Antofagasta', 'Mejillones', 'Sierra Gorda', 'Taltal', 'Calama', 'Ollagüe', 'San Pedro de Atacama', 'Tocopilla', 'María Elena']
                        },
                        {
                            name: 'Región de Atacama',
                            comunas: ['Copiapó', 'Caldera', 'Tierra Amarilla', 'Chañaral', 'Diego de Almagro', 'Vallenar', 'Alto del Carmen', 'Freirina', 'Huasco']
                        },
                        {
                            name: 'Región de Coquimbo',
                            comunas: ['La Serena', 'Coquimbo', 'Andacollo', 'La Higuera', 'Paiguano', 'Vicuña', 'Illapel', 'Canela', 'Los Vilos', 'Salamanca', 'Ovalle', 'Combarbalá', 'Monte Patria', 'Punitaqui', 'Río Hurtado']
                        },
                        {
                            name: 'Región de Valparaíso',
                            comunas: ['Valparaíso', 'Casablanca', 'Concón', 'Juan Fernández', 'Puchuncaví', 'Quintero', 'Viña del Mar', 'Isla de Pascua', 'Los Andes', 'Calle Larga', 'Rinconada', 'San Esteban', 'La Ligua', 'Cabildo', 'Papudo', 'Petorca', 'Zapallar', 'Quillota', 'Calera', 'Hijuelas', 'La Cruz', 'Nogales', 'San Antonio', 'Algarrobo', 'Cartagena', 'El Quisco', 'El Tabo', 'San Antonio', 'Santo Domingo', 'San Felipe', 'Catemu', 'Llaillay', 'Panquehue', 'Putaendo', 'Santa María', 'Quilpué', 'Limache', 'Olmué', 'Villa Alemana']
                        },
                        {
                            name: 'Región Metropolitana de Santiago',
                            comunas: ['Cerrillos', 'Cerro Navia', 'Conchalí', 'El Bosque', 'Estación Central', 'Huechuraba', 'Independencia', 'La Cisterna', 'La Florida', 'La Granja', 'La Pintana', 'La Reina', 'Las Condes', 'Lo Barnechea', 'Lo Espejo', 'Lo Prado', 'Macul', 'Maipú', 'Ñuñoa', 'Pedro Aguirre Cerda', 'Peñalolén', 'Providencia', 'Pudahuel', 'Quilicura', 'Quinta Normal', 'Recoleta', 'Renca', 'San Joaquín', 'San Miguel', 'San Ramón', 'Vitacura', 'Puente Alto', 'Pirque', 'San José de Maipo', 'Colina', 'Lampa', 'Tiltil', 'San Bernardo', 'Buin', 'Calera de Tango', 'Paine', 'Melipilla', 'Alhué', 'Curacaví', 'María Pinto', 'San Pedro', 'Talagante', 'El Monte', 'Isla de Maipo', 'Padre Hurtado', 'Peñaflor']
                        },
                        {
                            name: 'Región del Libertador General Bernardo O’Higgins',
                            comunas: ['Rancagua', 'Codegua', 'Coinco', 'Coltauco', 'Doñihue', 'Graneros', 'Las Cabras', 'Machalí', 'Malloa', 'Mostazal', 'Olivar', 'Peumo', 'Pichidegua', 'Quinta de Tilcoco', 'Rengo', 'Requínoa', 'San Vicente', 'Pichilemu', 'La Estrella', 'Litueche', 'Marchihue', 'Navidad', 'Paredones', 'San Fernando', 'Chépica', 'Chimbarongo', 'Lolol', 'Nancagua', 'Palmilla', 'Peralillo', 'Placilla', 'Pumanque', 'Santa Cruz']
                        },
                        {
                            name: 'Región del Maule',
                            comunas: ['Talca', 'Constitución', 'Curepto', 'Empedrado', 'Maule', 'Pelarco', 'Pencahue', 'Río Claro', 'San Clemente', 'San Rafael', 'Cauquenes', 'Chanco', 'Pelluhue', 'Curicó', 'Hualañé', 'Licantén', 'Molina', 'Rauco', 'Romeral', 'Sagrada Familia', 'Teno', 'Vichuquén', 'Linares', 'Colbún', 'Longaví', 'Parral', 'Retiro', 'San Javier', 'Villa Alegre', 'Yerbas Buenas']
                        },
                        {
                            name: 'Región de Ñuble',
                            comunas: ['Chillán', 'Bulnes', 'Cobquecura', 'Coelemu', 'Coihueco', 'El Carmen', 'Ninhue', 'Ñiquén', 'Pemuco', 'Pinto', 'Portezuelo', 'Quillón', 'Quirihue', 'Ránquil', 'San Carlos', 'San Fabián', 'San Ignacio', 'San Nicolás', 'Treguaco', 'Yungay']
                        },
                        {
                            name: 'Región del Biobío',
                            comunas: ['Concepción', 'Coronel', 'Chiguayante', 'Florida', 'Hualpén', 'Hualqui', 'Lota', 'Penco', 'San Pedro de la Paz', 'Santa Juana', 'Talcahuano', 'Tomé', 'Hualqui', 'Cabrero', 'Laja', 'Los Ángeles', 'Mulchén', 'Nacimiento', 'Negrete', 'Quilaco', 'Quilleco', 'San Rosendo', 'Santa Bárbara', 'Tucapel', 'Yumbel', 'Alto Biobío', 'Antuco', 'Curanilahue', 'Lebu', 'Los Álamos', 'Tirúa', 'Arauco', 'Cañete', 'Contulmo', 'Curanilahue', 'Lebu', 'Los Álamos', 'Tirúa']
                        },
                        {
                            name: 'Región de La Araucanía',
                            comunas: ['Temuco', 'Carahue', 'Cunco', 'Curarrehue', 'Freire', 'Galvarino', 'Gorbea', 'Lautaro', 'Loncoche', 'Melipeuco', 'Nueva Imperial', 'Padre Las Casas', 'Perquenco', 'Pitrufquén', 'Pucón', 'Saavedra', 'Teodoro Schmidt', 'Toltén', 'Vilcún', 'Villarrica', 'Cholchol', 'Angol', 'Collipulli', 'Curacautín', 'Ercilla', 'Lonquimay', 'Los Sauces', 'Lumaco', 'Purén', 'Renaico', 'Traiguén', 'Victoria']
                        },
                        {
                            name: 'Región de Los Ríos',
                            comunas: ['Valdivia', 'Corral', 'Lanco', 'Los Lagos', 'Máfil', 'Mariquina', 'Paillaco', 'Panguipulli', 'La Unión', 'Futrono', 'Lago Ranco', 'Río Bueno']
                        },
                        {
                            name: 'Región de Los Lagos',
                            comunas: ['Puerto Montt', 'Calbuco', 'Cochamó', 'Fresia', 'Frutillar', 'Los Muermos', 'Llanquihue', 'Maullín', 'Puerto Varas', 'Castro', 'Ancud', 'Chonchi', 'Curaco de Vélez', 'Dalcahue', 'Puqueldón', 'Queilén', 'Quellón', 'Quemchi', 'Quinchao', 'Osorno', 'Puerto Octay', 'Purranque', 'Puyehue', 'Río Negro', 'San Juan de la Costa', 'San Pablo']
                        },
                        {
                            name: 'Región de Aysén del General Carlos Ibáñez del Campo',
                            comunas: ['Coyhaique', 'Lago Verde', 'Aysén', 'Cisnes', 'Guaitecas', 'Cochrane', 'O’Higgins', 'Tortel', 'Chile Chico', 'Río Ibáñez']
                        },
                        {
                            name: 'Región de Magallanes y de la Antártica Chilena',
                            comunas: ['Punta Arenas', 'Laguna Blanca', 'Río Verde', 'San Gregorio', 'Cabo de Hornos', 'Antártica', 'Porvenir', 'Primavera', 'Timaukel', 'Natales', 'Torres del Paine']
                        }
                    ];
                    _i = 0, regiones_1 = regiones;
                    _c.label = 1;
                case 1:
                    if (!(_i < regiones_1.length)) return [3 /*break*/, 7];
                    region = regiones_1[_i];
                    return [4 /*yield*/, prisma.region.upsert({
                            where: { name: region.name },
                            update: {},
                            create: { name: region.name }
                        })];
                case 2:
                    createdRegion = _c.sent();
                    _a = 0, _b = region.comunas;
                    _c.label = 3;
                case 3:
                    if (!(_a < _b.length)) return [3 /*break*/, 6];
                    comuna = _b[_a];
                    return [4 /*yield*/, prisma.comuna.upsert({
                            where: { name_regionId: { name: comuna, regionId: createdRegion.id } },
                            update: {},
                            create: {
                                name: comuna,
                                regionId: createdRegion.id
                            }
                        })];
                case 4:
                    _c.sent();
                    _c.label = 5;
                case 5:
                    _a++;
                    return [3 /*break*/, 3];
                case 6:
                    _i++;
                    return [3 /*break*/, 1];
                case 7:
                    console.log('✅ Regiones y comunas pobladas correctamente.');
                    // Bloque de categorías y productos
                    console.log('➡️ Poblando categorías de ejemplo...');
                    const categorias = [
                      { id: 'papeleria', name: 'Papelería Escolar', description: 'Todo para el colegio y oficina' },
                      { id: 'cotillon', name: 'Cotillón y Fiestas', description: 'Artículos para celebraciones y eventos' },
                      { id: 'manualidades', name: 'Manualidades', description: 'Materiales para crear y decorar' },
                      { id: 'decoracion', name: 'Decoración', description: 'Accesorios y adornos para tu espacio' }
                    ];
                    for (const cat of categorias) {
                      try {
                        await prisma.category.upsert({
                          where: { name: cat.name },
                          update: { description: cat.description },
                          create: { name: cat.name, description: cat.description }
                        });
                        console.log(`✅ Categoría: ${cat.name}`);
                      } catch (err) {
                        console.error(`❌ Error insertando categoría ${cat.name}:`, err);
                      }
                    }
                    console.log('➡️ Poblando productos de ejemplo...');
                    const productos = [
                      {
                        name: 'Set de Plumones Faber-Castell',
                        description: 'Set de 24 plumones de colores vibrantes para manualidades y arte. Ideal para escolares y artistas.',
                        price: 15990,
                        imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&h=500&fit=crop',
                        categoryName: 'Papelería Escolar',
                        stock: 15
                      },
                      {
                        name: 'Cuadernos Oxford Decorativos',
                        description: 'Pack de 3 cuadernos universitarios con diseños únicos y papel de alta calidad. 100 hojas cada uno.',
                        price: 12990,
                        imageUrl: 'https://images.unsplash.com/photo-1531346680769-a1d79b57de5c?w=500&h=500&fit=crop',
                        categoryName: 'Papelería Escolar',
                        stock: 8
                      },
                      {
                        name: 'Set de Globos de Fiesta',
                        description: 'Pack de 50 globos multicolor para decoración de fiestas y eventos. Incluye inflador manual.',
                        price: 8990,
                        imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&h=500&fit=crop',
                        categoryName: 'Cotillón y Fiestas',
                        stock: 25
                      },
                      {
                        name: 'Set de Pinturas Acrílicas',
                        description: 'Pack de 12 pinturas acrílicas de colores vibrantes para manualidades y arte.',
                        price: 15990,
                        imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&h=500&fit=crop',
                        categoryName: 'Manualidades',
                        stock: 8
                      },
                      {
                        name: 'Guirnalda de Luces LED',
                        description: 'Guirnalda de 50 luces LED para decoración de fiestas y eventos.',
                        price: 18990,
                        imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500&h=500&fit=crop',
                        categoryName: 'Decoración',
                        stock: 10
                      }
                    ];
                    for (const prod of productos) {
                      try {
                        const categoria = await prisma.category.findFirst({ where: { name: prod.categoryName } });
                        if (!categoria) {
                          console.error(`❌ No se encontró la categoría para el producto: ${prod.name}`);
                          continue;
                        }
                        await prisma.product.upsert({
                          where: { name: prod.name },
                          update: {
                            description: prod.description,
                            price: prod.price,
                            imageUrl: prod.imageUrl,
                            stock: prod.stock,
                            categoryId: categoria.id
                          },
                          create: {
                            name: prod.name,
                            description: prod.description,
                            price: prod.price,
                            imageUrl: prod.imageUrl,
                            stock: prod.stock,
                            categoryId: categoria.id
                          }
                        });
                        console.log(`✅ Producto: ${prod.name}`);
                      } catch (err) {
                        console.error(`❌ Error insertando producto ${prod.name}:`, err);
                      }
                    }
                    console.log('✅ Categorías y productos poblados correctamente.');
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
