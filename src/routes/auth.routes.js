import { Router } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../database.js';

const router = Router();
// Crear Sesión 

router.post('/crearSesion', async (req, res) => {
    const { nombre, ciudad, telefono, direccion, email, password } = req.body;
    
    try {
        const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        
        if (existingUser.length > 0) {
            return res.status(400).send('El correo electrónico ya está registrado');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query('INSERT INTO users (nombre, ciudad, telefono, direccion, email, password) VALUES (?, ?, ?, ?, ?, ?)', 
                         [nombre, ciudad, telefono, direccion, email, hashedPassword]);
        res.redirect('/inicioSesion');
    } catch (error) {
        res.status(500).send('Error al crear la cuenta');
    }
});


router.get("/traerUsuario" , async (req, res) => {
    const [consultaUsuario] = await pool.query('SELECT * FROM usuario WHERE ID_Usuario = ?')
      if (consultaUsuario.length > 0 ) {return
        [consultaUsuario]
      }
  });
  
// Ruta para actualizar un usuario
router.put("/actualizarUsuario/:id", async (req, res) => {
    const { id } = req.params;
    const { nombre, correo, contrasena } = req.body;
    
    try {
      const query = 'UPDATE usuario SET nombre = ?, correo = ?, contrasena = ? WHERE ID_Usuario = ?';
      const [resultado] = await pool.query(query, [nombre, correo, contrasena, id]);
      
      if (resultado.affectedRows > 0) {
        return res.send('Usuario actualizado');
      } else {
        return res.status(404).send('Usuario no encontrado');
      }
    } catch (error) {
      return res.status(500).send('Error en la base de datos');
    }
  });
  
// Ruta para eliminar un usuario
router.delete("/eliminarUsuario/:id", async (req, res) => {
    const { id } = req.params;
    
    try {
      const query = 'DELETE FROM usuario WHERE ID_Usuario = ?';
      const [resultado] = await pool.query(query, [id]);
      
      if (resultado.affectedRows > 0) {
        return res.send('Usuario eliminado');
      } else {
        return res.status(404).send('Usuario no encontrado');
      }
    } catch (error) {
      return res.status(500).send('Error en la base de datos');
    }
  });
  

router.post('/inicioSesion', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const [user] = await pool.query('SELECT * FROM users WHERE username =?, and password = ?', [email, password]);
        
        if (user.length === 0) {
            return res.status(400).send('Correo eletrónico no encontrado');
        }

        const foundUser = user[0];
        const isMatch = await bcrypt.compare(password, foundUser.password);
        
        if (!isMatch) {
            return res.status(400).send('Contraseña incorrecta');
        }

        req.session.userId = foundUser.id;
        req.session.username = foundUser.username;
        res.redirect('/index');
    } catch (error) {
        res.status(500).send('Error al iniciar sesión');
    }
});

/*router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Error al cerrar sesión');
        }
        res.redirect('/inicioSesion');
    });
});*/

export default router;
