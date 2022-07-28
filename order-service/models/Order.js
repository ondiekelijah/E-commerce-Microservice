const mongoose = require('mongoose');
const Schema = mongoose.Schema

const OrderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }],
    total: {
        type: Number,
        required: true
    }
}

    , { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);