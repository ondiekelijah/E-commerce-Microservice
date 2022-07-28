const Router = require('express').Router;
const router = new Router();
const Product = require('../models/Product');
const auth = require('../../middleware/auth');

// Create a new product
router.post('/', auth,async (req, res) => {
    const { name, price, description } = req.body;
    // verify if name and price are not empty
    if (!name || !price || !description) {
        return res.status(400).json({
            message: 'Please provide name, price and description'
        });
    }
    const product = await new Product({ ...req.body });
    await product.save();
    return res.status(201).json({
        message: 'Product created successfully',
        product
    });
});

module.exports = router;