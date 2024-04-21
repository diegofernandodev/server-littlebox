const {model, Schema} = require('mongoose')

const userSchema= new Schema({
    username: {type: String,
        required:[false, 'nombre requerido']},
    identification: {type: String,
        required: [true, 'cedula es requerida']},
    tenantId: {type: String,
        required: [true, 'Nit de la empresa requerido'],   },
    email: {type: String,
        required:[true, 'correo requerido'],
        unique: true},
    password: {type: String,
        required: [false, 'constraseña requerida']},
        provisionalPassword: String,
    imgfirme: {type: String,
        required:[false, 'Imagen de firma es requerida']},
    telephone: {type: String,
        required: [false, 'telefono es requerido']},
    direction: { type: String,
    required: [false, 'direccion es requerida']},
    rol: {type: String,
        enum:['SuperUsuario', 'Gerente', 'Administrador', 'Colaborador'],
    required:[true, 'Rol es requerido']},
    status: {
        type: String,
        enum: ['inactivo', 'activo', 'pendiente', 'denegado'],
    },
    firstLogin: { type: Boolean, default: true },
    resetCode: { type: String, default: null },
  resetExpires: { type: Date, default: null }
    
     
    
})




module.exports = model('user', userSchema, "Users")
