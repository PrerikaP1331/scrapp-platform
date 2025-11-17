const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['individual', 'community_admin', 'org_admin', 'recycler'],
        default: 'individual'
    },
    address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        postalCode: { type: String }
    },
    notifications: {
        pickupReminders: { email: { type: Boolean, default: true }, push: { type: Boolean, default: false } },
        communityUpdates: { email: { type: Boolean, default: true }, push: { type: Boolean, default: true } },
        rewardsPromos: { email: { type: Boolean, default: true }, push: { type: Boolean, default: false } }
    }
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps
});

module.exports = mongoose.model('User', userSchema);