import express from 'express';
import { createServer } from 'node:http';
import session from 'express-session';
import type { MySQLStore } from 'express-mysql-session'
import apiRoute from './api';

const app = express();
const httpServer = createServer(app);
app.use(express.json());


export const startHttpServer = (port: number, sessionStore: MySQLStore, sessionSecret: string) => {
	const sessionMiddleware = session({
		secret: sessionSecret,
		store: sessionStore,
		resave: true,
		saveUninitialized: true
	});

	app.use(sessionMiddleware);

	app.use('/api', apiRoute);

	// On dev server the frontend is served by Vite. A proxy forwards socket.io requests to the backend.
	// On production server the frontend is built to "webdist" folder and served by the backend.
	app.get('/', (req, res) => {
		res.sendFile('index.html', { root: 'webdist' });
	});
	app.get('/*.html', (req, res) => {
		const filePath = req.path.substring(1);
		res.sendFile(filePath, { root: 'webdist' }, (err) => {
			if (err) {
				res.status(404).send('File not found');
			}
		});
	});
	app.use(express.static('webdist'));

	return new Promise<void>((resolve, reject) => {
		let listenStarted = false;
		httpServer.listen(port, () => {
			listenStarted = true;
			resolve();
		});
		httpServer.on('error', err => {
			if (!listenStarted) {
				reject(err);
				return;
			}
			console.error('http server error', err);
		});
	});
};
