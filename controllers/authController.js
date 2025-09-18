const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId) => {
    const payload = { id: userId };
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
    return jwt.sign(payload, secret, { expiresIn });
};

// @route POST /api/auth/register
// @body { email, password, name? }
const register = asyncHandler(async (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error('Email and password are required');
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
        res.status(400);
        throw new Error('User with this email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
        name,
        email: email.toLowerCase(),
        passwordHash,
    });

    res.status(201).json({
        id: user._id,
        email: user.email,
        name: user.name,
        token: generateToken(user._id),
    });
});

// @route POST /api/auth/login
// @body { email, password }
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error('Email and password are required');
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
        res.status(401);
        throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
        res.status(401);
        throw new Error('Invalid credentials');
    }

    res.json({
        id: user._id,
        email: user.email,
        name: user.name,
        token: generateToken(user._id),
    });
});

module.exports = { register, login };
