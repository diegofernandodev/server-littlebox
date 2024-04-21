const nodemailer = require("nodemailer");
// const { randomPassword } = require("../helpers/passwordGenerator");
const fs = require("fs");

const path = require("path");

const sendEmail = async (userData, random_Password = null) => {
  try {
    // const password = await randomPassword();

    const mensajeUsuario = `
    <!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Registro exitoso - Littlebox</title>
    <style>
      /* Colores */
      body {
        background-color: #f7f7f7;
        color: #333;
      }

      h1 {
        color: #0073b7;
      }

      a {
        color: #0073b7;
        text-decoration: none;
      }
      .link {
        font-size: 18px;
      }

      /* Fuentes */
      h1 {
        font-family: Arial, sans-serif;
        font-size: 24px;
        margin-top: 0;
      }

      p {
        font-family: Arial, sans-serif;
        font-size: 16px;
        margin-bottom: 10px;
        color: #333;
      }

      small {
        text-align: justify;
        display: block;
        color: gray;
      }

      /* Diseño */
      .container {
        width: 600px;
        margin: 0 auto;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 10px;
      }

      .logo {
        width: 150px;
        height: auto;
        margin-bottom: 20px;
      }

      .content {
        margin-bottom: 20px;
      }

      .footer {
        text-align: center;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>¡Felicidades, ${userData.name}! Tu registro ha sido aprobado.</h1>
      <p>
        Ahora puedes iniciar sesión en Littlebox con las siguientes
        credenciales:
      </p>
      <ul>
        <li>Usuario: ${userData.email}</li>
        <li>Contraseña: ${random_Password}</li>
      </ul>
      <p>
        <strong>Importante:</strong> Debes cambiar tu contraseña al iniciar
        sesión por primera vez.
      </p>
      <p>Para iniciar sesión, haz clic en el siguiente enlace:</p>
      <a class="link" href="http://littlebox.com/login"
        ><h4>Iniciar sesión</h4></a
      >

      <p>El equipo de Littlebox</p>
      <br />
      <small
        >Para resolver cualquier inquietud o comentario ingrese a
        <a href="http://littlebox.com">littlebox.com</a>; Opción Contáctenos y
        diligencie el formulario Registre Solicitudes o si lo prefiere
        comuníquese con nuestras líneas de servicio telefónico.</small
      >

     `;

    const mensajeEmpresa = `
     <!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Registro exitoso - Littlebox</title>
    <style>
      /* Colores */
      body {
        background-color: #f7f7f7;
        color: #333;
      }

      h1 {
        color: #0073b7;
      }

      a {
        color: #0073b7;
        text-decoration: none;
      }

      /* Fuentes */
      h1 {
        font-family: Arial, sans-serif;
        font-size: 24px;
        margin-top: 0;
      }

      p {
        font-family: Arial, sans-serif;
        font-size: 16px;
        margin-bottom: 10px;
      }

      /* Diseño */
      .container {
        width: 600px;
        margin: 0 auto;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 10px;
      }

      .logo {
        width: 150px;
        height: auto;
        margin-bottom: 20px;
      }

      .content {
        margin-bottom: 20px;
      }

      .footer {
        text-align: center;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>¡Felicidades, ${userData.nombreEmpresa}! Tu registro ha sido aprobado.</h1>
      <p>
        Al correo del usuario principal Llegarán las credenciales para iniciar
        sesión.
      </p>
      <p>
      <strong>Importante:</strong> Debes cambiar la contraseña del usuario principal al
        iniciar sesión por primera vez.
      </p>
      <p>Para iniciar sesión, haz clic en el siguiente enlace:</p>
      <a href="http://littlebox.com/login"><h4>Iniciar sesión</h4></a>
      <br />
      <p>
        Te damos la bienvenida a Littlebox y esperamos que la plataforma te sea
        de gran utilidad para gestionar tu empresa.
      </p>
      <p>El equipo de Littlebox</p>
      <small
        >Para resolver cualquier inquietud o comentario ingrese a
        <a href="http://littlebox.com">littlebox.com</a>; Opción Contáctenos y
        diligencie el formulario Registre Solicitudes o si lo prefiere
        comuníquese con nuestras líneas de servicio telefónico.</small
      >
     `;

    const emailHtml =
      userData.type === "user" ? mensajeUsuario : mensajeEmpresa;

    // const text = heml.htmlToText(html);
    // const password = await randomPassword()
    const config = {
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: "littleboxx23@gmail.com",
        pass: "ccnh rvez uzho akcs",
      },
    };

    // Crea un transporte una vez
    const transport = nodemailer.createTransport(config);

    let toEmail = "";

    // Verificar si userData es un usuario o una empresa
    if (userData.type === "user") {
      toEmail = userData.email;
    } else if (userData.type === "company") {
      toEmail = userData.emailEmpresa;
    } else {
      throw new Error("Tipo de datos no reconocido");
    }

    const mensaje = {
      from: "littleboxx23@gmail.com",
      to: toEmail,
      subject: `Registro exitoso usuario ${userData.name}`,
      html: emailHtml,
    };

    // Envía el correo electrónico utilizando el mismo transporte
    const info = await transport.sendMail(mensaje);

    console.log("Correo electrónico enviado:", info);

    return {
      success: true,
      message: "Correo electrónico enviado correctamente.",
    };
  } catch (error) {
    console.error("Error al enviar el correo electrónico:", error);
    throw new Error(
      "Error al enviar el correo electrónico. Detalles: " + error.message,
    );
  }
};

// const nodemailer = require("nodemailer");
// const { randomPassword } = require("../helpers/passwordGenerator");
// const pug = require("pug");
// const path = require("path");

// const sendEmail = async (userData) => {
//   try {
//     const password = await randomPassword();

//     const config = {
//       host: "smtp.gmail.com",
//       port: 587,
//       auth: {
//         user: "littleboxx23@gmail.com",
//         pass: "ccnh rvez uzho akcs",
//       },
//     };

//     // Crea un transporte una vez
//     const transport = nodemailer.createTransport(config);

//     const mensajeUsuario = pug.renderFile(
//       path.join(__dirname, "../views/emailUser.pug"),
//       {
//         name: userData.name,
//         email: userData.email,
//         password,
//       }
//     );

//     const mensajeEmpresa = pug.renderFile(
//       path.join(__dirname, "../views/emailCompany.pug"),
//       {
//         name: userData.name,
//         email: userData.email,
//       }
//     );

//     const mensaje = {
//       from: "littleboxx23@gmail.com",
//       to: userData.email,
//       subject: `Registro exitoso usuario ${userData.name}`,
//       html:
//         userData.type === "user" ? mensajeUsuario : mensajeEmpresa,
//     };

//     // Envía el correo electrónico utilizando el mismo transporte
//     const info = await transport.sendMail(mensaje);

//     console.log("Correo electrónico enviado:", info);

//     return { success: true, message: "Correo electrónico enviado correctamente." };
//   } catch (error) {
//     console.error("Error al enviar el correo electrónico:", error);
//     throw new Error("Error al enviar el correo electrónico.");
//   }
// };

module.exports = {
  sendEmail,
};
