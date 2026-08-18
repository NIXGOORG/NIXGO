/* ==========================================================================
   NIXGO tech — Tienda de tecnología con financiamiento
   Vanilla JS · sin dependencias
   ========================================================================== */

/* --------------------------------------------------------------------------
   CONFIGURACIÓN — cambia estos valores por los reales del negocio
   -------------------------------------------------------------------------- */
const CONFIG = {
  whatsapp: '50230409228',          // <-- número real de WhatsApp (código país + número)
  moneda: 'Q',
  engancheSugerido: 0.15,           // 15% por defecto en el carrito
  productosPorPagina: 8,
};

/* --------------------------------------------------------------------------
   PLANES DE FINANCIAMIENTO (tasa mensual sobre saldo)
   -------------------------------------------------------------------------- */
const PLANES = [
  { meses: 3,  tasa: 0      },
  { meses: 6,  tasa: 0.0125 },
  { meses: 12, tasa: 0.0175 },
  { meses: 18, tasa: 0.0195 },
  { meses: 24, tasa: 0.0215 },
];

/* --------------------------------------------------------------------------
   NIVELES DE CRÉDITO NIXGO
   El nivel se asigna según el monto a financiar (precio − enganche).
   -------------------------------------------------------------------------- */
const NIVELES = [
  {
    id: 'easy',
    nombre: 'NIXGO EASY',
    color: '#10b981',
    glow: 'rgba(16, 185, 129, .16)',
    max: 3000,
    rango: 'Hasta Q 3,000',
    nota: 'Ideal para tu primer equipo o accesorios',
    requisitos: [
      'DPI',
      'Número de celular',
      'Dirección y recibo de servicio',
      'Ingresos declarados',
      'Validación de identidad',
      'Referencias',
      'Enganche',
    ],
  },
  {
    id: 'smart',
    nombre: 'NIXGO SMART',
    color: '#4d8dff',
    glow: 'rgba(77, 141, 255, .16)',
    max: 8000,
    rango: 'Q 3,001 – Q 8,000',
    nota: 'Para gama media-alta y laptops de trabajo',
    heredaDe: 'NIXGO EASY',
    requisitos: [
      'Evidencia de ingresos',
      'Evaluación de capacidad de pago',
      'Historial crediticio',
      'Enganche',
    ],
  },
  {
    id: 'premium',
    nombre: 'NIXGO PREMIUM',
    color: '#b18cf5',
    glow: 'rgba(177, 140, 245, .16)',
    max: Infinity,
    rango: 'Más de Q 8,000',
    nota: 'Equipos insignia y compras múltiples',
    heredaDe: 'NIXGO SMART',
    requisitos: [
      'Estados de cuenta',
      'Comprobación formal de ingresos',
      'Evaluación ampliada',
      'Enganche',
    ],
  },
];

/**
 * Devuelve el nivel que corresponde a un monto financiado.
 * NIVELES está ordenado de menor a mayor y el último tiene tope Infinity,
 * así que el primer techo que alcanza el monto es su nivel. Se compara solo
 * contra `max` a propósito: los montos financiados casi nunca son enteros
 * (precio × enganche) y un rango con piso dejaría huecos como Q8,000.20.
 */
function nivelPara(monto) {
  return NIVELES.find((n) => monto <= n.max) || NIVELES[NIVELES.length - 1];
}

/* --------------------------------------------------------------------------
   VALORES DE LA EMPRESA
   -------------------------------------------------------------------------- */
const VALORES = [
  { ico: 'i-bolt',   n: 'Innovación con propósito', d: 'Creamos tecnología útil que transforma procesos y genera oportunidades reales.' },
  { ico: 'i-shield', n: 'Confianza y seguridad',    d: 'Protegemos cada transacción con altos estándares de transparencia, ética y seguridad.' },
  { ico: 'i-people', n: 'Cercanía humana',          d: 'Creemos en relaciones auténticas, acompañando a nuestros clientes con empatía y compromiso.' },
  { ico: 'i-clock',  n: 'Agilidad',                 d: 'Respondemos rápido a las necesidades del mercado y de nuestros clientes.' },
  { ico: 'i-growth', n: 'Compromiso con el crecimiento', d: 'Trabajamos para que cada solución impulse el desarrollo de personas, negocios y comunidades.' },
  { ico: 'i-scale',  n: 'Integridad',               d: 'Actuamos con honestidad, responsabilidad y coherencia en cada decisión.' },
];

/* --------------------------------------------------------------------------
   CATEGORÍAS
   -------------------------------------------------------------------------- */
const CATEGORIAS = [
  { id: 'celulares',    nombre: 'Celulares',    icono: 'i-phone',  nota: 'Nuevos y sellados' },
  { id: 'computadoras', nombre: 'Computadoras', icono: 'i-laptop', nota: 'Trabajo y gaming' },
  { id: 'tablets',      nombre: 'Tablets',      icono: 'i-tablet', nota: 'Estudio y diseño' },
  { id: 'accesorios',   nombre: 'Accesorios',   icono: 'i-buds',   nota: 'Audio y carga' },
  { id: 'smartwatches', nombre: 'Smartwatches', icono: 'i-watch',  nota: 'Salud y deporte' },
  { id: 'repuestos',    nombre: 'Repuestos',    icono: 'i-parts',  nota: 'Originales y premium' },
];

/* --------------------------------------------------------------------------
   PRODUCTOS
   -------------------------------------------------------------------------- */
