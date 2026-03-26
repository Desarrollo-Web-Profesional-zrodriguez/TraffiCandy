import mongoose from 'mongoose'

const productoSchema = new mongoose.Schema({
  slug:        { type: String, required: true, unique: true },
  nombre:      { type: String, required: true },
  marca:       { type: String, required: true },
  precio:      { type: Number, required: true },
  peso:        { type: Number, required: true },
  origen:      { type: String, required: true },
  categoria:   { type: String, enum: ['dulces_confitados', 'botanas', 'dulces_tipicos'], required: true },
  sabores: {
    dulce:      { type: Boolean, default: false },
    picoso:     { type: Boolean, default: false },
    salado:     { type: Boolean, default: false },
    acido:      { type: Boolean, default: false },
    agridulce:  { type: Boolean, default: false },
  },
  descripcion:  { type: String, required: true },
  emoji:        { type: String, default: '🍬' },
  color:        { type: String, default: 'from-[#FF006E] to-[#FB5607]' },
  stock:        { type: Number, default: 100 },
  disponible:   { type: Boolean, default: true },
})

export default mongoose.model('Producto', productoSchema)