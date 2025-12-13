import { body, ValidationChain } from 'express-validator';

export const registerValidation: ValidationChain[] = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    body('masterPasswordHash')
        .isString()
        .notEmpty()
        .withMessage('Master password hash is required'),
    body('salt')
        .isString()
        .notEmpty()
        .withMessage('Salt is required'),
];

export const loginValidation: ValidationChain[] = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    body('masterPasswordHash')
        .isString()
        .notEmpty()
        .withMessage('Master password hash is required'),
];

export const passwordValidation: ValidationChain[] = [
    body('encryptedData')
        .isString()
        .notEmpty()
        .withMessage('Encrypted data is required'),
    body('iv')
        .isString()
        .notEmpty()
        .withMessage('Initialization vector is required'),
    body('category')
        .optional()
        .isString()
        .trim(),
    body('favorite')
        .optional()
        .isBoolean(),
];
