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
    recyclerProfile: {
        type: Schema.Types.ObjectId,
        ref: 'RecyclerProfile'
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
        enum: ['pending', 'scheduled', 'upcoming', 'in-transit', 'completed', 'cancelled'],
        default: 'pending'
    },
    wasteTypes: [{
        type: String,
        required: true
    }],
    quantity: {
        type: String,
        enum: ['1-2 Small Bags', 'A Medium Box', 'Multiple Large Bags', 'Bulky Items'],
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
        state: { type: String, required: true },
        coordinates: {
            latitude: { type: Number },
            longitude: { type: Number }
        }
    },
    scheduledDate: {
        type: Date,
        required: true
    },
    timeSlot: {
        type: String,
        required: true
    },
    estimatedWeight: {
        type: Number // in kg
    },
    rating: {
        score: { type: Number, min: 1, max: 5 },
        review: { type: String },
        ratedAt: { type: Date }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Pickup', pickupSchema);