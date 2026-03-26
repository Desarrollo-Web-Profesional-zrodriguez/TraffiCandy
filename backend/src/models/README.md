## 🗄️ Arquitectura de Base de Datos (MongoDB)

El proyecto utiliza una base de datos NoSQL (MongoDB) por su flexibilidad y compatibilidad nativa con JSON en el stack MERN. A continuación se detallan los esquemas principales que manejan la lógica de negocio de **TrafiCandy**.

### Colección: `Usuarios`
Maneja la autenticación, la separación de roles (Vendedor/Cliente) y los campos necesarios para la seguridad avanzada (2FA y recuperación de contraseñas).

| Campo | Tipo | Requerido | Descripción / Regla de Negocio |
| :--- | :--- | :---: | :--- |
| `nombre` | String | Sí | Nombre completo del usuario. |
| `email` | String | Sí | Correo electrónico (Único, usado para login). |
| `password` | String | Sí | Contraseña encriptada (Hash con bcrypt). |
| `rol` | String | No | Enum: `['cliente', 'vendedor']`. Default: `'cliente'`. |
| `twoFactorCode` | String | No | Código temporal (OTP) para Autenticación Fuerte. |
| `twoFactorExpire` | Date | No | Fecha de caducidad del código 2FA. |
| `resetPasswordToken`| String | No | Token único para recuperar acceso. |
| `resetPasswordExpire`| Date | No | Fecha de caducidad del token de recuperación. |
| `timestamps` | Date | Automático| Registra `createdAt` y `updatedAt` automáticamente. |

### Colección: `Dulces`
Almacena el catálogo de productos. Está diseñado específicamente para la exportación internacional, manejando descripciones bilingües, perfiles sensoriales y variables logísticas.

| Campo | Tipo | Requerido | Descripción / Regla de Negocio |
| :--- | :--- | :---: | :--- |
| `nombre` | String | Sí | Nombre comercial del producto (Ej. "Pelón Pelo Rico"). |
| `descripcion_en` | String | Sí | Descripción adaptada para el mercado extranjero. |
| `descripcion_es` | String | Sí | Descripción para el mercado local o administradores. |
| `precioBase` | Number | Sí | Precio del producto sin envío (en MXN). |
| `pesoGramos` | Number | Sí | **Clave logística:** Usado para calcular el costo de envío internacional. |
| `stock` | Number | No | Cantidad disponible en inventario. Default: `0`. |
| `imagenes` | Array[String]| No | Arreglo de URLs con las fotografías del producto. |
| `flavorTags` | Array[String]| No | Etiquetas en inglés para filtros (Ej. `["spicy", "sweet"]`). |
| `nivelPicor` | Number | No | Escala del 0 al 5 para advertir al consumidor extranjero. |
| `alergenos` | Array[String]| No | Ingredientes de cuidado (Ej. `["peanuts", "soy"]`). |
| `disponibleParaEnvio`| Boolean| No | Define si el producto puede exportarse. Default: `true`. |
| `timestamps` | Date | Automático| Registra la fecha de creación y última actualización. |

***

## 🍭 Generación y Edición de Dulces (Requerimientos Backend)

El formulario de creación (`CandyForm.jsx`) ha sido actualizado con características avanzadas que requieren soporte en el lado del servidor para un flujo de producción óptimo:

### 1. Auto-Traducción de Descripciones
En el frontend, el botón "Traducir Inteligente" usa temporalmente una API gratuita abierta (MyMemory) o una simulación. Sin embargo, para producción:
- El backend debería tener una ruta como `POST /api/translate`.
- Esta ruta debe recibir el payload `{ text: "Dulce picante...", lang: "en" }`.
- El controlador del backend interactuará con APIs robustas y seguras (como Google Cloud Translation o DeepL) utilizando credenciales protegidas en tu `.env`. Luego devolverá el texto al frontend.

### 2. Múltiples Imágenes (Array de Strings)
El esquema de Mongoose actual (`imagenes: [String]`) ya soporta múltiples URLs formidables. El frontend ya envía un *Array de Strings* estructurado en lugar de un único string.
- Asegúrate de que el validador del backend (`req.body.imagenes`) itere y acepte el array sin sobrescribencias.
- Si en el futuro se desea implementar carga física de archivos en lugar de URLs, el backend requerirá Middleware de subida (Ej. `Multer`) conectado a un bucket (Ej. `AWS S3` o `Cloudinary`), retornando el array de URLs seguras hacia la base de datos.


---

## 💳 Integración de Pagos (PayPal)

El sistema de **Checkout** (Envíos Internacionales) simula el entorno de cobro en el *Frontend* procesando órdenes directamente. Sin embargo, en un sistema en producción seguro, la validación y captura de la orden debe validarse contra tus credenciales privadas.

### Variables de Entorno Requeridas (.env)
Para conectar tu cuenta de PayPal en el backend y verificar pagos, debes configurar tu archivo local `.env`. **¡Por reglas de seguridad rigurosas, NUNCA subas tus secretos al repositorio Git ni los guardes en código plano!**

Añade las siguientes variables a tu archivo `.env` en la raíz del backend:

```env
# PayPal API Credentials
PAYPAL_CLIENT_ID=Af8sjYN_QIXasRJIJdofe8cuN0PL6SaXDgOd5wncvyffpdVAP9DTD4zggIo8AdGIKcV3ah0SNwM2214v
PAYPAL_SECRET=Aqui_Pega_Tu_Secret_Proporcionado
PAYPAL_ENVIRONMENT=sandbox # Cambiar a 'live' en producción
```

*Nota para el desarrollador: Pega el `Secret` que termina en `_KJNu` que proporcionaste recientemente en tu archivo `.env` local. El Agente Inteligente no almacena esta llave en memoria para proteger tu API.*

### Endpoints (Por Desarrollar)
Para integrar el flujo completo, tu backend de Node.js deberá crear las siguientes rutas en el futuro:
1. `POST /api/orders/create` - Para llamar a PayPal con el Secret y crear la orden asegurada.
2. `POST /api/orders/:orderID/capture` - Para verificar la transacción real con PayPal antes de vaciar el inventario.