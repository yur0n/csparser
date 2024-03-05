import { Router } from 'express'
import passport from '../auths/passport.js'

const router = Router()

router.get('/',
    passport.authenticate('steam', { failureRedirect: '/' }),
    (req, res) => res.redirect('/')
);

router.get('/return',
    passport.authenticate('steam', { failureRedirect: '/' }),
    (req, res) => res.redirect('/')
);

export default router