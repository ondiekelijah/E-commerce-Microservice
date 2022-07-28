const Router = require('express').Router;
const router = new Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const config = require('../config');


router.post('/register', (req, res) => {
    const { username, password, email } = req.body;
    // verify if username and password are not empty
    if (!username || !password || !email) {
        return res.status(400).json({
            message: 'Please provide username, password and email'
        });
    }
    // verify if username is not taken
    User.findOne({ username }, (err, user) => {
        if (user) {
            return res.status(400).json({
                message: 'Username is already taken'
            });
        }
    })
    // verify if email is not taken
    User.findOne({ email }, (err, user) => {
        if (user) {
            return res.status(400).json({
                message: 'Email is already taken'
            });
        }
    })
    // hash password
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({
                message: 'Error hashing password'
            });
        }
    });
    // create user
    const user = new User({ username, password, email });
    user.save()
        .then(() => res.json({ message: 'User created!' }))
        .catch(err => res.status(400).json({ error: 'Error: ' + err }));

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
    await User.findOne({ username }, (err, user) => {
        if (err) {
            return res.status(500).json({
                message: 'Error finding user'
            });
        }
        if (!user) {
            return res.status(400).json({
                message: 'User not found'
            });
        }
        // compare password
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error verfying password'
                });
            }
            if (!result) {
                return res.status(400).json({
                    message: 'Incorrect password'
                });
            }
            // create token
            const token = jwt.sign({ username: user.username }, 'secret', { expiresIn: '1h' });
            res.json({
                message: 'User logged in',
                token: token,
                username: user.username
            });
        });
    });
});