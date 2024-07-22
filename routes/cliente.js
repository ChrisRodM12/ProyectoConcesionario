const express = require('express');
const router  = express.Router();
const db  = require('../db.js');


router.post('/', async (req, res) => {
    const client = await db.getClient();
    try {
        await client.query('BEGIN');

        const { id_cliente, nombre, direccion, telefono, correo, id_concesionario } = req.body;

        const query = 'INSERT INTO cliente (id_cliente, nombre, direccion, telefono, correo, id_concesionario) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
        const values = [id_cliente, nombre, direccion, correo, id_concesionario];
        
        const result = await client.query(query, values);
        
        await client.query('COMMIT');

        res.status(201).json({
            message: 'Cliente agregado',
            data: result.rows[0]
        });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: 'Error al agregar el cliente', details: err.message });
    } finally {
        client.release();
    }
});

router.get('/', async (req,res)=>{
    const result = await db.query('SELECT * FROM cliente')
    res.json(result.rows)
})

router.patch('/:id_cliente', async (req, res) => {
    const client = await db.getClient();
    try {
        await client.query('BEGIN');

        const id_cliente = parseInt(req.params.id_cliente);
        const { nombre, direccion, telefono, correo, id_concesionario } = req.body;

        let updateQuery = 'UPDATE cliente SET ';
        const updateValues = [];
        let paramCount = 1;

        if (nombre !== undefined) {
            updateQuery += `nombre = $${paramCount}, `;
            updateValues.push(nombre);
            paramCount++;
        }
        if (direccion !== undefined) {
            updateQuery += `direccion = $${paramCount}, `;
            updateValues.push(direccion);
            paramCount++;
        }
        if (telefono !== undefined) {
            updateQuery += `telefono = $${paramCount}, `;
            updateValues.push(telefono);
            paramCount++;
        }
        if (correo !== undefined) {
            updateQuery += `correo = $${paramCount}, `;
            updateValues.push(correo);
            paramCount++;
        }
        if (id_concesionario !== undefined) {
            updateQuery += `id_concesionario = $${paramCount}, `;
            updateValues.push(id_concesionario);
            paramCount++;
        }

        updateQuery = updateQuery.slice(0, -2);
        updateQuery += ` WHERE id_cliente = $${paramCount} RETURNING *`;
        updateValues.push(id_cliente);

        const result = await client.query(updateQuery, updateValues);

        if (result.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        await client.query('COMMIT');

        res.json({
            message: 'Cliente actualizado',
            data: result.rows[0]
        });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: 'Error al actualizar el cliente', details: err.message });
    } finally {
        client.release();
    }
});

router.delete('/:id_cliente', async (req, res) => {
    const client = await db.getClient();
    try {
        await client.query('BEGIN');

        const id_cliente = parseInt(req.params.id_cliente);
        const query = 'DELETE FROM cliente WHERE id_cliente = $1 RETURNING *';
        const result = await client.query(query, [id_cliente]);

        if (result.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        await client.query('COMMIT');

        res.json({
            message: 'Cliente eliminado',
            data: result.rows[0]
        });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: 'Error al eliminar el cliente', details: err.message });
    } finally {
        client.release();
    }
});

module.exports = router
