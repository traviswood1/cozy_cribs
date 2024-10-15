// backend/routes/index.js
const express = require('express');
const router = express.Router();
const path = require('path'); // Add this at the top

const { setTokenCookie } = require('../utils/auth.js');
const { User } = require('../db/models');

const apiRouter = require('./api');

router.use('/api', apiRouter);

// Add a XSRF-TOKEN cookie
router.get("/api/csrf/restore", (req, res) => {
  const csrfToken = req.csrfToken();
  res.cookie("XSRF-TOKEN", csrfToken);
  res.status(200).json({
    'XSRF-Token': csrfToken
  });
});

// GET /api/set-token-cookie
router.get('/api/set-token-cookie', async (_req, res) => {
  const user = await User.findOne({
    where: {
      username: 'Demo-lition'
    }
  });
  setTokenCookie(res, user);
  return res.json({ user: user });
});

router.post('/test', (req, res) => {
  console.log('Received POST request to /api/test');
  console.log('Request body:', req.body);
  res.json({ message: 'Test successful', receivedData: req.body });
});

// Static routes
// Serve React build files in production
if (process.env.NODE_ENV === 'production') {
  // Serve the static assets in the frontend's build folder
  router.use(express.static(path.resolve(__dirname, '../../frontend/dist')));

  // Serve the frontend's index.html file at all other routes NOT starting with /api
  router.get(/^(?!\/?api).*/, (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    return res.sendFile(
      path.resolve(__dirname, '../../frontend', 'dist', 'index.html')
    );
  });
}

module.exports = router;
