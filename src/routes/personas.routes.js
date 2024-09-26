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
 
router.get('/crearSesion', (req, res) => {
    res.render('personas/crearSesion');
});
 
router.get('/ofertas', (req, res) => {
    res.render('personas/ofertas');
});

router.get('/search', async (req, res) => {
    try {
        const { destino } = req.query;
        const query = `
            SELECT hotels.name, hotels.address,hotels.price, hotels.category, hotels.accommodation_type, hotels.description, hotels.id
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

// Ruta para mostrar los detalles del hotel basado en su ID
router.get('/hotel/:id', (req, res) => {
    const hotelId = req.params.id;

    const query = `
        SELECT 
            hotels.id AS hotel_id,
            hotels.name AS hotel_name,
            hotels.address,
            hotels.price,
            hotels.category,
            hotels.accommodation_type,
            hotels.description,
            cities.name AS city_name,
            GROUP_CONCAT(DISTINCT hotel_photos.photo_url) AS photos,
            GROUP_CONCAT(DISTINCT hotel_services.name) AS services
        FROM 
            hotels
        LEFT JOIN cities ON hotels.city_id = cities.id
        LEFT JOIN hotel_photos ON hotels.id = hotel_photos.hotel_id
        LEFT JOIN hotel_service_relation ON hotels.id = hotel_service_relation.hotel_id
        LEFT JOIN hotel_services ON hotel_service_relation.service_id = hotel_services.id
        WHERE 
            hotels.id = ?
        GROUP BY 
            hotels.id;
    `;

    db.query(query, [hotelId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error en la consulta' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Hotel no encontrado' });
        }
        // Renderizamos la vista 'hoteld' con los datos del hotel
        res.render('hoteld', { hotel: results[0] });
    });
});

router.get('/filtro', async (req, res) => {
    try {
        const { precio_min, precio_max, estrellas, actividades, orientacion, tipo_alojamiento } = req.query;

        let query = `
            SELECT hotels.name, hotels.address, hotels.price, hotels.category, hotels.accommodation_type, hotel_photos.photo_url
            FROM hotels
            LEFT JOIN hotel_photos ON hotels.id = hotel_photos.hotel_id
            WHERE 1=1
        `;

        let queryParams = [];

        // Filtro por rango de precios
        if (precio_min) {
            query += ' AND hotels.price >= ?';
            queryParams.push(precio_min);
        }
        if (precio_max) {
            query += ' AND hotels.price <= ?';
            queryParams.push(precio_max);
        }

        // Filtro por estrellas
        if (estrellas) {
            const estrellasArray = Array.isArray(estrellas) ? estrellas : [estrellas];
            query += ' AND hotels.category IN (?)';
            queryParams.push(estrellasArray);
        }

        // Filtro por actividades (ajusta según tu base de datos)
        if (actividades) {
            const actividadesArray = Array.isArray(actividades) ? actividades : [actividades];
            query += ' AND EXISTS (SELECT 1 FROM hotel_activities WHERE hotel_activities.hotel_id = hotels.id AND hotel_activities.activity_id IN (?))';
            queryParams.push(actividadesArray);
        }

        // Filtro por orientación sexual (ajusta según tu base de datos)
        if (orientacion) {
            const orientacionArray = Array.isArray(orientacion) ? orientacion : [orientacion];
            query += ' AND EXISTS (SELECT 1 FROM user_orientations WHERE user_orientations.hotel_id = hotels.id AND user_orientations.orientation_id IN (?))';
            queryParams.push(orientacionArray);
        }

        // Filtro por tipo de alojamiento
        if (tipo_alojamiento) {
            query += ' AND hotels.accommodation_type LIKE ?';
            queryParams.push(`%${tipo_alojamiento}%`);
        }

        const [results] = await pool.query(query, queryParams);

        res.render('personas/filtro', { hoteles: results });
    } catch (err) {
        console.error('Error en el filtro: ', err);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});


export default router;