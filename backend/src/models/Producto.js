import mongoose from 'mongoose'

const productoSchema = new mongoose.Schema({
  slug:          { type: String, unique: true }, // Auto-generado si no viene
  nombre:        { type: String, required: true },
  marca:         { type: String, default: 'Artesanal' },
  categoria:     { type: String, enum: ['dulce', 'picante', 'agridulce', 'tradicional', 'otro'], default: 'dulce' },
  descripcion_es:{ type: String, required: true },
  descripcion_en:{ type: String, default: '' },
  estadoOrigen:  { type: String, required: true },
  precioBase:    { type: Number, required: true },
  pesoGramos:    { type: Number, required: true },
  stock:         { type: Number, default: 0 },
  
  imagenes:      { type: [String], default: [] },
  emoji:         { type: String, default: '🍬' },
  
  flavorTags:    { type: [String], default: [] },
  nivelPicor:    { type: Number, default: 0 },
  alergenos:     { type: [String], default: [] },
  
  disponibleParaEnvio: { type: Boolean, default: true },
  color:         { type: String, default: 'from-[#FF006E] to-[#FB5607]' },
}, { timestamps: true })

productoSchema.pre('save', function() {
  if (!this.slug && this.nombre) {
    this.slug = this.nombre.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }
});

export default mongoose.model('Producto', productoSchema)