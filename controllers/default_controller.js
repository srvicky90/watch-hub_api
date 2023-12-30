const errorFunction = require("./../utils/error_function");

const defaultController = async (req, res, next) => {
res.status(200);
res.json(errorFunction(false, "Home Page", "Welcome from Virav Technologies"));
};

module.exports = defaultController;