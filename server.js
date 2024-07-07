require("dotenv").config();
require('./db/connection');
const express = require("express");

const app = express();
const port = '3000';

app.use(express.json({ limit: "10MB" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.listen(port, () => {
console.log(`Server is running at ${port}`);
});

const userRoutes = require("./routes/user_route");
const bodyParser = require("body-parser");
app.use('/', userRoutes);
app.use(bodyParser.json());

