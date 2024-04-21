const Controller = {};

const {
  newCompanyService,
  getCompanies,
  deleteCompany,
  approveCompany,
  denyCompany,
  disableCompany,
  activeCompany,
  getCompaniesSuperUsuario,
  getCompanys
} = require("../services/company.service");

Controller.createCompany = async (req, res) => {
  try {
    const companyData = req.body;
    const pdfFile = req.file; // Obtener el archivo PDF subido
    const newCompany = await newCompanyService(companyData, pdfFile); // Pasar el archivo PDF a la función
    res.status(201).json(newCompany);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



Controller.approveCompany = async (req, res) => {
  const companyId = req.params.id;
  try {
    const approvedCompany = await approveCompany(companyId); // Corregir aquí
    res.status(200).json(approvedCompany);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

Controller.activedCompany = async (req, res) => {
  const companyId = req.params.id;
  try {
    const approvedCompany = await activeCompany(companyId); // Corregir aquí
    res.status(200).json(approvedCompany);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

Controller.denyCompanyC= async (req, res) => {
  const companyId = req.params.id; // Obtener el ID de la empresa de la solicitud
  const email = req.body.emailCompany; // Obtener la dirección de correo electrónico del destinatario de la solicitud

  try {
    // Llamar al servicio para denegar la empresa y enviar el correo electrónico
    const deniedCompany = await denyCompany(companyId, email);
    
    // Enviar una respuesta con la empresa denegada
    res.status(200).json(deniedCompany);
  } catch (error) {
    // Enviar una respuesta de error en caso de que ocurra un error
    res.status(500).json({ error: error.message });
  }
};

Controller.disableCompanyC= async (req, res) => {
  const companyId = req.params.id; // Obtener el ID de la empresa de la solicitud
  const email = req.body.emailCompany; // Obtener la dirección de correo electrónico del destinatario de la solicitud

  try {
    // Llamar al servicio para denegar la empresa y enviar el correo electrónico
    const disabledCompany = await disableCompany(companyId, email);
    
    // Enviar una respuesta con la empresa denegada
    res.status(200).json(disabledCompany);
  } catch (error) {
    // Enviar una respuesta de error en caso de que ocurra un error
    res.status(500).json({ error: error.message });
  }
};



Controller.getCompanies = async (req, res) => {
  try {
    const companies = await getCompanies();
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


Controller.getCompaniesC = async (req, res) => {
  try {
    const companies = await getCompanys();
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


Controller.deleteCompany = async (req, res) => {
  const idParam = req.params.idCompany;
  const response = await deleteCompany(idParam);
  res.send(response);
};

Controller.getCompaniesSuperU = async (req, res) => {
  const listCompanies = await getCompaniesSuperUsuario();
  res.json(listCompanies);
};


module.exports = Controller;
