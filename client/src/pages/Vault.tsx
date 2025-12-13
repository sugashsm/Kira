import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, LogOut, Key, Eye, EyeOff, Copy, Trash2, Edit, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { encryptData, decryptData } from '../utils/crypto';
import { Password, DecryptedPassword, PasswordResponse } from '../types';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import { generatePassword, PasswordGeneratorOptions } from '../utils/passwordGenerator';

const Vault: React.FC = () => {
    const { user, logout, encryptionKey } = useAuth();
    const navigate = useNavigate();
    const [passwords, setPasswords] = useState<Password[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedPassword, setSelectedPassword] = useState<Password | null>(null);
    const [revealedPasswords, setRevealedPasswords] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);

    // Form state
    const [formData, setFormData] = useState<DecryptedPassword>({
        title: '',
        username: '',
        password: '',
        url: '',
        notes: '',
    });

    useEffect(() => {
        if (!user || !encryptionKey) {
            navigate('/login');
            return;
        }
        fetchPasswords();
    }, [user, encryptionKey, navigate]);

    const fetchPasswords = async () => {
        try {
            const response = await api.get<PasswordResponse>('/passwords');
            setPasswords(response.data.passwords || []);
        } catch (error) {
            console.error('Failed to fetch passwords:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddPassword = async () => {
        if (!encryptionKey) return;

        try {
            const { encryptedData, iv } = encryptData(formData, encryptionKey);
            await api.post('/passwords', { encryptedData, iv, category: 'general', favorite: false });
            await fetchPasswords();
            setIsAddModalOpen(false);
            resetForm();
        } catch (error) {
            console.error('Failed to add password:', error);
        }
    };

    const handleDeletePassword = async (id: string) => {
        if (!confirm('Are you sure you want to delete this password?')) return;

        try {
            await api.delete(`/passwords/${id}`);
            await fetchPasswords();
        } catch (error) {
            console.error('Failed to delete password:', error);
        }
    };

    const decryptPassword = (password: Password): DecryptedPassword | null => {
        if (!encryptionKey) return null;
        try {
            return decryptData(password.encryptedData, password.iv, encryptionKey);
        } catch (error) {
            console.error('Failed to decrypt password:', error);
            return null;
        }
    };

    const toggleReveal = (id: string) => {
        setRevealedPasswords((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const resetForm = () => {
        setFormData({ title: '', username: '', password: '', url: '', notes: '' });
    };

    const handleGeneratePassword = () => {
        const options: PasswordGeneratorOptions = {
            length: 16,
            includeUppercase: true,
            includeLowercase: true,
            includeNumbers: true,
            includeSymbols: true,
        };
        const generated = generatePassword(options);
        setFormData({ ...formData, password: generated });
    };

    const filteredPasswords = passwords.filter((pwd) => {
        const decrypted = decryptPassword(pwd);
        if (!decrypted) return false;
        const searchLower = searchTerm.toLowerCase();
        return (
            decrypted.title.toLowerCase().includes(searchLower) ||
            decrypted.username.toLowerCase().includes(searchLower)
        );
    });

    return (
        <div className="min-h-screen bg-bg-primary">
            {/* Header */}
            <header className="glass border-b border-border sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                            <Key className="text-white" size={20} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold gradient-text">KIRA</h1>
                            <p className="text-xs text-text-muted">{user?.email}</p>
                        </div>
                    </div>
                    <Button variant="ghost" onClick={logout} size="sm">
                        <LogOut size={18} />
                        Logout
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Search and Add */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="flex-1">
                        <Input
                            placeholder="Search passwords..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            icon={<Search size={20} />}
                        />
                    </div>
                    <Button onClick={() => setIsAddModalOpen(true)}>
                        <Plus size={20} />
                        Add Password
                    </Button>
                </div>

                {/* Password Grid */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : filteredPasswords.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-text-secondary">No passwords found. Add your first one!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredPasswords.map((pwd) => {
                            const decrypted = decryptPassword(pwd);
                            if (!decrypted) return null;
                            const isRevealed = revealedPasswords.has(pwd._id);

                            return (
                                <motion.div
                                    key={pwd._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="glass p-6 rounded-2xl hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-text-primary">{decrypted.title}</h3>
                                        <button onClick={() => handleDeletePassword(pwd._id)} className="text-text-muted hover:text-danger">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs text-text-muted mb-1">Username</p>
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm text-text-secondary flex-1 truncate">{decrypted.username}</p>
                                                <button onClick={() => copyToClipboard(decrypted.username)} className="text-accent hover:text-primary">
                                                    <Copy size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-xs text-text-muted mb-1">Password</p>
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm text-text-secondary flex-1 font-mono">
                                                    {isRevealed ? decrypted.password : '••••••••'}
                                                </p>
                                                <button onClick={() => toggleReveal(pwd._id)} className="text-text-muted hover:text-text-primary">
                                                    {isRevealed ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                                <button onClick={() => copyToClipboard(decrypted.password)} className="text-accent hover:text-primary">
                                                    <Copy size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        {decrypted.url && (
                                            <div>
                                                <p className="text-xs text-text-muted mb-1">URL</p>
                                                <a href={decrypted.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline truncate block">
                                                    {decrypted.url}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* Add Password Modal */}
            <Modal isOpen={isAddModalOpen} onClose={() => { setIsAddModalOpen(false); resetForm(); }} title="Add New Password">
                <div className="space-y-4">
                    <Input label="Title" placeholder="e.g., Gmail" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                    <Input label="Username/Email" placeholder="your@email.com" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} required />
                    <div>
                        <Input label="Password" type="text" placeholder="Enter password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                        <Button type="button" variant="secondary" size="sm" className="mt-2" onClick={handleGeneratePassword}>
                            Generate Strong Password
                        </Button>
                    </div>
                    <Input label="URL (Optional)" placeholder="https://example.com" value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} />
                    <div className="flex gap-3">
                        <Button variant="secondary" onClick={() => { setIsAddModalOpen(false); resetForm(); }} className="flex-1">
                            Cancel
                        </Button>
                        <Button onClick={handleAddPassword} className="flex-1">
                            Save Password
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Vault;
