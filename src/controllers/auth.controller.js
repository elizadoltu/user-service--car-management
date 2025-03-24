import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Admin from "../models/Admin.js";
import dotenv from 'dotenv';

dotenv.config();

const privateKey = process.env.PRIVATE_KEY_PATH.replace(/\\n/g, "\n");
const publicKey = process.env.PUBLIC_KEY_PATH.replace(/\\n/g, "\n");

export const register = async (req, res) => {
    const { username, fullName, password, email, cars } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "A user with this email already exists" });
        }

        const newUser = new User({
            username,
            fullName,
            password, 
            email, 
            cars
        });
        await newUser.save();

        const payload = {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            role: 'client'
        };
        const token = jwt.sign(payload, privateKey, {
            algorithm: "RS256",
            expiresIn: process.env.JWT_EXPIRATION
        });

        res.status(200).json({ message: "Successfully registered.", token });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const payload = {
            id: user._id,
            username: user.username,
            email: user.email,
            role: 'client'
        }

        const token = jwt.sign(payload, privateKey, {
            algorithm: "RS256",
            expiresIn: process.env.JWT_EXPIRATION
        })

        res.status(201).json({ token });
    } catch (error) {
        console.log("Login error", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const loginAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const payload = {
            sub: admin._id, 
            username: admin.username,
            role: 'admin'
        };

        const token = jwt.sign(
            payload,
            privateKey,
            { 
                algorithm: 'RS256',
                expiresIn: process.env.JWT_EXPIRATION || '1h',
            }
        );

        res.status(200).json({  
            token,
            admin: {
                id: admin._id,
                username: admin.username
            }
        });
    } catch (error) {
        console.error('Login error', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const registerAdmin = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        if (!username || !password || !email) {
            return res.status(400).json({ message: 'Username, password and email are required' });
        }

        // If admin already exists
        const existingAdmin = await Admin.findOne({ $or: [{ username }, { email }] });
        if (existingAdmin) {
            return res.status(409).json({ message: 'Username or email already exists' });
        }

        const newAdmin = new Admin({ 
            username,
            password,
            email
        });

        await newAdmin.save();
        const payload = {
            sub: newAdmin._id,
            username: newAdmin.username,
            role: 'admin'
        };

        const token = jwt.sign(
            payload,
            privateKey, {
                algorithm: 'RS256',
                expiresIn: process.env.JWT_EXPIRATION
            }
        );

        res.status(201).json({
            message: 'Admin registered successfully',
            token,
            admin: {
                id: newAdmin._id,
                username: newAdmin.username,
                email: newAdmin.email
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};