// /server/controllers/pickupController.js
const Pickup = require('../models/Pickup');
const User = require('../models/User');
const RecyclerProfile = require('../models/RecyclerProfile');

// Helper function to get day name from date
const getDayName = (date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
};

// Helper function to check if recycler serves the user's address
const checkServiceArea = (userCity, recyclerServiceAreas) => {
    return recyclerServiceAreas.some(area => 
        area.toLowerCase() === userCity.toLowerCase()
    );
};

// Create a new pickup request
exports.createPickup = async (req, res) => {
    try {
        const { wasteTypes, scheduledDate, additionalNotes } = req.body;

        if (!wasteTypes || !scheduledDate) {
            return res.status(400).json({ msg: 'wasteTypes and scheduledDate are required' });
        }

        const newPickup = new Pickup({
            user: req.user.id,
            wasteTypes,
            scheduledDate,
            additionalNotes: additionalNotes || '',
            status: 'pending'
        });

        await newPickup.save();
        res.status(201).json(newPickup);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get all pickups for the logged-in user
exports.getMyPickups = async (req, res) => {
    try {
        const pickups = await Pickup.find({ user: req.user.id })
            .populate('recycler', 'name phone email')
            .populate('recyclerProfile', 'businessName rating')
            .sort({ createdAt: -1 });
        
        res.json(pickups);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get available recyclers for a specific date, time slot, and waste types
exports.getAvailableRecyclers = async (req, res) => {
    try {
        const { scheduledDate, timeSlot, wasteTypes, userCity } = req.body;

        if (!scheduledDate || !timeSlot || !wasteTypes || !userCity) {
            return res.status(400).json({ msg: 'Missing required fields' });
        }

        const pickupDate = new Date(scheduledDate);
        const dayName = getDayName(pickupDate);

        // Find all recycler profiles that:
        // 1. Accept the selected waste types
        // 2. Serve the user's city
        // 3. Are available on the selected day and time slot
        // 4. Haven't reached max pickups for the day
        
        const availableRecyclers = await RecyclerProfile.find({
            acceptedWasteTypes: { $in: wasteTypes },
            serviceAreas: userCity,
            'availability.operatingDays': dayName,
            $expr: { $lt: ['$currentPickupsToday', '$maxPickupsPerDay'] }
        })
        .populate('user', 'name email phone')
        .populate({
            path: 'user',
            select: 'name email phone'
        });

        // Filter by time slot availability
        const filteredRecyclers = availableRecyclers.filter(recycler => {
            return recycler.availability.timeSlots.some(slot => 
                slot.start === timeSlot.split(' - ')[0]
            );
        });

        // Add calculated fields for response
        const recyclerList = filteredRecyclers.map(recycler => ({
            _id: recycler._id,
            userId: recycler.user._id,
            businessName: recycler.businessName,
            rating: recycler.rating,
            specialties: recycler.specialties,
            location: recycler.businessAddress.coordinates,
            acceptedWasteTypes: recycler.acceptedWasteTypes
        }));

        res.json(recyclerList);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get available time slots for a specific date
exports.getTimeSlots = async (req, res) => {
    try {
        const { scheduledDate } = req.body;

        if (!scheduledDate) {
            return res.status(400).json({ msg: 'scheduledDate is required' });
        }

        // Define standard time slots
        const timeSlots = [
            '09:00 - 12:00',
            '12:00 - 15:00',
            '15:00 - 18:00'
        ];

        res.json({ timeSlots });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Update pickup with selected recycler
exports.updatePickupWithRecycler = async (req, res) => {
    try {
        const { pickupId, recyclerId } = req.body;

        if (!pickupId || !recyclerId) {
            return res.status(400).json({ msg: 'pickupId and recyclerId are required' });
        }

        // Find the pickup
        const pickup = await Pickup.findById(pickupId);
        if (!pickup) {
            return res.status(404).json({ msg: 'Pickup not found' });
        }

        // Verify user owns this pickup
        if (pickup.user.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Not authorized' });
        }

        // Find the recycler profile
        const recyclerProfile = await RecyclerProfile.findById(recyclerId);
        if (!recyclerProfile) {
            return res.status(404).json({ msg: 'Recycler not found' });
        }

        // Update pickup
        pickup.recycler = recyclerProfile.user;
        pickup.recyclerProfile = recyclerId;
        pickup.status = 'scheduled';

        await pickup.save();

        // Increment recycler's current pickups for the day
        // In a production app, this should use a more robust scheduling system
        recyclerProfile.currentPickupsToday += 1;
        await recyclerProfile.save();

        const updatedPickup = await pickup.populate('recycler', 'name phone email')
            .populate('recyclerProfile', 'businessName rating');

        res.json(updatedPickup);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get pickup details
exports.getPickupDetails = async (req, res) => {
    try {
        const { pickupId } = req.params;

        const pickup = await Pickup.findById(pickupId)
            .populate('recycler', 'name phone email')
            .populate('recyclerProfile', 'businessName rating specialties businessAddress');

        if (!pickup) {
            return res.status(404).json({ msg: 'Pickup not found' });
        }

        // Verify user owns this pickup
        if (pickup.user.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Not authorized' });
        }

        res.json(pickup);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Rate a completed pickup
exports.ratePickup = async (req, res) => {
    try {
        const { pickupId, score, review } = req.body;

        if (!pickupId || !score) {
            return res.status(400).json({ msg: 'pickupId and score are required' });
        }

        if (score < 1 || score > 5) {
            return res.status(400).json({ msg: 'score must be between 1 and 5' });
        }

        const pickup = await Pickup.findById(pickupId);
        if (!pickup) {
            return res.status(404).json({ msg: 'Pickup not found' });
        }

        // Verify user owns this pickup
        if (pickup.user.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Not authorized' });
        }

        // Update pickup with rating
        pickup.rating = {
            score,
            review: review || '',
            ratedAt: new Date()
        };

        await pickup.save();

        // Update recycler's average rating
        if (pickup.recyclerProfile) {
            const recyclerProfile = await RecyclerProfile.findById(pickup.recyclerProfile);
            
            // Recalculate average rating
            const allRatings = await Pickup.find({
                recyclerProfile: pickup.recyclerProfile,
                'rating.score': { $exists: true }
            });

            const totalScore = allRatings.reduce((sum, p) => sum + (p.rating.score || 0), 0);
            recyclerProfile.rating.averageScore = allRatings.length > 0 ? totalScore / allRatings.length : 0;
            recyclerProfile.rating.totalReviews = allRatings.length;

            await recyclerProfile.save();
        }

        res.json(pickup);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
