const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://postgres:password@localhost:5432/resource_sharing', {
  logging: false,
  dialect: 'postgres'
});

module.exports = sequelize;