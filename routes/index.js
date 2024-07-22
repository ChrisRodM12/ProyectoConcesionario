const express = require('express')

const clientesRouter = require('./cliente.js');
const concesionarioRouter = require('./concesionario.js');
const detallecompraRouter = require('./detallecompra.js');
const insumoRouter = require('./insumo.js');
const almacenRouter = require('./almacen.js');
const compraRouter = require('./compra.js');
const empleadoRouter = require('./empleado.js');
const vehiculoRouter = require('./vehiculo.js');

function routers(app){
    const router = express.Router();
    app.use('/api/v1', router)

    router.use('/cliente', clientesRouter)
    router.use('/concesionario', concesionarioRouter)
    router.use('/detallecompra', detallecompraRouter)
    router.use('/insumo', insumoRouter)
    router.use('/almacen', almacenRouter)
    router.use('/compra', compraRouter)
    router.use('/empleado', empleadoRouter)
    router.use('/vehiculo', vehiculoRouter)
}

module.exports = routers;