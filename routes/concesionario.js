const express = require('express');
const router  = express.Router();
const db  = require('../db.js');


router.post('/', async (req, res) => {
    const client = await db.getClient();
    try {
        await client.query('BEGIN');

        const { id_concesionario, nombre, dirección, ciudad, teléfono } = req.body;

        const query = 'INSERT INTO concesionario (id_concesionario, nombre, dirección, ciudad, teléfono) VALUES ($1, $2, $3, $4, $5) RETURNING *';
        const values = [id_concesionario, nombre, dirección, ciudad, teléfono];
        
        const result = await client.query(query, values);
        
        await client.query('COMMIT');

        res.status(201).json({
            message: 'Concesionario agregado',
            data: result.rows[0]
        });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: 'Error al agregar el concesionario', details: err.message });
    } finally {
        client.release();
    }
});

router.get('/', async (req,res)=>{
    const result = await db.query('SELECT * FROM concesionario')
    res.json(result.rows)
})

router.patch('/:id_concesionario', async (req, res) => {
    const client = await db.getClient();
    try {
        await client.query('BEGIN');

        const id_concesionario = parseInt(req.params.id_concesionario);
        const { nombre, dirección, ciudad, teléfono} = req.body;

        let updateQuery = 'UPDATE concesionario SET ';
        const updateValues = [];
        let paramCount = 1;

        if (nombre !== undefined) {
            updateQuery += `nombre = $${paramCount}, `;
            updateValues.push(nombre);
            paramCount++;
        }
        if (dirección !== undefined) {
            updateQuery += `dirección = $${paramCount}, `;
            updateValues.push(dirección);
            paramCount++;
        }
        if (ciudad !== undefined) {
            updateQuery += `ciudad = $${paramCount}, `;
            updateValues.push(ciudad);
            paramCount++;
        }
        if (teléfono !== undefined) {
            updateQuery += `teléfono = $${paramCount}, `;
            updateValues.push(teléfono);
            paramCount++;
        }
        updateQuery = updateQuery.slice(0, -2);
        updateQuery += ` WHERE id_concesionario = $${paramCount} RETURNING *`;
        updateValues.push(id_concesionario);

        const result = await client.query(updateQuery, updateValues);

        if (result.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Concesionario no encontrado' });
        }

        await client.query('COMMIT');

        res.json({
            message: 'Concesionario actualizado',
            data: result.rows[0]
        });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: 'Error al actualizar el concesionario', details: err.message });
    } finally {
        client.release();
    }
});

router.delete('/:id_concesionario', async (req, res) => {
    const client = await db.getClient();
    try {
        await client.query('BEGIN');

        const id_concesionario = parseInt(req.params.id_concesionario);
        const query = 'DELETE FROM concesionario WHERE id_concesionario = $1 RETURNING *';
        const result = await client.query(query, [id_concesionario]);

        if (result.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Concesionario no encontrado' });
        }

        await client.query('COMMIT');

        res.json({
            message: 'Concesionario eliminado',
            data: result.rows[0]
        });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: 'Error al eliminar el concesionario', details: err.message });
    } finally {
        client.release();
    }
});

module.exports = router