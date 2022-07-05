import express from "express";
import passport from "passport";
import { log_in, sign_up, log_in_facebook, check_for_token } from '../controllers/auth_controller';

const router = express.Router();

router.post('/log-in',log_in);

//TO-DO: If there is a file, DO IT. If not, carry on
router.post('/sign-up', sign_up);

router.get('/log-in/facebook', log_in_facebook);

router.get('/token', passport.authenticate('jwt'), check_for_token)

export default router;