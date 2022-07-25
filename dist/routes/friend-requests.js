"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const friend_request_controller_1 = require("../controllers/friend-request-controller");
router.get('/all', friend_request_controller_1.get_all_requests);
router.get('/:UserId', friend_request_controller_1.get_all_user_requests);
router.get('/recieved/:UserId', friend_request_controller_1.get_user_recieved_requests);
router.get('/sent/:UserId', friend_request_controller_1.get_user_sent_requests);
router.get('/:From_Id/:To_Id', friend_request_controller_1.check_request_exists);
router.post('/:From_Id/:To_Id', friend_request_controller_1.create_request);
router.delete('/:RequestId', friend_request_controller_1.delete_request);
exports.default = router;
