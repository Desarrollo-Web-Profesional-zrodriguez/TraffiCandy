import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Dulce from './models/Dulce.js';

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);
console.log('📦 Conectado a MongoDB para seed de dulces...');

// Limpiar colección existente
await Dulce.deleteMany({});
console.log('🗑️ Dulces anteriores eliminados.');

const dulces = [
  {
    nombre: 'Pulparindo',
    descripcion_es: 'Dulce de tamarindo con chile y sal, clásico de México.',
    descripcion_en: 'Sweet tamarind candy with chili and salt, a Mexican staple.',
    precioBase: 12,
    pesoGramos: 20,
    stock: 200,
    emoji: '🌶️',
    categoria: 'picante',
    flavorTags: ['spicy', 'tamarind', 'sour'],
    nivelPicor: 3,
    alergenos: [],
    disponibleParaEnvio: true,
    estadoOrigen: 'Jalisco'
  },
  {
    nombre: 'Mazapán de La Rosa',
    descripcion_es: 'Dulce de cacahuate molido y azúcar, delicioso y nutritivo.',
    descripcion_en: 'Classic Mexican peanut and sugar candy, crumbly and sweet.',
    precioBase: 8,
    pesoGramos: 30,
    stock: 150,
    emoji: '🥜',
    categoria: 'dulce',
    flavorTags: ['sweet', 'peanut', 'classic'],
    nivelPicor: 0,
    alergenos: ['peanuts'],
    disponibleParaEnvio: true,
    estadoOrigen: 'Jalisco'
  },
  {
    nombre: 'Glorias de Linares',
    descripcion_es: 'Dulce de leche quemada con nuez pecana originario de Nuevo León.',
    descripcion_en: 'Caramel and pecan nut candy from Nuevo León, rich and creamy.',
    precioBase: 18,
    pesoGramos: 25,
    stock: 80,
    emoji: '🍮',
    categoria: 'tradicional',
    flavorTags: ['sweet', 'caramel', 'nut'],
    nivelPicor: 0,
    alergenos: ['nuts', 'dairy'],
    disponibleParaEnvio: true,
    estadoOrigen: 'Nuevo León'
  },
  {
    nombre: 'Camotes de Puebla',
    descripcion_es: 'Dulce conventual de batata con azúcar, icónico de la ciudad de Puebla.',
    descripcion_en: 'Traditional convent sweet made from sweet potato and sugar, iconic from Puebla.',
    precioBase: 22,
    pesoGramos: 40,
    stock: 60,
    emoji: '🍠',
    categoria: 'tradicional',
    flavorTags: ['sweet', 'traditional', 'vanilla'],
    nivelPicor: 0,
    alergenos: [],
    disponibleParaEnvio: true,
    estadoOrigen: 'Puebla'
  },
];

const insertados = await Dulce.insertMany(dulces);
console.log(`✅ ${insertados.length} dulces insertados correctamente.`);
insertados.forEach(d => console.log(`  → ${d.nombre} (slug: ${d.slug})`));

process.exit();