const PRODUCTOS = [
  {
    id: 'ip15pm', cat: 'celulares', kind: 'phone', marca: 'Apple',
    nombre: 'iPhone 15 Pro Max', specs: '256 GB · Titanio Natural',
    precio: 11499, antes: 12799, rating: 4.9, reviews: 212, tags: ['hot'],
    desc: 'Chip A17 Pro, cuerpo de titanio y el sistema de cámaras más avanzado de Apple. Sellado, con garantía oficial.',
    ficha: [['Pantalla', '6.7" Super Retina XDR'], ['Procesador', 'A17 Pro'], ['Cámara', '48 MP + 12 MP + 12 MP'], ['Batería', 'Hasta 29 h de video'], ['Garantía', '12 meses']],
  },
  {
    id: 's24u', cat: 'celulares', kind: 'phone', marca: 'Samsung',
    nombre: 'Galaxy S24 Ultra', specs: '512 GB · S Pen incluido',
    precio: 10999, antes: 11999, rating: 4.8, reviews: 178, tags: ['new'],
    desc: 'Galaxy AI, zoom óptico 5x y marco de titanio. El buque insignia de Samsung con S Pen integrado.',
    ficha: [['Pantalla', '6.8" QHD+ 120 Hz'], ['Procesador', 'Snapdragon 8 Gen 3'], ['Cámara', '200 MP principal'], ['Batería', '5000 mAh'], ['Garantía', '12 meses']],
  },
  {
    id: 'note13', cat: 'celulares', kind: 'phone', marca: 'Xiaomi',
    nombre: 'Redmi Note 13 Pro', specs: '256 GB · 8 GB RAM',
    precio: 2299, antes: 2699, rating: 4.7, reviews: 340, tags: ['off'],
    desc: 'El rey de la relación precio-rendimiento. Cámara de 200 MP y carga turbo de 67 W.',
    ficha: [['Pantalla', '6.67" AMOLED 120 Hz'], ['Procesador', 'Helio G99 Ultra'], ['Cámara', '200 MP OIS'], ['Carga', '67 W turbo'], ['Garantía', '12 meses']],
  },
  {
    id: 'motog84', cat: 'celulares', kind: 'phone', marca: 'Motorola',
    nombre: 'Moto G84 5G', specs: '256 GB · 12 GB RAM',
    precio: 1799, rating: 4.6, reviews: 156, tags: ['zero'],
    desc: 'Conectividad 5G, pantalla pOLED y batería para dos días. Ideal como primer smartphone de gama media.',
    ficha: [['Pantalla', '6.5" pOLED 120 Hz'], ['Procesador', 'Snapdragon 695'], ['Cámara', '50 MP OIS'], ['Batería', '5000 mAh'], ['Garantía', '12 meses']],
  },
  {
    id: 'mbair', cat: 'computadoras', kind: 'laptop', marca: 'Apple',
    nombre: 'MacBook Air M3 13"', specs: '8 GB RAM · 256 GB SSD',
    precio: 9499, antes: 10299, rating: 4.9, reviews: 98, tags: ['hot'],
    desc: 'Ultraligera, silenciosa y con 18 horas de batería. El chip M3 vuela en edición y multitarea.',
    ficha: [['Pantalla', '13.6" Liquid Retina'], ['Procesador', 'Apple M3'], ['Memoria', '8 GB unificada'], ['Almacenamiento', '256 GB SSD'], ['Garantía', '12 meses']],
  },
  {
    id: 'tufa15', cat: 'computadoras', kind: 'laptop', marca: 'ASUS',
    nombre: 'TUF Gaming F15', specs: 'RTX 4050 · 16 GB · 512 GB',
    precio: 8799, antes: 9499, rating: 4.7, reviews: 74, tags: ['off'],
    desc: 'Grado militar MIL-STD-810H, pantalla de 144 Hz y gráfica RTX 4050 para jugar y renderizar.',
    ficha: [['Pantalla', '15.6" FHD 144 Hz'], ['Procesador', 'Intel Core i7-12700H'], ['Gráfica', 'RTX 4050 6 GB'], ['Memoria', '16 GB DDR4'], ['Garantía', '12 meses']],
  },
  {
    id: 'ideapad', cat: 'computadoras', kind: 'laptop', marca: 'Lenovo',
    nombre: 'IdeaPad Slim 3', specs: 'Ryzen 5 · 16 GB · 512 GB',
    precio: 4299, rating: 4.5, reviews: 121, tags: ['zero'],
    desc: 'La laptop de oficina y estudio que no te va a fallar. Liviana, rápida y con teclado cómodo.',
    ficha: [['Pantalla', '15.6" FHD IPS'], ['Procesador', 'AMD Ryzen 5 7520U'], ['Memoria', '16 GB LPDDR5'], ['Almacenamiento', '512 GB SSD'], ['Garantía', '12 meses']],
  },
  {
    id: 'victus', cat: 'computadoras', kind: 'laptop', marca: 'HP',
    nombre: 'Victus 15', specs: 'Core i5 · GTX 1650 · 8 GB',
    precio: 5999, antes: 6499, rating: 4.4, reviews: 63, tags: [],
    desc: 'Entrada al gaming sin comprometer el presupuesto. Sistema de enfriamiento dual y RAM ampliable.',
    ficha: [['Pantalla', '15.6" FHD 144 Hz'], ['Procesador', 'Intel Core i5-12450H'], ['Gráfica', 'GTX 1650 4 GB'], ['Memoria', '8 GB ampliable'], ['Garantía', '12 meses']],
  },
  {
    id: 'ipad10', cat: 'tablets', kind: 'tablet', marca: 'Apple',
    nombre: 'iPad 10ma generación', specs: '64 GB · Wi-Fi',
    precio: 3299, rating: 4.8, reviews: 143, tags: ['new'],
    desc: 'Pantalla Liquid Retina de 10.9", chip A14 Bionic y compatibilidad con Apple Pencil.',
    ficha: [['Pantalla', '10.9" Liquid Retina'], ['Procesador', 'A14 Bionic'], ['Almacenamiento', '64 GB'], ['Cámara', '12 MP gran angular'], ['Garantía', '12 meses']],
  },
  {
    id: 'tabs9fe', cat: 'tablets', kind: 'tablet', marca: 'Samsung',
    nombre: 'Galaxy Tab S9 FE', specs: '128 GB · S Pen incluido',
    precio: 3899, antes: 4299, rating: 4.7, reviews: 88, tags: ['off'],
    desc: 'Resistente al agua IP68, S Pen incluido y pantalla de 90 Hz. Perfecta para tomar notas y dibujar.',
    ficha: [['Pantalla', '10.9" TFT 90 Hz'], ['Procesador', 'Exynos 1380'], ['Almacenamiento', '128 GB'], ['Extra', 'S Pen y IP68'], ['Garantía', '12 meses']],
  },
  {
    id: 'pad6', cat: 'tablets', kind: 'tablet', marca: 'Xiaomi',
    nombre: 'Xiaomi Pad 6', specs: '128 GB · 6 GB RAM',
    precio: 2599, rating: 4.6, reviews: 112, tags: ['zero'],
    desc: 'Pantalla de 144 Hz y cuatro altavoces Dolby Atmos. La tablet multimedia con mejor precio.',
    ficha: [['Pantalla', '11" 2.8K 144 Hz'], ['Procesador', 'Snapdragon 870'], ['Almacenamiento', '128 GB'], ['Audio', '4 altavoces Dolby'], ['Garantía', '12 meses']],
  },
  {
    id: 'airpods', cat: 'accesorios', kind: 'buds', marca: 'Apple',
    nombre: 'AirPods Pro 2', specs: 'USB-C · Cancelación activa',
    precio: 1899, antes: 2199, rating: 4.9, reviews: 267, tags: ['hot'],
    desc: 'Cancelación de ruido adaptativa, audio espacial y hasta 6 horas de reproducción continua.',
    ficha: [['Chip', 'Apple H2'], ['Batería', '6 h + 30 h con estuche'], ['Resistencia', 'IP54'], ['Conector', 'USB-C'], ['Garantía', '12 meses']],
  },
  {
    id: 'budsfe', cat: 'accesorios', kind: 'buds', marca: 'Samsung',
    nombre: 'Galaxy Buds FE', specs: 'ANC · Bluetooth 5.2',
    precio: 649, rating: 4.5, reviews: 94, tags: [],
    desc: 'Cancelación activa de ruido y ajuste seguro con aletas. Excelente audio a precio accesible.',
    ficha: [['Drivers', '1 vía dinámico'], ['Batería', '6 h + 24 h'], ['Resistencia', 'IPX2'], ['Conexión', 'Bluetooth 5.2'], ['Garantía', '12 meses']],
  },
  {
    id: 'gan65', cat: 'accesorios', kind: 'charger', marca: 'Anker',
    nombre: 'Cargador GaN 65 W', specs: '3 puertos · Carga rápida',
    precio: 349, antes: 429, rating: 4.8, reviews: 189, tags: ['off'],
    desc: 'Carga tu laptop, celular y audífonos al mismo tiempo con un solo adaptador del tamaño de un dado.',
    ficha: [['Potencia', '65 W total'], ['Puertos', '2 USB-C + 1 USB-A'], ['Tecnología', 'GaN II'], ['Compatibilidad', 'PD 3.0 / PPS'], ['Garantía', '18 meses']],
  },
  {
    id: 'pb20k', cat: 'accesorios', kind: 'powerbank', marca: 'Anker',
    nombre: 'PowerCore 20 000 mAh', specs: '22.5 W · Pantalla LED',
    precio: 429, rating: 4.7, reviews: 231, tags: ['zero'],
    desc: 'Cinco cargas completas de celular. Con indicador digital de batería restante y carga rápida.',
    ficha: [['Capacidad', '20 000 mAh'], ['Salida', '22.5 W máx.'], ['Puertos', 'USB-C + 2 USB-A'], ['Extra', 'Display digital'], ['Garantía', '18 meses']],
  },
  {
    id: 'watch6', cat: 'smartwatches', kind: 'watch', marca: 'Samsung',
    nombre: 'Galaxy Watch 6', specs: '44 mm · Bluetooth',
    precio: 1999, antes: 2299, rating: 4.7, reviews: 76, tags: ['off'],
    desc: 'Monitoreo de sueño, composición corporal y ECG. Pantalla AMOLED siempre activa.',
    ficha: [['Pantalla', '1.5" Super AMOLED'], ['Sensores', 'ECG, BioActive, SpO2'], ['Batería', 'Hasta 40 h'], ['Resistencia', '5 ATM + IP68'], ['Garantía', '12 meses']],
  },
  {
    id: 'watchse', cat: 'smartwatches', kind: 'watch', marca: 'Apple',
    nombre: 'Apple Watch SE', specs: '40 mm · GPS',
    precio: 2299, rating: 4.8, reviews: 134, tags: ['new'],
    desc: 'Detección de choques, seguimiento de entrenamiento y notificaciones. El Apple Watch más accesible.',
    ficha: [['Pantalla', 'Retina 40 mm'], ['Chip', 'S8 SiP'], ['Sensores', 'Acelerómetro, giroscopio'], ['Resistencia', 'WR50'], ['Garantía', '12 meses']],
  },
  {
    id: 'rep-oled13', cat: 'repuestos', kind: 'screen', marca: 'Repuesto',
    nombre: 'Pantalla OLED iPhone 13', specs: 'Original · Instalación incluida',
    precio: 1249, rating: 4.8, reviews: 57, tags: ['hot'],
    desc: 'Módulo OLED original con Face ID funcional. Incluye mano de obra e instalación certificada.',
    ficha: [['Tipo', 'OLED original'], ['Compatibilidad', 'iPhone 13 / 13 Pro'], ['Incluye', 'Instalación'], ['Tiempo', '45 minutos'], ['Garantía', '90 días']],
  },
  {
    id: 'rep-bat-a54', cat: 'repuestos', kind: 'battery', marca: 'Repuesto',
    nombre: 'Batería Galaxy A54', specs: '5000 mAh · Cambio express',
    precio: 349, rating: 4.6, reviews: 82, tags: [],
    desc: 'Batería de alta densidad con certificación de seguridad. Cambio en menos de 40 minutos.',
    ficha: [['Capacidad', '5000 mAh'], ['Tipo', 'Li-Po certificada'], ['Incluye', 'Instalación'], ['Tiempo', '40 minutos'], ['Garantía', '90 días']],
  },
  {
    id: 'rep-note12', cat: 'repuestos', kind: 'screen', marca: 'Repuesto',
    nombre: 'Pantalla Redmi Note 12', specs: 'AMOLED premium · Con marco',
    precio: 649, antes: 749, rating: 4.5, reviews: 41, tags: ['off'],
    desc: 'Display AMOLED con marco preinstalado para un cambio limpio y sin astillas en los bordes.',
    ficha: [['Tipo', 'AMOLED con marco'], ['Compatibilidad', 'Redmi Note 12 4G'], ['Incluye', 'Instalación'], ['Tiempo', '50 minutos'], ['Garantía', '90 días']],
  },
  {
    id: 'rep-puerto', cat: 'repuestos', kind: 'charger', marca: 'Repuesto',
    nombre: 'Módulo de carga USB-C', specs: 'Universal · Multi-marca',
    precio: 199, rating: 4.4, reviews: 68, tags: ['zero'],
    desc: '¿Tu celular ya no carga o el cable baila? Cambiamos el puerto completo con microsoldadura.',
    ficha: [['Tipo', 'Flex de carga USB-C'], ['Compatibilidad', 'Samsung, Xiaomi, Motorola'], ['Incluye', 'Microsoldadura'], ['Tiempo', '60 minutos'], ['Garantía', '90 días']],
  },
];

