const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recyclerProfileSchema = new Schema({
    user: { // This links the profile to a user with the 'recycler' role
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    businessName: {
        type: String,
        required: true,
        trim: true
    },
    businessPhone: {
        type: String,
        trim: true
    },
    businessEmail: {
        type: String,
        trim: true
    },
    businessLogo: {
        type: String, // URL to logo image
        trim: true
    },
    tagline: {
        type: String,
        maxlength: 50,
        trim: true
    },
    description: {
        type: String,
        maxlength: 300,
        trim: true
    },
    businessAddress: {
        addressLine1: { type: String, required: true },
        addressLine2: { type: String },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        state: { type: String, required: true },
        coordinates: {
            latitude: { type: Number, required: true },
            longitude: { type: Number, required: true }
        }
    },
    serviceAreas: [{
        type: String,
        required: true,
        trim: true
    }],
    acceptedWasteTypes: [{
        type: String,
        required: true
    }],
    clientTypes: [{
        type: String,
        enum: ['individual', 'community', 'organization'],
        trim: true
    }],
    specialties: [{
        type: String, // e.g., "E-Waste Specialist", "Fastest Pickup", "Eco-Certified"
        trim: true
    }],
    availability: {
        operatingDays: [{
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        }],
        timeSlots: [
            {
                start: { type: String, required: true }, // e.g., "09:00"
                end: { type: String, required: true } // e.g., "12:00"
            }
        ]
    },
    rating: {
        averageScore: { type: Number, min: 0, max: 5, default: 0 },
        totalReviews: { type: Number, default: 0 }
    },
    maxPickupsPerDay: {
        type: Number,
        default: 10
    },
    currentPickupsToday: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('RecyclerProfile', recyclerProfileSchema);