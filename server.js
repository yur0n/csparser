const express = require('express');
require('./db/connection.js')
require('./bot_admin.js')
const passport = require('passport')
const session = require('express-session')
const SteamStrategy = require('passport-steam');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const {Subscriber} = require('./models/subscriber.js')
const {User} = require('./models/user.js')
const {csparser} = require('./csparser.js')
const {getSteamId} = require('./getSteamId.js');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');
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


passport.serializeUser(function(user, done) {
    process.nextTick(() => {
        done(null, { 
            id: user.id, 
            photo: user.photo, 
            displayName: user.displayName
         });
    })
});
  
passport.deserializeUser(function(userObj, done) {
    process.nextTick(() => {
        done(null, userObj);
    })
});

passport.use(new SteamStrategy({
        returnURL: process.env.HOST? process.env.HOST + ':' + PORT + '/auth/steam/return' : 'http://localhost:8080/auth/steam/return',
        realm: process.env.HOST? process.env.HOST + ':' + PORT : 'http://localhost:8080/',
        apiKey: process.env.STEAM_API_KEY
    },
    function(identifier, profile, done) {
        console.log(profile)
        profile.identifier = identifier;
        process.nextTick(function () {
            Subscriber.findOne({ id: profile.id }).then((subscriber) => {
                if (!subscriber) throw Error('Please, get a subscription first')
                User.findOne({ id: subscriber.id }).then(user => {
                    if (!user) {
                        let newUser = new User({
                            id: profile.id,
                            photo: profile.photos[1].value,
                            displayName: profile.displayName,
                        })
                        newUser.save().then(savedUser => {
                            done(null, savedUser);
                        })
                        return
                    }
                    done(null, user);
                })
            }).catch(err => {
                done(err, null);
            })
        });
    }
));

app.use(session({
    secret: 'random apple eater',
    name: 'steam_id',
    resave: true,
    saveUninitialized: true
}));

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());


app.use(express.static(__dirname + '/../../public'));



app.get('/', function(req, res){
    res.render('index', { user: req.user, message: req.query.message });
});

// app.get('/account', ensureAuthenticated, function(req, res){
//   res.render('account', { user: req.user });
// });

app.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
});

// GET /auth/steam
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Steam authentication will involve redirecting
//   the user to steamcommunity.com.  After authenticating, Steam will redirect the
//   user back to this application at /auth/steam/return
app.get('/auth/steam',
  passport.authenticate('steam', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
});

// GET /auth/steam/return
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/steam/return',
    passport.authenticate('steam', { failureRedirect: '/' }),
    function(req, res) {
        res.redirect('/');
    }
);


app.get('/account', async (req, res) => {
    res.json({ allow: req.user?.id })

    // try {
    //     res.json({ message: 'Access granted'})
    // } catch (e) {
    //     console.log(e)
    //     res.status(500).json({ error: 'Server error' })
    // }
})

app.get('/min-price', ensureAuthenticated, async (req, res) => {
    const {goodsId, minProfit, stickerOverpay } = req.query;
    if (!goodsId) return res.status(500).json({ error: 'Please, provide goods ID' })
    const data = await csparser(goodsId, minProfit, stickerOverpay);
    if (data) {
        res.json({ data });
    } else {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.use(function(err, req, res, next) {  /// error handler (handles only passport issues)
    if (err) {
        if (err.message == 'Please, get a subscription first') {
            req.logout(() => res.redirect(`/?message=${err.message}`));
            return
        }
        console.log(err)
    } else {
        next();
    }
})

app.listen(PORT, () => {
    console.log(`\nServer is running on port ${PORT}`, 
        `\nGo to http://localhost:8080/ in your browser`);
})

function ensureAuthenticated(req, res, next) {
    // let coockieCode = res.locals.cookie.code
    if (req.isAuthenticated()) return next();
    res.json({ error: 'ACTIVATE SUBSCRIPTION' });
    return
}
  