# Contratos API (Frontend ↔ Backend)

Este documento sirve como referencia rápida para el equipo de Backend sobre la estructura de datos que el equipo de Frontend (React) espera recibir para poblar e interactuar correctamente con la interfaz, especialmente con el Mapa Interactivo y el Carrusel.

## `GET /api/productos`

Este es el endpoint unificado principal que alimenta tanto el carrusel de Inicio como el mapa interactivo regional.

### Formato de Respuesta Esperado (DTO de Lista)

El frontend requiere que este endpoint devuelva un **Arreglo de Objetos** (Array), donde cada objeto represente un dulce y contenga, al menos, las siguientes propiedades con los tipos de datos estipulados:

```json
[
  {
    "_id": "60d5ecb8b392d7... (MongoDB ObjectId)",
    "nombre": "String (Ej. 'Pulparindo')",
    "descripcion_es": "String (Historia breve o descripción del producto para mostrar en el panel Info)",
    "precioBase": 12, // Number (Importante para mostrar el label de precio en el botón de compra)
    "pesoGramos": 20, // Number (Para futuras logísticas e incidencias de paquetería)
    "stock": 200, // Number
    "imagenes": ["https://link-a-imagen.jpg"], // Array of Strings (Si está vacío, el UI caerá en "fallbacks" como emojis)
    "emoji": "🌶️", // String (Mínimo un caracter emoji representativo, útil para UI limpia)
    "categoria": "String ('picante', 'dulce', 'tradicional', etc)",
    "flavorTags": ["spicy", "tamarind"], // Array of Strings (Para futuros filtros de búsqueda)
    "nivelPicor": 3, // Number (Se muestra textual en la viñeta de preparación)
    "alergenos": ["peanuts", "dairy"], // Array of Strings (Se advierten en el UI)
    "disponibleParaEnvio": true, // Boolean
    "estadoOrigen": "String (CRÍTICO: Debe ser el nombre exacto con mayúsculas y acentos: 'Puebla', 'Nuevo León', 'Jalisco')",
    "slug": "String ('pulparindo')"
  }
]
```

### Notas Importantes para Backend:
1. **Atributo Crítico `estadoOrigen`:** El frontend agrupa los dulces usando este string exacto. Si esto no viene o viene mal capitalizado (ej. "nuevo leon" en lugar de "Nuevo León"), el mapa del Frontend NO coloreará la región.
2. **Campos Condicionales UI:**
   - La propiedad `descripcion_es` se renderiza en la UI del mapa como la **"Historia"**.
   - Para no crear campos redundantes, en la sección **"Preparación"** del mapa, el frontend genera de forma automática un string fusionando los datos `nivelPicor` y `alergenos`.
   - Si `imagenes` viene vacío, el frontend utilizará instintivamente el campo `emoji` para renderizar en los *cards* o el carrusel superior.
