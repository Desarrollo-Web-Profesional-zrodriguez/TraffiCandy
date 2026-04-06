import mongoose from 'mongoose'

/**
 * Roles disponibles en el sistema:
 *  - comprador : puede navegar el catálogo y realizar compras
 *  - vendedor  : puede además crear, editar y eliminar productos
 */
const ROLES = ['comprador', 'vendedor']

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, default: '' },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  rol: {
    type: String,
    enum: ROLES,
    default: 'comprador'
  },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  twoFactorEmail: { type: Boolean, default: false },
  twoFactorApp: { type: Boolean, default: false },
  twoFactorAppSecret: { type: String },
  twoFactorCode: { type: String },
  twoFactorExpire: { type: Date },
  tokenVersion: { type: Number, default: 0 },
  backupCodes: { type: [String], default: [] }
}, {
  timestamps: true
})

export default mongoose.model('Usuario', usuarioSchema)