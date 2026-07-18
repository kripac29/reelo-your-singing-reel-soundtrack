const assert = require('assert');
const express = require('express');
const http = require('http');

const authMiddlewarePath = require.resolve('./src/middleware/authMiddleware');
const playlistModelPath = require.resolve('./src/models/Playlist');

const fakeAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  req.user = { id: token === 'user-2' ? 'user-2' : 'user-1' };
  next();
};

require.cache[authMiddlewarePath] = {
  id: authMiddlewarePath,
  filename: authMiddlewarePath,
  loaded: true,
  exports: fakeAuthMiddleware,
};

const playlists = [];
const PlaylistStub = {
  create: async (data) => {
    const playlist = {
      _id: `playlist-${playlists.length + 1}`,
      ...data,
      createdAt: new Date(),
    };
    playlists.push(playlist);
    return playlist;
  },
  find: (query) => ({
    sort: () => {
      return Promise.resolve(
        playlists
          .filter((playlist) => playlist.user === query.user)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      );
    },
  }),
  findOneAndDelete: async (query) => {
    const index = playlists.findIndex(
      (playlist) => playlist._id === query._id && playlist.user === query.user
    );

    if (index === -1) {
      return null;
    }

    const [removed] = playlists.splice(index, 1);
    return removed;
  },
};

require.cache[playlistModelPath] = {
  id: playlistModelPath,
  filename: playlistModelPath,
  loaded: true,
  exports: PlaylistStub,
};

const playlistRouter = require('./src/routes/playlistRoutes');
const app = express();
app.use(express.json());
app.use('/api', playlistRouter);

async function request(path, options = {}) {
  const serverUrl = `http://127.0.0.1:${server.address().port}${path}`;
  return fetch(serverUrl, options);
}

(async () => {
  try {
    const server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));

    const unauthResponse = await fetch(`http://127.0.0.1:${server.address().port}/api/playlists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Unauthenticated' }),
    });
    assert.strictEqual(unauthResponse.status, 401);
    console.log('✓ unauthenticated request is blocked with 401');

    const createResponse = await fetch(`http://127.0.0.1:${server.address().port}/api/playlists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer user-1',
      },
      body: JSON.stringify({ name: 'My playlist', description: 'created by user 1' }),
    });
    assert.strictEqual(createResponse.status, 201);
    const createdPlaylist = await createResponse.json();
    assert.strictEqual(createdPlaylist.playlist.user, 'user-1');
    console.log('✓ POST /api/playlists creates a playlist for the logged-in user');

    const foreignPlaylist = await PlaylistStub.create({
      user: 'user-2',
      name: 'Other user playlist',
      description: 'belongs to another user',
    });

    const secondOwnedPlaylist = await PlaylistStub.create({
      user: 'user-1',
      name: 'Second playlist',
      description: 'belongs to user 1',
    });

    const getResponse = await fetch(`http://127.0.0.1:${server.address().port}/api/playlists`, {
      headers: { Authorization: 'Bearer user-1' },
    });
    assert.strictEqual(getResponse.status, 200);
    const playlistsResponse = await getResponse.json();
    assert.ok(Array.isArray(playlistsResponse.playlists));
    assert.ok(playlistsResponse.playlists.every((playlist) => playlist.user === 'user-1'));
    assert.ok(playlistsResponse.playlists.some((playlist) => playlist._id === createdPlaylist.playlist._id));
    assert.ok(playlistsResponse.playlists.some((playlist) => playlist._id === secondOwnedPlaylist._id));
    assert.ok(!playlistsResponse.playlists.some((playlist) => playlist._id === foreignPlaylist._id));
    console.log('✓ GET /api/playlists returns only the logged-in user\'s playlists');

    const deleteResponse = await fetch(`http://127.0.0.1:${server.address().port}/api/playlists/${createdPlaylist.playlist._id}`, {
      method: 'DELETE',
      headers: { Authorization: 'Bearer user-1' },
    });
    assert.strictEqual(deleteResponse.status, 200);
    const deletedBody = await deleteResponse.json();
    assert.strictEqual(deletedBody.playlist._id, createdPlaylist.playlist._id);
    console.log('✓ DELETE /api/playlists/:id deletes the logged-in user\'s playlist');

    const foreignDeleteResponse = await fetch(`http://127.0.0.1:${server.address().port}/api/playlists/${foreignPlaylist._id}`, {
      method: 'DELETE',
      headers: { Authorization: 'Bearer user-1' },
    });
    assert.strictEqual(foreignDeleteResponse.status, 404);
    console.log('✓ foreign playlist delete is denied for the logged-in user');

    const finalGetResponse = await fetch(`http://127.0.0.1:${server.address().port}/api/playlists`, {
      headers: { Authorization: 'Bearer user-1' },
    });
    const finalPlaylists = await finalGetResponse.json();
    assert.ok(!finalPlaylists.playlists.some((playlist) => playlist._id === createdPlaylist.playlist._id));
    assert.ok(finalPlaylists.playlists.some((playlist) => playlist._id === secondOwnedPlaylist._id));
    console.log('✓ playlist deletion only removed the matching owned playlist');

    console.log('\nPlaylist API verification completed successfully.');
    server.close();
  } catch (error) {
    console.error('Playlist API verification failed:', error);
    process.exit(1);
  }
})();
