const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getInitiatives,
  getInitiativeById,
  createInitiative,
  updateInitiative,
  deleteInitiative,
  getInitiativesByOrganization,
} = require("../controllers/initiativeController");

// @route   GET /api/initiatives
// @desc    Get all initiatives
// @access  Private
router.get("/", authMiddleware, getInitiatives);

// @route   GET /api/initiatives/org/:orgId
// @desc    Get initiatives by organization
// @access  Private
router.get("/org/:orgId", authMiddleware, getInitiativesByOrganization);

// @route   GET /api/initiatives/:id
// @desc    Get initiative by ID
// @access  Private
router.get("/:id", authMiddleware, getInitiativeById);

// @route   POST /api/initiatives
// @desc    Create new initiative
// @access  Private
router.post("/", authMiddleware, createInitiative);

// @route   PUT /api/initiatives/:id
// @desc    Update initiative
// @access  Private
router.put("/:id", authMiddleware, updateInitiative);

// @route   DELETE /api/initiatives/:id
// @desc    Delete initiative
// @access  Private
router.delete("/:id", authMiddleware, deleteInitiative);

module.exports = router;
