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
    businessAddress: {
        addressLine1: { type: String, required: true },
        addressLine2: { type: String },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        state: { type: String, required: true }
    },
    serviceAreas: [{
        type: String,
        required: true,
        trim: true
    }],
    acceptedWasteTypes: [{
        type: String,
        required: true
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('RecyclerProfile', recyclerProfileSchema);