/* --------------------------------------------------------------------------
   SERVICIO TÉCNICO
   -------------------------------------------------------------------------- */
const SERVICIOS = [
  { ico: 'i-screen',  n: 'Cambio de pantalla',        d: 'Todas las marcas · 45 min', p: 'Desde Q 349' },
  { ico: 'i-battery', n: 'Cambio de batería',         d: 'Batería certificada · 40 min', p: 'Desde Q 249' },
  { ico: 'i-drop',    n: 'Daño por líquido',          d: 'Limpieza ultrasónica', p: 'Desde Q 300' },
  { ico: 'i-port',    n: 'Puerto de carga',           d: 'Microsoldadura especializada', p: 'Desde Q 199' },
  { ico: 'i-cam',     n: 'Módulo de cámara',          d: 'Trasera o frontal', p: 'Desde Q 289' },
  { ico: 'i-chip',    n: 'Software y desbloqueo',     d: 'Liberación e instalación', p: 'Desde Q 150' },
  { ico: 'i-laptop',  n: 'Mantenimiento de laptop',   d: 'Limpieza, pasta térmica y SSD', p: 'Desde Q 250' },
];

/* --------------------------------------------------------------------------
   TESTIMONIOS
   -------------------------------------------------------------------------- */
const TESTIMONIOS = [
  { n: 'María Fernanda López', r: 'Compró un iPhone 15 Pro', t: 'Nunca había podido comprar un equipo así. Me aprobaron en menos de 20 minutos y pago una cuota que sí me alcanza. El asesor fue clarísimo con los intereses.' },
  { n: 'Carlos Estuardo Ruiz', r: 'Compró una laptop para su negocio', t: 'Necesitaba una laptop urgente para mi taller. Apliqué el Plan Renueva con mi equipo viejo y bajé bastante el enganche. La recibí al día siguiente.' },
  { n: 'Ana Lucía Ordóñez', r: 'Cambio de pantalla', t: 'Se me quebró la pantalla un viernes y para el sábado ya la tenía nueva. Cobraron exactamente lo que cotizaron y me dieron garantía por escrito.' },
];

/* --------------------------------------------------------------------------
   FAQ
   -------------------------------------------------------------------------- */
const FAQS = [
  ['¿Necesito tarjeta de crédito para financiar?', 'No. El financiamiento NIXGO es directo: evaluamos tu perfil con tu DPI y un comprobante de ingresos. No necesitas tarjeta ni historial bancario extenso.'],
  ['¿Cuánto tarda la aprobación?', 'En horario hábil, la respuesta llega en aproximadamente 15 minutos después de enviar tus documentos completos. Si aplicas fuera de horario, te respondemos a primera hora del siguiente día.'],
  ['¿Puedo pagar antes y ahorrarme intereses?', 'Sí. No cobramos penalidad por pago anticipado: si liquidas antes, solo pagas los intereses generados hasta esa fecha.'],
  ['¿Los equipos son nuevos y con garantía?', 'Todos los equipos son nuevos, sellados y con 12 meses de garantía. Los repuestos y reparaciones tienen 90 días de garantía por escrito.'],
  ['¿Hacen envíos fuera de la capital?', 'Sí, enviamos a los 22 departamentos. En la capital y áreas cercanas la entrega es de 24 horas; al interior, de 48 a 72 horas.'],
  ['¿Qué pasa si mi equipo falla dentro de la garantía?', 'Lo recibimos en nuestro centro de servicio, lo diagnosticamos sin costo y lo reparamos o reemplazamos según corresponda, sin afectar tu plan de pagos.'],
];

/* ==========================================================================
   UTILIDADES
   ========================================================================== */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

const money = (n) =>
  CONFIG.moneda + ' ' + Math.round(n).toLocaleString('es-GT');

/** Cuota mensual — amortización francesa. Con tasa 0 es división simple. */
function cuotaMensual(monto, meses, tasa) {
  if (monto <= 0 || meses <= 0) return 0;
  if (tasa === 0) return monto / meses;
  const f = Math.pow(1 + tasa, meses);
  return (monto * tasa * f) / (f - 1);
}

