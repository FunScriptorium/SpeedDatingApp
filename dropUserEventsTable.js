const sequelize = require('./database');
const UserEvent = require('./models/userEvent');

(async () => {
    try {
        await sequelize.query('DROP TABLE IF EXISTS `UserEvents`');
        console.log('UserEvents table dropped successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error dropping UserEvents table:', error);
        process.exit(1);
    }
})();