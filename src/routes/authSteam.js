import { Router } from 'express'
import passport from '../auths/passport.js'

const router = Router()
const router2 = Router()



router.get('/:provider', (req, res, next) => passport.authenticate(req.params.provider, { failureRedirect: '/' })(req, res, next),
    (req, res) => {
        return res.redirect('/')
    }
);

router.get('/:provider/return', (req, res, next) => passport.authenticate(req.params.provider, { failureRedirect: '/' })(req, res, next),
    (req, res) => {
        res.cookie(req.params.provider, true)
        return res.redirect('/')
    }
);

export default router 