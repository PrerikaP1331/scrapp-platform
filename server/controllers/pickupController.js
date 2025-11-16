// /server/controllers/pickupController.js
const Pickup = require('../models/Pickup');
const User = require('../models/User');

exports.createPickup = async (req, res) => {
    // We will add more detailed validation later
    const { wasteTypes, quantity, notes, scheduledDate, timeSlot, address } = req.body;
    
    try {
        // Get the user from the auth middleware
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const newPickup = new Pickup({
            user: req.user.id, // Link the pickup to the logged-in user
            wasteTypes,
            quantity,
            notes,
            scheduledDate,
            timeSlot,
            // Use the address from the request, or default to user's address
            address: address || user.address 
        });

        const pickup = await newPickup.save();

        res.status(201).json(pickup); // 201 status means "Created"

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getMyPickups = async (req, res) => {
    try {
        // Find all pickups where the 'user' field matches the logged-in user's ID
        // Sort by createdAt in descending order (-1) to get newest first
        const pickups = await Pickup.find({ user: req.user.id }).sort({ createdAt: -1 });
        
        res.json(pickups);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
