const express = require('express');
const app = express();
const ExpressError = require('./expressError');
const routes = require('./routes/routes');

app.use(express.json());
app.use('/items', routes);

app.use(function (req, res, next) {
    return new ExpressError('Not Found', 404);
});

app.use(function (err, req, res, next) {
    res.status(err.status || 500);

    return res.json({
        error: err.message
    });
});

app.listen(3000, function () {
    console.log("Server is listening on port 3000");
});

module.exports = app;

