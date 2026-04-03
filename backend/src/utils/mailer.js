import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || "rodriguez.mora.zahir.15@gmail.com",
    pass: process.env.EMAIL_PASS || "eygj aqtv vjom vulm"
  }
})

export const enviarCorreo2FA = async (email, codigo) => {
  const mailOptions = {
    from: '"TraffiCandy Seguridad" <noreply@trafficandy.com>',
    to: email,
    subject: 'Tu Código de Verificación 2FA - TraffiCandy',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #FF006E; text-align: center;">Código de Seguridad</h2>
        <p>Hola,</p>
        <p>Has intentado iniciar sesión. Por favor, usa el siguiente código de 6 dígitos para completar tu inicio de sesión:</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 5px; background: #f4f4f4; padding: 15px 30px; border-radius: 8px; color: #333;">
            ${codigo}
          </span>
        </div>
        <p style="color: #666; font-size: 14px;">Este código expirará en 10 minutos.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #999; font-size: 12px; text-align: center;">Si tú no solicitaste este código, puedes ignorar este correo de forma segura.</p>
      </div>
    `
  }

  await transporter.sendMail(mailOptions)
}

export const enviarCorreoRecuperacion = async (email, resetUrl) => {
  const mailOptions = {
    from: '"TraffiCandy Soporte" <soporte@trafficandy.com>',
    to: email,
    subject: 'Recuperación de Contraseña - TraffiCandy',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #FF006E;">Recuperación de contraseña</h2>
        <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para crear una nueva:</p>
        <div style="text-align: center;">
          <a href="${resetUrl}" style="background-color: #FF006E; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; margin: 20px 0;">Restablecer mi contraseña</a>
        </div>
        <p style="color: #666; font-size: 14px;">Este enlace expirará en 1 hora.</p>
        <p style="color: #999; font-size: 12px;">Si no solicitaste este cambio, simplemente ignora este correo.</p>
      </div>
    `
  }

  await transporter.sendMail(mailOptions)
}
