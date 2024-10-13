const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql'
});

const User = require('./user')(sequelize);
const Group = require('./group')(sequelize);
const Message = require('./message')(sequelize);

// Associations
User.belongsToMany(Group, { throug