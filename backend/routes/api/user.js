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
  validateSignup,
  async (req, res, next) => {
    const { email, password, username, lastName, firstName } = req.body;
    
    try {
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
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        const errors = {};
        error.errors.forEach(e => {
          if (e.path === 'email' || e.path === 'username') {
            errors[e.path] = `User with that ${e.path} already exists`;
          }
        });
        return res.status(500).json({
          message: "User already exists",
          errors: errors
        });
      }
      next(error);
    }
  }
);

module.exports = router;