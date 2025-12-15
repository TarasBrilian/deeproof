import React, { useState } from 'react';
import { X } from '@phosphor-icons/react';

interface EmailModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (email: string) => void;
    isLoading: boolean;
}

export const EmailModal: React.FC<EmailModalProps> = ({ isOpen, onClose, onSubmit, isLoading }) => {
    const [email, setEmail] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(email);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void-black/80 backdrop-blur-sm">
            <div className="bg-deep-charcoal border border-white/10 rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-code-grey hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <h2 className="text-2xl font-bold text-white mb-2">Enter your Email</h2>
                <p className="text-code-grey mb-6 text-sm">
                    We will use this email to verify your identity status.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-xs font-semibold text-code-grey uppercase tracking-wider mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                            className="w-full bg-void-black border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-electric-azure transition-colors"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-electric-azure hover:bg-electric-azure/90 text-white font-bold py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Processing...' : 'Verify with Binance'}
                    </button>
                </form>
            </div>
        </div>
    );
};
