import express from "express";
const router = express.Router();
import {get_all_requests, create_request, delete_request, check_request_exists} from '../controllers/friend-request-controller';

router.get('/all', get_all_requests);

router.get('/:From_Id/:To_Id', check_request_exists);

router.post('/:From_Id/:To_Id', create_request)

router.delete('/:RequestId', delete_request)

export default router;