import passport from "passport"
import steamStrategy from './strategies/steamStrategy.js'

passport.serializeUser((user, done) => {
    process.nextTick(() => {
        done(null, { 
            id: user._id, 
            photo: user.photo, 
            displayName: user.displayName
        });
    })
});
  
passport.deserializeUser((userObj, done) => {
    process.nextTick(() => {
        done(null, userObj);
    })
});

passport.use(steamStrategy)

export default passport