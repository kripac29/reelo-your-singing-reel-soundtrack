const express = require('express');
const router = express.Router();

const {
  createPlaylist,
  getMyPlaylists,
  deletePlaylist,
} = require('../controllers/playlistController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/playlists', authMiddleware, createPlaylist);
router.get('/playlists', authMiddleware, getMyPlaylists);
router.delete('/playlists/:id', authMiddleware, deletePlaylist);

module.exports = router;