/** Cuota "desde" que se muestra en cada tarjeta: 15% enganche a 24 meses. */
function cuotaDesde(precio) {
  const plan = PLANES[PLANES.length - 1];
  return cuotaMensual(precio * (1 - CONFIG.engancheSugerido), plan.meses, plan.tasa);
}

const waLink = (texto) =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`;

const estrellas = (r) => '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r));

const iniciales = (nombre) =>
  nombre.split(' ').slice(0, 2).map((p) => p[0]).join('').toUpperCase();

/* ==========================================================================
   ARTE SVG DE DISPOSITIVOS
   ========================================================================== */
function inyectarDefs() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.setAttribute('aria-hidden', 'true');
  svg.style.position = 'absolute';
  svg.innerHTML = `
    <defs>
      <linearGradient id="gBody" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#3a3a4d"/><stop offset=".45" stop-color="#222230"/><stop offset="1" stop-color="#101019"/>
      </linearGradient>
      <linearGradient id="gScreen" x1="0" y1="0" x2=".7" y2="1">
        <stop offset="0" stop-color="#1c2b52"/><stop offset=".5" stop-color="#0d1426"/><stop offset="1" stop-color="#05070f"/>
      </linearGradient>
      <linearGradient id="gGold" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#f6e6a8"/><stop offset=".5" stop-color="#d4af37"/><stop offset="1" stop-color="#8d7327"/>
      </linearGradient>
      <linearGradient id="gGlass" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#ffffff" stop-opacity=".22"/><stop offset=".55" stop-color="#ffffff" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="gVolt" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#7fb0ff"/><stop offset="1" stop-color="#2f5fd0"/>
      </linearGradient>
    </defs>`;
  document.body.appendChild(svg);
}

const ART = {
  phone: `
    <rect x="60" y="14" width="80" height="172" rx="16" fill="url(#gBody)" stroke="#43435a" stroke-width="1.5"/>
    <rect x="66" y="20" width="68" height="160" rx="11" fill="url(#gScreen)"/>
    <rect x="86" y="24" width="28" height="7" rx="3.5" fill="#0a0a12"/>
    <rect x="66" y="20" width="68" height="160" rx="11" fill="url(#gGlass)"/>
    <rect x="57" y="52" width="3" height="22" rx="1.5" fill="#5a5a72"/>
    <rect x="140" y="46" width="3" height="16" rx="1.5" fill="#5a5a72"/>
    <circle cx="100" cy="76" r="20" fill="url(#gGold)" opacity=".16"/>
    <path d="M104 58l-14 24h9l-3 20 16-26h-9z" fill="url(#gGold)"/>
    <rect x="78" y="120" width="44" height="5" rx="2.5" fill="#ffffff" opacity=".13"/>
    <rect x="78" y="134" width="30" height="5" rx="2.5" fill="#ffffff" opacity=".08"/>
    <rect x="86" y="168" width="28" height="4" rx="2" fill="#ffffff" opacity=".18"/>`,

  laptop: `
    <rect x="32" y="40" width="136" height="88" rx="8" fill="url(#gBody)" stroke="#43435a" stroke-width="1.5"/>
    <rect x="39" y="47" width="122" height="74" rx="4" fill="url(#gScreen)"/>
    <rect x="39" y="47" width="122" height="74" rx="4" fill="url(#gGlass)"/>
    <circle cx="100" cy="84" r="22" fill="url(#gGold)" opacity=".14"/>
    <path d="M104 66l-14 24h9l-3 20 16-26h-9z" fill="url(#gGold)"/>
    <rect x="52" y="104" width="40" height="4" rx="2" fill="#ffffff" opacity=".12"/>
    <path d="M16 140h168l12 16H4z" fill="url(#gBody)" stroke="#43435a" stroke-width="1.5"/>
    <rect x="82" y="145" width="36" height="4" rx="2" fill="#5a5a72"/>
    <rect x="32" y="128" width="136" height="12" fill="#1a1a26"/>`,

  tablet: `
    <rect x="42" y="22" width="116" height="156" rx="14" fill="url(#gBody)" stroke="#43435a" stroke-width="1.5"/>
    <rect x="50" y="30" width="100" height="140" rx="7" fill="url(#gScreen)"/>
    <rect x="50" y="30" width="100" height="140" rx="7" fill="url(#gGlass)"/>
    <circle cx="100" cy="88" r="26" fill="url(#gGold)" opacity=".14"/>
    <path d="M105 66l-16 28h10l-3 24 19-31h-11z" fill="url(#gGold)"/>
    <rect x="66" y="126" width="68" height="5" rx="2.5" fill="#ffffff" opacity=".13"/>
    <rect x="66" y="140" width="46" height="5" rx="2.5" fill="#ffffff" opacity=".08"/>
    <circle cx="100" cy="26" r="2" fill="#5a5a72"/>`,

  watch: `
    <rect x="80" y="16" width="40" height="52" rx="12" fill="#23232f" stroke="#3a3a4c"/>
    <rect x="80" y="132" width="40" height="54" rx="12" fill="#23232f" stroke="#3a3a4c"/>
    <rect x="66" y="58" width="68" height="86" rx="22" fill="url(#gBody)" stroke="#4a4a62" stroke-width="1.5"/>
    <rect x="73" y="65" width="54" height="72" rx="17" fill="url(#gScreen)"/>
    <rect x="73" y="65" width="54" height="72" rx="17" fill="url(#gGlass)"/>
    <path d="M103 82l-11 20h7l-2 16 13-22h-7z" fill="url(#gGold)"/>
    <rect x="88" y="112" width="24" height="4" rx="2" fill="#ffffff" opacity=".15"/>
    <rect x="133" y="84" width="6" height="16" rx="3" fill="url(#gGold)"/>`,

  buds: `
    <circle cx="74" cy="62" r="17" fill="url(#gBody)" stroke="#4a4a62" stroke-width="1.5"/>
    <rect x="69" y="72" width="10" height="30" rx="5" fill="url(#gBody)" stroke="#4a4a62" stroke-width="1.5"/>
    <circle cx="126" cy="62" r="17" fill="url(#gBody)" stroke="#4a4a62" stroke-width="1.5"/>
    <rect x="121" y="72" width="10" height="30" rx="5" fill="url(#gBody)" stroke="#4a4a62" stroke-width="1.5"/>
    <circle cx="74" cy="62" r="7" fill="#0d1426"/>
    <circle cx="126" cy="62" r="7" fill="#0d1426"/>
    <rect x="54" y="112" width="92" height="66" rx="22" fill="url(#gBody)" stroke="#4a4a62" stroke-width="1.5"/>
    <path d="M54 134h92" stroke="#4a4a62" stroke-width="1.5"/>
    <rect x="54" y="112" width="92" height="66" rx="22" fill="url(#gGlass)"/>
    <circle cx="100" cy="158" r="6" fill="url(#gGold)"/>`,

  screen: `
    <rect x="56" y="18" width="88" height="150" rx="12" fill="url(#gScreen)" stroke="url(#gGold)" stroke-width="2"/>
    <rect x="56" y="18" width="88" height="150" rx="12" fill="url(#gGlass)"/>
    <rect x="84" y="24" width="32" height="7" rx="3.5" fill="#0a0a12"/>
    <path d="M100 60l-16 30h10l-3 26 20-34h-11z" fill="url(#gGold)" opacity=".9"/>
    <path d="M100 168v16h30" stroke="#c9a94a" stroke-width="3" fill="none" stroke-linecap="round"/>
    <rect x="126" y="176" width="26" height="16" rx="4" fill="url(#gBody)" stroke="#4a4a62"/>
    <path d="M131 180v8M137 180v8M143 180v8" stroke="url(#gGold)" stroke-width="1.6"/>`,

  battery: `
    <rect x="88" y="24" width="24" height="10" rx="3" fill="#4a4a62"/>
    <rect x="44" y="34" width="112" height="146" rx="16" fill="url(#gBody)" stroke="#4a4a62" stroke-width="1.5"/>
    <rect x="54" y="44" width="92" height="126" rx="10" fill="#0f1a14"/>
    <rect x="54" y="96" width="92" height="74" rx="10" fill="#10b981" opacity=".28"/>
    <path d="M106 66l-20 40h13l-4 34 25-46h-14z" fill="url(#gGold)"/>
    <rect x="54" y="44" width="92" height="126" rx="10" fill="url(#gGlass)"/>
    <path d="M64 156h16M64 164h28" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" opacity=".6"/>`,

  charger: `
    <rect x="58" y="46" width="84" height="80" rx="20" fill="url(#gBody)" stroke="#4a4a62" stroke-width="1.5"/>
    <rect x="58" y="46" width="84" height="80" rx="20" fill="url(#gGlass)"/>
    <rect x="76" y="24" width="8" height="24" rx="3" fill="#8c8ca3"/>
    <rect x="116" y="24" width="8" height="24" rx="3" fill="#8c8ca3"/>
    <rect x="74" y="104" width="20" height="9" rx="4.5" fill="#0d1426" stroke="url(#gGold)" stroke-width="1.2"/>
    <rect x="106" y="104" width="20" height="9" rx="4.5" fill="#0d1426" stroke="url(#gGold)" stroke-width="1.2"/>
    <path d="M104 62l-14 26h9l-3 20 16-28h-9z" fill="url(#gGold)"/>
    <path d="M100 126c0 26-34 18-34 40 0 10 8 16 18 16" stroke="#4a4a62" stroke-width="5" fill="none" stroke-linecap="round"/>
    <rect x="82" y="172" width="26" height="14" rx="6" fill="url(#gBody)" stroke="#5a5a72"/>`,

  powerbank: `
    <rect x="60" y="26" width="80" height="150" rx="16" fill="url(#gBody)" stroke="#4a4a62" stroke-width="1.5"/>
    <rect x="60" y="26" width="80" height="150" rx="16" fill="url(#gGlass)"/>
    <rect x="74" y="44" width="52" height="34" rx="7" fill="#0d1426"/>
    <text x="100" y="68" font-family="Orbitron, monospace" font-size="18" font-weight="700" fill="#f2d675" text-anchor="middle">87%</text>
    <path d="M104 94l-13 24h8l-2 18 15-26h-9z" fill="url(#gGold)"/>
    <circle cx="78" cy="150" r="4" fill="#10b981"/>
    <circle cx="92" cy="150" r="4" fill="#10b981"/>
    <circle cx="106" cy="150" r="4" fill="#10b981"/>
    <circle cx="120" cy="150" r="4" fill="#3a3a4c"/>
    <rect x="84" y="164" width="32" height="7" rx="3.5" fill="#0d1426" stroke="url(#gGold)" stroke-width="1"/>`,
};

