module.exports = {
  development: {
  storage: process.env.DB * FILE,
  dialect: "sqlite",
  seederStorage: "sequelize",
  benchmark: true,
  logQueryParameters: true,
  typeValidation: true,
  // logging: false
  },
 };