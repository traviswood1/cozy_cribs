// backend/routes/api/index.js
const router = require("express").Router();
const { restoreUser } = require("../../utils/auth.js");
const sessionRouter = require('./session.js');
const usersRouter = require('./user.js');
const spotRouter = require('./spot.js');
const spotImagesRouter = require('./spot-images.js');
const reviewsRouter = require('./reviews.js');
const bookingsRouter = require('./bookings.js');
const reviewImagesRouter = require('./review-images.js');

// Connects restoreUser middleware to the API router
  // If current user session is valid, set req.user to the user in the database
  // If current user session is not valid, set req.user to null
router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use('/spots', spotRouter);

router.use('/spot-images', spotImagesRouter);

router.use('/reviews', reviewsRouter);

router.use('/bookings', bookingsRouter);
router.use('/review-images', reviewImagesRouter);

router.post('/test', (req, res) => {
    console.log(`Received ${req.method} request to ${req.path}`);
  // next();
  res.json({ requestBody: req.body });
});



// app.use((req, res, next) => {
//   console.log(`Received ${req.method} request to ${req.path}`);
//   next();
// });



module.exports = router;
