import mongoose from 'mongoose';

const DulceSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del dulce es obligatorio.'],
      trim: true,
    },
    descripcion_es: {
      type: String,
      required: [true, 'La descripción en español es obligatoria.'],
    },
    descripcion_en: {
      type: String,
      required: [true, 'La descripción en inglés es obligatoria.'],
    },
    precioBase: {
      type: Number,
      required: [true, 'El precio base es obligatorio.'],
      min: 0,
    },
    pesoGramos: {
      type: Number,
      required: [true, 'El peso es obligatorio para calcular costos logísticos.'],
      min: 0,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    imagenes: {
      type: [String],
      default: [],
    },
    emoji: {
      type: String,
      default: '',
    },
    categoria: {
      type: String,
      enum: ['picante', 'dulce', 'agridulce', 'tradicional', 'otro'],
      default: 'dulce',
    },
    flavorTags: {
      type: [String],
      default: [],
    },
    nivelPicor: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    alergenos: {
      type: [String],
      default: [],
    },
    disponibleParaEnvio: {
      type: Boolean,
      default: true,
    },
    estadoOrigen: {
      type: String,
      required: [true, 'El estado de origen es obligatorio para ubicarlo en el mapa.'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
  },
  { timestamps: true }
);

// Auto generar el slug desde el nombre antes de guardar
DulceSchema.pre('save', function (next) {
  if (this.isModified('nombre')) {
    this.slug = this.nombre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  }
  next();
});

const Dulce = mongoose.model('Dulce', DulceSchema);
export default Dulce;
