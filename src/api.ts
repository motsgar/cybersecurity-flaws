import { RequestHandler, Router } from "express";
import { createMessage, createUser, getMessages, verifyUser } from "./db";

export const loginRequired: RequestHandler = (req, res, next) => {
    if (!req.session.user) {
        res.status(401).send('Unauthorized');
    } else {
        next();
    }
}

const router = Router();

router.post('/login', async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    const userId = await verifyUser(username, password);

    if (!userId) {
        res.status(401).send('Wrong username or password');
        return;
    }

    req.session.regenerate((err) => {
        if (err) next(err)

        req.session.user = { username, userId };

        // save the session before redirection to ensure page
        // load does not happen before session is saved
        req.session.save((err) => {
            if (err) return next(err)
            res.redirect('/')
        })
    })
});

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) throw err;
        res.send('Logged out');
    });
});

router.post('/register', async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    const userId = await createUser(username, password);
    if (userId === null) {
        res.status(401).send('Username already taken');
        return;
    }
    if (userId.success === false) {
        res.status(401).send('password already taken by ' + userId.username);
        return;
    };
    req.session.regenerate((err) => {
        if (err) next(err)

        req.session.user = { username, userId: userId.userId };

        // save the session before redirection to ensure page
        // load does not happen before session is saved
        req.session.save((err) => {
            if (err) return next(err)
            res.redirect('/')
        })
    })
});

router.get('/messages', loginRequired, async (req, res) => {
    if (!req.session.user) throw new Error('User not logged in somehow');

    const messages = await getMessages();
    res.json(messages);
});

router.post('/messages', loginRequired, (req, res) => {
    if (!req.session.user) throw new Error('User not logged in somehow');

    const message = req.body.message;
    const userId = req.session.user.userId;

    createMessage(message, userId);
    res.status(201).send('Message sent');
});

router.get('/isLogged', (req, res) => {
    if (req.session.user) {
        res.status(200).send('Logged in');
    } else {
        res.status(401).send('Not logged in');
    }
});

export default router;

function assert(user: { username: string; userId: number; } | undefined, arg1: string) {
    throw new Error("Function not implemented.");
}
