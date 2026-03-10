import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import Usuario from './models/Usuario.js'

dotenv.config()

await mongoose.connect(process.env.MONGO_URI)

const hash = await bcrypt.hash('1234', 10)
await Usuario.create({ email: 'admin@trafficandy.com', password: hash })

console.log('✅ Usuario creado')
process.exit()