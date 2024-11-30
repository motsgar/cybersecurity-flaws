import MySQLStore from 'express-mysql-session';
import * as session from 'express-session';
import mysql, { Connection } from 'mysql2/promise';
import assert from 'assert';

const MySQLStoreClass = MySQLStore(session);

let connection: Connection | null = null;
let sessionStore: MySQLStore.MySQLStore | null = null;

export const connectToDB = async (dbUrl: string) => {
	if (!dbUrl) {
		throw new Error('DATABASE_URL environment variable is not set');
	}

	connection = await mysql.createConnection(dbUrl);
};

export const initializeSessionStore = async () => {
	if (!connection) {
		throw new Error('Call connectToDB first');
	}

	return new Promise<MySQLStore.MySQLStore>((resolve, reject) => {
		// the types are messed up as ts requires a non promise mysql connection
		// but this is fine according to docs
		sessionStore = new MySQLStoreClass({
			createDatabaseTable: true,
		}, connection as any);

		sessionStore
			.onReady()
			.then(() => {
				assert(sessionStore !== null);
				resolve(sessionStore);
			})
			.catch(err => {
				reject(err);
			});
	});
};

export const getDbConnection = () => {
	if (!connection) {
		throw new Error('Call connectToDB first');
	}

	return connection;
}