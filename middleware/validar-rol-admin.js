const jwt = require('jsonwebtoken');

const validarRolAdmin = (req, res, netx) =>{
    if (req.payload.rol != 'Administrador' ) {
        return res.status(401).json({ mensaje: 'Error unauthorized'});
    }
    netx();
}

module.exports = {
    validarRolAdmin
}