import User from "../models/User.js";

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user' });
    }
};

export const updateUserById = async (req, res) => {
    try {
        const { username, email, fullName, role } = req.body;
        const updates = { username, email, fullName, role };

        const updateUser = await User.findByIdAndUpdate(
            req.params.userId,
            updates,
            { new: true, runValidators: true }
        ).select('-password');

        if (!updateUser) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(updateUser);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user' });
    }
};

export const deleteUserById = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.userId);
        if (!deletedUser) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user' });
    }
};