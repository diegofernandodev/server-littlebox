const {model, Schema} = require('mongoose')

const rolesSchema = new Schema({
    nameRol: {type: String,
        require:[true, 'nombre de rol es requerido'],
        unique: true
    }
})

module.exports = model ('role', rolesSchema, 'roles')