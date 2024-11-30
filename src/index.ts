import dotenv from 'dotenv';
import { connectToDB, initializeSessionStore } from './dbConnection';
import { startHttpServer } from './server';

dotenv.config();

// -------- parse environment variables --------
const port = parseInt(process.env.PORT || '3000', 10);
if (isNaN(port)) {
	throw new Error('PORT environment variable is not a valid number');
}
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
	throw new Error('DATABASE_URL environment variable is not set');
}
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
	throw new Error('SESSION_SECRET environment variable is not set');
}

// -------- start the application --------
const start = async () => {
	await connectToDB(dbUrl)
	console.log('connected to db');

	const sessionStore = await initializeSessionStore()
	console.log('session store initialized');

	await startHttpServer(port, sessionStore, sessionSecret)
	console.log(`backend http server is running at: http://localhost:${port}`);
};

start()
	.then(() => {
		console.log('application started');
	})
	.catch(err => {
		console.error('error starting application', err);
	});
