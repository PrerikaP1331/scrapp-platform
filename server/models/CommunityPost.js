// /server/models/CommunityPost.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const communityPostSchema = new Schema({
    community: {
        type: Schema.Types.ObjectId,
        ref: 'Community',
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['giveaway', 'request', 'announcement', 'discussion', 'drive'],
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
    itemDetails: {
        condition: { type: String, enum: ['Like New', 'Good', 'Fair', 'Used'] },
        category: { type: String },
        images: [{ type: String }] // URLs to item images
    },
    status: {
        type: String,
        enum: ['active', 'claimed', 'completed', 'archived'],
        default: 'active'
    },
    claimedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    claimedAt: {
        type: Date
    },
    comments: [{
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }],
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    isPinned: {
        type: Boolean,
        default: false
    },
    scheduledDate: {
        type: Date,
        description: 'For drive posts, the date the drive is scheduled'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('CommunityPost', communityPostSchema);
