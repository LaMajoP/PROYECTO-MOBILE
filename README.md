# 🌍 GlobalLocker Marketplace

## 🚀 Descripción general

**GlobalLocker Marketplace** es una plataforma que permite a los usuarios comprar productos de cualquier país sin preocuparse por procesos complejos de envío internacional.  
El sistema se conecta automáticamente con el **casillero virtual más económico o más conveniente** según la ubicación del usuario, optimizando costos y tiempos de entrega.

En otras palabras: el usuario compra como si estuviera comprando localmente, pero la plataforma se encarga de la logística global.

---

## 🧭 Problema que resuelve

Comprar en el extranjero suele ser complicado y costoso por:
- Altos costos de envío internacional.  
- Dificultad para elegir el mejor casillero o courier.  
- Poca transparencia en tiempos de entrega.  
- Procesos de aduana confusos y pagos adicionales inesperados.  

**GlobalLocker Marketplace** simplifica este proceso conectando automáticamente al usuario con el casillero ideal, optimizando costos y logística en segundo plano.

---

## 💡 Propuesta de valor

- 🔗 **Conexión automática** con el casillero más económico o conveniente.  
- 🧠 **Marketplace inteligente con IA logística:** el sistema calcula en tiempo real la mejor ruta de envío entre países, optimizando costo y tiempo.  
- 🏪 **Marketplace descentralizado de tiendas locales:** el usuario puede acceder a pequeños comercios internacionales sin intermediarios.  
- 🏠 **Experiencia de compra local:** el usuario solo selecciona el país y compra normalmente.  
- 💸 **Ahorro garantizado** en envíos internacionales.  
- 🌐 **Acceso a tiendas globales** desde una sola aplicación.  
- 📦 **Seguimiento unificado** de pedidos desde el origen hasta el destino.  

---

## 🧱 Flujo de uso

1. **Inicio de sesión (Login):**  
   El usuario accede con su correo electrónico.

2. **Ubicación de residencia:**  
   Indica su país y ciudad actual.

3. **Selección de país del casillero:**  
   La app sugiere automáticamente el casillero más conveniente según costo y tiempo.

4. **Compra internacional simulada:**  
   El usuario realiza la compra como si estuviera en ese país; el sistema gestiona el casillero y el envío simulado.

---

## ⚙️ Características principales del MVP (2 semanas)

- 🔍 **Recomendador básico de casilleros:** usa datos predefinidos (mock) para mostrar la mejor opción.  
- 💳 **Compra simulada:** flujo de compra sin pagos reales.  
- 📦 **Seguimiento del pedido:** estados: *procesando → en tránsito → entregado*.  
- 🧾 **Historial de compras:** visible por usuario.  
- 👤 **Login y registro:** solo con correo electrónico (Supabase Auth).  
- 📱 **Compatible con iOS y Android.**  

---

## 🎯 Público objetivo

- Compradores frecuentes en tiendas internacionales (Amazon, eBay, Shein, etc.)  
- Usuarios que buscan reducir costos de envío.  
- Emprendedores o pequeños negocios que importan productos.  
- Personas sin experiencia en compras internacionales.  
- Tiendas locales que desean vender productos globalmente sin infraestructura compleja.  

---

# 📋 PROJECT CRITERIA

A continuación se presentan los cinco criterios del proyecto, ajustados al alcance y tiempo de desarrollo (2 semanas).

---

## 🧱 1. REQUIREMENTS

### 🔹 Funcionales
1. Registro e inicio de sesión con correo electrónico (Supabase Auth).  
2. Ingreso de país y ciudad de residencia.  
3. Asignación automática de casillero según país y costo simulado.  
4. Simulación de compra internacional (sin pasarela de pago).  
5. Seguimiento del pedido con estados visibles.  
6. Historial básico de pedidos.  

### 🔹 No funcionales
1. Disponibilidad: 95% durante pruebas.  
2. Rendimiento: todas las operaciones deben ejecutarse en menos de **1 minuto**.  
3. Compatibilidad: iOS y Android.  
4. Usabilidad: interfaz clara y fluida.  
5. Seguridad: datos cifrados con SSL/TLS en Supabase.  

---

## 👥 2. USER STORIES

1. **Como usuario nuevo**, quiero poder registrarme e iniciar sesión con mi correo electrónico.  
2. **Como comprador**, quiero ingresar mi país y ciudad para obtener recomendaciones de casilleros.  
3. **Como comprador**, quiero ver un casillero sugerido automáticamente según mis datos.  
4. **Como comprador**, quiero simular una compra internacional.  
5. **Como comprador**, quiero rastrear mi pedido y ver su estado actual.  
6. **Como comprador**, quiero consultar mi historial de compras.  

---

## 🎯 3. SUCCESS CRITERIA

1. Registro y login funcionan correctamente para el **90% de los usuarios de prueba**.  
2. La recomendación del casillero se genera en menos de **1 minuto**.  
3. El flujo de compra simulada se completa sin errores críticos.  
4. Al menos **70% de los usuarios califican positivamente la experiencia**.  
5. **10 tiendas locales** (mock o reales) están disponibles en el marketplace.  

---

## ⚠️ 4. RISKS

1. Retrasos técnicos por falta de experiencia con React Native o Supabase.  
2. Errores de sincronización entre base de datos y app.  
3. Tiempo limitado de desarrollo (2 semanas).  
4. Problemas de compatibilidad entre iOS y Android.  
5. Fallos por pérdida de conexión a internet.  

---

## ⛓️ 5. CONSTRAINTS

1. **Tiempo:** 2 semanas de desarrollo total.  
2. **Equipo:** desarrolladores junior.  
3. **Tecnología:** React Native + Supabase.  
4. **Presupuesto:** servicios gratuitos o de bajo costo.  
5. **Alcance:** sin pagos reales ni API logística; funciones simuladas.  
6. **Idiomas:** español e inglés.  

---

## 🧩 Stack tecnológico

- **Frontend:** React Native (Expo Go)  
- **Backend:** Supabase (Auth + Database)  
- **Lenguaje:** TypeScript  
- **Almacenamiento:** Supabase Storage (si se incluyen imágenes)  

---

© 2025 GlobalLocker Marketplace. Todos los derechos reservados.