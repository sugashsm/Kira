export interface User {
    id: string;
    email: string;
    salt: string;
    createdAt: string;
}

export interface Password {
    _id: string;
    userId: string;
    encryptedData: string;
    iv: string;
    category?: string;
    favorite: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface DecryptedPassword {
    title: string;
    username: string;
    password: string;
    url?: string;
    notes?: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    token: string;
    user: User;
}

export interface PasswordResponse {
    success: boolean;
    password?: Password;
    passwords?: Password[];
    count?: number;
    message?: string;
}
