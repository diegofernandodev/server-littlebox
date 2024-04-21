const express = require('express');
const router = express.Router();
const pdfUpload = require('../middleware/pdfmulder');
const validarTokenMiddleware = require('../middleware/userAuthentication')
const checkRol = require('../middleware/roleAuth')

const {
    getCompanies,
    createCompany,
    deleteCompany,
    approveCompany,
    denyCompanyC,
    disableCompanyC,
    getCompaniesSuperU,
    activedCompany,
    getCompaniesC
} = require("../controller/company.controller");
//listar todas las empresas activas
router.get("/getAllCompanies", getCompanies);

//listar todas las empresas 
router.get("/getAllCompanis", getCompaniesC);


//listar empresas sin activarse
router.get('/GetCompaniesSuperU', getCompaniesSuperU)

//crear empresas
router.post("/saveNewCompany", pdfUpload.single('pdfRunt'), createCompany);

//aprovar empresa por id
router.put('/companiesAproved/:id', validarTokenMiddleware , checkRol(['SuperUsuario']), approveCompany);

//activar empresa despues de ser inhabilitada 
router.put('/companiesActived/:id',validarTokenMiddleware , checkRol(['SuperUsuario']),  activedCompany);


//denegar empresa por id
router.put('/companiesDeny/:id',validarTokenMiddleware , checkRol(['SuperUsuario']),  denyCompanyC);

//eliminar empresa por id
router.delete("/deleteCompany/:idCompany", deleteCompany);

//inhabilitar empresa por id
router.put('/disable/:id',validarTokenMiddleware , checkRol(['SuperUsuario']), disableCompanyC);

module.exports = router;
