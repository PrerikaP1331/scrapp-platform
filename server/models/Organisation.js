const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const organizationSchema = new Schema({
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
        enum: ['Corporate Office', 'Retail Store / Business', 'School / University', 'Restaurant / Hotel', 'Factory / Industrial Unit', 'Non-Profit / NGO', 'Other'],
        required: true
    },
    employeeCount: {
        type: String, // e.g., "101-500"
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
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Organization', organizationSchema);