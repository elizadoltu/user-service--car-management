import User from "../models/User.js";

export const getUserProfile = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(201).json({ user });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const updates = {};

        const { username, email, password, fullName } = req.body;

        // Build updates object
        if (username) updates.uername = username;
        if (email) updates.email = email;
        if (fullName) updates.fullName = fullName;

        // If username or email already exists (if being updated)
        if (username || email) {
            const query = [];
            if (username) query.push({ username });
            if (email) query.push({ email });

            const existingUser = await User.findOne({
                $or: query, 
                _id: { $ne: userId }
            });

            if (existingUser) {
                // To determine which field is causing the conflict
                if (username && existingUser.username === username) {
                    return res.status(400).json({ message: "Username already taken" });
                }
                if (email && existingUser.email === email) {
                    return res.status(400).json({ message: "Email already taken" });
                }
            }
        }

        if (password) {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            user.password = password;
            await user.save();

            // Apply other updates
            if (Object.keys(updates).length > 0) {
                await User.findByIdAndUpdate(userId, { $set: updates });
            }
        } else {
            // If no password update
            if (Object.keys(updates).length > 0) {
                const result = await User.findByIdAndUpdate(userId, { $set: updates }, { new: true });
                if (!result) {
                    return res.status(404).json({ message: "User not found" });
                }
            } else {
                return res.status(400).json({ message: 'No updates provided' });
            }
        }

        // Fetch updates user
        const updatedUser = await User.findById(userId)
            .select('-password');

        res.status(201).json({ 
            message: 'Profile updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteUserProfile = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const result = await User.findByIdAndDelete(userId);

        if (!result) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(201).json({ message: 'User account deleted successfully' });
    } catch (error) {
        console.error('Error deleting profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};