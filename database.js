const { Sequelize } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite' // or your database configuration
});

const dropAndRecreateUserEventsTable = async () => {
  try {
    await sequelize.query('DROP TABLE IF EXISTS `UserEvents`');
    console.log('UserEvents table dropped successfully.');
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS \`UserEvents\` (
        \`id\` INTEGER PRIMARY KEY AUTOINCREMENT,
        \`userId\` INTEGER NOT NULL,
        \`eventId\` INTEGER NOT NULL,
        \`choice\` VARCHAR(255),
        \`createdAt\` DATETIME NOT NULL,
        \`updatedAt\` DATETIME NOT NULL,
        FOREIGN KEY(\`userId\`) REFERENCES \`Users\`(\`id\`),
        FOREIGN KEY(\`eventId\`) REFERENCES \`Events\`(\`id\`)
      )
    `);
    console.log('UserEvents table recreated successfully.');
  } catch (error) {
    console.error('Error dropping or recreating UserEvents table:', error);
  }
};

dropAndRecreateUserEventsTable();

module.exports = sequelize;