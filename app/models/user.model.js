module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
      username: {
        type: Sequelize.STRING
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      hash: {
        type: Sequelize.STRING,
        allowNull: false
      }
    }, {
      tableName: 'users',
      defaultScope: {
        // exclude hash by default
        attributes: { exclude: ['hash'] }
      },
      scopes: {
        // include hash with this scope
        withHash: { attributes: {}, }
      }
    });
  
    return User;
  };