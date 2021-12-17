const Joi = require('joi');
const validateRequest = require('../middleware/validate-request.js');
const userService = require('../services/user.service.js');

// Retrieve all Users from the database
exports.getAll = (req, res, next) => {
    userService.getAll(req.query)
        .then(users => res.status(200).send(users))
        .catch(next => res.status(409).send({ message: next }));
};

// Find User by ID
exports.getByID = (req, res, next) => {
    userService.getById(req.params.id)
        .then(user => res.status(200).send(user))
        .catch(next => res.status(409).send({ message: next }));
};

// Update a User by id
exports.updateSchema = (req, res, next) => {
    const schema = Joi.object({
        username: Joi.string().empty(''),
        firstName: Joi.string().empty(''),
        lastName: Joi.string().empty(''),
        email: Joi.string().empty('')
    });
    validateRequest(req, next, schema);
};

exports.update = (req, res, next) => {
    userService.update(req.params.id, req.body)
        .then(user => res.status(200).send(user))
        .catch(next => res.status(409).send({ message: next }));
};

// Delete a User by id
exports.delete = (req, res, next) => {
    userService.delete(req.params.id)
        .then(() => res.status(200).send({ message: "User deleted successfully" }))
        .catch(next => res.status(409).send({ message: next }));
};

// Delete all Users from the database - METHOD TO BE REMOVED ON PRODUCTION
exports.deleteAll = (req, res, next) => {
    userService.deleteAll()
        .then(() => res.status(200).send({ message: "All users were deleted successfully" }))
        .catch(next => res.status(409).send({ message: next }));
};