const express = require('express');
const router  = express.Router();
const db  = require('../db.js');


router.post('/', async (req, res) => {
    const client = await db.getClient();
    try {
        await client.query('BEGIN');

        const { id_detallecompra, tipo_producto, cantidad, precio_unitario, precio_total, id_compra, id_producto } = req.body;

        const query = 'INSERT INTO detallecompra (id_detallecompra, tipo_producto, cantidad, precio_unitario, precio_total, id_compra, id_producto) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
        const values = [id_detallecompra, tipo_producto, cantidad, precio_unitario, precio_total, id_compra, id_producto];
        
        const result = await client.query(query, values);
        
        await client.query('COMMIT');

        res.status(201).json({
            message: 'Detalle de la compra agregado',
            data: result.rows[0]
        });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: 'Error al agregar el Detalle de la compra', details: err.message });
    } finally {
        client.release();
    }
});

router.get('/', async (req,res)=>{
    const result = await db.query('SELECT * FROM detallecompra')
    res.json(result.rows)
})

router.patch('/:id_detallecompra', async (req, res) => {
    const client = await db.getClient();
    try {
        await client.query('BEGIN');

        const id_detallecompra = parseInt(req.params.id_detallecompra);
        const { tipo_producto, cantidad, precio_unitario, precio_total, id_compra, id_producto} = req.body;

        let updateQuery = 'UPDATE detallecompra SET ';
        const updateValues = [];
        let paramCount = 1;

        if (tipo_producto !== undefined) {
            updateQuery += `tipo_producto = $${paramCount}, `;
            updateValues.push(tipo_producto);
            paramCount++;
        }
        if (cantidad !== undefined) {
            updateQuery += `cantidad = $${paramCount}, `;
            updateValues.push(cantidad);
            paramCount++;
        }
        if (precio_unitario !== undefined) {
            updateQuery += `precio_unitario = $${paramCount}, `;
            updateValues.push(precio_unitario);
            paramCount++;
        }
        if (precio_total !== undefined) {
            updateQuery += `precio_total = $${paramCount}, `;
            updateValues.push(precio_total);
            paramCount++;
        }
        if (id_compra !== undefined) {
            updateQuery += `id_compra = $${paramCount}, `;
            updateValues.push(id_compra);
            paramCount++;
        }
        if (id_producto !== undefined) {
            updateQuery += `id_producto = $${paramCount}, `;
            updateValues.push(id_producto);
            paramCount++;
        }
        updateQuery = updateQuery.slice(0, -2);
        updateQuery += ` WHERE id_detallecompra = $${paramCount} RETURNING *`;
        updateValues.push(id_detallecompra);

        const result = await client.query(updateQuery, updateValues);

        if (result.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Detalle de la compra no encontrado' });
        }

        await client.query('COMMIT');

        res.json({
            message: 'Detalle de la compra actualizado',
            data: result.rows[0]
        });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: 'Error al actualizar el Detalle de la compra', details: err.message });
    } finally {
        client.release();
    }
});

router.delete('/:id_detallecompra', async (req, res) => {
    const client = await db.getClient();
    try {
        await detallecompra.query('BEGIN');

        const id = parseInt(req.params.id);
        const query = 'DELETE FROM detallecompra WHERE id_detallecompra = $1 RETURNING *';
        const result = await detallecompra.query(query, [id]);

        if (result.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Detalle de la compra no encontrado' });
        }

        await client.query('COMMIT');

        res.json({
            message: 'Detalle de la compra eliminado',
            data: result.rows[0]
        });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: 'Error al eliminar el Detalle de la compra', details: err.message });
    } finally {
        client.release();
    }
});

module.exports = router