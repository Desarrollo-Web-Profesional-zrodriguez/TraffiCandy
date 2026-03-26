import { Router } from 'express'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { Resend } from 'resend'
import Usuario from '../models/Usuario.js'

const router = Router()
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    // 1. Buscar usuario en MongoDB
    const usuario = await Usuario.findOne({ email })
    if (!usuario) {
      return res.status(401).json({ ok: false, mensaje: 'Credenciales incorrectas' })
    }

    // 2. Comparar contraseña
    const passwordOk = await bcrypt.compare(password, usuario.password)
    if (!passwordOk) {
      return res.status(401).json({ ok: false, mensaje: 'Credenciales incorrectas' })
    }

    res.json({ ok: true, mensaje: 'Login exitoso', usuario: { email: usuario.email } })

  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error en el servidor' })
  }
})

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  
  try {
    // ✅ Muévelo aquí adentro
    const resend = new Resend(process.env.RESEND_API_KEY)
    
    const usuario = await Usuario.findOne({ email });
    // ... resto del código igual
  
    if (!usuario) {
      // Por seguridad, no revelamos si existe el correo
      return res.json({ ok: true, mensaje: 'Si el correo existe, se enviará un enlace.' });
    }

    // Generar token único de 32 bytes (64 chars hex)
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Guardar en BD (expira en 1 hora)
    usuario.resetPasswordToken = resetToken;
    usuario.resetPasswordExpires = Date.now() + 3600000;
    await usuario.save();

    // Crear URL de reestablecimiento para el frontend
    const resetUrl = `${FRONTEND_URL}/reset-password/${resetToken}`;
    
    // Enviar correo con Resend
    await resend.emails.send({
      from: 'TraffiCandy Soporte <onboarding@resend.dev>', // Email autorizado de resend (temporal/testing)
      to: usuario.email,
      subject: 'Recuperación de Contraseña - TraffiCandy',
      html: `
        <div style="font-family: sans-serif; max-w-id: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #FF006E;">Recuperación de contraseña</h2>
          <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para crear una nueva:</p>
          <a href="${resetUrl}" style="background-color: #FF006E; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; margin: 20px 0;">Restablecer mi contraseña</a>
          <p style="color: #666; font-size: 14px;">Este enlace es seguro y expirará en 1 hora.</p>
          <br/>
          <p style="color: #999; font-size: 12px;">Si no solicitaste este cambio, simplemente ignora este correo. Tu cuenta seguira segura haciéndolo.</p>
        </div>
      `
    });

    res.json({ ok: true, mensaje: 'Si el correo existe, se enviará un enlace de recuperación.' });
  } catch (error) {
    console.error('Error en forgot-password:', error);
    res.status(500).json({ ok: false, mensaje: 'Hubo un error al procesar la solicitud' });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  
  try {
    // Buscar usuario con el token correspondiente y que aún no haya expirado
    const usuario = await Usuario.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() } // token expiry mayor a la fecha actual
    });

    if (!usuario) {
      return res.status(400).json({ ok: false, mensaje: 'El enlace de recuperación es inválido o ha expirado.' });
    }

    // Hashear nueva contraseña
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(newPassword, salt);
    
    // Limpiar los campos del token para que no se pueda volver a usar
    usuario.resetPasswordToken = undefined;
    usuario.resetPasswordExpires = undefined;
    
    await usuario.save();

    res.json({ ok: true, mensaje: 'La contraseña ha sido actualizada con éxito. Ya puedes iniciar sesión.' });
  } catch (error) {
    console.error('Error en reset-password:', error);
    res.status(500).json({ ok: false, mensaje: 'Hubo un error al actualizar la contraseña.' });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { email, password } = req.body

  try {
    const existe = await Usuario.findOne({ email })
    if (existe) {
      return res.status(400).json({ ok: false, mensaje: 'El correo ya está registrado' })
    }

    const hash = await bcrypt.hash(password, 10)
    const nuevoUsuario = await Usuario.create({ email, password: hash })

    res.status(201).json({ ok: true, mensaje: 'Usuario registrado correctamente', usuario: { email: nuevoUsuario.email } })

  } catch (error) {
    console.error('Error en register:', error) // ← aquí en el backend
    res.status(500).json({ ok: false, mensaje: 'Error al registrar usuario' })
  }
})

export default router