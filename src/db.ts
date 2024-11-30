import { getDbConnection } from "./dbConnection";

export const verifyUser = async (username: string, password: string) => {
    const db = getDbConnection();
    const [users] = await db.query(`SELECT * FROM users WHERE username = '` + username + `' AND password = '` + password + `'`) as any;
    if (users.length === 0) {
        return null;
    }
    const userId = users[0].id;
    return userId;
}

// This would be better to catch the error thrown by the db.query function,
// and check if it is duplicate entry error, but db errors are a pain to work with
export const createUser = async (username: string, password: string) => {
    const db = getDbConnection();
    await db.beginTransaction();
    try {
        const [usersWithPassword] = await db.query(`SELECT * FROM users WHERE password = '` + password + `'`) as any;
        if (usersWithPassword.length > 0) {
            await db.rollback();
            return { success: false, userId: usersWithPassword[0].id, username: usersWithPassword[0].username };
        }
        const [existingUsers] = await db.query(`SELECT * FROM users WHERE username = '` + username + `'`) as any;
        if (existingUsers.length > 0) {
            await db.rollback();
            return null;
        }
        const [queryResult] = await db.query(`INSERT INTO users (username, password) VALUES ('` + username + `', '` + password + `')`) as any;
        const userId: number = queryResult.insertId;
        await db.commit();
        return { success: true, userId };
    } catch (error) {
        await db.rollback();
        return null;
    }
}

export const getMessages = async () => {
    const db = getDbConnection();
    const [messages] = await db.query(`
        SELECT messages.*, users.* 
        FROM messages 
        JOIN users ON messages.user_id = users.id
    `) as any;
    return messages;
}

export const createMessage = async (message: string, userId: number) => {
    const db = getDbConnection();
    await db.query(`INSERT INTO messages (message, user_id) VALUES ('` + message + `', ` + userId + `)`);
}