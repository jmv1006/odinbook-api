import express from "express";
import { log_in, sign_up, log_in_facebook } from '../controllers/auth_controller';
const router = express.Router();

router.post('/log-in',log_in);

router.post('/sign-up', sign_up);

router.get('/log-in/facebook', log_in_facebook);

export default router;