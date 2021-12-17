const jwt = require('express-jwt');
const { secret } = require("../config/auth.config.js");
const db = require("../models");
const User = db.users;


// Authorize middleware can be added to any route to restrict access to the route to
// authenticated users. It is used by the users controller to restrict access to user CRUD routes
module.exports = authorize;

function authorize() {
    return [
        // authenticate JWT token and attach decoded token to request as req.user
        jwt({ secret, algorithms: ['HS256'] }),

        // attach full user record to request object
        async (req, res, next) => {
            // get user with id from token 'sub' (subject) property
            const user = await User.findByPk(req.user.sub);

            // check user still exists
            if (!user) return res.status(401).send({ message: 'Unauthorized' });

            // authorization successful
            req.user = user.get();
            next();
        },
        async (err, req, res, next) => {
            // handle unauthorize requests here
            if (err && err.name === 'UnauthorizedError') return res.status(401).send({ message: 'Unauthorized' });
        },
    ];
}