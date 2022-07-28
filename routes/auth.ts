import express from "express";
import passport from "passport";
import { log_in, sign_up, check_for_token, log_in_facebook_success } from '../controllers/auth_controller';

const router = express.Router();

router.post('/log-in',log_in);

router.post('/sign-up', sign_up);

router.get('/log-in/facebook', passport.authenticate('facebook', {session: false}));

router.get('/log-in/facebook/redirect', passport.authenticate('facebook', {session: false}), log_in_facebook_success);

router.get('/token', passport.authenticate('jwt', {session: false}), check_for_token)


export default router;