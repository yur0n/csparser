import express from 'express';
import './db/connection.js';
import MongoStore from 'connect-mongo'; // session store for passport
import './bots/bot_admin.js'; // bot admin
import passport from 'passport';
import session from 'express-session';
import cors from 'cors';
import { join } from 'path';

import Subscriber from './models/subscriber.js';

import csparser from './utils/csparser.js';
import authSteam from './routes/authSteam.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(join(import.meta.dirname, '../public')));
app.set('views', join(import.meta.dirname, '../views'));
app.set('view engine', 'ejs');

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});
// read cookie
app.use((req, res, next) => {
    const { headers: { cookie } } = req;
    if (cookie) {
        const values = cookie.split(';').reduce((res, item) => {
            const data = item.trim().split('=');
            return { ...res, [data[0]]: data[1] };
        }, {});
        res.locals.cookie = values;
    }
    else res.locals.cookie = {};
    next();
});

app.use(session({
    secret: 'random apple eater',
    name: 'steam_id',
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_CONNECTION })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth/steam', authSteam);


app.get('/', (req, res) => {
    res.render('index', { user: req.user, message: req.query.message });
});

app.get('/coming-soon', (req, res) => {
    res.render('coming-soon');
});

app.get('/allsubs', async (req, res) => {
    if (req.query.token !== 'ht2a33B4EQ4226dpH') {
        res.redirect('/')
        return
    }
    let subs = await Subscriber.find().exec().catch(console.log);
    subs = subs.map(sub => {
        return {
            steamID: sub.id,
            expires: getHumanDate(sub.expirationDate),
            createdAt: getHumanDate(sub.createdAt)
        }
    })
    res.send(subs);
})

app.get('/logout', function(req, res, next) {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

app.get('/min-price', ensureAuthenticated, async (req, res) => {
    const { goodsId, minProfit, stickerOverpay } = req.query;
    if (!goodsId) return res.status(500).json({ error: 'Please, provide goods ID' })
    const data = await csparser(goodsId, minProfit, stickerOverpay);
    if (data) {
        res.json({ data });
    } else {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.use((err, req, res, next) => {  /// error handler (handles only passport issues)
    if (err) {
        console.log(err)
    } else {
        next();
    }
})

async function ensureAuthenticated(req, res, next) {
    // let coockieCode = res.locals.cookie.code
    if (req.isAuthenticated()) {
        let sub = await Subscriber.findOne({ id: req.user.id }).exec()
            .catch(e => {
                console.log(e);
                return res.json({ error: 'Server error'})
            });
        if (!sub) return res.json({ error: 'Please, get a subscription' });
        return next();
    } else {
        res.json({ error: 'Please, link your Steam account' });
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