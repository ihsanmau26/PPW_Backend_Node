const express = require('express');
const multer = require('multer');
const path = require('path');
const Photo = require('../models/Photo');
const fs = require('fs');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../laravel-tubes-api/public/storage/image'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const photoPath = `/public/storage/image/${req.file.filename}`;

    const photo = await Photo.create({
      photo: photoPath,
      user_id: user_id,
    });

    res.status(200).json({
      message: 'Photo uploaded successfully',
      photo,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const photos = await Photo.findAll();
    res.status(200).json(photos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/user/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const photos = await Photo.findAll({
      where: { user_id: userId }
    });

    if (photos.length === 0) {
      return res.status(404).json({ message: 'No photos found for this user' });
    }

    res.status(200).json({
      message: 'Photos retrieved successfully',
      photos,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:user_id', upload.single('photo'), async (req, res) => {
  try {
    const { user_id } = req.params;
    const photo = await Photo.findOne({ where: { user_id: user_id } });

    if (!photo) {
      return res.status(404).json({ error: 'Photo not found for the user' });
    }

    const photoPath = req.file ? `/public/storage/image/${req.file.filename}` : photo.photo;
    photo.photo = photoPath;
    await photo.save();
    res.status(200).json(photo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    const photo = await Photo.findOne({ where: { user_id: user_id } });

    if (!photo) {
      return res.status(404).json({ error: 'Photo not found for the user' });
    }

    const fs = require('fs');
    const filePath = path.join(__dirname, '../../laravel-tubes-api/public', photo.photo);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await photo.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
