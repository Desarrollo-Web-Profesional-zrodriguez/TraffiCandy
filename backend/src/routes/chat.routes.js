import { Router } from 'express'
import Anthropic from '@anthropic-ai/sdk'

const router = Router()

const SYSTEM_PROMPT = `Eres ChapitoCandy, el asistente experto de TraffiCandy, una tienda de exportación de dulces mexicanos.

REGLAS ESTRICTAS:
- SOLO responde preguntas relacionadas con dulces, snacks, botanas mexicanas, o los productos de TraffiCandy.
- Si te preguntan algo que NO sea sobre dulces, responde amablemente que solo puedes hablar de dulces mexicanos.
- Sé amigable, usa emojis de dulces ocasionalmente 🍬🌶️🍭
- Responde siempre en español usando expresiones mexicanas ocasionalmente.
- Si te dan contexto de un producto específico, úsalo para dar respuestas más precisas.
- Máximo 3 párrafos por respuesta, sé conciso.`

router.post('/', async (req, res) => {
  const { mensaje, contextoProducto, historial = [] } = req.body

  try {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const contextoExtra = contextoProducto
      ? `\n\nEl usuario está viendo este producto:\n- Nombre: ${contextoProducto.nombre}\n- Categoría: ${contextoProducto.categoria}\n- Descripción: ${contextoProducto.descripcion_es}\n- Sabores: ${contextoProducto.flavorTags?.join(', ')}\n- Origen: ${contextoProducto.estadoOrigen}\n- Precio: $${contextoProducto.precioBase} USD\n- Nivel de picor: ${contextoProducto.nivelPicor}/5`
      : ''

    const messages = [
      ...historial.map(msg => ({
        role: msg.rol === 'model' ? 'assistant' : 'user',
        content: msg.texto
      })),
      { role: 'user', content: mensaje }
    ]

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 500,
      system: SYSTEM_PROMPT + contextoExtra,
      messages
    })

    const respuesta = response.content[0].text
    res.json({ ok: true, respuesta })

  } catch (error) {
    console.error('Error en chat:', error)
    res.status(500).json({ ok: false, mensaje: 'Error al conectar con ChapitoCandy' })
  }
})

export default router