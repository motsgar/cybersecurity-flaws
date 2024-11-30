import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const schema = `
    DROP TABLE IF EXISTS messages;
    DROP TABLE IF EXISTS users;
    CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL UNIQUE
    );
    CREATE TABLE messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    );
`;

const main = async () => {
	const connection = await mysql.createConnection({ uri: process.env.DATABASE_URL, multipleStatements: true });
	await connection.query(schema);
	console.log('Database initialized');
	connection.end();
};

main().catch(err => {
	console.error(err);
	process.exit(1);
});
