const express = require('express');
const router  = express.Router();
const db  = require('../db.js');


router.post('/', async (req, res) => {
    const client = await db.getClient();
    try {
        await client.query('BEGIN');

        const { id_empleado, nombre, cargo, salario, id_concesionario } = req.body;

        const query = 'INSERT INTO empleado (id_empleado, nombre, cargo, salario, id_concesionario ) VALUES ($1, $2, $3, $4, $5) RETURNING *';
        const values = [id_empleado, nombre, cargo, salario, id_concesionario];
        
        const result = await client.query(query, values);
        
        await client.query('COMMIT');

        res.status(201).json({
            message: 'Empleado agregado',
            data: result.rows[0]
        });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: 'Error al agregar el Empleado', details: err.message });
    } finally {
        client.release();
    }
});

router.get('/', async (req,res)=>{
    const result = await db.query('SELECT * FROM empleado')
    res.json(result.rows)
})

router.patch('/:id_empleado', async (req, res) => {
    const client = await db.getClient();
    try {
        await client.query('BEGIN');

        const id_empleado = parseInt(req.params.id_empleado);
        const { nombre, cargo, salario, id_concesionario} = req.body;

        let updateQuery = 'UPDATE empleado SET ';
        const updateValues = [];
        let paramCount = 1;

        if (nombre !== undefined) {
            updateQuery += `nombre = $${paramCount}, `;
            updateValues.push(nombre);
            paramCount++;
        }
        if (cargo !== undefined) {
            updateQuery += `cargo = $${paramCount}, `;
            updateValues.push(cargo);
            paramCount++;
        }
        if (salario !== undefined) {
            updateQuery += `salario = $${paramCount}, `;
            updateValues.push(salario);
            paramCount++;
        }
        if (id_concesionario !== undefined) {
            updateQuery += `id_concesionario = $${paramCount}, `;
            updateValues.push(id_concesionario);
            paramCount++;
        }
        updateQuery = updateQuery.slice(0, -2);
        updateQuery += ` WHERE id_empleado = $${paramCount} RETURNING *`;
        updateValues.push(id_empleado);

        const result = await client.query(updateQuery, updateValues);

        if (result.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Empleado no encontrado' });
        }

        await client.query('COMMIT');

        res.json({
            message: 'Empleadoa actualizado',
            data: result.rows[0]
        });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: 'Error al actualizar el Empleado', details: err.message });
    } finally {
        client.release();
    }
});

router.delete('/:id_empleado', async (req, res) => {
    const client = await db.getClient();
    try {
        await client.query('BEGIN');

        const id_empleado = parseInt(req.params.id_empleado);
        const query = 'DELETE FROM empleado WHERE id_empleado = $1 RETURNING *';
        const result = await empleado.query(query, [id_empleado]);

        if (result.rows.length === 0) {
            await empleado.query('ROLLBACK');
            return res.status(404).json({ message: 'Empleado no encontrado' });
        }

        await client.query('COMMIT');

        res.json({
            message: 'Empleado eliminado',
            data: result.rows[0]
        });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: 'Error al eliminar Empleado', details: err.message });
    } finally {
        client.release();
    }
});

module.exports = router