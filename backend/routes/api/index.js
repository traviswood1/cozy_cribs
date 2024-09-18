// backend/routes/api/index.js
const router = require('express').Router();


// backend/routes/api/index.js
// ...


// GET /api/restore-user
const { restoreUser } = require('../../utils/auth.js');

router.use(restoreUser);

router.get(
  '/restore-user',
  (req, res) => {
    return res.json(req.user);
  }
);

// GET /api/require-auth
const { requireAuth } = require('../../utils/auth.js');
router.get(
  '/require-auth',
  requireAuth,
  (req, res) => {
    return res.json(req.user);
  }
);


router.post('/test', function(req, res) {

    res.json({ requestBody: req.body });
  });
  
  // ...


module.exports = router;