function deviceArt(kind) {
  return `<svg class="device-art" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${ART[kind] || ART.phone}</svg>`;
}

/* ==========================================================================
   ESTADO
   ========================================================================== */
const estado = {
  filtro: 'todos',
  busqueda: '',
  visibles: CONFIG.productosPorPagina,
  carrito: cargarCarrito(),
  favoritos: cargarFavoritos(),
  planCarrito: 12,
  sim: { precio: 4500, enganchePct: 15, meses: 12 },
};

function cargarCarrito() {
  try { return JSON.parse(localStorage.getItem('nixgo_cart')) || {}; }
  catch { return {}; }
}
function guardarCarrito() {
  try { localStorage.setItem('nixgo_cart', JSON.stringify(estado.carrito)); } catch {}
}
function cargarFavoritos() {
  try { return new Set(JSON.parse(localStorage.getItem('nixgo_fav')) || []); }
  catch { return new Set(); }
}
function guardarFavoritos() {
  try { localStorage.setItem('nixgo_fav', JSON.stringify([...estado.favoritos])); } catch {}
}

/* ==========================================================================
   RENDER — barras superiores
   ========================================================================== */
function renderTicker() {
  const items = [
    '<b>0%</b> de interés a 3 meses',
    'Aprobación en <b>15 minutos</b>',
    'Envíos a los <b>22 departamentos</b>',
    '<b>12 meses</b> de garantía en todos los equipos',
    'Diagnóstico técnico <b>gratuito</b>',
    'Plan Renueva: <b>tu equipo usado</b> como enganche',
  ];
  const bloque = items.map((t) => `<span>◆ ${t}</span>`).join('');
  $('#ticker').innerHTML = bloque + bloque;
}

function renderMarcas() {
  const marcas = ['Apple', 'Samsung', 'Xiaomi', 'Motorola', 'Lenovo', 'HP', 'ASUS', 'Huawei', 'Anker', 'JBL', 'Dell', 'Realme'];
  const bloque = marcas.map((m) => `<span>${m}</span>`).join('');
  $('#brandTrack').innerHTML = bloque + bloque;
}

/* ==========================================================================
   RENDER — categorías y catálogo
   ========================================================================== */
