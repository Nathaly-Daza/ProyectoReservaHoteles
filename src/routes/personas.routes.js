import { Router } from 'express';
//import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
 
import pool from '../database.js';

const router = Router();
const JWT_SECRET = 'tu_clave_secreta';
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
 
router.get('/hoteld', (req, res) => {
    res.render('personas/hoteld');
});
 
router.get('/filtro', (req, res) => {
    res.render('personas/filtro');
});
 
router.get('/favoritos', (req, res) => {
    res.render('personas/favoritos');
});
 
router.get('/Reservas', (req, res) => {
    res.render('personas/Reservas');
});
 
router.get('/Reservar', (req, res) => {
    res.render('personas/Reservar');
});
router.get('/inicioSesion', (req, res) => {
    res.render('personas/inicioSesion');
});
 
 
router.post('/inicioSesion', async (req, res) => {
    const { email, password } = req.body;
 
    try {
        // Consulta con AND para verificar email y contraseña
        const [user] = await pool.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
 
        if (user.length === 0) {
            return res.status(400).send('Credenciales inválidas');
        }
 
        const foundUser = user[0];
 
        // Generar el token
        const token = jwt.sign({ id: foundUser.id, email: foundUser.email }, JWT_SECRET, { expiresIn: '1h' });
 
        // Aquí puedes guardar el token en una cookie si deseas
        res.cookie('token', token, { httpOnly: true }); // Asegúrate de instalar el paquete 'cookie-parser'
 
        // Redirigir a la página de inicio
        return res.redirect('/index'); // Redirige a la página de inicio
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).send('Error al iniciar sesión');
    }
});
 
router.get('/index', (req, res) => {
    res.render('index');
});
 
 
router.get('/ofertas', (req, res) => {
    res.render('personas/ofertas');
});
 
router.get('/search', async (req, res) => {
    try {
        const { destino } = req.query;
        const query = `
            SELECT hotels.name, hotels.address
            FROM hotels
            JOIN cities ON hotels.city_id = cities.id
            WHERE cities.name = ?
        `;
        const [results] = await pool.query(query, [destino]);
        res.json(results);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
 
   
});
 
router.get('/crearSesion', (req, res) => {
    res.render('personas/crearSesion');
  });
  // Crear sesión
  router.post('/crearSesion', async (req, res) => {
   
    try {
        const { nombre, ciudad, telefono, direccion, email, password } = req.body;
   
        // Verificar si el usuario ya existe
        const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        console.log(existingUser);
 
        if (existingUser.length > 0) {
            return res.status(400).send('El correo electrónico ya está registrado');
        }else{
           
 
        // Insertar nuevo usuario en la base de datos
        await pool.query('INSERT INTO users (nombre, ciudad, telefono, direccion, email, password) VALUES (?, ?, ?, ?, ?, ?)',
                         [nombre, ciudad, telefono, direccion, email, password]);
 
        console.log('Usuario creado exitosamente');
        res.redirect('/inicioSesion'); // Redirigir después de la creación
 
        }
 
        // Hash de la contraseña
       
 
    } catch (error) {
        console.error('Error al crear la cuenta:', error);
        //res.status(500).send('Error al crear la cuenta');
    }
});
 
export default router;
 