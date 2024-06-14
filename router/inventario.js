const { Router } = require('express');
const Inventario = require('../models/Inventario');
const { validationResult, check } = require('express-validator');
const { patch } = require('./usuario');
const { validarJWT } = require('../middleware/validar-jwt');
const { validarRolAdmin } = require('../middleware/validar-rol-admin');

const router = Router();

//LISTAR INVENTARIO
router.get('/', [ validarJWT ], async function (req, res) {
    try {

        const inventarios = await Inventario.find().populate([
          {
            path: 'usuario', select: 'nombre email estado'
          },
          {
            path: 'marca', select: 'nombre estado'
          },
          {
            path: 'estadoEquipo', select: 'nombre estado'
          },
          {
            path: 'tipoEquipo', select: 'nombre estado'
          }
        ])
        res.send(inventarios);

    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error');
    }

});

//CREAR INVENTARIO
router.post('/', [ validarJWT, validarRolAdmin ], [
    check('serial', 'invalid.serial').not().isEmpty(),
    check('modelo', 'invalid.modelo').not().isEmpty(),
    check('descripcion', 'invalid.descripcion').not().isEmpty(),
    check('fotoEquipo', 'invalid.fotoEquipo').not().isEmpty(),
    check('color', 'invalid.color').not().isEmpty(),
    check('fechaCompra', 'invalid.fechaCompra').not().isEmpty(),
    check('precio', 'invalid.precio').not().isEmpty(),
    //check('usuario', 'invalid.usuario').not().isEmpty(),
    check('marca', 'invalid.marca').not().isEmpty(),
    check('estadoEquipo', 'invalid.estadoEquipo').not().isEmpty(),
    check('tipoEquipo', 'invalid.tipoEquipo').not().isEmpty(),

], async function (req, res) {

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ mensaje: errors.array() });
        }

        const existeInvantarioPorSerial = await Inventario.findOne({ serial: req.body.serial });
        if (existeInvantarioPorSerial) {
            return res.status(400).send('Ya existe el serial para otro equipo')
        }

        let inventario = Inventario();
        inventario.serial = req.body.serial;
        inventario.modelo = req.body.modelo;
        inventario.descripcion = req.body.descripcion;
        inventario.fotoEquipo = req.body.fotoEquipo;
        inventario.color = req.body.color;
        inventario.fechaCompra = req.body.fechaCompra;
        inventario.precio = req.body.precio;
        inventario.usuario = req.body.usuario;
        inventario.marca = req.body.marca;
        inventario.estadoEquipo = req.body.estadoEquipo;
        inventario.tipoEquipo = req.body.tipoEquipo;
        inventario.fechaCreacion = new Date();
        inventario.fechaActualizacion = new Date();

        inventario = await inventario.save();
        res.send(inventario);

    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error al crear inventario');
    }
});

module.exports = router;