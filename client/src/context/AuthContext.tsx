import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../utils/api';
import { User, AuthResponse } from '../types';
import { hashPassword, generateSalt, deriveKey } from '../utils/crypto';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, masterPassword: string) => Promise<void>;
    register: (email: string, masterPassword: string) => Promise<void>;
    logout: () => void;
    encryptionKey: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [encryptionKey, setEncryptionKey] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        const savedKey = localStorage.getItem('encryptionKey');

        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
            setEncryptionKey(savedKey);
        }
        setLoading(false);
    }, []);

    const register = async (email: string, masterPassword: string) => {
        const salt = generateSalt();
        const masterPasswordHash = hashPassword(masterPassword);
        const key = deriveKey(masterPassword, salt);

        const response = await api.post<AuthResponse>('/auth/register', {
            email,
            masterPasswordHash,
            salt,
        });

        const { token, user: userData } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('encryptionKey', key);

        setUser(userData);
        setEncryptionKey(key);
    };

    const login = async (email: string, masterPassword: string) => {
        const masterPasswordHash = hashPassword(masterPassword);

        const response = await api.post<AuthResponse>('/auth/login', {
            email,
            masterPasswordHash,
        });

        const { token, user: userData } = response.data;
        const key = deriveKey(masterPassword, userData.salt);

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('encryptionKey', key);

        setUser(userData);
        setEncryptionKey(key);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('encryptionKey');
        setUser(null);
        setEncryptionKey(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, encryptionKey }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
