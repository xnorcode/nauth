module.exports = app => {
    const users = require("../controllers/user.controller.js");
    const authorize = require('../middleware/authorize.js');
  
    var router = require("express").Router();
  
    // Retrieve all Users
    router.get("/", authorize(), users.getAll);
  
    // Retrieve User by id
    router.get("/:id", authorize(), users.getByID);
  
    // Update a User with id
    router.put("/:id", authorize(), users.updateSchema, users.update);
  
    // Delete a User with id
    router.delete("/:id", authorize(), users.delete);
  
    // Delete all Users
    router.delete("/", authorize(), users.deleteAll);
  
    app.use('/users', router);
};