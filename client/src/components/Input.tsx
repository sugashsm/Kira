import React, { InputHTMLAttributes, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
    label,
    error,
    icon,
    type = 'text',
    className = '',
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-text-secondary mb-2">
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
                        {icon}
                    </div>
                )}
                <input
                    type={inputType}
                    className={`
            w-full px-4 py-3 ${icon ? 'pl-12' : ''} ${isPassword ? 'pr-12' : ''}
            bg-bg-secondary border border-border rounded-xl
            text-text-primary placeholder-text-muted
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
            transition-all duration-200
            ${error ? 'border-danger focus:ring-danger' : ''}
            ${className}
          `}
                    {...props}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                )}
            </div>
            {error && (
                <p className="mt-2 text-sm text-danger">{error}</p>
            )}
        </div>
    );
};

export default Input;
