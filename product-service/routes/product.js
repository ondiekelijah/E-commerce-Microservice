const Router = require("express").Router;
const router = new Router();
const Product = require("../models/Product");
const auth = require("../../middleware/auth");
const amqp = require("amqplib");

var order, channel, connection;

// RabbitMQ connection
async function connectToRabbitMQ() {
  const amqpServer = "amqp://guest:guest@localhost:5672";
  connection = await amqp.connect(amqpServer);
  channel = await connection.createChannel();
  await channel.assertQueue("product-service-queue");
}
connectToRabbitMQ();

// Create a new product
router.post("/", auth, async (req, res) => {
  const { name, price, description } = req.body;
  // verify if name and price are not empty
  if (!name || !price || !description) {
    return res.status(400).json({
      message: "Please provide name, price and description",
    });
  }
  const product = await new Product({ ...req.body });
  await product.save();
  return res.status(201).json({
    message: "Product created successfully",
    product,
  });
});

// Buy a product
router.post("/buy", auth, async (req, res) => {
  const { productIds } = req.body;
  // Get products from database with the given ids
  const products = await Product.find({ _id: { $in: productIds } });

  // Send to RabbitMQ
  channel.sendToQueue(
    "order-service-queue",
    Buffer.from(
      JSON.stringify({
        products,
        userEmail: req.user.email,
      })
    )
  );

  // Consume from RabbitMQ
  channel.consume("product-service-queue", (data) => {
    console.log("Consumed from product-service-queue");
    order = JSON.parse(data.content);
    channel.ack(data);
  });
  return res.status(201).json({
    message: "Order placed successfully",
    order,
  });


});

module.exports = router;
