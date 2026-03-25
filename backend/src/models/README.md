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