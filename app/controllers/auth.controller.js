const Joi = require('joi');
const validateRequest = require('../middleware/validate-request.js');
const authService = require('../services/auth.service.js');


// Login user
exports.loginSchema = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
    });
    validateRequest(req, next, schema);
};

exports.login = (req, res, next) => {
    authService.login(req.body)
        .then(user => res.status(200).send(user))
        .catch(next => res.status(401).send({ message: next }));
};

// Register a new User
exports.registerSchema = (req, res, next) => {
    const schema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().min(6).required()
    });
    validateRequest(req, next, schema);
};

exports.register = (req, res, next) => {
    authService.create(req.body)
        .then(() => res.status(200).send({ message: 'Registration successful' }))
        .catch(next => res.status(409).send({ message: next }));
};

// Update user password
exports.updatePasswordSchema = (req, res, next) => {
    const schema = Joi.object({
        password: Joi.string().required(),
        newPassword: Joi.string().required()
    });
    validateRequest(req, next, schema);
};

exports.updatePassword = (req, res, next) => {
    authService.updatePassword(req.params.id, req.body)
        .then(user => res.status(200).send(user))
        .catch(next => res.status(401).send({ message: next }));
};