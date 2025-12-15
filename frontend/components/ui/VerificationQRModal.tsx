import React from 'react';
import QRCode from "react-qr-code";
import { X, SpinnerGap, CheckCircle, WarningCircle } from '@phosphor-icons/react';

interface VerificationQRModalProps {
    isOpen: boolean;
    onClose: () => void;
    requestUrl: string;
    isLoading: boolean;
    status: 'waiting' | 'verified' | 'failed';
    onContinue?: () => void;
}

export const VerificationQRModal: React.FC<VerificationQRModalProps> = ({ isOpen, onClose, requestUrl, isLoading, status, onContinue }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void-black/80 backdrop-blur-sm">
            <div className="bg-deep-charcoal border border-white/10 rounded-2xl w-full max-w-sm p-8 relative shadow-2xl flex flex-col items-center text-center">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-code-grey hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                {status === 'verified' ? (
                    <>
                        <div className="w-20 h-20 rounded-full bg-zk-green/20 flex items-center justify-center mb-6 text-zk-green">
                            <CheckCircle size={48} weight="fill" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Verification Successful!</h2>
                        <p className="text-code-grey mb-6 text-sm">
                            Your Binance identity has been successfully verified without revealing any sensitive data.
                        </p>
                        <button
                            onClick={onContinue || onClose}
                            className="bg-zk-green hover:bg-zk-green/90 text-void-black font-bold py-3 px-8 rounded-lg transition-all duration-300 w-full"
                        >
                            Continue
                        </button>
                    </>
                ) : status === 'failed' ? (
                    <>
                        <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mb-6 text-red-500">
                            <WarningCircle size={48} weight="fill" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Verification Failed</h2>
                        <p className="text-code-grey mb-6 text-sm">
                            We couldn't verify your identity. Please try again.
                        </p>
                        <button
                            onClick={onClose}
                            className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 w-full"
                        >
                            Close
                        </button>
                    </>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold text-white mb-2">Scan to Verify</h2>
                        <p className="text-code-grey mb-6 text-sm">
                            Scan this QR code with your mobile device to verify your identity on Binance.
                        </p>

                        <div className="bg-white p-4 rounded-xl mb-6">
                            {isLoading ? (
                                <div className="h-48 w-48 flex items-center justify-center">
                                    <SpinnerGap className="animate-spin text-deep-charcoal" size={48} />
                                </div>
                            ) : requestUrl ? (
                                <div className="h-auto w-auto max-w-full">
                                    <QRCode
                                        value={requestUrl}
                                        size={192}
                                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                        viewBox={`0 0 256 256`}
                                    />
                                </div>
                            ) : (
                                <div className="h-48 w-48 flex items-center justify-center text-deep-charcoal text-sm font-medium">
                                    Failed to load QR
                                </div>
                            )}
                        </div>

                        <p className="text-xs text-code-grey">
                            Status: <span className="text-electric-azure font-mono animate-pulse">Waiting for verification...</span>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};
