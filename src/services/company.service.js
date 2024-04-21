const Company = require('../models/compay.model');
const nodemailer = require('nodemailer');
const User = require('../models/user.model')
const {sendNotificationOnCompanyCreation} = require('../services/notificationService')

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: 'litterbox212@gmail.com',
    pass: 'rtpr yunf crkt daif' // Aquí deberías usar variables de entorno
  }
});

const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    to: to,
    subject: subject,
    html: html // Usamos HTML en lugar de texto plano
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo electrónico enviado: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error al enviar el correo electrónico:', error);
    throw error;
  }
};

const newCompanyService = async (companyData, pdfFile) => {
  companyData.estado = 'pendiente'; // Establecer estado predeterminado
  try {
    if (pdfFile) {
      // Si se proporciona un archivo adjunto, asigna la ruta del archivo al campo pdfRunt
      companyData.pdfRunt = pdfFile.path;
    }

    const newCompany = await Company.create(companyData);

   
    
    // Construir el mensaje HTML excluyendo estado e ID
    const messageHtml = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Solicitud de nueva empresa</title>
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
        ul {
          list-style-type: none;
          padding: 0;
        }
        li {
          margin-bottom: 10px;
        }
        /* Estilos específicos */
        .logo {
          width: 150px;
          margin-bottom: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Solicitud de nueva empresa</h1>
        <ul>
          <li><strong>Nombre de la empresa:</strong> ${companyData.nameCompany}</li>
          <li><strong>Teléfono:</strong> ${companyData.telephoneCompany}</li>
          <li><strong>NIT:</strong> ${companyData.tenantId}</li>
          <li><strong>Correo:</strong> ${companyData.emailCompany}</li>
          <li><strong>Dirección:</strong> ${companyData.directionCompany}</li>
        </ul>
      </div>
    </body>
    </html>
    
    `;

    // Enviar el correo electrónico con el mensaje HTML
    await sendEmail({
      to: 'litterbox212@gmail.com',
      subject: 'Solicitud de nueva empresa',
      html: messageHtml
    });
       // Enviar notificación al SuperUsuario
       await sendNotificationOnCompanyCreation(companyData.nameCompany);

    return newCompany;
  } catch (error) {
    throw new Error("Error al crear la empresa: " + error.message);
  }
};


const approveCompany = async (companyId) => {
  try {
    // Aprobar la empresa
    const company = await Company.findByIdAndUpdate(companyId, { estado: 'aprobado' });

    // Consultar y actualizar el estado de los usuarios gerentes asociados a esta empresa
    await approveAssociatedManagers(company.tenantId);

    // Obtener nuevamente la información actualizada de la empresa (por si acaso)
    const updatedCompany = await Company.findById(companyId);

    // Consultar el usuario gerente asociado a esta empresa
    const managerUser = await User.findOne({ tenantId: updatedCompany.tenantId, rol: 'Gerente' });

    // Construir el mensaje HTML para el correo electrónico
    const messageHtml = `
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Empresa Aprobada</title>
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
        ul {
          list-style-type: none;
          padding: 0;
        }
        li {
          margin-bottom: 10px;
        }
        .alert {
          background-color: #ffc107;
          color: #333;
          padding: 10px;
          margin-bottom: 20px;
          border-radius: 5px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        
        <h1>¡Tu empresa ha sido aprobada!</h1>
        <p>Estos son los datos:</p>
        <ul>
          <li><strong>Nombre de la Empresa:</strong> ${updatedCompany.nameCompany}</li>
          <li><strong>Teléfono de la Empresa:</strong> ${updatedCompany.telephoneCompany}</li>
          <li><strong>NIT:</strong> ${updatedCompany.tenantId}</li>
          <li><strong>Email de la Empresa:</strong> ${updatedCompany.emailCompany}</li>
          <li><strong>Dirección de la Empresa:</strong> ${updatedCompany.directionCompany}</li>
        </ul>
        <h2>Datos de usuario para Gerente</h2>
        <ul>
          <li><strong>Usuario de gerente:</strong> ${managerUser.email}</li>
          <li><strong>Contraseña:</strong> ${managerUser.identification}</li>
        </ul>
        <p>Inicia sesión con este usuario Gerente<p>
        <div class="alert">
          <strong>¡Importante!</strong> Por favor, inicie sesión con el usuario Gerente proporcionado y realize su primer Ingreso para comenzar a utilizar nuestras funciones.
        </div>
      </div>
      
    </body>
    </html>
  `;

    // Enviar el correo electrónico a la empresa aprobada
    await sendEmail({
      to: updatedCompany.emailCompany,
      subject: 'Empresa Aprobada',
      html: messageHtml
    });

    return updatedCompany;
  } catch (error) {
    throw new Error("Error al aprobar la empresa: " + error.message);
  }
};

// Función para aprobar automáticamente los usuarios gerentes asociados a una empresa
const approveAssociatedManagers = async (tenantId) => {
  try {
    // Buscar y actualizar usuarios gerentes asociados a esta empresa
    await User.updateMany({ rol: 'Gerente', tenantId: tenantId }, { status: 'activo' });
  } catch (error) {
    throw new Error("Error al aprobar usuarios gerentes: " + error.message);
  }
};



const activeCompany = async (companyId) => {
  try {
    // Aprobar la empresa
    const company = await Company.findByIdAndUpdate(companyId, { estado: 'aprobado' });

    
    const updatedCompany = await Company.findById(companyId);

    

    // Construir el mensaje HTML para el correo electrónico
    const messageHtml = `
      <h1>¡Tu empresa ha sido Activada nuevamente!</h1>
      <p>Detalles:</p>
      <ul>
        <li>Nombre de la EMPRESA: ${updatedCompany.nameCompany}</li>
        <li>Teléfono de la Empresa: ${updatedCompany.telephoneCompany}</li>
        <li>NIT: ${updatedCompany.tenantIdCompany}</li>
        <li>Email de la Empresa: ${updatedCompany.emailCompany}</li>
        <li>Dirección de la Empresa: ${updatedCompany.directionCompany}</li>
      </ul>
      
    `;

    // Enviar el correo electrónico a la empresa aprobada
    await sendEmail({
      to: updatedCompany.emailCompany,
      subject: 'Activacion de empresa',
      html: messageHtml
    });

    return updatedCompany;
  } catch (error) {
    throw new Error("Error al aprobar la empresa: " + error.message);
  }
};

const denyCompany = async (companyId) => {
  try {
    // Actualizar el estado de la empresa a 'denegado'
    const deniedCompany = await Company.findByIdAndUpdate(companyId, { estado: 'denegado' });

    // Obtener los datos actualizados de la empresa
    const updatedCompany = await Company.findById(companyId);

    // Extraer el correo electrónico de la empresa
    const emailCompany = updatedCompany.emailCompany;

    // Crear un transporter de nodemailer
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
        user: 'litterbox212@gmail.com',
        pass: 'rtpr yunf crkt daif' // Aquí deberías usar variables de entorno
      }
    });

    // Configurar los detalles del correo electrónico
    const messageHtml = `
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Solicitud de empresa denegada</title>
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
            color: #ff0000;
          }
          p {
            margin-bottom: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Lamentamos informarle que su solicitud de empresa ha sido denegada.</h1>
          <p>Por favor, contáctenos si tiene alguna pregunta.</p>
          <p>correo: litterbox212@gmail.com
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: 'litterbox212@gmail.com', // Dirección de correo electrónico del remitente
      to: emailCompany, // Dirección de correo electrónico del destinatario
      subject: 'Solicitud de empresa denegada', // Asunto del correo electrónico
      html: messageHtml // Contenido del correo electrónico en formato HTML
    };

    // Enviar el correo electrónico
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo electrónico enviado: %s', info.messageId);

    // Devolver la empresa denegada
    return deniedCompany;
  } catch (error) {
    throw new Error("Error al denegar la empresa: " + error.message);
  }
};



const disableCompany = async (companyId) => {
  try {
    const disabledCompany = await Company.findByIdAndUpdate(companyId, { estado: 'inhabilitado' });
       // Obtener los datos actualizados de la empresa
       const updatedCompany = await Company.findById(companyId);

       // Extraer el correo electrónico de la empresa
       const emailCompany = updatedCompany.emailCompany;

    // Crear un transporter de nodemailer
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
        user: 'litterbox212@gmail.com',
        pass: 'rtpr yunf crkt daif' // Aquí deberías usar variables de entorno
      }
    });

    // Configurar los detalles del correo electrónico
    const mailOptions = {
      from: 'litterbox212@gmail.com', // Dirección de correo electrónico del remitente
      to: emailCompany, // Dirección de correo electrónico del destinatario (puedes pasarla como parámetro)
      subject: 'Empresa inhabilitada temporalmente', // Asunto del correo electrónico
      text: 'Por mora de pago su empresa esta inhabilitada temporalmente.' // Contenido del correo electrónico
    };

    // Enviar el correo electrónico
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo electrónico enviado: %s', info.messageId);

    // Devolver la empresa denegada
    return disabledCompany;
  } catch (error) {
    throw new Error("Error al denegar la empresa: " + error.message);
  }
}


