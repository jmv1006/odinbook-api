import express from "express";
const router = express.Router();

router.get('/all', (req, res) => {
    res.json("All Posts Here")
})

export default router;