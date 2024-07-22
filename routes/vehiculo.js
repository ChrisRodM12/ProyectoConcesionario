const express = require('express');
const router  = express.Router();
const db  = require('../db.js');


router.post('/', async (req, res) => {
    const client = await db.getClient();
    try {
        await client.query('BEGIN');

        const { id_vehiculo, marca, modelo, año, precio, id_concesionario } = req.body;

        const query = 'INSERT INTO cliente (id_vehiculo, marca, modelo, año, precio, id_concesionario) VALUES ($1, $2, $3, $4, $5) RETURNING *';
        const values = [id_vehiculo, marca, modelo, año, precio, id_concesionario];
        
        const result = await client.query(query, values);
        
        await client.query('COMMIT');

        res.status(201).json({
            message: 'Vehiculo agregado',
            data: result.rows[0]
        });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: 'Error al agregar el Vehiculo', details: err.message });
    } finally {
        client.release();
    }
});

router.get('/', async (req,res)=>{
    const result = await db.query('SELECT * FROM vehiculo')
    res.json(result.rows)
})

router.patch('/:id_vehiculo', async (req, res) => {
    const client = await db.getClient();
    try {
        await client.query('BEGIN');

        const id_vehiculo = parseInt(req.params.id_vehiculo);
        const { marca, modelo, año, precio, id_concesionario} = req.body;

        let updateQuery = 'UPDATE vehiculo SET ';
        const updateValues = [];
        let paramCount = 1;

        if (marca !== undefined) {
            updateQuery += `marca = $${paramCount}, `;
            updateValues.push(marca);
            paramCount++;
        }
        if (modelo !== undefined) {
            updateQuery += `modelo = $${paramCount}, `;
            updateValues.push(modelo);
            paramCount++;
        }
        if (año !== undefined) {
            updateQuery += `año = $${paramCount}, `;
            updateValues.push(año);
            paramCount++;
        }
        if (precio !== undefined) {
            updateQuery += `precio = $${paramCount}, `;
            updateValues.push(precio);
            paramCount++;
        }
        if (id_concesionario !== undefined) {
            updateQuery += `id_concesionario = $${paramCount}, `;
            updateValues.push(id_concesionario);
            paramCount++;
        }
        updateQuery = updateQuery.slice(0, -2);
        updateQuery += ` WHERE id_vehiculo = $${paramCount} RETURNING *`;
        updateValues.push(id_vehiculo);

        const result = await client.query(updateQuery, updateValues);

        if (result.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Vehiculo no encontrado' });
        }

        await client.query('COMMIT');

        res.json({
            message: 'Vehiculo actualizado',
            data: result.rows[0]
        });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: 'Error al actualizar el vehiculo', details: err.message });
    } finally {
        client.release();
    }
});

router.delete('/:id_vehiculo', async (req, res) => {
    const client = await db.getClient();
    try {
        await client.query('BEGIN');

        const id_vehiculo = parseInt(req.params.id_vehiculo);
        const query = 'DELETE FROM vehioulo WHERE id_vehiculo = $1 RETURNING *';
        const result = await client.query(query, [id_vehiculo]);

        if (result.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Vehiculo no encontrado' });
        }

        await client.query('COMMIT');

        res.json({
            message: 'Vehiculo eliminado',
            data: result.rows[0]
        });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: 'Error al eliminar vehiculo', details: err.message });
    } finally {
        client.release();
    }
});

module.exports = router