function renderCategorias() {
  $('#catGrid').innerHTML = CATEGORIAS.map((c) => `
    <button class="cat-card" data-cat="${c.id}" type="button">
      <svg class="ico"><use href="#${c.icono}"/></svg>
      <h3>${c.nombre}</h3>
      <small>${c.nota}</small>
    </button>`).join('');

  $$('#catGrid .cat-card').forEach((b) => {
    b.addEventListener('click', () => {
      aplicarFiltro(b.dataset.cat);
      $('#productGrid').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

function renderFiltros() {
  const opciones = [{ id: 'todos', nombre: 'Todos' }, ...CATEGORIAS];
  $('#filters').innerHTML = opciones.map((o) =>
    `<button class="filter${o.id === estado.filtro ? ' active' : ''}" data-cat="${o.id}" type="button">${o.nombre}</button>`
  ).join('');

  $$('#filters .filter').forEach((b) => {
    b.addEventListener('click', () => aplicarFiltro(b.dataset.cat));
  });
}

function aplicarFiltro(cat) {
  estado.filtro = cat;
  estado.visibles = CONFIG.productosPorPagina;
  renderFiltros();
  renderProductos();
}

function productosFiltrados() {
  const q = estado.busqueda.trim().toLowerCase();
  return PRODUCTOS.filter((p) => {
    const okCat = estado.filtro === 'todos' || p.cat === estado.filtro;
    const okQ = !q || `${p.nombre} ${p.marca} ${p.specs} ${p.cat}`.toLowerCase().includes(q);
    return okCat && okQ;
  });
}

const ETIQUETAS = {
  hot: 'Más vendido',
  new: 'Nuevo',
  off: 'Oferta',
  zero: '0% a 3 meses',
};

function tarjetaProducto(p) {
  const tags = (p.tags || []).map((t) => `<span class="tag ${t}">${ETIQUETAS[t]}</span>`).join('');
  const fav = estado.favoritos.has(p.id) ? ' on' : '';
  return `
    <article class="product" data-id="${p.id}">
      <div class="p-media">
        ${deviceArt(p.kind)}
        <div class="p-tags">${tags}</div>
        <button class="p-fav${fav}" data-fav="${p.id}" type="button" aria-label="Guardar en favoritos">
          <svg><use href="#i-heart"/></svg>
        </button>
      </div>
      <div class="p-body">
        <div class="p-brand">${p.marca}</div>
        <h3 class="p-name">${p.nombre}</h3>
        <div class="p-specs">${p.specs}</div>
        <div class="p-rating"><span class="stars">${estrellas(p.rating)}</span> ${p.rating} · ${p.reviews} reseñas</div>
        <div class="p-price-row">
          <span class="p-price">${money(p.precio)}</span>
          ${p.antes ? `<span class="p-old">${money(p.antes)}</span>` : ''}
        </div>
        <div class="p-fin">💳 Desde <b>${money(cuotaDesde(p.precio))}</b> / mes</div>
        <div class="p-actions">
          <button class="btn btn-gold sm" data-add="${p.id}" type="button">Agregar</button>
          <button class="btn btn-ghost sm" data-view="${p.id}" type="button">Detalles</button>
        </div>
      </div>
    </article>`;
}

function renderProductos() {
  const lista = productosFiltrados();
  const grid = $('#productGrid');

  if (!lista.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="big">🔍</div>
        <p>No encontramos productos con esos criterios.</p>
        <p style="margin-top:8px">Prueba con otra búsqueda o escríbenos y te lo conseguimos.</p>
      </div>`;
    $('#loadMore').hidden = true;
    return;
  }

  const mostrar = lista.slice(0, estado.visibles);
  grid.innerHTML = mostrar.map(tarjetaProducto).join('');
  $('#loadMore').hidden = estado.visibles >= lista.length;

  observarReveal(grid);
}

/* ==========================================================================
   RENDER — servicio, testimonios, FAQ
   ========================================================================== */
function renderServicios() {
  $('#svcList').innerHTML = SERVICIOS.map((s) => `
    <div class="svc-item">
      <div class="l">
        <svg class="ico"><use href="#${s.ico}"/></svg>
        <div><h4>${s.n}</h4><small>${s.d}</small></div>
      </div>
      <div class="price">${s.p}</div>
    </div>`).join('');
}

function renderTestimonios() {
  $('#testiGrid').innerHTML = TESTIMONIOS.map((t) => `
    <div class="testi">
      <div class="stars">★★★★★</div>
      <p>${t.t}</p>
      <div class="testi-who">
        <div class="avatar">${iniciales(t.n)}</div>
        <div><strong>${t.n}</strong><span>${t.r}</span></div>
      </div>
    </div>`).join('');
}

function renderFaq() {
  $('#faqList').innerHTML = FAQS.map(([q, a]) => `
    <div class="faq-item">
      <button class="faq-q" type="button">${q}<span class="plus">+</span></button>
      <div class="faq-a"><p>${a}</p></div>
    </div>`).join('');

  $$('#faqList .faq-q').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const abierto = item.classList.contains('open');
      $$('#faqList .faq-item').forEach((i) => {
        i.classList.remove('open');
        $('.faq-a', i).style.maxHeight = null;
      });
      if (!abierto) {
        item.classList.add('open');
        const panel = $('.faq-a', item);
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });
}

/* --------------------------------------------------------------------------
   ACCIONES RÁPIDAS DE WHATSAPP (panel de contacto)
   -------------------------------------------------------------------------- */
const ACCIONES_WA = [
  {
    ico: 'i-cart',
    t: 'Quiero cotizar un equipo',
    d: 'Celulares, laptops, tablets y accesorios',
    m: 'Hola NIXGO tech 👋 Quiero cotizar un equipo. ¿Me ayudan con disponibilidad y precio?',
  },
  {
    ico: 'i-id',
    t: 'Aplicar a financiamiento',
    d: 'Te decimos qué nivel te aplica y qué necesitas',
    m: 'Hola NIXGO tech 👋 Me interesa aplicar al financiamiento. ¿Qué nivel me corresponde y qué requisitos debo presentar?',
  },
  {
    ico: 'i-select',
    t: 'Pedir el catálogo completo',
    d: 'Te lo enviamos por chat al instante',
    m: 'Hola NIXGO tech 👋 ¿Me pueden enviar el catálogo completo de equipos, por favor?',
  },
  {
    ico: 'i-parts',
    t: 'Reparación o repuesto',
    d: 'Diagnóstico gratis · garantía 90 días',
    m: 'Hola NIXGO tech 👋 Necesito una reparación / un repuesto para mi equipo. ¿Me dan una cotización?',
  },
  {
    ico: 'i-refresh',
    t: 'Cotizar mi equipo usado',
    d: 'Plan Renueva: úsalo como enganche',
    m: 'Hola NIXGO tech 👋 Quiero cotizar mi equipo usado para el Plan Renueva. ¿Cómo lo valúan?',
  },
];

function renderAccionesWa() {
  $('#waActions').innerHTML = ACCIONES_WA.map((a) => `
    <a class="wa-action" href="${waLink(a.m)}" target="_blank" rel="noopener">
      <span class="ico"><svg><use href="#${a.ico}"/></svg></span>
      <span class="txt"><strong>${a.t}</strong><span>${a.d}</span></span>
      <span class="arrow">→</span>
    </a>`).join('');
}

function renderValores() {
  $('#valoresGrid').innerHTML = VALORES.map((v) => `
    <div class="valor-card">
      <svg class="ico"><use href="#${v.ico}"/></svg>
      <h4>${v.n}</h4>
      <p>${v.d}</p>
    </div>`).join('');
}

/* ==========================================================================
   NIVELES DE CRÉDITO
   ========================================================================== */
function renderNiveles() {
  $('#tiers').innerHTML = NIVELES.map((n) => {
    const herencia = n.heredaDe
      ? `<li class="herencia">Todo lo de ${n.heredaDe}</li>`
      : '';
    return `
      <article class="tier" data-nivel="${n.id}" style="--tc:${n.color};--tglow:${n.glow}">
        <span class="tier-flag">Tu nivel</span>
        <div class="tier-head">
          <span class="tier-dot"></span>
          <h3>${n.nombre}</h3>
        </div>
        <div class="range">${n.rango}</div>
        <span class="range-note">${n.nota}</span>
        <ul>
          ${herencia}
          ${n.requisitos.map((r) => `<li>${r}</li>`).join('')}
        </ul>
      </article>`;
  }).join('');
}

/** Resalta la tarjeta del nivel aplicable y actualiza el distintivo del resultado. */
function marcarNivel(montoFinanciado) {
  const nivel = nivelPara(montoFinanciado);

  $$('#tiers .tier').forEach((el) => {
    el.classList.toggle('match', el.dataset.nivel === nivel.id);
  });

  $('#resTier').innerHTML = `
    <span class="result-tier" style="--tc:${nivel.color};--tglow:${nivel.glow}">
      <span class="tier-dot"></span>${nivel.nombre}
    </span>`;

  return nivel;
}

/* ==========================================================================
   SIMULADOR DE FINANCIAMIENTO
   ========================================================================== */
function renderPlanes() {
  $('#terms').innerHTML = PLANES.map((p) => `
    <button class="term${p.meses === estado.sim.meses ? ' active' : ''}" data-meses="${p.meses}" type="button">
      <div class="n">${p.meses}</div>
      <div class="u">meses</div>
      <span class="rate">${p.tasa === 0 ? '0% interés' : (p.tasa * 100).toFixed(2) + '%'}</span>
    </button>`).join('');

  $$('#terms .term').forEach((b) => {
    b.addEventListener('click', () => {
      estado.sim.meses = Number(b.dataset.meses);
      renderPlanes();
      calcularSimulador();
    });
  });
}

function renderSelectorProducto() {
  const grupos = CATEGORIAS.map((c) => {
    const items = PRODUCTOS.filter((p) => p.cat === c.id)
      .map((p) => `<option value="${p.id}">${p.nombre} — ${money(p.precio)}</option>`).join('');
    return `<optgroup label="${c.nombre}">${items}</optgroup>`;
  }).join('');

  $('#simProduct').innerHTML = `<option value="">Monto personalizado</option>${grupos}`;

  $('#simProduct').addEventListener('change', (e) => {
    const p = PRODUCTOS.find((x) => x.id === e.target.value);
    if (!p) return;
    estado.sim.precio = p.precio;
    $('#simPrice').value = Math.min(p.precio, Number($('#simPrice').max));
    calcularSimulador();
  });
}

function calcularSimulador() {
  const precio = estado.sim.precio;
  const pct = estado.sim.enganchePct;
  const plan = PLANES.find((p) => p.meses === estado.sim.meses) || PLANES[2];

  const enganche = precio * (pct / 100);
  const financiado = precio - enganche;
  const cuota = cuotaMensual(financiado, plan.meses, plan.tasa);
  const totalCuotas = cuota * plan.meses;
  const intereses = totalCuotas - financiado;
  const total = totalCuotas + enganche;

  $('#simPriceVal').textContent = money(precio);
  $('#simDownVal').textContent = `${money(enganche)} · ${pct}%`;

  $('#resQuota').innerHTML = `${money(cuota)}<small>/mes</small>`;
  $('#resNote').textContent =
    `Plazo de ${plan.meses} meses · ${plan.tasa === 0 ? 'sin intereses' : 'tasa ' + (plan.tasa * 100).toFixed(2) + '% mensual'}`;
  $('#resPrice').textContent = money(precio);
  $('#resDown').textContent = money(enganche);
  $('#resFinanced').textContent = money(financiado);
  $('#resInterest').textContent = money(intereses);
  $('#resTotal').textContent = money(total);

  const nivel = marcarNivel(financiado);

  const nombreProd = $('#simProduct').selectedOptions[0]?.value
    ? $('#simProduct').selectedOptions[0].textContent.split(' — ')[0]
    : 'un equipo';

  $('#simWa').href = waLink(
    `Hola NIXGO tech 👋\n\nQuiero solicitar financiamiento para ${nombreProd}.\n\n` +
    `• Precio: ${money(precio)}\n• Enganche: ${money(enganche)} (${pct}%)\n` +
    `• Monto a financiar: ${money(financiado)}\n• Nivel: ${nivel.nombre}\n` +
    `• Plazo: ${plan.meses} meses\n• Cuota mensual: ${money(cuota)}\n• Total a pagar: ${money(total)}\n\n` +
    `¿Me ayudan con el proceso?`
  );
}

function initSimulador() {
  const rangoPrecio = $('#simPrice');
  const rangoEnganche = $('#simDown');

  rangoPrecio.value = estado.sim.precio;
  rangoEnganche.value = estado.sim.enganchePct;

  rangoPrecio.addEventListener('input', (e) => {
    estado.sim.precio = Number(e.target.value);
    $('#simProduct').value = '';
    calcularSimulador();
  });

  rangoEnganche.addEventListener('input', (e) => {
    estado.sim.enganchePct = Number(e.target.value);
    calcularSimulador();
  });

  renderPlanes();
  renderSelectorProducto();
  calcularSimulador();
}

/* ==========================================================================
   CARRITO / COTIZACIÓN
   ========================================================================== */
function totalCarrito() {
  return Object.entries(estado.carrito).reduce((acc, [id, qty]) => {
    const p = PRODUCTOS.find((x) => x.id === id);
    return acc + (p ? p.precio * qty : 0);
  }, 0);
}

function unidadesCarrito() {
  return Object.values(estado.carrito).reduce((a, b) => a + b, 0);
}

function agregarAlCarrito(id, silencioso = false) {
  estado.carrito[id] = (estado.carrito[id] || 0) + 1;
  guardarCarrito();
  renderCarrito();
  if (!silencioso) {
    const p = PRODUCTOS.find((x) => x.id === id);
    toast(`${p.nombre} agregado a tu cotización`);
  }
}

function cambiarCantidad(id, delta) {
  estado.carrito[id] = (estado.carrito[id] || 0) + delta;
  if (estado.carrito[id] <= 0) delete estado.carrito[id];
  guardarCarrito();
  renderCarrito();
}

function quitarDelCarrito(id) {
  delete estado.carrito[id];
  guardarCarrito();
  renderCarrito();
}

function renderCarrito() {
  const ids = Object.keys(estado.carrito);
  const badge = $('#cartCount');
  const unidades = unidadesCarrito();

  badge.textContent = unidades;
  badge.classList.toggle('show', unidades > 0);

  const body = $('#cartBody');
  const foot = $('#cartFoot');

  if (!ids.length) {
    body.innerHTML = `
      <div class="cart-empty">
        <div class="big">🛒</div>
        <p>Tu cotización está vacía.</p>
        <p style="margin-top:8px;font-size:.85rem">Agrega equipos y calculamos tu cuota al instante.</p>
      </div>`;
    foot.hidden = true;
    return;
  }

  body.innerHTML = ids.map((id) => {
    const p = PRODUCTOS.find((x) => x.id === id);
    if (!p) return '';
    const qty = estado.carrito[id];
    return `
      <div class="cart-item">
        <div class="thumb">${deviceArt(p.kind)}</div>
        <div class="info">
          <h5>${p.nombre}</h5>
          <div class="pr">${money(p.precio * qty)}</div>
          <div class="qty">
            <button data-minus="${id}" type="button" aria-label="Quitar uno">−</button>
            <span>${qty}</span>
            <button data-plus="${id}" type="button" aria-label="Agregar uno">+</button>
            <button class="rm" data-remove="${id}" type="button">Eliminar</button>
          </div>
        </div>
      </div>`;
  }).join('');

  foot.hidden = false;
  renderPlanMini();
  calcularCarrito();
}

function renderPlanMini() {
  $('#planMini').innerHTML = PLANES.map((p) =>
    `<button type="button" data-plan="${p.meses}" class="${p.meses === estado.planCarrito ? 'active' : ''}">${p.meses}m</button>`
  ).join('');

  $$('#planMini button').forEach((b) => {
    b.addEventListener('click', () => {
      estado.planCarrito = Number(b.dataset.plan);
      renderPlanMini();
      calcularCarrito();
    });
  });
}

function calcularCarrito() {
  const subtotal = totalCarrito();
  const enganche = subtotal * CONFIG.engancheSugerido;
  const plan = PLANES.find((p) => p.meses === estado.planCarrito) || PLANES[2];
  const financiado = subtotal - enganche;
  const cuota = cuotaMensual(financiado, plan.meses, plan.tasa);
  const nivel = nivelPara(financiado);

  $('#cartSubtotal').textContent = money(subtotal);
  $('#cartDown').textContent = money(enganche);
  $('#cartQuota').textContent = money(cuota);

  const detalle = Object.entries(estado.carrito).map(([id, qty]) => {
    const p = PRODUCTOS.find((x) => x.id === id);
    return p ? `• ${qty}x ${p.nombre} — ${money(p.precio * qty)}` : '';
  }).filter(Boolean).join('\n');

  $('#cartWa').href = waLink(
    `Hola NIXGO tech 👋\n\nMe interesa esta cotización:\n\n${detalle}\n\n` +
    `Subtotal: ${money(subtotal)}\nEnganche (15%): ${money(enganche)}\n` +
    `Monto a financiar: ${money(financiado)}\nNivel: ${nivel.nombre}\n` +
    `Plazo: ${plan.meses} meses\nCuota mensual estimada: ${money(cuota)}\n\n` +
    `¿Me confirman disponibilidad y requisitos?`
  );
}

/* ==========================================================================
   MODAL DE PRODUCTO
   ========================================================================== */
function abrirModal(id) {
  const p = PRODUCTOS.find((x) => x.id === id);
  if (!p) return;

  const plan24 = PLANES[PLANES.length - 1];
  $('#modalCard').innerHTML = `
    <button class="modal-close" id="modalClose" aria-label="Cerrar">&times;</button>
    <div class="modal-media">${deviceArt(p.kind)}</div>
    <div class="modal-info">
      <div class="p-brand">${p.marca}</div>
      <h3>${p.nombre}</h3>
      <div class="p-rating"><span class="stars">${estrellas(p.rating)}</span> ${p.rating} · ${p.reviews} reseñas</div>
      <p class="desc" style="margin-top:14px">${p.desc}</p>
      <div class="spec-list">
        ${p.ficha.map(([k, v]) => `<div class="spec"><span>${k}</span><b>${v}</b></div>`).join('')}
      </div>
      <div class="p-price-row">
        <span class="modal-price">${money(p.precio)}</span>
        ${p.antes ? `<span class="p-old">${money(p.antes)}</span>` : ''}
      </div>
      <div class="p-fin modal-fin">💳 Desde <b>${money(cuotaDesde(p.precio))}</b> / mes a ${plan24.meses} meses con 15% de enganche</div>
      <div class="modal-actions">
        <button class="btn btn-gold" data-add="${p.id}" type="button">Agregar a cotización</button>
        <a class="btn btn-wa" href="${waLink(`Hola NIXGO tech 👋 Me interesa el ${p.nombre} (${p.specs}) de ${money(p.precio)}. ¿Me dan más información sobre el financiamiento?`)}" target="_blank" rel="noopener">Consultar</a>
      </div>
    </div>`;

  $('#modal').classList.add('show');
  document.body.classList.add('no-scroll');
  $('#modalClose').addEventListener('click', cerrarModal);
}

function cerrarModal() {
  $('#modal').classList.remove('show');
  if (!$('#drawer').classList.contains('open')) document.body.classList.remove('no-scroll');
}

/* ==========================================================================
   DRAWER
   ========================================================================== */
function abrirDrawer() {
  $('#drawer').classList.add('open');
  $('#overlay').classList.add('show');
  document.body.classList.add('no-scroll');
}
function cerrarDrawer() {
  $('#drawer').classList.remove('open');
  $('#overlay').classList.remove('show');
  if (!$('#modal').classList.contains('show')) document.body.classList.remove('no-scroll');
}

/* ==========================================================================
   TOAST
   ========================================================================== */
let toastTimer;
function toast(msg) {
  $('#toastMsg').textContent = msg;
  $('#toast').classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $('#toast').classList.remove('show'), 2800);
}

/* ==========================================================================
   ANIMACIONES
   ========================================================================== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

// Nota: .tier queda fuera a propósito — su estado .match usa transform y
// chocaría con la animación de entrada.
const SELECTORES_REVEAL = '.cat-card, .product, .sim, .result, .step, .reqs, .svc-item, .svc-panel, .testi, .faq-item, .renueva, .contacto-text, .wa-panel, .about-card, .valor-card, .catalogo-cta';

function observarReveal(ctx = document) {
  $$(SELECTORES_REVEAL, ctx).forEach((el) => {
    if (el.classList.contains('reveal')) return;
    el.classList.add('reveal');
    revealObserver.observe(el);
  });
}

function animarContadores() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const meta = Number(el.dataset.count);
      const suf = el.dataset.suffix || '';
      const inicio = performance.now();
      const dur = 1400;

      const paso = (t) => {
        const p = Math.min((t - inicio) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(meta * eased).toLocaleString('es-GT') + suf;
        if (p < 1) requestAnimationFrame(paso);
      };
      requestAnimationFrame(paso);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  $$('[data-count]').forEach((el) => obs.observe(el));
}

function navActiva() {
  const secciones = ['inicio', 'catalogo', 'financiamiento', 'servicio', 'nosotros', 'contacto']
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      $$('#navLinks a').forEach((a) => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id);
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  secciones.forEach((s) => obs.observe(s));
}

/* ==========================================================================
   EVENTOS GLOBALES
   ========================================================================== */
function initEventos() {
  // Header al hacer scroll
  const header = $('#header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  // Menú móvil
  const hamburger = $('#hamburger');
  const navLinks = $('#navLinks');
  hamburger.addEventListener('click', () => {
    const abierto = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', abierto);
    hamburger.setAttribute('aria-expanded', String(abierto));
  });
  $$('#navLinks a').forEach((a) => a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }));

  // Búsqueda
  let debounce;
  $('#searchInput').addEventListener('input', (e) => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      estado.busqueda = e.target.value;
      estado.visibles = CONFIG.productosPorPagina;
      renderProductos();
    }, 180);
  });

  // Ver más
  $('#loadMore').addEventListener('click', () => {
    estado.visibles += CONFIG.productosPorPagina;
    renderProductos();
  });

  // Delegación: agregar / ver / favoritos
  document.addEventListener('click', (e) => {
    const add = e.target.closest('[data-add]');
    if (add) {
      agregarAlCarrito(add.dataset.add);
      if (add.closest('#modal')) cerrarModal();
      return;
    }

    const view = e.target.closest('[data-view]');
    if (view) { abrirModal(view.dataset.view); return; }

    const fav = e.target.closest('[data-fav]');
    if (fav) {
      const id = fav.dataset.fav;
      if (estado.favoritos.has(id)) { estado.favoritos.delete(id); }
      else { estado.favoritos.add(id); toast('Guardado en tus favoritos'); }
      guardarFavoritos();
      fav.classList.toggle('on', estado.favoritos.has(id));
      return;
    }

    const minus = e.target.closest('[data-minus]');
    if (minus) { cambiarCantidad(minus.dataset.minus, -1); return; }

    const plus = e.target.closest('[data-plus]');
    if (plus) { cambiarCantidad(plus.dataset.plus, 1); return; }

    const rm = e.target.closest('[data-remove]');
    if (rm) { quitarDelCarrito(rm.dataset.remove); return; }

    const jump = e.target.closest('[data-jump]');
    if (jump) { aplicarFiltro(jump.dataset.jump); return; }
  });

  // Drawer
  $('#cartBtn').addEventListener('click', abrirDrawer);
  $('#drawerClose').addEventListener('click', cerrarDrawer);
  $('#overlay').addEventListener('click', cerrarDrawer);

  // Modal
  $('#modal').addEventListener('click', (e) => {
    if (e.target.id === 'modal') cerrarModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    cerrarModal();
    cerrarDrawer();
  });

  // Enlaces de WhatsApp generales
  const saludo = 'Hola NIXGO tech 👋 Quiero información sobre sus equipos y el financiamiento.';
  [$('#fabWa'), $('#footWa'), $('#contactWa')].forEach((a) => {
    a.href = waLink(saludo);
    a.target = '_blank';
    a.rel = 'noopener';
  });

  const catalogoWa = $('#catalogoWa');
  catalogoWa.href = waLink(
    'Hola NIXGO tech 👋 Me gustaría recibir el catálogo completo de equipos y conocer las opciones de financiamiento. ¡Gracias!'
  );
  catalogoWa.target = '_blank';
  catalogoWa.rel = 'noopener';
  $('#simWa').target = '_blank';
  $('#cartWa').target = '_blank';

  // Año en el footer
  $('#year').textContent = new Date().getFullYear();
}

/* ==========================================================================
   ARRANQUE
   ========================================================================== */
function init() {
  inyectarDefs();
  renderTicker();
  renderMarcas();
  renderCategorias();
  renderFiltros();
  renderProductos();
  renderServicios();
  renderTestimonios();
  renderValores();
  renderAccionesWa();
  renderFaq();
  renderNiveles();
  initSimulador();
  renderCarrito();
  initEventos();
  animarContadores();
  navActiva();
  observarReveal();

  $('#heroArt').innerHTML = deviceArt('phone');
  $('#renuevaArt').innerHTML = deviceArt('laptop');

  // La cuota "desde" del hero se calcula del catálogo real, no se escribe a mano
  const cuotaMinima = Math.min(...PRODUCTOS.filter((p) => p.cat === 'celulares').map((p) => cuotaDesde(p.precio)));
  $('#heroCuota').textContent = `${money(cuotaMinima)} / mes`;
}

document.addEventListener('DOMContentLoaded', init);
