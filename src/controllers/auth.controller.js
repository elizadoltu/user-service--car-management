import jwt from 'jsonwebtoken';
import User from '../models/User.js';
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
            email: newUser.email
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
        }

        const token = jwt.sign(payload, privateKey, {
            algorithm: "RS256",
            expiresIn: process.env.JWT_PAYLOAD
        })

        res.status(201).json({ token });
    } catch (error) {
        console.log("Login error", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};