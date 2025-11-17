const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const driveSchema = new Schema({
    community: {
        type: Schema.Types.ObjectId,
        ref: 'Community',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    coverPhoto: {
        type: String, // URL to image
        default: null
    },
    date: {
        type: Date,
        required: true
    },
    location: {
        venue: { type: String, required: true }, // e.g., "Community Clubhouse Parking Lot"
        address: {
            addressLine1: { type: String },
            addressLine2: { type: String },
            city: { type: String },
            postalCode: { type: String },
            state: { type: String },
            coordinates: {
                latitude: { type: Number },
                longitude: { type: Number }
            }
        }
    },
    acceptedWasteTypes: [{
        type: String,
        required: true
    }],
    visibility: {
        type: String,
        enum: ['public', 'private'],
        default: 'private'
    },
    status: {
        type: String,
        enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
        default: 'upcoming'
    },
    organizer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    stats: {
        totalWeightCollected: {
            type: Number,
            default: 0, // in kg
            description: 'Total waste collected during the drive'
        },
        participatingHouseholds: {
            type: Number,
            default: 0
        },
        itemBreakdown: [{
            wasteType: { type: String },
            quantityKg: { type: Number },
            count: { type: Number } // number of items
        }],
        co2Saved: {
            type: Number,
            default: 0, // in kg
            description: 'Calculated from weight diverted'
        },
        mostCommonItem: {
            type: String
        }
    },
    notes: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Drive', driveSchema);