const getCompanies = async () => {
  try {
    
    const approvedCompanies = await Company.find({ estado: { $in: ['aprobado', 'inhabilitado'] } });
    return approvedCompanies;
  } catch (error) {
    throw new Error("Error al obtener las empresas aprobadas: " + error.message);
  }
};


const getCompanys= async () => {
  try {
    
    const listCompanies = await Company.find();
    return listCompanies;
  } catch (error) {
    throw new Error("Error al obtener las empresas aprobadas: " + error.message);
  }
};
const getCompaniesSuperUsuario = async () => {
  try {
    
    const approvedCompanies = await Company.find({estado: 'pendiente'});
    return approvedCompanies;
  } catch (error) {
    throw new Error("Error al obtener las empresas pendientes: " + error.message);
  }
};

const deleteCompany = async (id) => {
  try {
    const company = await Company.findOne({ _id: id });
    if (company) {
      await Company.findOneAndDelete({ _id: id });
      return "Empresa eliminada con éxito";
    } else {
      return "No se encontró esta empresa";
    }
  } catch (error) {
    return "Ocurrió un error eliminando la empresa";
  }
};

module.exports = {
  newCompanyService,
  getCompanies,
  deleteCompany,
  approveCompany,
  denyCompany,
  disableCompany,
  getCompaniesSuperUsuario,
  activeCompany,
  getCompanys
};
