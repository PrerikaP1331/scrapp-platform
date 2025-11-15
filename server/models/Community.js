const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const communitySchema = new Schema({
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['Residential Society / RWA', 'Apartment Complex', 'Neighborhood Association', 'Other'],
        required: true
    },
    householdCount: {
        type: String, // e.g., "101-250"
        required: true
    },
    address: {
        addressLine1: { type: String, required: true },
        addressLine2: { type: String },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        state: { type: String, required: true }
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    pendingRequests: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Community', communitySchema);