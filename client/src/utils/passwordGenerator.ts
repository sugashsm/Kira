export interface PasswordGeneratorOptions {
    length: number;
    includeUppercase: boolean;
    includeLowercase: boolean;
    includeNumbers: boolean;
    includeSymbols: boolean;
}

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

export const generatePassword = (options: PasswordGeneratorOptions): string => {
    let charset = '';
    let password = '';

    if (options.includeUppercase) charset += UPPERCASE;
    if (options.includeLowercase) charset += LOWERCASE;
    if (options.includeNumbers) charset += NUMBERS;
    if (options.includeSymbols) charset += SYMBOLS;

    if (charset === '') {
        charset = LOWERCASE + NUMBERS;
    }

    for (let i = 0; i < options.length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }

    return password;
};

export const calculatePasswordStrength = (password: string): {
    score: number;
    label: string;
    color: string;
} => {
    let score = 0;

    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;

    if (score <= 2) {
        return { score, label: 'Weak', color: 'text-red-500' };
    } else if (score <= 4) {
        return { score, label: 'Fair', color: 'text-orange-500' };
    } else if (score <= 5) {
        return { score, label: 'Good', color: 'text-yellow-500' };
    } else {
        return { score, label: 'Strong', color: 'text-green-500' };
    }
};
