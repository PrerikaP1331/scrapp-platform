const Drive = require('../models/Drive');
const Community = require('../models/Community');

// Get all drives for a community
exports.getDrives = async (req, res) => {
  try {
    const { communityId } = req.params;
    const { status, visibility } = req.query;

    // Verify community exists
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ msg: 'Community not found' });
    }

    // Build query
    let query = { community: communityId };

    if (status) {
      query.status = status;
    }

    if (visibility) {
      query.visibility = visibility;
    }

    // Get drives and populate organizer
    const drives = await Drive.find(query)
      .populate('organizer', 'name email')
      .populate('participants', 'name email')
      .sort({ date: -1 });

    res.json({ drives });
  } catch (err) {
    console.error('Error fetching drives:', err);
    res.status(500).json({ msg: 'Server error fetching drives' });
  }
};

// Get single drive by ID
exports.getDriveById = async (req, res) => {
  try {
    const { communityId, driveId } = req.params;

    const drive = await Drive.findOne({ _id: driveId, community: communityId })
      .populate('organizer', 'name email')
      .populate('participants', 'name email');

    if (!drive) {
      return res.status(404).json({ msg: 'Drive not found' });
    }

    res.json({ drive });
  } catch (err) {
    console.error('Error fetching drive:', err);
    res.status(500).json({ msg: 'Server error fetching drive' });
  }
};

// Create a new drive
exports.createDrive = async (req, res) => {
  try {
    const { communityId } = req.params;
    const { title, description, coverPhoto, date, location, acceptedWasteTypes, visibility } = req.body;

    // Validation
    if (!title || !description || !date || !location || !acceptedWasteTypes || acceptedWasteTypes.length === 0) {
      return res.status(400).json({ msg: 'Please provide all required fields' });
    }

    // Verify community exists
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ msg: 'Community not found' });
    }

    // Get user ID from request (should be set by auth middleware)
    const organizerId = req.user.id;

    // Create drive
    const drive = new Drive({
      community: communityId,
      title,
      description,
      coverPhoto: coverPhoto || null,
      date: new Date(date),
      location: {
        venue: location.venue || location,
        address: location.address || {},
      },
      acceptedWasteTypes,
      visibility: visibility || 'private',
      organizer: organizerId,
    });

    await drive.save();
    await drive.populate('organizer', 'name email');

    res.status(201).json({ msg: 'Drive created successfully', drive });
  } catch (err) {
    console.error('Error creating drive:', err);
    res.status(500).json({ msg: 'Server error creating drive' });
  }
};

// Update a drive
exports.updateDrive = async (req, res) => {
  try {
    const { communityId, driveId } = req.params;
    const { title, description, coverPhoto, date, location, acceptedWasteTypes, visibility, status } = req.body;

    // Find drive and verify it belongs to this community
    let drive = await Drive.findOne({ _id: driveId, community: communityId });
    if (!drive) {
      return res.status(404).json({ msg: 'Drive not found' });
    }

    // Update fields
    if (title) drive.title = title;
    if (description) drive.description = description;
    if (coverPhoto) drive.coverPhoto = coverPhoto;
    if (date) drive.date = new Date(date);
    if (location) {
      drive.location = {
        venue: location.venue || location,
        address: location.address || drive.location.address,
      };
    }
    if (acceptedWasteTypes) drive.acceptedWasteTypes = acceptedWasteTypes;
    if (visibility) drive.visibility = visibility;
    if (status) drive.status = status;

    await drive.save();
    await drive.populate('organizer', 'name email');

    res.json({ msg: 'Drive updated successfully', drive });
  } catch (err) {
    console.error('Error updating drive:', err);
    res.status(500).json({ msg: 'Server error updating drive' });
  }
};

// Delete a drive
exports.deleteDrive = async (req, res) => {
  try {
    const { communityId, driveId } = req.params;

    const drive = await Drive.findOneAndDelete({ _id: driveId, community: communityId });

    if (!drive) {
      return res.status(404).json({ msg: 'Drive not found' });
    }

    res.json({ msg: 'Drive deleted successfully' });
  } catch (err) {
    console.error('Error deleting drive:', err);
    res.status(500).json({ msg: 'Server error deleting drive' });
  }
};

// Get drive statistics
exports.getDriveStats = async (req, res) => {
  try {
    const { communityId, driveId } = req.params;

    const drive = await Drive.findOne({ _id: driveId, community: communityId });

    if (!drive) {
      return res.status(404).json({ msg: 'Drive not found' });
    }

    if (drive.status !== 'completed') {
      return res.status(400).json({ msg: 'Statistics only available for completed drives' });
    }

    // Build stats response
    const stats = {
      title: drive.title,
      totalWeightCollected: drive.stats.totalWeightCollected || 0,
      participatingHouseholds: drive.stats.participatingHouseholds || 0,
      itemBreakdown: drive.stats.itemBreakdown || [],
      mostCommonItem: drive.stats.mostCommonItem || 'N/A',
      co2Saved: drive.stats.co2Saved || 0,
      date: drive.date,
    };

    res.json({ stats });
  } catch (err) {
    console.error('Error fetching drive stats:', err);
    res.status(500).json({ msg: 'Server error fetching drive stats' });
  }
};

// Update drive statistics (called after pickups are recorded)
exports.updateDriveStats = async (req, res) => {
  try {
    const { communityId, driveId } = req.params;
    const { totalWeightCollected, participatingHouseholds, itemBreakdown, mostCommonItem } = req.body;

    const drive = await Drive.findOne({ _id: driveId, community: communityId });

    if (!drive) {
      return res.status(404).json({ msg: 'Drive not found' });
    }

    // Update statistics
    drive.stats = {
      totalWeightCollected: totalWeightCollected || 0,
      participatingHouseholds: participatingHouseholds || 0,
      itemBreakdown: itemBreakdown || [],
      mostCommonItem: mostCommonItem || null,
      co2Saved: (totalWeightCollected || 0) * 0.8, // Approximate CO2 saved calculation
    };

    await drive.save();

    res.json({ msg: 'Drive statistics updated', drive });
  } catch (err) {
    console.error('Error updating drive stats:', err);
    res.status(500).json({ msg: 'Server error updating drive stats' });
  }
};
