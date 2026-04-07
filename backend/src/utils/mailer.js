import 'dotenv/config';

// URL de la API de Brevo 
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

// ── FUNCIÓN BASE PARA ENVIAR CORREOS CON BREVO ──────────────────────
const sendBrevoEmail = async (toEmail, subject, htmlContent) => {
  try {
    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_URL
      },
      body: JSON.stringify({
        sender: { 
          name: 'TraffiCandy', 
          email: process.env.EMAIL_USER || 'zahir.rodriguez.per@gmail.com' 
        },
        to: [{ email: toEmail }],
        subject: subject,
        htmlContent: htmlContent
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(JSON.stringify(errorData));
    }
    console.log(`Correo enviado a ${toEmail} vía Brevo`);
  } catch (error) {
    console.error(`Error en Brevo al enviar a ${toEmail}:`, error.message);
  }
};

// ── 2FA ─────────────────────────────────────────────────────────────
export const enviarCorreo2FA = async (email, codigo) => {
  const html = `
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
  `;
  await sendBrevoEmail(email, 'Tu Código de Verificación 2FA - TraffiCandy', html);
}

// ── Recuperación de contraseña ───────────────────────────────────────
export const enviarCorreoRecuperacion = async (email, resetUrl) => {
  const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #FF006E;">Recuperación de contraseña</h2>
        <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para crear una nueva:</p>
        <div style="text-align: center;">
          <a href="${resetUrl}" style="background-color: #FF006E; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; margin: 20px 0;">Restablecer mi contraseña</a>
        </div>
        <p style="color: #666; font-size: 14px;">Este enlace expirará en 1 hora.</p>
        <p style="color: #999; font-size: 12px;">Si no solicitaste este cambio, simplemente ignora este correo.</p>
      </div>
  `;
  await sendBrevoEmail(email, 'Recuperación de Contraseña - TraffiCandy', html);
}

// ── Correo al usuario tras compra ────────────────────────────────────
export const enviarCorreoUsuario = async (usuario, productosComprados, totalOrden, direccionEnvio) => {
  const tablaProductos = productosComprados.map(p => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #2a0a3a; color: #fff;">${p.emoji} ${p.nombre}</td>
      <td style="padding: 10px; border-bottom: 1px solid #2a0a3a; color: #fff; text-align: center;">${p.cantidad}</td>
      <td style="padding: 10px; border-bottom: 1px solid #2a0a3a; color: #fff; text-align: right;">$${p.precio.toFixed(2)}</td>
      <td style="padding: 10px; border-bottom: 1px solid #2a0a3a; color: #FF006E; text-align: right; font-weight: bold;">$${p.subtotal.toFixed(2)}</td>
    </tr>
  `).join('');

  const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #1a0533; padding: 30px; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #FF006E; font-size: 28px; margin: 0;">¡Gracias por tu compra! 🍬</h1>
          <p style="color: #ffffff99; margin-top: 8px;">Tu orden ha sido confirmada y está en preparación</p>
        </div>
        <div style="background: #2a0a3a; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
          <h2 style="color: #FFD60A; font-size: 16px; margin: 0 0 16px 0; text-transform: uppercase;">📦 Productos comprados</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="padding: 8px 10px; text-align: left; color: #ffffff60; font-size: 12px;">Producto</th>
                <th style="padding: 8px 10px; text-align: center; color: #ffffff60; font-size: 12px;">Cant.</th>
                <th style="padding: 8px 10px; text-align: right; color: #ffffff60; font-size: 12px;">Precio</th>
                <th style="padding: 8px 10px; text-align: right; color: #ffffff60; font-size: 12px;">Subtotal</th>
              </tr>
            </thead>
            <tbody>${tablaProductos}</tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="padding: 16px 10px 0; color: #fff; font-weight: bold; text-align: right; font-size: 16px;">TOTAL</td>
                <td style="padding: 16px 10px 0; color: #FF006E; font-weight: bold; text-align: right; font-size: 20px;">$${totalOrden.toFixed(2)} MXN</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div style="background: #2a0a3a; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
          <h2 style="color: #FFD60A; font-size: 16px; margin: 0 0 12px 0; text-transform: uppercase;">📍 Dirección de envío</h2>
          <p style="color: #fff; margin: 4px 0;"><strong>Receptor:</strong> ${direccionEnvio.nombreReceptor}</p>
          <p style="color: #fff; margin: 4px 0;"><strong>Dirección:</strong> ${direccionEnvio.direccion}</p>
          <p style="color: #fff; margin: 4px 0;"><strong>Ciudad:</strong> ${direccionEnvio.ciudad}, ${direccionEnvio.estadoProvincia} ${direccionEnvio.codigoPostal}</p>
          <p style="color: #fff; margin: 4px 0;"><strong>País:</strong> ${direccionEnvio.pais}</p>
          ${direccionEnvio.referencias ? `<p style="color: #fff; margin: 4px 0;"><strong>Referencias:</strong> ${direccionEnvio.referencias}</p>` : ''}
        </div>
      </div>
  `;
  await sendBrevoEmail(usuario.email, '¡Tu orden de dulces está en camino! 🍬✈️', html);
}

// ── Correo al admin tras compra ──────────────────────────────────────
export const enviarCorreoAdmin = async (usuario, productosComprados, totalOrden, direccionEnvio) => {
  const tablaProductos = productosComprados.map(p => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #2a0a3a; color: #fff;">${p.emoji} ${p.nombre}</td>
      <td style="padding: 10px; border-bottom: 1px solid #2a0a3a; color: #fff; text-align: center;">${p.cantidad}</td>
      <td style="padding: 10px; border-bottom: 1px solid #2a0a3a; color: #FF006E; text-align: right; font-weight: bold;">$${p.subtotal.toFixed(2)}</td>
    </tr>
  `).join('');

  const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #1a0533; padding: 30px; border-radius: 16px;">
        <h1 style="color: #FF006E; text-align: center;">Nueva Orden Recibida 🚨</h1>

        <div style="background: #2a0a3a; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
          <h2 style="color: #FFD60A; font-size: 16px; margin: 0 0 12px 0; text-transform: uppercase;">👤 Datos del Cliente</h2>
          <p style="color: #fff; margin: 4px 0;"><strong>Nombre:</strong> ${usuario.nombre || 'N/A'}</p>
          <p style="color: #fff; margin: 4px 0;"><strong>Email:</strong> ${usuario.email}</p>
          <p style="color: #fff; margin: 4px 0;"><strong>Rol:</strong> ${usuario.rol}</p>
        </div>

        <div style="background: #2a0a3a; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
          <h2 style="color: #FFD60A; font-size: 16px; margin: 0 0 16px 0; text-transform: uppercase;">📦 Productos</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="padding: 8px 10px; text-align: left; color: #ffffff60; font-size: 12px;">Producto</th>
                <th style="padding: 8px 10px; text-align: center; color: #ffffff60; font-size: 12px;">Cant.</th>
                <th style="padding: 8px 10px; text-align: right; color: #ffffff60; font-size: 12px;">Subtotal</th>
              </tr>
            </thead>
            <tbody>${tablaProductos}</tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding: 16px 10px 0; color: #fff; font-weight: bold; text-align: right;">TOTAL</td>
                <td style="padding: 16px 10px 0; color: #FF006E; font-weight: bold; text-align: right; font-size: 20px;">$${totalOrden.toFixed(2)} MXN</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div style="background: #2a0a3a; border-radius: 12px; padding: 20px;">
          <h2 style="color: #FFD60A; font-size: 16px; margin: 0 0 12px 0; text-transform: uppercase;">📍 Dirección de Envío</h2>
          <p style="color: #fff; margin: 4px 0;"><strong>Receptor:</strong> ${direccionEnvio.nombreReceptor}</p>
          <p style="color: #fff; margin: 4px 0;"><strong>Dirección:</strong> ${direccionEnvio.direccion}</p>
          <p style="color: #fff; margin: 4px 0;"><strong>Ciudad:</strong> ${direccionEnvio.ciudad}, ${direccionEnvio.estadoProvincia} ${direccionEnvio.codigoPostal}</p>
          <p style="color: #fff; margin: 4px 0;"><strong>País:</strong> ${direccionEnvio.pais}</p>
          ${direccionEnvio.referencias ? `<p style="color: #fff; margin: 4px 0;"><strong>Referencias:</strong> ${direccionEnvio.referencias}</p>` : ''}
        </div>
      </div>
  `;
  
  const adminEmail = process.env.EMAIL_USER || 'zahir.rodriguez.per@gmail.com';
  await sendBrevoEmail(adminEmail, `🍬 Nueva orden de ${usuario.nombre || usuario.email}`, html);
}