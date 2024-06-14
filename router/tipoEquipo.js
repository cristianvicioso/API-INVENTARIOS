const { Router } = require('express');
const TipoEquipo = require('../models/TipoEquipo');
const { validationResult, check } = require('express-validator');
const { validarJWT } = require('../middleware/validar-jwt');
const { validarRolAdmin } = require('../middleware/validar-rol-admin');

const router = Router();

//LISTAR TIPO EQUIPO
router.get('/', [ validarJWT, validarRolAdmin ], async function (req, res) {
    try {

        const tipoEquipos = await TipoEquipo.find();
        res.send(tipoEquipos);

    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error');
    }

});

//CREAR TIPO EQUIPO
router.post('/', [ validarJWT, validarRolAdmin ], [
    check('nombre', 'invalid.nombre').not().isEmpty(),
    check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo']),

], async function (req, res) {

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ mensaje: errors.array() });
        }

        let tipoEquipo = TipoEquipo();
        tipoEquipo.nombre = req.body.nombre;
        tipoEquipo.estado = req.body.estado;
        tipoEquipo.fechaCreacion = new Date();
        tipoEquipo.fechaActualizacion = new Date();

        tipoEquipo = await tipoEquipo.save();

        res.send(tipoEquipo);

    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al crear tipo equipo');
    }

});

//ACTUALIZAR TIPO EQUIPO
router.put('/:tipoEquipoId', [ validarJWT, validarRolAdmin ], [
    check('nombre', 'invalid.nombre').not().isEmpty(),
    check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo']),

], async function (req, res) {

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ mensaje: errors.array() });
        }


        let tipoEquipo = await TipoEquipo.findById(req.params.tipoEquipoId);
        if (!tipoEquipo) {
            return res.status(400).send('tipoEquipo no existe');
        }

        tipoEquipo.nombre = req.body.nombre;
        tipoEquipo.estado = req.body.estado;
        tipoEquipo.fechaActualizacion = new Date();

        tipoEquipo = await tipoEquipo.save();

        res.send(tipoEquipo);

    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al actualizar tipo Equipo');
    }

});

module.exports = router;