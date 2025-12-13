import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [masterPassword, setMasterPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(email, masterPassword);
            navigate('/vault');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                    }}
                    transition={{ duration: 20, repeat: Infinity }}
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [90, 0, 90],
                    }}
                    transition={{ duration: 15, repeat: Infinity }}
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass w-full max-w-md p-8 rounded-3xl shadow-2xl relative z-10"
            >
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                        className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl mb-4"
                    >
                        <Sparkles className="text-white" size={32} />
                    </motion.div>
                    <h1 className="text-4xl font-bold gradient-text mb-2">Welcome Back</h1>
                    <p className="text-text-secondary">Login to access your vault</p>
                </div>

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-danger/10 border border-danger/30 rounded-xl text-danger text-sm"
                    >
                        {error}
                    </motion.div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <Input
                        label="Email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        icon={<Mail size={20} />}
                        required
                    />

                    <Input
                        label="Master Password"
                        type="password"
                        placeholder="Enter your master password"
                        value={masterPassword}
                        onChange={(e) => setMasterPassword(e.target.value)}
                        icon={<Lock size={20} />}
                        required
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        className="w-full"
                        isLoading={isLoading}
                    >
                        Login
                    </Button>
                </form>

                {/* Register Link */}
                <div className="mt-6 text-center">
                    <p className="text-text-secondary">
                        Don't have an account?{' '}
                        <Link
                            to="/register"
                            className="text-primary hover:text-secondary font-medium transition-colors"
                        >
                            Create one
                        </Link>
                    </p>
                </div>

                {/* Security Notice */}
                <div className="mt-8 p-4 bg-accent/10 border border-accent/30 rounded-xl">
                    <p className="text-xs text-text-secondary text-center">
                        🔒 Your master password is never stored. If you forget it, your data cannot be recovered.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
