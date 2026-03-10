import mongoose from 'mongoose'

const usuarioSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
})

export default mongoose.model('Usuario', usuarioSchema)