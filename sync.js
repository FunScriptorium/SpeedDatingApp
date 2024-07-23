// sync.js
const sequelize = require('./database');
const { User, Event, UserEvent } = require('./models');

async function syncDatabase() {
    try {
        // Disable foreign key checks
        await sequelize.query('PRAGMA foreign_keys = OFF');

        // Drop all tables
        await sequelize.query('DROP TABLE IF EXISTS UserEvents');
        await sequelize.query('DROP TABLE IF EXISTS Events');
        await sequelize.query('DROP TABLE IF EXISTS Users');

        // Create Users table
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS Users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                createdAt DATETIME NOT NULL,
                updatedAt DATETIME NOT NULL
            )
        `);

        // Create Events table
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS Events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date DATETIME NOT NULL,
                maxParticipants INTEGER NOT NULL,
                minAge INTEGER NOT NULL,
                maxAge INTEGER NOT NULL,
                address VARCHAR(255),
                startTime TIME NOT NULL,
                endTime TIME NOT NULL,
                createdAt DATETIME NOT NULL,
                updatedAt DATETIME NOT NULL
            )
        `);

        // Create UserEvents table
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS UserEvents (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                UserId INTEGER NOT NULL,
                EventId INTEGER NOT NULL,
                choice VARCHAR(255),
                createdAt DATETIME NOT NULL,
                updatedAt DATETIME NOT NULL,
                FOREIGN KEY (UserId) REFERENCES Users (id),
                FOREIGN KEY (EventId) REFERENCES Events (id)
            )
        `);

        // Re-enable foreign key checks
        await sequelize.query('PRAGMA foreign_keys = ON');

        console.log('Database & tables updated!');
    } catch (error) {
        console.error('Error updating database:', error);
    } finally {
        await sequelize.close();
    }
}

syncDatabase();