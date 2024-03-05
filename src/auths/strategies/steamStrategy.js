import SteamStrategy from 'passport-steam';
import User from '../../models/user.js';

const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || 'http://localhost';

const steamStrategyOptions = {
    returnURL: HOST + ':' + PORT + '/auth/steam/return',
    realm: HOST + ':' + PORT,
    apiKey: process.env.STEAM_API_KEY
}

export default new SteamStrategy(steamStrategyOptions,
    function(identifier, profile, done) {
        profile.identifier = identifier;
        process.nextTick(function () {
            User.findOne({ id: profile.id })
            .then(user => {
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
            .catch(err => done(err, null));
        })
    }
)