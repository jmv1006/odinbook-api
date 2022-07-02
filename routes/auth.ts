import express from "express";
import { log_in, sign_up } from '../controllers/auth_controller';
const router = express.Router();

router.post('/log-in',log_in);

router.post('/sign-up', sign_up);

export default router;