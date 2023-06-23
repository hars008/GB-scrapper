const express = require('express');
const router = express.Router();
const UserToken = require('../models/UserToken');
const mongoose = require('mongoose');
const verifyToken = require('../middleware/jwtAuth');
const parser = require('ua-parser-js');
mongoose.connect(process.env.MONGO_URL);


router.get('/all-sessions/:userId', verifyToken, async (req, res) => {
    const { userId } = req.params;
    const userAgent = req.headers['user-agent'];
    const ua = parser(userAgent);
    // console.log(ua);
    try {
        const sessionsDoc = await UserToken.find({ userId });
        return res.status(200).json({ sessionsDoc });
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error' });
    }
    }
);

router.delete('/terminate-session/:sessionId', async (req, res) => {

    const { sessionId } = req.params;
    try {
        const sessionDoc = await UserToken.findByIdAndDelete(sessionId);
        return res.status(200).json({ sessionDoc });
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error' });
    }
    }
);

module.exports = router;