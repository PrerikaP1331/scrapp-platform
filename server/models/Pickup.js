const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pickupSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recycler: {
        type: Schema.Types.ObjectId,
        ref: 'User' // Recyclers are also users
    },
    community: {
        type: Schema.Types.ObjectId,
        ref: 'Community'
    },
    organization: {
        type: Schema.Types.ObjectId,
        ref: 'Organization'
    },
    status: {
        type: String,
        enum: ['pending', 'upcoming', 'completed', 'cancelled'],
        default: 'pending'
    },
    wasteTypes: [{
        type: String,
        required: true
    }],
    quantity: {
        type: String,
        required: true
    },
    notes: {
        type: String,
        trim: true
    },
    address: { // Storing a copy in case the user's default address changes
        addressLine1: { type: String, required: true },
        addressLine2: { type: String },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        state: { type: String, required: true }
    },
    scheduledDate: {
        type: Date,
        required: true
    },
    timeSlot: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Pickup', pickupSchema);