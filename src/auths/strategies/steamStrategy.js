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
        process.nextTick(async () => {
            try {
                let user = await User.findByIdAndUpdate(profile.id,
                    {
                        _id: profile.id,
                        photo: profile.photos[1].value,
                        displayName: profile.displayName,
                    },
                    { new: true, upsert: true}
                )
                done(null, user);
            } catch (error) {             
                done(error, null);
            }
        })
    }
)