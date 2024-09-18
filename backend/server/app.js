const express = require("express");
const { environment } = require("./config");
const { NotFoundError } = require("./utils/errors");
const app = express();


app.listen(5000, () => {
    console.log("Server is running on port 5000");
});

module.exports = app;