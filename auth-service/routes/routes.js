const Router = require('express').Router;
const router = new Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const config = require('../config');


router.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
    // verify if username and password are not empty
    if (!username || !password || !email) {
        return res.status(400).json({
            message: 'Please provide username, password and email'
        });
    }
    const user = await User.findOne({ username });
        
    if (user)
        return res
            .status(400)
            .json({ error: true, message: "User already exists" });

    const salt = await bcrypt.genSalt(Number(10));
    const hashedPassword = await bcrypt.hash(password, salt);
    await new User({ ...req.body, password: hashedPassword }).save();

    return res
        .status(201)
        .json({ error: false, message: "User created successfully" });

});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    // verify if username and password are not empty
    if (!username || !password) {
        return res.status(400).json({
            message: 'Please provide username and password'
        });
    }
    // find user by username
    // verify if user exists
    const user = await User.findOne({ username });
    if (!user)
        return res
            .status(400)
            .json({ error: true, message: "User does not exist" });
    const isValidPassword = await bcrypt.compare(
        req.body.password,
        user.password
    );
    if (!isValidPassword)
        return res
            .status(400)
            .json({ error: true, message: "Invalid password" });
    // create token
    const token = jwt.sign({ username: user.username }, 'secret', { expiresIn: '1h' });
    res.json({
        message: 'User logged in',
        token: token,
        username: user.username
    });
});

module.exports = router;