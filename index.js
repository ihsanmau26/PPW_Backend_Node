require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');
const photoRoutes = require('./routes/photoRoutes');
const app = express();
const cors = require('cors');

const corsOptions = {
    origin: 'http://127.0.0.1:3000',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
};

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
