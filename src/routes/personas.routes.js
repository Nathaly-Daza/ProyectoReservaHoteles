import { Router } from 'express';
import pool from '../database.js';

const router = Router();

router.get('/add', async (req, res) => {
    try {
        const [tipos_persona] = await pool.query('SELECT * FROM Tipo_Persona');
        res.render('personas/add', { tipos_persona });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/add', async (req, res) => {
    try {
        const { name, lastname, age, tipo_persona_id } = req.body;
        const newPersona = { name, lastname, age, tipo_persona_id };
        await pool.query('INSERT INTO personas SET ?', [newPersona]);
        res.redirect('/list');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/list', async (req, res) => {
    try {
        const [result] = await pool.query(`SELECT p.*, tp.tipo as tipo_persona 
                                           FROM personas p 
                                           JOIN Tipo_Persona tp ON p.tipo_persona_id = tp.id`);
        res.render('personas/list', { personas: result });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.get('/edit/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [persona] = await pool.query('SELECT * FROM personas WHERE id = ?', [id]);
        const personaEdit = persona[0];
        const [tipos_persona] = await pool.query('SELECT * FROM Tipo_Persona');
        res.render('personas/edit', { persona: personaEdit, tipos_persona });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/edit/:id', async (req, res) => {
    try {
        const { name, lastname, age, tipo_persona_id } = req.body;
        const { id } = req.params;
        const editPersona = { name, lastname, age, tipo_persona_id };
        await pool.query('UPDATE personas SET ? WHERE id = ?', [editPersona, id]);
        res.redirect('/list');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM personas WHERE id = ?', [id]);
        res.redirect('/list');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
