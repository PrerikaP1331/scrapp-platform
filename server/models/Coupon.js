// /server/models/Coupon.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const couponSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    code: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    discountValue: {
        type: Number, // in percentage or rupees
        required: true
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'],
        default: 'percentage'
    },
    status: {
        type: String,
        enum: ['available', 'used', 'expired'],
        default: 'available'
    },
    expiryDate: {
        type: Date,
        required: true
    },
    usedAt: {
        type: Date
    },
    usedOnPickupId: {
        type: Schema.Types.ObjectId,
        ref: 'Pickup'
    },
    source: {
        type: String,
        enum: ['pickup', 'referral', 'achievement', 'promotion'],
        default: 'pickup'
    },
    sourcePickupId: {
        type: Schema.Types.ObjectId,
        ref: 'Pickup'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Coupon', couponSchema);
