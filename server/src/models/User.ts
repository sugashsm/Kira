import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    email: string;
    masterPasswordHash: string;
    salt: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
        },
        masterPasswordHash: {
            type: String,
            required: [true, 'Master password hash is required'],
        },
        salt: {
            type: String,
            required: [true, 'Salt is required'],
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster email lookups
userSchema.index({ email: 1 });

const User = mongoose.model<IUser>('User', userSchema);

export default User;
