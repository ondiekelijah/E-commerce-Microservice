const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');
const authRouter = require('./routes/routes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/auth', authRouter);

mongoose.connect('mongodb://localhost/auth-service', { 
    useNewUrlParser: true ,
    useUnifiedTopology: true,
    }, () => {
        console.log('Auth-Service Connected to MongoDB');
    });

app.listen(PORT, () => {
    console.log(`Auth-Service listening on port ${PORT}`);
    }
);