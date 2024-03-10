import { Router } from 'express'
import passport from '../auths/passport.js'

const router = Router()

router.get('/', passport.authenticate('steam', { failureRedirect: '/' }),
    (req, res) => {
        return res.redirect('/')
    }
);

router.get('/return', passport.authenticate('steam', { failureRedirect: '/' }),
    (req, res) => {
        res.cookie('loggedin', '1')
        return res.redirect('/')
    }
);

export default router   