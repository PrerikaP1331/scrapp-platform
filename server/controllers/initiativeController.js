const Initiative = require("../models/Initiative");
const Organisation = require("../models/Organisation");
const Organization = require("../models/Organisation"); // Alias for consistency

// @desc    Get all initiatives for an organization
// @access  Private
exports.getInitiatives = async (req, res) => {
  try {
    const { orgId } = req.query;

    let query = {};
    if (orgId) {
      query.organizationId = orgId;
    }

    const initiatives = await Initiative.find(query)
      .populate("createdBy", "name email")
      .populate("organizationId", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: initiatives,
    });
  } catch (error) {
    console.error("Error fetching initiatives:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching initiatives",
      error: error.message,
    });
  }
};

// @desc    Get initiative by ID
// @access  Private
exports.getInitiativeById = async (req, res) => {
  try {
    const { id } = req.params;

    const initiative = await Initiative.findById(id)
      .populate("createdBy", "name email")
      .populate("organizationId", "name");

    if (!initiative) {
      return res.status(404).json({
        success: false,
        message: "Initiative not found",
      });
    }

    res.json({
      success: true,
      data: initiative,
    });
  } catch (error) {
    console.error("Error fetching initiative:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching initiative",
      error: error.message,
    });
  }
};

// @desc    Create new initiative
// @access  Private
exports.createInitiative = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const {
      title,
      description,
      startDate,
      endDate,
      category,
      location,
      isPublic,
      targetParticipants,
      organizationId,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !description ||
      !startDate ||
      !endDate ||
      !category ||
      !location
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Use provided organizationId or try to get from user, or use a default test org
    let finalOrgId = organizationId || req.user?.orgId;

    // If still no orgId, create or use a default organization
    if (!finalOrgId) {
      try {
        // Try to find or create a default test organization
        let defaultOrg = await Organisation.findOne({
          name: "Default Test Organization",
        });

        if (!defaultOrg) {
          // Create a default organization if it doesn't exist
          const User = require("../models/User");
          let adminUser = await User.findOne({ role: "org_admin" });

          if (!adminUser) {
            // Create a test admin user if needed
            adminUser = new User({
              name: "Admin",
              email: "admin@scrapp.com",
              password: "test123",
              phone: "9999999999",
              role: "org_admin",
              address: {
                addressLine1: "Test",
                city: "Test",
                state: "Test",
                postalCode: "000000",
              },
            });
            await adminUser.save();
          }

          defaultOrg = new Organisation({
            admin: adminUser._id,
            name: "Default Test Organization",
            type: "Corporate Office",
            employeeCount: "100-500",
            address: {
              addressLine1: "Test Address",
              city: "Test City",
              state: "Test State",
              postalCode: "000000",
            },
          });
          await defaultOrg.save();
        }
        finalOrgId = defaultOrg._id;
      } catch (orgError) {
        console.error("Error creating default org:", orgError);
        return res.status(400).json({
          success: false,
          message: "Unable to create or find organization for initiative",
        });
      }
    }

    const initiative = new Initiative({
      title,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      category,
      location,
      isPublic: isPublic !== undefined ? isPublic : true,
      targetParticipants: parseInt(targetParticipants) || 0,
      organizationId: finalOrgId,
      createdBy: req.user.id,
    });

    await initiative.save();
    await initiative.populate("createdBy", "name email");
    await initiative.populate("organizationId", "name");

    res.status(201).json({
      success: true,
      message: "Initiative created successfully",
      data: initiative,
    });
  } catch (error) {
    console.error("Error creating initiative:", error);
    res.status(500).json({
      success: false,
      message: "Error creating initiative",
      error: error.message,
    });
  }
};

// @desc    Update initiative
// @access  Private
exports.updateInitiative = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      startDate,
      endDate,
      category,
      location,
      isPublic,
      targetParticipants,
      status,
      actualParticipants,
      wasteCollected,
      reportDetails,
    } = req.body;

    let initiative = await Initiative.findById(id);

    if (!initiative) {
      return res.status(404).json({
        success: false,
        message: "Initiative not found",
      });
    }

    // Update fields
    if (title) initiative.title = title;
    if (description) initiative.description = description;
    if (startDate) initiative.startDate = new Date(startDate);
    if (endDate) initiative.endDate = new Date(endDate);
    if (category) initiative.category = category;
    if (location) initiative.location = location;
    if (isPublic !== undefined) initiative.isPublic = isPublic;
    if (targetParticipants !== undefined)
      initiative.targetParticipants = targetParticipants;
    if (status) initiative.status = status;
    if (actualParticipants !== undefined)
      initiative.actualParticipants = actualParticipants;
    if (wasteCollected !== undefined)
      initiative.wasteCollected = wasteCollected;
    if (reportDetails) initiative.reportDetails = reportDetails;

    initiative.updatedAt = Date.now();

    await initiative.save();
    await initiative.populate("createdBy", "name email");
    await initiative.populate("organizationId", "name");

    res.json({
      success: true,
      message: "Initiative updated successfully",
      data: initiative,
    });
  } catch (error) {
    console.error("Error updating initiative:", error);
    res.status(500).json({
      success: false,
      message: "Error updating initiative",
      error: error.message,
    });
  }
};

// @desc    Delete initiative
// @access  Private
exports.deleteInitiative = async (req, res) => {
  try {
    const { id } = req.params;

    const initiative = await Initiative.findByIdAndDelete(id);

    if (!initiative) {
      return res.status(404).json({
        success: false,
        message: "Initiative not found",
      });
    }

    res.json({
      success: true,
      message: "Initiative deleted successfully",
      data: initiative,
    });
  } catch (error) {
    console.error("Error deleting initiative:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting initiative",
      error: error.message,
    });
  }
};

// @desc    Get initiatives by organization
// @access  Private
exports.getInitiativesByOrganization = async (req, res) => {
  try {
    const { orgId } = req.params;

    const initiatives = await Initiative.find({ organizationId: orgId })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: initiatives,
    });
  } catch (error) {
    console.error("Error fetching organization initiatives:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching initiatives",
      error: error.message,
    });
  }
};
