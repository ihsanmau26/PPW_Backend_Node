require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');
const photoRoutes = require('./routes/photoRoutes');
const app = express();
const cors = require('cors');

// CORS Configuration
const corsOptions = {
    origin: 'http://127.0.0.1:3000', // Atau '*', jika Anda ingin mengizinkan semua origin
    methods: 'GET,POST,PUT,DELETE',   // Tentukan metode HTTP yang diizinkan
    allowedHeaders: 'Content-Type, Authorization', // Tentukan header yang diizinkan
};

// Gunakan middleware CORS
app.use(cors(corsOptions));

app.use(express.json());
app.use('/photos', photoRoutes);

app.options('*', cors());

sequelize.sync({ force: false })
  .then(() => console.log('Database synchronized'))
  .catch(err => console.error('Error syncing database:', err));

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
