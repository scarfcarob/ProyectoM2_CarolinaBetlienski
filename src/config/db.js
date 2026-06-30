
process.loadEnvFile();

import pkg from 'pg';
const { Pool } = pkg;


const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});


pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
    } else {
        console.log('Conexión exitosa a la base de datos. Hora actual:', res.rows[0].now);
    }
});

export default pool;

