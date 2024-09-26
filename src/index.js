import express from 'express';
import morgan from 'morgan';
import { engine } from 'express-handlebars';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import personasRoutes from './routes/personas.routes.js';
import pool from './database.js'; // Asegúrate de que pool está exportado desde database.js

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Función auxiliar ifCond
const ifCond = (v1, operator, v2, options) => {
    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
            return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
};

app.set('port', process.env.PORT || 3000);
app.set('views', join(__dirname, 'views'));
app.engine('.hbs', engine({
    defaultLayout: 'main',
    layoutsDir: join(app.get('views'), 'layouts'),
    partialsDir: join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: {
        ifCond: ifCond
    }
}));

app.set('view engine', '.hbs');
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Rutas estáticas
app.use(express.static(join(__dirname, 'public')));

// Rutas principales
app.get('/', (req, res) => {
    res.render('index');
});

app.use(personasRoutes);

// Endpoints adicionales
app.get('/autocomplete', async (req, res) => {
    try {
        const query = `SELECT name FROM cities WHERE name LIKE ?`;
        const search = `%${req.query.q}%`;
        const [results] = await pool.query(query, [search]);
        res.json(results.map(row => row.name));
    } catch (err) {
        console.error('Error en la consulta de autocompletado: ', err);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

app.get('/search', async (req, res) => {
    try {
        const { destino } = req.query;
        const query = `
            SELECT hotels.name, hotels.address, hotels.price, hotels.category, hotels.accommodation_type, hotels.description,hotels.id
            FROM hotels
            JOIN cities ON hotels.city_id = cities.id
            WHERE cities.name = ?
        `;
        const [results] = await pool.query(query, [destino]);
        res.json(results);
    } catch (err) {
        console.error('Error en la consulta de búsqueda de hoteles: ', err);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});


app.listen(app.get('port'), () =>
    console.log('El server está escuchando en el puerto', app.get('port'))
);
