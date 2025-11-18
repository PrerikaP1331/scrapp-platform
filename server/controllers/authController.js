// /server/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
    const { name, email, password, phone, role, address } = req.body;

    try {
        // Input validation
        if (!name || !email || !password || !phone || !role) {
            return res.status(400).json({ msg: 'Please provide all required fields: name, email, password, phone, role' });
        }

        if (password.length < 8) {
            return res.status(400).json({ msg: 'Password must be at least 8 characters long' });
        }

        if (!/^\S+@\S+$/.test(email)) {
            return res.status(400).json({ msg: 'Please provide a valid email address' });
        }

        // For individual users, validate address
        if (role === 'individual' && address) {
            if (!address.addressLine1 || !address.city || !address.state || !address.postalCode) {
                return res.status(400).json({ msg: 'Please provide complete address information: addressLine1, city, state, postalCode' });
            }
        }

        // 1. Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // 2. Create a new user instance
        console.log('Registering user with address:', address);
        const addressData = {
            addressLine1: String(address?.addressLine1 || '').trim(),
            addressLine2: String(address?.addressLine2 || '').trim(),
            city: String(address?.city || '').trim(),
            state: String(address?.state || '').trim(),
            postalCode: String(address?.postalCode || '').trim()
        };
        console.log('Address data to be saved:', addressData);
        user = new User({
            name,
            email,
            password, // Plain text for now
            phone,
            role,
            address: addressData
        });

        // 3. Hash the password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // 4. Save the user to the database
        await user.save();
        console.log('User saved successfully with address:', user.address);
        
        // 5. Create and return a JWT
        const payload = {
            user: {
                id: user.id,
                role: user.role,
                name: user.name,
                email: user.email
            }
        };

        // For recycler role, fetch the recycler profile ID
        let responseUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone
        };

        if (user.role === 'recycler') {
            const RecyclerProfile = require('../models/RecyclerProfile');
            const recyclerProfile = await RecyclerProfile.findOne({ user: user.id });
            if (recyclerProfile) {
                responseUser.recyclerProfileId = recyclerProfile.id;
            }
        }

        jwt.sign(
            payload,
            process.env.JWT_SECRET, // We need to add this to our .env file!
            { expiresIn: '5h' },
            (err, token) => {
                if (err) throw err;
                res.json({ 
                    token,
                    user: responseUser
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.loginUser = async (req, res) => {
    // NOTE: We will add input validation later
    const { email, password } = req.body;

    try {
        // 1. Check if the user exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' }); // Be generic
        }

        // 2. Compare the provided password with the stored, hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // 3. If credentials are correct, create and return a JWT
        const payload = {
            user: {
                id: user.id,
                role: user.role,
                name: user.name,
                email: user.email
            }
        };

        // For recycler role, fetch the recycler profile ID
        let responseUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone
        };

        if (user.role === 'recycler') {
            const RecyclerProfile = require('../models/RecyclerProfile');
            const recyclerProfile = await RecyclerProfile.findOne({ user: user.id });
            if (recyclerProfile) {
                responseUser.recyclerProfileId = recyclerProfile.id;
            }
        }

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5h' },
            (err, token) => {
                if (err) throw err;
                res.json({ 
                    token,
                    user: responseUser
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getMe = async (req, res) => {
    try {
        // req.user.id is available because of our authMiddleware
        const user = await User.findById(req.user.id).select('-password'); // Exclude password
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};