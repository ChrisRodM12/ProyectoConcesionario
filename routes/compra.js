const express = require('express');
const router  = express.Router();
const db  = require('../db.js');


router.post('/', async (req, res) => {
    const client  = await db.getClient();
    try {
        await client.query('BEGIN');

        const { id_compra, fecha, precio_total, id_cliente, id_empleado } = req.body;

        const query = 'INSERT INTO compra (id_compra, fecha, precio_total, id_cliente, id_empleado) VALUES ($1, $2, $3, $4, $5) RETURNING *';
        const values = [id_compra, fecha, precio_total, id_cliente, id_empleado];
        
        const result = await compra.query(query, values);
        
        await client.query('COMMIT');

        res.status(201).json({
            message: 'Compra agregada',
            data: result.rows[0]
        });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: 'Error al agregar la compra', details: err.message });
    } finally {
        client.release();
    }
});

router.get('/', async (req,res)=>{
    const result = await db.query('SELECT * FROM compra')
    res.json(result.rows)
})

router.patch('/:id_compra', async (req, res) => {
    const client = await db.getClient();
    try {
        await client.query('BEGIN');

        const id_compra = parseInt(req.params.id_compra);
        const { fecha, precio_total, id_cliente, id_empleado} = req.body;

        let updateQuery = 'UPDATE compra SET ';
        const updateValues = [];
        let paramCount = 1;

        if (fecha !== undefined) {
            updateQuery += `fecha = $${paramCount}, `;
            updateValues.push(fecha);
            paramCount++;
        }
        if (precio_total !== undefined) {
            updateQuery += `precio_total = $${paramCount}, `;
            updateValues.push(precio_total);
            paramCount++;
        }
        if (id_cliente !== undefined) {
            updateQuery += `id_cliente = $${paramCount}, `;
            updateValues.push(id_cliente);
            paramCount++;
        }
        if (id_empleado !== undefined) {
            updateQuery += `id_empleado = $${paramCount}, `;
            updateValues.push(id_empleado);
            paramCount++;
        }
        updateQuery = updateQuery.slice(0, -2);
        updateQuery += ` WHERE id_compra = $${paramCount} RETURNING *`;
        updateValues.push(id_compra);

        const result = await client.query(updateQuery, updateValues);

        if (result.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Compra no encontrada' });
        }

        await client.query('COMMIT');

        res.json({
            message: 'Compra actualizada',
            data: result.rows[0]
        });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: 'Error al actualizar la compra', details: err.message });
    } finally {
        client.release();
    }
});

router.delete('/:id_compra', async (req, res) => {
    const client = await db.getClient();
    try {
        await compra.query('BEGIN');

        const id_compra = parseInt(req.params.id_compra);
        const query = 'DELETE FROM compra WHERE id_compra = $1 RETURNING *';
        const result = await compra.query(query, [id_compra]);

        if (result.rows.length === 0) {
            await compra.query('ROLLBACK');
            return res.status(404).json({ message: 'Compra no encontrada' });
        }

        await client.query('COMMIT');

        res.json({
            message: 'Compra eliminada',
            data: result.rows[0]
        });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: 'Error al eliminar la compra', details: err.message });
    } finally {
        client.release();
    }
});

module.exports = router
