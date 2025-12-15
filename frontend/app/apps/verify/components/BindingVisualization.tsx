"use client";

import {
    LockKey,
    Link as LinkIcon,
    CheckCircle,
    Hash,
    Envelope,
} from "@phosphor-icons/react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { AuthSession } from "@/lib/types";

interface BindingVisualizationProps {
    isConnected: boolean;
    address: string | undefined;
    isBound: boolean;
    isEmailVerified: boolean;
    email: string;
    setEmail: (email: string) => void;
    magicLinkSent: boolean;
    hash: string;
    authSession: AuthSession | null;
    onLogout: () => void;
}

export const BindingVisualization = ({
    isConnected,
    address,
    isBound,
    isEmailVerified,
    email,
    setEmail,
    magicLinkSent,
    hash,
    authSession,
    onLogout
}: BindingVisualizationProps) => {
    return (
        <div className="grid lg:grid-cols-1 gap-8">
            <Card className="bg-deep-charcoal border-white/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(217,119,6,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(217,119,6,0.03)_1px,transparent_1px)] bg-[size:24px_24px]" />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 py-8 px-4 md:px-12">
                    {/* Left: Wallet */}
                    <div className="text-center space-y-4">
                        <div className="w-20 h-20 mx-auto rounded-full bg-void-black border-2 border-electric-azure flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                            <LockKey className="w-8 h-8 text-electric-azure" />
                        </div>
                        <div>
                            <Badge className="bg-electric-azure/10 text-electric-azure border-electric-azure/20 mb-2">
                                {isConnected ? "CONNECTED" : "NOT CONNECTED"}
                            </Badge>
                            <p className="font-mono text-white text-lg">
                                {isConnected && address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "0x0000...0000"}
                            </p>
                        </div>
                    </div>

                    {/* Center: Link Visualization */}
                    <div className="flex-1 w-full md:w-auto flex flex-col items-center justify-center">
                        <div className="relative w-full h-[2px] bg-white/10 max-w-[200px] mb-4">
                            <div className={`absolute top-0 left-0 h-full bg-gradient-to-r from-electric-azure to-zk-green transition-all duration-1000 ${isBound ? "w-full" : isEmailVerified ? "w-1/2" : "w-0"}`} />
                        </div>
                        <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-colors duration-500 ${isBound ? "bg-zk-green/20 border-zk-green text-zk-green" : isEmailVerified ? "bg-oracle-gold/20 border-oracle-gold text-oracle-gold" : "bg-deep-charcoal border-white/20 text-code-grey"}`}>
                            <LinkIcon className="w-6 h-6" />
                        </div>
                        <p className="mt-2 text-xs uppercase tracking-widest text-code-grey">
                            {isBound ? "CRYPTOGRAPHICALLY BOUND" : isEmailVerified ? "EMAIL VERIFIED" : "UNBOUND"}
                        </p>
                    </div>

                    {/* Right: Identity Input (Blind Input) */}
                    <div className="text-center space-y-4 w-full md:w-auto md:min-w-[280px]">
                        <div className={`w-20 h-20 mx-auto rounded-full bg-void-black border-2 flex items-center justify-center shadow-lg transition-colors duration-500 ${isBound ? "border-zk-green shadow-[0_0_20px_rgba(16,185,129,0.4)]" : isEmailVerified ? "border-oracle-gold shadow-[0_0_20px_rgba(217,119,6,0.4)]" : "border-white/10"}`}>
                            {isEmailVerified ? (
                                <CheckCircle className="w-8 h-8 text-oracle-gold" weight="fill" />
                            ) : (
                                <Hash className={`w-8 h-8 ${isBound ? "text-zk-green" : "text-code-grey"}`} />
                            )}
                        </div>

                        <div className="w-full">
                            {!isEmailVerified ? (
                                <div className="space-y-2">
                                    <div className="relative">
                                        <input
                                            type="email"
                                            placeholder="Enter Email to Verify"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled={magicLinkSent}
                                            className="w-full bg-void-black border border-white/10 rounded-lg py-2 px-4 text-center text-white focus:outline-none focus:border-oracle-gold transition-colors font-mono placeholder:font-sans disabled:opacity-50"
                                        />
                                        <Envelope className="absolute right-3 top-2.5 text-code-grey w-5 h-5 pointer-events-none" />
                                    </div>
                                    <p className="font-mono text-xs text-hash-grey truncate px-2">{hash}</p>
                                </div>
                            ) : (
                                <div>
                                    <Badge className="bg-oracle-gold/10 text-oracle-gold border-oracle-gold/20 mb-2">EMAIL VERIFIED</Badge>
                                    <p className="font-mono text-hash-grey text-sm">{authSession?.emailHash.substring(0, 12)}...{authSession?.emailHash.slice(-4)}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};
