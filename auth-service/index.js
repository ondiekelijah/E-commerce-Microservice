const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');
const authRouter = require('./routes/auth');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/auth', authRouter);



mongoose.connect(
    'mongodb://0.0.0.0:27017/auth-service',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
)
    .then(() => console.log('Auth-Service Connected to MongoDB'))
    .catch(e => console.log(e));


app.listen(PORT, () => {
    console.log(`Auth-Service listening on port ${PORT}`);
}
);

