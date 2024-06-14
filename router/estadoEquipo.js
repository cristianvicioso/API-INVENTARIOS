const { Router } = require('express');
const EstadoEquipo = require('../models/EstadoEquipo');
const { validationResult, check } = require('express-validator');
const { validarJWT } = require('../middleware/validar-jwt');
const { validarRolAdmin } = require('../middleware/validar-rol-admin');

const router = Router();

//LISTAR ESTADO EQUIPO
router.get('/', [ validarJWT, validarRolAdmin ], async function (req, res) {
    try {

        const estadoEquipos = await EstadoEquipo.find();
        res.send(estadoEquipos);

    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error');
    }

});

//CREAR ESTADO EQUIPO
router.post('/', [ validarJWT, validarRolAdmin ], [
    check('nombre', 'invalid.nombre').not().isEmpty(),
    check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo']),

], async function (req, res) {

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ mensaje: errors.array() });
        }

        let estadoEquipo = EstadoEquipo();
        estadoEquipo.nombre = req.body.nombre;
        estadoEquipo.estado = req.body.estado;
        estadoEquipo.fechaCreacion = new Date();
        estadoEquipo.fechaActualizacion = new Date();

        estadoEquipo = await estadoEquipo.save();

        res.send(estadoEquipo);

    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al crear estadoEquipo');
    }

});

//ACTUALIZAR ESTADO EQUIPO
router.put('/:estadoEquipoId', [ validarJWT, validarRolAdmin ], [
    check('nombre', 'invalid.nombre').not().isEmpty(),
    check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo']),

], async function (req, res) {

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ mensaje: errors.array() });
        }


        let estadoEquipo = await EstadoEquipo.findById(req.params.estadoEquipoId);
        if (!estadoEquipo) {
            return res.status(400).send('Estado Equipo no existe');
        }

        estadoEquipo.nombre = req.body.nombre;
        estadoEquipo.estado = req.body.estado;
        estadoEquipo.fechaActualizacion = new Date();

        estadoEquipo = await estadoEquipo.save();

        res.send(estadoEquipo);

    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al actualizar estadoEquipo');
    }

});

module.exports = router;