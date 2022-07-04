import express from "express";
const router = express.Router();
import {get_all_requests, create_request, delete_request} from '../controllers/friend-request-controller';

router.get('/all', get_all_requests);

router.post('/:User1Id/:User2Id', create_request)

router.delete('/:RequestId', delete_request)

export default router;