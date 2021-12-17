const db = require("../models");
const Users = db.users;
const Op = require("../models").Sequelize.Op;


module.exports = {
    getAll,
    getById,
    update,
    delete: _delete,
    deleteAll: _deleteAll
};


// Method to get all users
async function getAll(query) {
    // filter users by queries if any
    var condition = null;
    if (query){
        condition = {};
        condition.where = {};

        // Query: firstName
        const q1 = query.firstName;        
        if(q1) condition.where.firstName = { [Op.like]: `%${q1}%` }

        // Query: lastName
        const q2 = query.lastName;
        if(q2) condition.where.lastName = { [Op.like]: `%${q2}%` }
        
        // Query: email
        const q3 = query.email;
        if(q3) condition.where.email = { [Op.eq]: `${q3}` }

        // Query: username
        const q4 = query.username;
        if(q4) condition.where.username = { [Op.eq]: `${q4}` }
    }

    return await Users.findAll(condition);
}

// Method to find user by id
async function getById(id) {
    return await getUser(id);
}

// Method to update user by id
async function update(id, params) {
    const user = await getUser(id);

    // validate username
    const usernameChanged = params.username && user.username !== params.username;
    if (usernameChanged && await Users.findOne({ where: { username: params.username } })) {
        throw 'Username "' + params.username + '" is already taken';
    }
    
    // validate email
    const emailChanged = params.email && user.email !== params.email;
    if (emailChanged && await Users.findOne({ where: { email: params.email } })) {
        throw 'This email is already registered';
    }
    
    // copy params to user and save
    Object.assign(user, params);
    await user.save();

    // return user data without hash key
    const { hash, ...userData } = user.get();
    return userData;
}

// Method to delete user by id
async function _delete(id) {
    const user = await getUser(id);
    await user.destroy();
}

// Method to delete all users
async function _deleteAll() {
    await Users.destroy({ where: {}, truncate: false });
}

// helper function
async function getUser(id) {
    const user = await Users.findByPk(id);
    if (!user) throw 'User not found';
    return user;
}