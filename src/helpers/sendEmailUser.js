const nodemailer = require('nodemailer');

// Función para enviar correo con los datos del usuario
const sendEmailUsers = async (userData) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      service: 'gmail',
      auth: {
        user: 'litterbox212@gmail.com',
        pass: 'rtpr yunf crkt daif'
      }
    });

    const messageHtml = `
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Datos de usuario</title>
        <style>
          /* Estilos generales */
          body {
            font-family: Arial, sans-serif;
            background-color: #f7f7f7;
            color: #333;
            margin: 0;
            padding: 0;
          }
          .container {
            width: 80%;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 10px;
            background-color: #fff;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #0073b7;
          }
          p {
            margin-bottom: 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Datos de usuario</h1>
          <p>Tienes un usuario como administrador en nuestra aplicacion LittleBox, puedes ingresar a ella con los siguientes datos<p>
          <p>Nombre de usuario: ${userData.email}</p>
          <p>Password: ${userData.identification}</p>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: 'litterbox212@gmail.com', // Cambiar por tu correo
      to: userData.email,
      subject: 'Datos de usuario',
      html: messageHtml
    };

    await transporter.sendMail(mailOptions);
    console.log('Correo enviado con los datos del usuario:', userData.email);
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    throw error;
  }
};

module.exports = sendEmailUsers;
