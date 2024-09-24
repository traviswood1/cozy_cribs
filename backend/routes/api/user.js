// backend/routes/api/users.js
const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

const validateSignup = [
  check('email')
    .isEmail()
    .withMessage('Invalid email'),
  check('username')
    .notEmpty()
    .withMessage('Username is required'),
  check('firstName')
    .notEmpty()
    .withMessage('First Name is required'),
  check('lastName')
    .notEmpty()
    .withMessage('Last Name is required'),
  handleValidationErrors
];

// Sign up
router.post(
  '/',
  async (req, res) => {
    const { email, password, username, lastName, firstName } = req.body;
    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({ email, username, hashedPassword, lastName, firstName });

    const safeUser = {
      id: user.id,
      email: user.email,
      username: user.username,
      lastName: user.lastName,
      firstName: user.firstName
    };

    await setTokenCookie(res, safeUser);

    return res.json({
      user: safeUser
    });
  }
);

module.exports = router;