import express from 'express';
import './db/connection.js';
import MongoStore from 'connect-mongo'; // session store for passport
import './bots/bot_admin.js'; // bot admin
import { sendToBotFloat, sendToBotStickers } from './bots/bot_notifier.js'; // bot notifier 
import passport from 'passport';
import session from 'express-session';
import cors from 'cors';
import { join } from 'path';

import Subscriber from './models/subscriber.js';
import User from './models/user.js';

import stickerParser from './utils/stickerParser.js';
import floatParser from './utils/floatParser.js';
import autobuy from './utils/autobuy.js';

import authSteam from './routes/authSteam.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(join(import.meta.dirname, '../public')));
app.set('views', join(import.meta.dirname, '../views'));
app.set('view engine', 'ejs');

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

// read cookie
// app.use((req, res, next) => {
//     const { headers: { cookie } } = req;
//     if (cookie) {
//         const values = cookie.split(';').reduce((res, item) => {
//             const data = item.trim().split('=');
//             return { ...res, [data[0]]: data[1] };
//         }, {});
//         res.locals.cookie = values;
//     }
//     else res.locals.cookie = {};
//     next();
// });

app.use(session({
    secret: 'random apple eater',
    name: 'steam_id',
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_CONNECTION })
}));

app.use(passport.initialize());
app.use(passport.session());

//routes
app.get('/autobuy', async (req, res) => {
    let { cookie } = await User.findById(req.user.id).exec();
    if (cookie) await autobuy(cookie);
    res.send({ status: 'ok' });
});

app.use('/auth', authSteam);

app.get('/', (req, res) => {
    res.redirect('/sticker-parser');
});
app.get('/sticker-parser', (req, res) => {
    res.render('sticker-parser', { user: req.user });
});

app.get('/parse-with-float', (req, res) => {
    res.render('parse-with-float', { user: req.user });
});

app.get('/coming-soon', async (req, res) => {
    res.render('coming-soon');
});

app.post('/cookie', ensureAuthenticated, (req, res) => {
    if (!req.body.cookie) return res.send({ status: 'No cookie provided' })
    User.findByIdAndUpdate(req.user.id, { cookie: req.body.cookie }).exec()
    .then((user) => user? res.send({ status: 'Cookie added' }) : res.send({ status: 'User not found' }))
    .catch(e => {
        console.log(e)
        res.send({ status: 'Server error' })
    })
})

app.get('/allsubs', async (req, res) => {
    if (req.query.token !== 'ht2a33B4EQ4226dpH') {
        res.redirect('/')
        return
    }
    try {
        let subscribers = await Subscriber.find().populate('_id').exec()
        let subs = subscribers.map(sub => {
            return {
                user: {
                    id: sub._id._id,
                    photo: sub._id.photo,
                    name: sub._id.displayName,
                    cookie: sub._id.cookie?.length && true
                },
                expires: getHumanDate(sub.expirationDate),
                createdAt: getHumanDate(sub.createdAt)
            }
        })
        res.send(subs);
    } catch (error) {
        console.log(error)
        res.send({error: 'Server error'})
    }
})

app.get('/logout', function(req, res, next) {
    res.clearCookie('steam')
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

app.post('/sticker-parser', ensureSubscribed, async (req, res) => {
    const { skins, minProfit, stickerOverpay, chatId } = req.body;
    if (!skins.length) return res.send({ error: 'Please, provide items' })
    const data = await stickerParser(skins, minProfit, stickerOverpay, req.user.id);
    res.send(data);
    if (chatId && !data.error) sendToBotStickers(data, chatId);
});

app.post('/float-parser', ensureSubscribed, async (req, res) => {
    const { skins, chatId } = req.body;
    if (!skins.length) return res.send({ error: 'Please, provide items' })
    const data = await floatParser(skins, req.user.id);
    res.send(data);
    if (chatId && !data.error) sendToBotFloat(data, chatId);
});

app.use((err, req, res, next) => {  // error handler
    if (err) {
        console.log(err)
    } else {
        next();
    }
})

async function ensureAuthenticated(req, res, next) {
    // let coockieCode = res.locals.cookie.code
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.send({ error: 'Please, link your Steam account' });
        return
    }
}

async function ensureSubscribed(req, res, next) {
    if (req.isAuthenticated()) {
        let sub = await Subscriber.findById(req.user.id).exec()
            .catch(e => {
                console.log(e);
                return res.send({ error: 'Server error'})
            });
        if (!sub) return res.send({ error: 'Please, get a subscription' });
        return next();
    } else {
        res.send({ error: 'Please, link your Steam account' });
        return
    }
}

function getHumanDate(isoString) {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const pad = num => num.toString().padStart(2, "0");

    return `${year}-${pad(month)}-${pad(day)} at ${pad(hours)}:${pad(minutes)}`;
}

export default app