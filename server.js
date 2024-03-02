const express = require('express');
const passport = require('passport')
const session = require('express-session')
const SteamStrategy = require('passport-steam');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
// const users = require('./database');
const {csparser} = require('./csparser.js')
const {getSteamId} = require('./getSteamId.js')

const app = express();
const PORT = 8080;
let codes = ['838295', '95973', '615738', '519592', '287358'];

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
    done(null, user);
});
  
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});
  
  // Use the SteamStrategy within Passport.
  //   Strategies in passport require a `validate` function, which accept
  //   credentials (in this case, an OpenID identifier and profile), and invoke a
  //   callback with a user object.
passport.use(new SteamStrategy({
        returnURL: 'http://localhost:8080/auth/steam/return',
        realm: 'http://localhost:8080/',
        apiKey: process.env.STEAM_API_KEY
    },
    function(identifier, profile, done) {
        // asynchronous verification, for effect...
        process.nextTick(function () {
        // To keep the example simple, the user's Steam profile is returned to
        // represent the logged-in user.  In a typical application, you would want
        // to associate the Steam account with a user record in your database,
        // and return that user instead.
            console.log(profile.id)
            profile.identifier = identifier;
            return done(null, profile);
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
  res.render('index', { user: req.user });
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
});


app.get('/account', async (req, res) => {
    //const code = res.locals.cookie.code;
    const code = req.query.code;
    try {
        if (codes.includes(code)) { // code check logic should be here
            // let steamId = await getSteamId()
            // console.log(steamId)
            res.json({ message: 'Access granted'})  
        } else {
            res.json({ error: 'Wrong code' })
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Server error' })
    }
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

app.listen(PORT, () => {
    console.log(`\nServer is running on port ${PORT}`, 
        `\nGo to http://localhost:8080/ in your browser`);
})

function ensureAuthenticated(req, res, next) {
    // let coockieCode = codes.includes(res.locals.cookie.code)
    let code = codes.includes(req.query.code)
    if (req.isAuthenticated() && code) return next();
    res.json({ error: 'ACTIVATE SUBSCRIPTION' });
}
  