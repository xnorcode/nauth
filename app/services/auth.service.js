const { secret } = require("../config/auth.config.js");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require("../models");
const Users = db.users;


module.exports = {
    login,
    create,
    updatePassword
};


// Method to login user
async function login({ email, password }) {
    const user = await Users.scope('withHash').findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.hash)))
        throw 'Email or password is incorrect';

    // authentication successful
    const token = jwt.sign({ sub: user.id }, secret, { expiresIn: '7d' });
    // return cookie
    return { id: user.id, username: user.username, token };
}

// Method to create new user
async function create(params) {
    // validate
    if (await Users.findOne({ where: { email: params.email } })) {
        throw 'This email is already registered';
    }

    // hash password
    if (params.password) {
        params.hash = await bcrypt.hash(params.password, 10);
    }

    // save user
    await Users.create(params);
}

// Method to update user password
async function updatePassword(id, { password, newPassword }) {
    const user = await Users.scope('withHash').findByPk(id);

    if (!user || !(await bcrypt.compare(password, user.hash)))
        throw 'Incorrect password';
    
    // hash new password
    user.hash = await bcrypt.hash(newPassword, 10);

    // save user
    await user.save();

    // update successful
    const token = jwt.sign({ sub: user.id }, secret, { expiresIn: '7d' });
    // return cookie
    return { id: user.id, username: user.username, token };
}