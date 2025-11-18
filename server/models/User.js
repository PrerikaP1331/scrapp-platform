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
        type: {
            addressLine1: { type: String, default: '' },
            addressLine2: { type: String, default: '' },
            city: { type: String, default: '' },
            state: { type: String, default: '' },
            postalCode: { type: String, default: '' }
        },
        _id: false,
        default: () => ({
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            postalCode: ''
        })
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