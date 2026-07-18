const Playlist = require('../models/Playlist');

const createPlaylist = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const { name, description } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Playlist name is required',
      });
    }

    const playlist = await Playlist.create({
      user: userId,
      name: name.trim(),
      description: description || '',
    });

    return res.status(201).json({
      success: true,
      playlist,
    });
  } catch (error) {
    console.error('createPlaylist error:', error);

    return res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

const getMyPlaylists = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const playlists = await Playlist.find({ user: userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      playlists,
    });
  } catch (error) {
    console.error('getMyPlaylists error:', error);

    return res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

const deletePlaylist = async (req, res) => {
  try {
    const userId = req.user?.id;
    const playlistId = req.params.id || req.params.playlistId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    if (!playlistId) {
      return res.status(400).json({
        success: false,
        message: 'Playlist ID is required',
      });
    }

    const deletedPlaylist = await Playlist.findOneAndDelete({
      _id: playlistId,
      user: userId,
    });

    if (!deletedPlaylist) {
      return res.status(404).json({
        success: false,
        message: 'Playlist not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Playlist deleted successfully',
      playlist: deletedPlaylist,
    });
  } catch (error) {
    console.error('deletePlaylist error:', error);

    return res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

module.exports = {
  createPlaylist,
  getMyPlaylists,
  deletePlaylist,
};
