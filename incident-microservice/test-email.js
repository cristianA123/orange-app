const nodemailer = require('nodemailer');

// Tus credenciales - cámbialas aquí
const MAIL_HOST = 'smtp.gmail.com';
const MAIL_PORT = 587;
const MAIL_USER = 'cristianchipan2@gmail.com';
const MAIL_PASSWORD = 'omgb hfcd plwh klyf'; // Sin comillas
const MAIL_TO = 'cristian.chipana@kambista.com';

async function testEmail() {
  console.log('🔄 Probando conexión SMTP...\n');

  const transporter = nodemailer.createTransport({
    host: MAIL_HOST,
    port: MAIL_PORT,
    secure: false,
    auth: {
      user: MAIL_USER,
      pass: MAIL_PASSWORD,
    },
  });

  try {
    // Verificar conexión
    await transporter.verify();
    console.log('✅ Conexión SMTP exitosa!\n');

    // Enviar correo de prueba
    console.log('📧 Enviando correo de prueba...');
    const info = await transporter.sendMail({
      from: `"Test" <${MAIL_USER}>`,
      to: MAIL_TO,
      subject: 'Prueba de Email - Orange Microservices',
      text: 'Este es un correo de prueba para verificar las credenciales SMTP.',
      html: '<h1>Prueba Exitosa!</h1><p>Las credenciales de email están funcionando correctamente.</p>',
    });

    console.log('✅ Correo enviado exitosamente!');
    console.log('   Message ID:', info.messageId);
    console.log('   Preview URL:', nodemailer.getTestMessageUrl(info) || 'N/A');
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 'EAUTH') {
      console.error('\n⚠️  Posibles soluciones:');
      console.error('   1. Verifica que la contraseña de aplicación sea correcta');
      console.error('   2. Asegúrate de tener la verificación en 2 pasos activada');
      console.error('   3. Genera una nueva contraseña de aplicación en: https://myaccount.google.com/apppasswords');
    }
  }
}

testEmail();
