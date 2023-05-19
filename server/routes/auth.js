const express = require("express");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const authRouter = express.Router();

// send user data
authRouter.post('/api/signup', async (req, res) => {
    try {
        const { name, email, profilePic} = req.body;
        let user = await User.findOne({ email: email });
        if(!user) {
            user = new User({
                email,
                profilePic,
                name
            });
            user = await user.save();
        }

        const token = jwt.sign({ id: user._id }, "passwordKey");

        res.status(200).json({ user, token });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// get user data
authRouter.get('/', auth, async (req, res) => {
    const user = await User.findById(req.user);
    res.json({user, token: req.token});
});

module.exports = authRouter;