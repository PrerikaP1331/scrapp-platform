// /server/controllers/organisationController.js
const User = require('../models/User');
const Organisation = require('../models/Organisation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerOrganisation = async (req, res) => {
  const {
    name, email, phone, roleTitle, password, // Admin details
    orgName, orgType, employeeCount, // Organization details
    addressLine1, addressLine2, city, postalCode, state // Organization address
  } = req.body;

  try {
    // 1. Check if an admin with this email already exists
    let adminUser = await User.findOne({ email });
    if (adminUser) {
      return res.status(400).json({ msg: 'An account with this email already exists.' });
    }

    // 2. Create and save the new admin user
    adminUser = new User({
      name,
      email,
      phone,
      password,
      role: 'org_admin', // Assign the correct role
      // Note: roleTitle is not part of the User schema, so it's not saved here.
      // It could be added if needed in the future.
      address: { addressLine1, addressLine2, city, postalCode, state }
    });

    const salt = await bcrypt.genSalt(10);
    adminUser.password = await bcrypt.hash(password, salt);
    await adminUser.save();

    // 3. Create and save the new organization, linking it to the admin
    const newOrganisation = new Organisation({
      admin: adminUser.id,
      name: orgName,
      type: orgType,
      employeeCount,
      address: { addressLine1, addressLine2, city, postalCode, state }
    });

    await newOrganisation.save();
    
    // 4. Create and return a JWT for the new admin user
    const payload = {
      user: {
        id: adminUser.id,
        role: adminUser.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ token });
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};