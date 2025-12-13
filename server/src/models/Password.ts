import mongoose, { Document, Schema } from 'mongoose';

export interface IPassword extends Document {
    userId: mongoose.Types.ObjectId;
    encryptedData: string;
    iv: string;
    category?: string;
    favorite: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const passwordSchema = new Schema<IPassword>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required'],
            index: true,
        },
        encryptedData: {
            type: String,
            required: [true, 'Encrypted data is required'],
        },
        iv: {
            type: String,
            required: [true, 'Initialization vector is required'],
        },
        category: {
            type: String,
            default: 'general',
            trim: true,
        },
        favorite: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index for faster user-specific queries
passwordSchema.index({ userId: 1, createdAt: -1 });
passwordSchema.index({ userId: 1, favorite: -1 });

const Password = mongoose.model<IPassword>('Password', passwordSchema);

export default Password;
