module.exports = app => {
    const auth = require("../controllers/auth.controller.js");
    const authorize = require('../middleware/authorize.js');
  
    var router = require("express").Router();

    // Login a User
    router.post("/login", auth.loginSchema, auth.login);
  
    // Register a new User
    router.post("/signup", auth.registerSchema, auth.register);

    // Update user password
    router.put("/:id", authorize(), auth.updatePasswordSchema, auth.updatePassword);
  
    app.use('/auth', router);
};