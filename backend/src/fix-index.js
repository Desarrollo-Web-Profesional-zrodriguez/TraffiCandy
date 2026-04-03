import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

await mongoose.connect(process.env.MONGO_URI)
await mongoose.connection.collection('usuarios').dropIndex('username_1')
console.log('✅ Índice eliminado')
process.exit()