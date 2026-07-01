import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        sparse: true, // <--- FIX: Allows multiple users to have 'null' or missing emails
    },
    phone: {
        type: String,
        unique: true,
        sparse: true, // <--- FIX: Allows multiple users to have 'null' or missing phones
    },
    password: {
        type: String,
        required: true,
        select: false, // Hides password from normal database queries for security
    }
}, {
    timestamps: true
});

// Automatically hash the password before saving a new user or updating a password
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Helper method used in authController to check if passwords match during login
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;