const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const mongoose = require('mongoose');
const productRouter = require('./routes/product');
const amqp = require('amqplib');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/products', productRouter);


mongoose.connect(
    'mongodb://0.0.0.0:27017/product-service',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
)
    .then(() => console.log('Product-Service Connected to MongoDB'))
    .catch(e => console.log(e));


// RabbitMQ connection
async function connectToRabbitMQ() {
    const amqpServer = 'amqp://guest:guest@localhost:5672';
    const connection = await amqp.connect(amqpServer);
    const channel = await connection.createChannel();
    await channel.assertQueue('product-service-queue');

}
connectToRabbitMQ();


app.listen(PORT, () => {
    console.log(`Product-Service listening on port ${PORT}`);
}
);

