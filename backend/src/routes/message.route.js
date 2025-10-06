import express from "express";

const router = express.Router();

router.get('/getMsg', (req, res) => {
    res.send('Get Message Endpoint');
});

export default router;