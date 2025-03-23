import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    username: {
        type: String, 
        required: true, 
        unique: true
    },
    fullName: {
        type: String, 
    },
    password: {
        type: String, 
        required: true
    },
    email: {
        type: String, 
        required: true, 
        unique: true,
    },
    cars: {
        type: [String],
        required: true
    },
    bills: {
        type: [String]
    },
    reservations: {
        type: [String]
    }
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema, 'Users');

export default User;